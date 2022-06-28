"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST = void 0;
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
exports.default = GithubAppWorker;
GithubAppWorker.ENDPOINTS = {
    get ROOT() { return "https://gitclass-github-app.dev-worker.workers.dev/"; },
    get OAUTH_CLIENT_ID() { return GithubAppWorker.pathJoin(GithubAppWorker.ENDPOINTS.ROOT, "/oauth/client/id"); },
    parse(endpoint, args) {
        let r = endpoint;
        Object.keys(args).forEach(k => {
            r = r.replace(new RegExp("{{" + args[k] + "}}"), args[k]);
        });
        return r;
    }
};
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
class TEST {
}
exports.TEST = TEST;
;
