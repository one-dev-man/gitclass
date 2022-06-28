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
var _authtoken;
Object.defineProperty(exports, "__esModule", { value: true });
class GithubAPI {
    constructor(authtoken) {
        // 
        _authtoken.set(this, void 0);
        __classPrivateFieldSet(this, _authtoken, authtoken);
    }
    static auth(options) {
    }
    //
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
exports.default = GithubAPI;
_authtoken = new WeakMap();
GithubAPI.ENDPOINTS = {
    get ROOT() { return "https://api.github.com/"; },
    get AUTHENTICATE() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/user"); },
    get GET_AUTHENTICATED_USER() { return GithubAPI.pathJoin(GithubAPI.ENDPOINTS.ROOT, "/user"); },
    parse(endpoint, args) {
        let r = endpoint;
        Object.keys(args).forEach(k => {
            r = r.replace(new RegExp("{{" + args[k] + "}}"), args[k]);
        });
        return r;
    }
};
