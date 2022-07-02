if(window.opener) {
    let github_auth_code = new URL(window.location.href).searchParams.get("code");

    window.opener.postMessage({ code: github_auth_code }, '*');

    window.close();
}