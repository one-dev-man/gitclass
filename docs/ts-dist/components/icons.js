"use strict";
document.addEventListener("DOMContentLoaded", () => {
    let icon_elements = document.querySelectorAll("icon[src]");
    for (let i = 0; i < icon_elements.length; ++i) {
        let elem = icon_elements[i];
        let icon_src = elem.getAttribute("src");
        fetch(icon_src, {
            method: "GET",
            mode: "cors"
        }).then(response => {
            let content_type = response.headers.get("Content-Type");
            if (content_type.startsWith("image/svg")) {
                response.text().then(xml => {
                    elem.innerHTML = xml;
                    let svg_list = elem.querySelectorAll("svg");
                    for (let j = 0; j < svg_list.length; ++j) {
                        let svg = svg_list[j];
                        svg.setAttribute("width", elem.getAttribute("width") || elem.getAttribute("height") || "");
                        svg.setAttribute("height", elem.getAttribute("height") || elem.getAttribute("width") || "");
                        elem.classList.forEach(c => { svg.classList.add(c); });
                    }
                }).catch(e => console.error);
            }
            else
                console.error("Invalid file : must be an SVG xml file.");
        }).catch(e => console.error);
    }
    console.log("test");
});
