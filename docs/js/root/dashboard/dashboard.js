import GithubAppWorker from "../../libs/github-app-worker.js";
import GithubAPI from "../../libs/github-api.js";

import SectionsManager from "./sections.js";

document.addEventListener("DOMContentLoaded", async () => {
    let accesstoken = await GithubAppWorker.OAuth.accesstoken();

    if(await GithubAPI.isValid({ accesstoken: accesstoken })) {

    }
    else {
        window.location.href = "/login/";
    }

    let current_section = await SectionsManager.current();
    current_section.apply(document.querySelector("div#dashboard div.body"));
});