"use strict";
tsParticles
    .loadJSON("tsparticles", "particles_config.json")
    .then(container => {
        console.log("callback - tsparticles config loaded");
    })
    .catch(error => {
        console.error(error);
    });
