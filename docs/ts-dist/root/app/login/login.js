"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github_app_worker_1 = __importDefault(require("../../../libs/github-app-worker"));
const github_api_1 = __importDefault(require("../../../libs/github-api"));
// 
(async () => {
    console.log("test");
    let oauth_app_client_id = await github_app_worker_1.default.OAuth.getCliendId();
    let btns = document.body.querySelectorAll(".github-connect-button");
    for (let i = 0; i < btns.length; ++i) {
        btns[i].addEventListener("click", () => {
            window.location.href = encodeURI("https://github.com/login/oauth/authorize?scope=repo user&client_id=" + oauth_app_client_id + "");
        });
    }
});
// 
let github_auth_code = new URL(window.location.href).searchParams.get("code");
if (github_auth_code) {
    github_api_1.default.auth({ code: github_auth_code });
}
