"use strict";
var _a;
class GithubAppWorker {
    static pathJoin(...p) {
        let r = "" + p[0];
        for (let i = 1; i < p.length; ++i) {
            r += (p[i].startsWith("/") ? "" : "/") + p[i];
        }
        r = r.replace(/\/\//g, "/");
        return r;
    }
}
GithubAppWorker.ENDPOINTS = (_a = class {
        static parse(endpoint, args) {
            let r = endpoint;
            Object.keys(args).forEach(k => {
                r = r.replace(new RegExp("{{" + args[k] + "}}"), args[k]);
            });
            return r;
        }
    },
    _a.ROOT = "https://gitclass-github-app.dev-worker.workers.dev/",
    _a.OAUTH_CLIENT_ID = GithubAppWorker.pathJoin(GithubAppWorker.ENDPOINTS.ROOT, "/oauth/client/id"),
    _a);
GithubAppWorker.OAuth = class {
    static getCliendId() {
        return new Promise((resolve, reject) => {
            fetch(GithubAppWorker.ENDPOINTS.parse(GithubAppWorker.ENDPOINTS.OAUTH_CLIENT_ID, {}), {
                method: "GET",
                mode: "cors"
            }).then(response => {
                if (response.status == 200) {
                    response.json().then(respjson => {
                        resolve(respjson.id);
                    }).catch(e => reject);
                }
                else
                    reject({ code: response.status, text: response.statusText });
            }).catch(e => reject);
        });
    }
};
