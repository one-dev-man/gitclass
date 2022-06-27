"use strict";
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("__colormode__")) {
        document.body.classList.remove("lightmode");
        document.body.classList.remove("darkmode");
        document.body.classList.add(localStorage.getItem("__colormode__") || "");
    }
    if (!document.body.classList.contains("lightmode") && !document.body.classList.contains("darkmode")) {
        document.body.classList.add("lightmode");
    }
    let colormode_button = document.querySelector("body div#colormode");
    let colormode_transition_timeout = null;
    colormode_button.addEventListener("click", () => {
        if (document.body.classList.contains("lightmode")) {
            document.body.classList.remove("lightmode");
            document.body.classList.add("darkmode");
            document.body.classList.add("colormode_transition");
            clearTimeout(colormode_transition_timeout);
            colormode_transition_timeout = setTimeout(() => {
                document.body.classList.remove("colormode_transition");
            }, 251);
            localStorage.setItem("__colormode__", "darkmode");
        }
        else if (document.body.classList.contains("darkmode")) {
            document.body.classList.remove("darkmode");
            document.body.classList.add("lightmode");
            document.body.classList.add("colormode_transition");
            clearTimeout(colormode_transition_timeout);
            colormode_transition_timeout = setTimeout(() => {
                document.body.classList.remove("colormode_transition");
            }, 251);
            localStorage.setItem("__colormode__", "lightmode");
        }
    });
});
