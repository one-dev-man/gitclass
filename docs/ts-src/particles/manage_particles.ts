import particles_config from "./particlesjs-config.json";

let manage_particles_script = document.currentScript;

if(manage_particles_script instanceof HTMLScriptElement) {
    let particles_config_path = new URL(globalThis.pathJoin(globalThis.pathParent(manage_particles_script.src), './particlesjs-config.json')).pathname;
    global.particlesJS.load('particles', particles_config_path, function() {
        
    });
}