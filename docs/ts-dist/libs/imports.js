"use strict";
globalThis.global = globalThis;
// 
global.pathJoin = (...p) => {
    let r = "" + p[0];
    for (let i = 1; i < p.length; ++i) {
        r += (p[i].startsWith("/") ? "" : "/") + p[i];
    }
    r = r.replace(/\/\//g, "/");
    return r;
};
global.pathParent = (p) => {
    let pp = p.split("/");
    pp.pop();
    return pp.join("/");
};
global.exports = new Proxy({}, {
    get(target, name, reciever) {
        return target[name];
    },
    set(target, name, value, reciever) {
        let src = "__" + Date.now();
        if (document.currentScript instanceof HTMLScriptElement) {
            src = document.currentScript.src;
        }
        ;
        !target[src] ? target[src] = {} : null;
        target[src][name] = value;
        return true;
    },
    defineProperty(target, p, attributes) {
        let src = "__prop__" + Date.now();
        if (document.currentScript instanceof HTMLScriptElement) {
            src = document.currentScript.src;
        }
        ;
        !target[src] ? target[src] = {} : null;
        return Object.defineProperty(target[src], p, attributes);
    },
});
global.exports.__proto__.setkey = (k, v) => {
    global.exports.__proto__[k] = v;
};
// 
global.require = (src) => {
    let origin_script = document.currentScript;
    if (!src.match(/(.)+\.js$/g)) {
        src += ".js";
    }
    let absolute_src = null;
    try {
        absolute_src = new URL(src).href;
    }
    catch (e) {
        absolute_src = new URL(global.pathJoin(global.pathParent(origin_script.src), src)).href;
    }
    return global.exports[absolute_src];
};
// 
global.imports = {};
global.imports.__proto__.load = (list, ismain = false) => {
    let async_loading = new Promise((resolve, reject) => {
        let loaded_count = 0;
        for (let i = 0; i < list.length; ++i) {
            let script = document.createElement("script");
            let src = new URL(window.location);
            src.pathname = list[i];
            src.searchParams.append("timestamp", "" + Date.now());
            script.src = src.href;
            document.head.append(script);
            let _i = i;
            script.addEventListener("load", () => {
                loaded_count += 1;
                if (loaded_count == list.length) {
                    resolve(true);
                }
                else if (_i == list.length - 1)
                    reject({
                        index: _i,
                        loaded_count: loaded_count,
                        list: list
                    });
            });
        }
    });
    if (!ismain) {
        return {
            main: (src) => {
                async_loading.then(() => { }).catch(e => console.error).finally(() => {
                    global.imports.load([src], ismain = true);
                });
            }
        };
    }
};
