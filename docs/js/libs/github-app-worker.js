export default class GithubAppWorker {

    static ENDPOINTS = {
        get ROOT() { return "https://gitclass-github-app.dev-worker.workers.dev/" },
        
        get OAUTH_CLIENT_ID() { return GithubAppWorker.pathJoin(GithubAppWorker.ENDPOINTS.ROOT, "/oauth/client/id") },
        get OAUTH_ACCESSTOKEN() { return GithubAppWorker.pathJoin(GithubAppWorker.ENDPOINTS.ROOT, "/oauth/accesstoken?code={{code}}") },

        parse(endpoint, args) {
            let r = endpoint;
            Object.keys(args).forEach(k => {
                r = r.replace(new RegExp("\\{\\{"+k+"\\}\\}", "g"), args[k]);
            });
            return r;
        }
    }

    //

    static async sendRequest(method, endpoint, params={}, options={ accesstoken: undefined, headers: {}, body: undefined }) {
        options = options || {};

        options.accesstoken = options.accesstoken || undefined;
        options.headers = options.headers || { "Accept": "application/vnd.github.v3+json" };
        options.body = options.body || undefined;

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
                GithubAppWorker.ENDPOINTS.parse(endpoint, params),
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

    static OAuth = class {

        static async clientid() {
            let clientid = null;

            let response = await GithubAppWorker.sendRequest(
                "GET",
                GithubAppWorker.ENDPOINTS.OAUTH_CLIENT_ID
            );

            if(response.code == 200) {
                let jsonresp = JSON.parse(response.content);
                clientid = jsonresp ? jsonresp.id : clientid;
            }

            return clientid;
        }

        static async accesstoken(code) {
            let accesstoken = null;

            let response = await GithubAppWorker.sendRequest(
                "GET",
                GithubAppWorker.ENDPOINTS.OAUTH_ACCESSTOKEN,
                { code: code }
            );

            if(response.code == 200) {
                let jsonresp = JSON.parse(response.content);
                accesstoken = jsonresp ? jsonresp.accesstoken : accesstoken;
            }

            return accesstoken;
        }

    }

    static pathJoin(...p) {
        let r = ""+p[0];
        for(let i = 1; i < p.length; ++i) {
            r+=(p[i].startsWith("/") ? "" : "/")+p[i];
        }
        r = r.replace(/\/\//g, "/");
        return r;
    }
}

export class TEST {
    
};