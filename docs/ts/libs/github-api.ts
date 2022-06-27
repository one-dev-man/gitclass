class GithubAPI {

    static ENDPOINTS = class {
        static ROOT = "https://api.github.com/";

        static GET_AUTHENTICATED_USER = GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/user")
        
        static parse(endpoint: string, args: Object) {
            let r = endpoint;
            Object.keys(args).forEach(k => {
                r = r.replace(new RegExp("{{"+args[k]+"}}"), args[k]);
            });
            return r;
        }
    }

    static pathJoin(...p: string[]) {
        let r = ""+p[0];
        for(let i = 1; i < p.length; ++i) {
            r+=(p[i].startsWith("/") ? "" : "/")+p[i];
        }
        r = r.replace(/\/\//g, "/");
        return r;
    }

    // 
    
    #authtoken: string;

    constructor(authtoken: string) {
        this.#authtoken = authtoken
    }

    //

    get authtoken() { return this.#authtoken; }

    //

    user() {

    }

    contents(username: string, repository: string, branch="main") {
        return {
            get(path: string) {

            },
            set(path: string) {

            },
            download() {
                
            }
        }
    }

}