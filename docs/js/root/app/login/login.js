import GithubAppWorker from "../../../libs/github-app-worker.js";
import GithubAPI from "../../../libs/github-api.js";

// 

document.addEventListener("DOMContentLoaded", async () => {
    let oauth_app_client_id = await GithubAppWorker.OAuth.clientid();

    let btns = document.body.querySelectorAll(".github-connect-button");
    for(let i = 0; i < btns.length; ++i) {
        btns[i].addEventListener("click", () => {
            window.location.href = encodeURI("https://github.com/login/oauth/authorize?scope=repo user&client_id="+oauth_app_client_id+"");
        });
    }

    // 

    let login_area = document.body.querySelector("div.login-area");

    let github_auth_code = new URL(window.location.href).searchParams.get("code");

    if(github_auth_code) {
        let api = await GithubAPI.auth({ code: github_auth_code });

        console.log(api?.accesstoken);
    }
    else {
        login_area.classList.remove("in-loading");
    }
});