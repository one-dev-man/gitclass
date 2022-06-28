export default class GithubAPI {

    static ENDPOINTS = {
        get ROOT() { return "https://api.github.com/" },

        get AUTHENTICATE() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/user") },

        get GET_AUTHENTICATED_USER() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/user") },
        
        parse(endpoint: string, args: Object) {
            let r = endpoint;
            Object.keys(args).forEach(k => {
                r = r.replace(new RegExp("{{"+args[k]+"}}"), args[k]);
            });
            return r;
        }
    }

    static auth(options: { code: string }) {

    }

    //

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