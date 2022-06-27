"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _authtoken, _a;
class GithubAPI {
    constructor(authtoken) {
        // 
        _authtoken.set(this, void 0);
        __classPrivateFieldSet(this, _authtoken, authtoken);
    }
    static pathJoin(...p) {
        let r = "" + p[0];
        for (let i = 1; i < p.length; ++i) {
            r += (p[i].startsWith("/") ? "" : "/") + p[i];
        }
        r = r.replace(/\/\//g, "/");
        return r;
    }
    //
    get authtoken() { return __classPrivateFieldGet(this, _authtoken); }
    //
    user() {
    }
    contents(username, repository, branch = "main") {
        return {
            get(path) {
            },
            set(path) {
            },
            download() {
            }
        };
    }
}
_authtoken = new WeakMap();
GithubAPI.ENDPOINTS = (_a = class {
        static parse(endpoint, args) {
            let r = endpoint;
            Object.keys(args).forEach(k => {
                r = r.replace(new RegExp("{{" + args[k] + "}}"), args[k]);
            });
            return r;
        }
    },
    _a.ROOT = "https://api.github.com/",
    _a.GET_AUTHENTICATED_USER = GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/user"),
    _a);
