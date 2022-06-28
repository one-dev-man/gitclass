"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let manage_particles_script = document.currentScript;
if (manage_particles_script instanceof HTMLScriptElement) {
    let particles_config_path = new URL(globalThis.pathJoin(globalThis.pathParent(manage_particles_script.src), './particlesjs-config.json')).pathname;
    global.particlesJS.load('particles', particles_config_path, function () {
    });
}
