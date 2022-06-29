import GithubAppWorker from "../../libs/github-app-worker.js";
import GithubAPI from "../../libs/github-api.js";

document.addEventListener("DOMContentLoaded", async () => {
    let accesstoken = await GithubAppWorker.OAuth.accesstoken();

    if(await GithubAPI.isValid({ accesstoken: accesstoken })) {

    }
    else {
        window.location.href = "/login/";
    }
});