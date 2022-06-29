import GithubAppWorker from "./github-app-worker.js";

export default class GithubAPI {

    static ENDPOINTS = {
        get ROOT() { return "https://api.github.com/" },

        // 

        get AUTHENTICATE() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/login/oauth/access_token") },

        get CURRENT_USER() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/user") },

        // 
        
        get CURRENT_USER_REPOSITORIES() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/user/repos?visibility={{visibility}}&affiliation={{affiliation}}&per_page={{per_page}}") },
        
        get USER_REPOSITORIES() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/users/{{username}}/repos") },
        
        get REPOSITORY_CONTENT() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/repos/{{owner}}/{{repository}}/contents/{{path}}?ref={{branch}}") },
        
        get REPOSITORY_README() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/repos/{{owner}}/{{repository}}/readme/{{path}}?ref={{branch}}") },
        
        // 

        parse(endpoint, args) {
            let r = endpoint;
            Object.keys(args).forEach(k => {
                r = r.replace(new RegExp("\\{\\{"+k+"\\}\\}", "g"), args[k]);
            });
            return r;
        }
    }

    //

    static async sendRequest(method, endpoint, params={}, options={ accesstoken: undefined, headers: {}, body: undefined, check_accesstoken: true }) {
        options = options || {};

        options.accesstoken = options.accesstoken || undefined;
        options.headers = options.headers || { "Accept": "application/vnd.github.v3+json" };
        options.body = options.body || undefined;
        options.check_accesstoken = options.check_accesstoken == true ? true : false;

        if(options.check_accesstoken) {
            if(!(await GithubAPI.isValid({ accesstoken: options.accesstoken }))) {
                throw { code: 401, status: "invalid_access_token", content: null };
            }
        }

        let request_options = {};
            request_options.method = method;
            request_options.headers = options.headers;
            request_options.body = options.body;

            options.accesstoken ?request_options.headers["Authorization"] = `token ${options.accesstoken}` : null;

        let result = {
            code: null,
            status: null,
            content: null
        }

        try {
            let response = await fetch(
                GithubAPI.ENDPOINTS.parse(endpoint, params),
                request_options
            );
            
            let textresp = null;
            try { textresp = await response.text(); } catch(e) {}

            result.code = response.status
            result.status = response.statusText
            result.content = textresp

            if(response.status != 200) console.error(result);
        } catch(e) { console.error(e); }

        return result;
    }

    //

    static async isValid(options={ accesstoken: "" }) {
        options = options || {};

        options.accesstoken = options.accesstoken || "";
        
        let response = await GithubAPI.sendRequest(
            "HEAD",
            GithubAPI.ENDPOINTS.CURRENT_USER,
            {},
            { accesstoken: options.accesstoken, check_accesstoken: false }
        );
        
        return response.code == 200;
    }

    static async auth(options={ code: "" }) {
        options = options || {};

        options.code = options.code || "";

        let result = null;

        let accesstoken = await GithubAppWorker.OAuth.accesstoken(options.code);
        if(accesstoken) {
            result = new this.Client(accesstoken);
        }

        return result;
    }

    static async login(options={ accesstoken: "" }) {
        return new this.Client(options.accesstoken);
    }

    //

