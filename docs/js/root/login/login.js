import GithubAppWorker from "../../libs/github-app-worker.js";
import GithubAPI from "../../libs/github-api.js";

// 

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let oauth_app_client_id = await GithubAppWorker.OAuth.clientid();

        let btns = document.body.querySelectorAll(".github-connect-button");
        for(let i = 0; i < btns.length; ++i) {
            btns[i].addEventListener("click", () => {
                window.location.href = encodeURI("https://github.com/login/oauth/authorize?scope=repo user&client_id="+oauth_app_client_id+"");
            });
        }

        // 

        let login_area = document.body.querySelector("div.login-area");

        let needs_login = false;

        if(!(await GithubAPI.isValid({ accesstoken: await GithubAppWorker.OAuth.accesstoken() || "" }))) {
            let github_auth_code = new URL(window.location.href).searchParams.get("code");
            if(github_auth_code) {
                await GithubAppWorker.OAuth.accesstoken(github_auth_code);
            }
            else needs_login = true;
        }

        if(needs_login) login_area.classList.remove("in-loading");
        else window.location.href = "/dashboard/";

    } catch(e) { console.error(e); }
});