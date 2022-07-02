/*

Regex to select only section path in URL search property ; /\/((.)+?)((?=\&)|(\=)|(()$))/g

*/

const DEFAULT_SECTION_SCHEME = {
    actions: {
        "menu-sections": (source_element, destination_element) => {
            if(source_element instanceof HTMLElement && destination_element instanceof HTMLElement) {
                let item_div = document.createElement("div");
                    item_div.classList.add("item");
                
                source_element.hasAttribute("selected") ? item_div.classList.add("selected") : null;
                item_div.innerHTML = source_element.innerHTML;

                destination_element.appendChild(item_div);
            }
        }
    },

    relations: {
        'menu > head': {
            destination: "div.menu div.head",
            action: (source_element, destination_element) => {
                if(source_element instanceof HTMLElement && destination_element instanceof HTMLElement) {
                    destination_element.innerHTML = source_element.innerHTML;
                }
            }
        },
        'menu > item[section="top"]': {
            destination: "div.menu section.top",
            action: "menu-sections"
        },
        'menu > item[section="center"]': {
            destination: "div.menu section.center",
            action: "menu-sections"
        },
        'menu > item[section="bottom"]': {
            destination: "div.menu section.bottom",
            action: "menu-sections"
        }
    }
}

export default class SectionsManager {

    static async current() {
        let section_path = null;
        let section_content = null;

        let location_parameters_keys = Array.from(new URL(window.location.href).searchParams.keys());

        location_parameters_keys.filter((value, index, array) => {
            if(value.startsWith("/")) {
                if(index > 0) {
                    return !array[index-1].startsWith("/")
                }
                else return true;
            }
            else return false;
        });

        section_path = pathJoin("/sections/", location_parameters_keys.length > 0 ? location_parameters_keys[0] : "");

        let section_src = new URL(window.location.href);
            section_src.pathname = pathJoin(section_src.pathname, section_path);

        try {
            let response = await fetch(section_src, { method: "GET" });

            if(response.status == 200) {
                let textresp = await response.text();
                section_content = textresp;
            }
        } catch(e) {

        }
        
        return new Section(section_content, DEFAULT_SECTION_SCHEME);
    }

}

export class Section {

    #content;
    #scheme;

    #vbody = document.createElement("body");

    #section;

    constructor(content, scheme) {
        this.#content = content;
        this.#scheme = scheme;

        this.#vbody.innerHTML = content;

        this.#section = this.#vbody.querySelector("section");
    }

    //

    get content() { return this.#content; }
    
    get scheme() { return this.#scheme; }

    //

    apply(container) {
        if(container instanceof HTMLElement) {
            Object.keys(this.scheme.relations).forEach(source_elements_selector => {
                let source_elements_list = this.#section.querySelectorAll(source_elements_selector);
                let destination_elements_list = container.querySelectorAll(this.scheme.relations[source_elements_selector].destination);
                
                for(let si = 0; si < source_elements_list.length; ++si) {
                    for(let di = 0; di < source_elements_list.length; ++di) {
                        let action = this.scheme.relations[source_elements_selector].action;
                            action = action instanceof Function ? action : typeof action == "string" ? this.scheme.actions[action] : (a,b) => {};
                        action(source_elements_list[si], destination_elements_list[di]);
                    }
                }
            });
        }
    }

}

function pathJoin(...p) {
    let r = ""+p[0];
    for(let i = 1; i < p.length; ++i) {
        r+=(p[i].startsWith("/") ? "" : "/")+p[i];
    }
    r = r.replace(/\/\//g, "/");
    return r;
}