    static pathJoin(...p) {
        let r = ""+p[0];
        for(let i = 1; i < p.length; ++i) {
            r+=(p[i].startsWith("/") ? "" : "/")+p[i];
        }
        r = r.replace(/\/\//g, "/");
        return r;
    }

    // 
    
    static Client = class {
        #accesstoken;

        #repositories = new GithubAPI.Repostories(this);

        constructor(accesstoken) {
            this.#accesstoken = accesstoken;
        }

        //

        get accesstoken() { return this.#accesstoken; }
        
        get repositories() { return this.#repositories; }

        //

        async user() {
            let userprofile = null;

            let response = await GithubAPI.sendRequest(
                "GET",
                GithubAPI.ENDPOINTS.CURRENT_USER,
                {},
                { accesstoken: this.accesstoken }
            );

            if(response.code == 200) {
                let jsonresp = JSON.parse(response.content)
                userprofile = jsonresp ? jsonresp : userprofile;
            }

            return userprofile;
        }

    }

    //

    static Repostories = class {

        #client;

        constructor(client) {
            this.#client = client;
        }

        //

        get client() { return this.#client instanceof GithubAPI.Client ? this.#client : null; }

        //

        async list(options={ public: true, private: true, owner: true, collaborator: true, organization: true, count: 100 }) {
            options = options || {};

            options.public = options.public == true ? true : false;
            options.private = options.private == true ? true : false;
            options.owner = options.owner == true ? true : false;
            options.collaborator = options.collaborator == true ? true : false;
            options.organization = options.organization == true ? true : false;
            options.count = options.count || 100;

            let repo_list = null;

            let response = await GithubAPI.sendRequest(
                "GET",
                GithubAPI.ENDPOINTS.CURRENT_USER_REPOSITORIES,
                JSON.parse(JSON.stringify({
                    visibility: options.public && options.private ? "all" : options.public ? "public" : options.private ? "private" : undefined,
                    affiliation: `${options.owner ? "owner,": ""}${options.collaborator ? "collaborator,": ""}${options.organization ? "organization": ""}` || undefined,
                    per_page: options.count
                })),
                { accesstoken: this.client.accesstoken }
            );

            if(response.code == 200) {
                let jsonresp = JSON.parse(response.content);
                repo_list = jsonresp ? jsonresp : repo_list;
            }

            return repo_list;
        }

        async create(name) {

        }

    }

    //

    static Repository = class {

        #client;

        #owner;
        #name;

        constructor(client, owner, name) {
            this.#client = client;

            this.#owner = owner;
            this.#name = name;
        }

        //

        get client() { return this.#client; }

        get owner() { return this.#owner; }

        get name() { return this.#name; }

        //

        async get(path, options={ branch: "main" }) {
            options = options || {};

            options.branch = options.branch || "main";

            let file = {
                exists: false,
                isdir: null,
                stats: null
            }

            let response = await GithubAPI.sendRequest(
                "GET",
                GithubAPI.ENDPOINTS.REPOSITORY_CONTENT,
                {
                    owner: this.owner,
                    repository: this.name,
                    path: path,
                    branch: options.branch
                },
                { accesstoken: this.client.accesstoken }
            );

            if(response.code == 200) {
                let jsonresp = JSON.parse(response.content);

                file.exists = jsonresp ? true : false;
                file.isdir = jsonresp instanceof Array;
                file.stats = jsonresp;
            }

            return file;
        }

        async set(path, content, options={ branch: "main", message: "set-content", committer: undefined, author: undefined }) {
            options = options || {};

            options.message = options.message || "set-content";
            options.branch = options.branch || "main";
            options.committer = options.committer || undefined;
            options.author = options.author || undefined;

            let commit_return = null;

            let response = await GithubAPI.sendRequest(
                "PUT",
                GithubAPI.ENDPOINTS.REPOSITORY_CONTENT,
                {
                    owner: this.owner,
                    repository: this.name,
                    path: path,
                    branch: options.branch
                },
                {
                    accesstoken: this.client.accesstoken,
                    body: JSON.stringify({
                        content: content,
                        message: options.message,
                        branch: options.branch,
                        committer: options.committer,
                        author: options.author
                    })
                }
            );

            if(response.code == 200) {
                let jsonresp = JSON.parse(response.content);
                commit_return = jsonresp ? jsonresp : commit_return;
            }

            return commit_return;
        }

        async delete(path, options={ message: "set-content", branch: "main", committer: null, author: null }) {
            options = options || {};

            options.message = options.message || "set-content";
            options.branch = options.branch || "main";
            options.committer = options.committer || undefined;
            options.author = options.author || undefined;

            let commit_return = null;

            let response = await GithubAPI.sendRequest(
                "DELETE",
                GithubAPI.ENDPOINTS.REPOSITORY_CONTENT,
                {
                    owner: this.owner,
                    repository: this.name,
                    path: path,
                    branch: options.branch
                },
                {
                    accesstoken: this.client.accesstoken,
                    body: JSON.stringify({
                        message: options.message,
                        sha: file_sha,
                        branch: options.branch,
                        committer: options.committer,
                        author: options.author
                    })
                }
            );

            if(response.code == 200) {
                let jsonresp = JSON.parse(response.content);
                commit_return = jsonresp ? jsonresp : commit_return;
            }

            return commit_return;
        }

        async readme(dirpath, options={ branch: "main" }) {
            options = options || {};

            options.branch = options.branch || "main";

            let readme_file = {
                exists: false,
                isdir: null,
                stats: null
            }

            let response = await GithubAPI.sendRequest(
                "GET",
                GithubAPI.ENDPOINTS.REPOSITORY_README,
                {
                    owner: this.owner,
                    repository: this.name,
                    path: dirpath,
                    branch: options.branch
                },
                { accesstoken: this.client.accesstoken }
            );

            if(response.code == 200) {
                let jsonresp = JSON.parse(response.content);

                readme_file.exists = jsonresp ? true : false;
                readme_file.isdir = jsonresp instanceof Array;
                readme_file.stats = jsonresp;
            }

            return readme_file;
        }

    }

}