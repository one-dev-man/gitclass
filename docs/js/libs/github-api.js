import GithubAppWorker from "./github-app-worker.js";

export default class GithubAPI {

    static ENDPOINTS = {
        get ROOT() { return "https://api.github.com/" },

        get AUTHENTICATE() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/login/oauth/access_token") },

        get GET_AUTHENTICATED_USER() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/user") },
        
        parse(endpoint, args) {
            let r = endpoint;
            Object.keys(args).forEach(k => {
                r = r.replace(new RegExp("{{"+args[k]+"}}"), args[k]);
            });
            return r;
        }
    }

    static async auth(options) {
        options.code = options.code || "null";

        let r = null;
        try {
            r = new this(await GithubAppWorker.OAuth.accesstoken(options.code));
        } catch(e) {
            console.error(e);
        }
        return r;
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
    
    #accesstoken;

    constructor(accesstoken) {
        this.#accesstoken = accesstoken;
    }

    //

    get accesstoken() { return this.#accesstoken; }

    //

    user() {

    }

    contents(username, repository, branch="main") {
        return {
            get(path) {

            },
            set(path) {

            },
            download() {
                
            }
        }
    }

}