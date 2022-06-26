document.addEventListener("DOMContentLoaded", async () => {
    let converter = new showdown.Converter();

    let current_md_page_url = new URL(
        window.location.protocol
        +"//"
        +window.location.hostname
        +":"
        +window.location.port
        +pathJoin("/md_pages/", window.location.pathname)
        +window.location.hash
        +window.location.search
    )

    document.querySelectorAll(".md_page_view").forEach(async (md_page_view) => {
        try {
            let _url = md_page_view.getAttribute("md-src") || current_md_page_url;
            try {
                _url = new URL(_url);
            } catch(e) {
                let p = _url
                _url = new URL(current_md_page_url);
                _url.pathname = p
            }

            let md_page_content = null;
            await new Promise((resolve, reject) => {
                fetchContent(_url).then(c => {
                    md_page_content = c;
                    resolve(true);
                }).catch(e => {
                    if(e.code == 404) {
                        let __url = new URL(_url);
                        __url.pathname+=".md";
                        fetchContent(__url).then(c => {
                            md_page_content = c;
                            resolve(true);
                        }).catch(e => {
                            if(e.code == 404) {
                                let __url = new URL(_url);
                                __url.pathname = pathJoin(__url.pathname, "index.md");
                                fetchContent(__url).then(c => {
                                    md_page_content = c;
                                    resolve(true);
                                }).catch(e => reject);
                            }
                        });
                    }
                });
            });
        
            if(md_page_content) {
                md_page_view.innerHTML = converter.makeHtml(md_page_content);
                md_page_view.querySelectorAll("[id]").forEach(elem => {
                    elem.insertAdjacentHTML("afterbegin", `
                        <a class="anchor_link" href="#${elem.id}"><svg class="link_icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>
                    `)
                });
            }
        } catch(e) { console.error(e); }
    });
});

function fetchContent(_url) {
    return new Promise((resolve, reject) => {
        fetch(_url, {
            method: "GET",
            mode: "cors",
            headers: {
                Accept: "*/*, application/vnd.github.v3.raw+json"
            }
        }).then(response => {
            if(response.status == 200) {
                response.text().then(content => {
                    resolve(content);
                }).catch(e => reject);
            }
            else reject({ code: response.status, text: response.statusText });
        }).catch(e => reject);
    });
}

function pathJoin(...p) {
    let r = ""+p[0];
    for(let i = 1; i < p.length; ++i) {
        r+=(p[i].startsWith("/") ? "" : "/")+p[i];
    }
    r = r.replace(/\/\//g, "/");
    return r;
}