document.addEventListener("DOMContentLoaded", () => {
    let icons_elements_observer = null;

    let load_icons = async () => {
        icons_elements_observer.disconnect();

        let icon_elements = document.querySelectorAll("icon[src]")

        await new Promise((resolve, reject) => {
            for(let i = 0; i < icon_elements.length; ++i) {
                let _i = i;

                (async () => {
                    try {
                        let elem = icon_elements[i];
                        let icon_src = elem.getAttribute("src");
                        let stored_icon_sha = elem.querySelector("noscript[sha]");
                        let icon_sha = await sha_1(getQuerySelector(elem));
                    
                        if(!stored_icon_sha) {
                            let noscript_sha = document.createElement("noscript");
                                noscript_sha.setAttribute("sha", "");
                            elem.insertAdjacentElement("afterbegin", noscript_sha);
                            stored_icon_sha = elem.querySelector("noscript[sha]");
                        }
    
                        if(icon_sha != stored_icon_sha.innerHTML) {
                            let response = await fetch(icon_src, {
                                method: "GET",
                                mode: "cors"
                            });

                            for(let j = 0; j < elem.children.length; ++j) {
                                let child_elem = elem.children.item(j)
                                child_elem.localName != "noscript" ? child_elem.remove() : null;
                            }

                            if(response.status == 200) {

                                let content_type = response.headers.get("Content-Type");
                
                                if(content_type.startsWith("image/svg")) {
                                    let xml = await response.text();

                                    elem.insertAdjacentHTML("afterbegin", xml);
                            
                                    let svg = elem.querySelector("svg");
                        
                                    svg?.setAttribute("width", elem.getAttribute("width") || "")
                                    svg?.setAttribute("height", elem.getAttribute("height") || "")
                                    elem.classList.forEach(c => { svg?.classList.add(c); });
                                }
                                else {
                                    let image_blob = await response.blob();
                                    let image_blob_url = URL.createObjectURL(image_blob);

                                    let image_element = document.createElement("img");
                                        image_element.src = image_blob_url;

                                    image_element.setAttribute("width", elem.getAttribute("width") || "")
                                    image_element.setAttribute("height", elem.getAttribute("height") || "")
                                    elem.classList.forEach(c => { image_element.classList.add(c); });

                                    elem.insertAdjacentElement("afterbegin", image_element);
                                }
                                // else console.error("Invalid file : must be an SVG xml file.");
                            }

                            stored_icon_sha.innerHTML = await sha_1(getQuerySelector(elem));
                        }
                    } catch(e) { console.error(e); }

                    if(_i == icon_elements.length-1) resolve(true);
                })();
            }
        });

        icons_elements_observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true });
    }

    icons_elements_observer = new MutationObserver(load_icons);
    icons_elements_observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true });

    load_icons();
});

function getQuerySelector(element) {
    if(element instanceof HTMLElement) {
        let selector = "";
        
        selector += element.localName;
        selector += element.id.length > 0 ? `#${element.id}` : "";
        element.classList.forEach(c => {
            selector += `.${c}`;
        });
        for(let i = 0; i < element.attributes.length; ++i) {
            let attribute = element.attributes.item(i);
            selector += `[${attribute.name}="${attribute.value}"]`;
        }

        return selector;
    }
}

async function sha_1(data) {
    if(typeof data == "string") data = new TextEncoder().encode(data);
    return Array.from(new Uint8Array((await crypto.subtle.digest("SHA-1", data)))).map(b => b.toString(16).padStart(2, '0')).join('');
}