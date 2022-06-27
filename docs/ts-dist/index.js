"use strict";
document.addEventListener("DOMContentLoaded", async () => {
    let oauth_app_client_id = await GithubAppWorker.OAuth.getCliendId();
    let btns = document.body.querySelectorAll(".github-connect-button");
    for (let i = 0; i < btns.length; ++i) {
        btns[i].addEventListener("click", () => {
            window.location.href = encodeURI("https://github.com/login/oauth/authorize?scope=repo user&client_id=" + oauth_app_client_id + "");
        });
    }
});
