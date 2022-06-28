export default class GithubAppWorker {

    static ENDPOINTS = {
        get ROOT() { return "https://gitclass-github-app.dev-worker.workers.dev/" },
        
        get OAUTH_CLIENT_ID() { return GithubAppWorker.pathJoin(GithubAppWorker.ENDPOINTS.ROOT, "/oauth/client/id") },
        get OAUTH_ACCESSTOKEN() { return GithubAppWorker.pathJoin(GithubAppWorker.ENDPOINTS.ROOT, "/oauth/accesstoken?code={{code}}") },

        parse(endpoint, args) {
            let r = endpoint;
            Object.keys(args).forEach(k => {
                r = r.replace(new RegExp("{{"+args[k]+"}}"), args[k]);
            });
            return r;
        }
    }

    static OAuth = class {

        static clientid() {
            return new Promise((resolve, reject) => {
                fetch(GithubAppWorker.ENDPOINTS.parse(GithubAppWorker.ENDPOINTS.OAUTH_CLIENT_ID, {}), {
                    method: "GET",
                    mode: "cors"
                }).then(response => {
                    if(response.status == 200) {
                        response.json().then(respjson => {
                            resolve(respjson.id);
                        }).catch(e => reject);
                    }
                    else reject({ code: response.status, text: response.statusText });
                }).catch(e => reject);
            });
        }

        static accesstoken(code) {
            return new Promise((resolve, reject) => {
                fetch(GithubAppWorker.ENDPOINTS.parse(GithubAppWorker.ENDPOINTS.OAUTH_ACCESSTOKEN, { code: code }), {
                    method: "GET",
                    mode: "cors"
                }).then(response => {
                    if(response.status == 200) {
                        response.json().then(jsonresp => {
                            resolve(jsonresp.accesstoken);
                        }).catch(e => reject);
                    }
                    else reject({ code: response.status, text: response.statusText });
                }).catch(e => reject);
            });
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