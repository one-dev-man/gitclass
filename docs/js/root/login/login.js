import GithubAppWorker from "../../libs/github-app-worker.js";
import GithubAPI from "../../libs/github-api.js";

// 

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let oauth_app_client_id = await GithubAppWorker.OAuth.clientid();

        let btns = document.body.querySelectorAll(".github-connect-button");
        for(let i = 0; i < btns.length; ++i) {
            btns[i].addEventListener("click", () => {
                let gihub_login_url = `https://github.com/login/oauth/authorize?scope=repo user&client_id=${oauth_app_client_id}`;

                let login_popup = popupCenter({ url: gihub_login_url, title: "gitclass - login", width: Math.floor(window.innerWidth*(3/4)), height: Math.floor(window.innerHeight*(3/4)) })
                
                if(login_popup) {
                    login_area.classList.add("in-loading");

                    let login_popup_close_interval = setInterval(() => {
                        if(login_popup.closed) {
                            clearInterval(login_popup_close_interval);

                            login_area.classList.remove("in-loading");
                        }
                    }, 25);

                    window.addEventListener("message", (e) => {
                        console.log(e.data);
                    });
                }
                else {
                    window.location.href = encodeURI("https://github.com/login/oauth/authorize?scope=repo user&client_id="+oauth_app_client_id+"");
                }
            });
        }

        // 

        let login_area = document.body.querySelector("div.login-area");

        let needs_login = false;

        if(!(await GithubAPI.isValid({ accesstoken: await GithubAppWorker.OAuth.accesstoken() || "" }))) {
            needs_login = true;
        }

        if(needs_login) login_area.classList.remove("in-loading");
        else window.location.href = "/dashboard/";

    } catch(e) { console.error(e); }
});

const popupCenter = ({url, title, width, height}) => {
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

    const _width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const _height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = _width / window.screen.availWidth;
    const left = (_width - width) / 2 / systemZoom + dualScreenLeft
    const top = (_height - height) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open(url, title, 
      `
      popup,
      scrollbars=yes,
      width=${width / systemZoom}, 
      height=${height / systemZoom}, 
      top=${top}, 
      left=${left}
      `
    )

    if (window.focus) newWindow.focus();

    return newWindow;
}