import BootScene from "./scenes/bootScene.js";

import TextOnlyScene from "./scenes/gameLoop/textOnlyScene.js";

// Escena 1
import Scene1Classroom from "./scenes/gameLoop/scene1/scene1Classroom.js";
import Scene1Break from "./scenes/gameLoop/scene1/scene1Break.js";
import Scene1Lunch1 from "./scenes/gameLoop/scene1/scene1Lunch1.js";
import Scene1Bedroom1 from "./scenes/gameLoop/scene1/scene1Bedroom1.js";
import Scene1Lunch2 from "./scenes/gameLoop/scene1/scene1Lunch2.js";
import Scene1Bedroom2 from "./scenes/gameLoop/scene1/scene1Bedroom2.js";

// Escena 2
import Scene2Break from "./scenes/gameLoop/scene2/scene2Break.js";
import Scene2Bedroom from "./scenes/gameLoop/scene2/scene2Bedroom.js";

// Escena 3
import Scene3Break from "./scenes/gameLoop/scene3/scene3Break.js";
import Scene3Bedroom from "./scenes/gameLoop/scene3/scene3Bedroom.js";

// Escena 4
import Scene4Frontyard from "./scenes/gameLoop/scene4/scene4Frontyard.js";
import Scene4Backyard from "./scenes/gameLoop/scene4/scene4Backyard.js";
import Scene4Garage from "./scenes/gameLoop/scene4/scene4Garage.js";

// UI
import UIManager from './managers/UIManager.js';
// Menus
import TitleScene from "./scenes/titleScene.js";
import LoginScene from "./scenes/loginScene.js";

const max_w = 1600, max_h = 900, min_w = 320, min_h = 240;
const config = {
    width: max_w,
    height: max_h,
    backgroundColor: '#000000',
    version: "1.0",

    type: Phaser.AUTO,
    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        // Carga de assets
        BootScene,
        
        // Escena 1
        Scene1Classroom, Scene1Break, Scene1Lunch1, Scene1Bedroom1, Scene1Lunch2, Scene1Bedroom2,
        // Escena 2
        Scene2Break, Scene2Bedroom,
        // Escena 3
        Scene3Break, Scene3Bedroom,
        // Escena 4
        Scene4Frontyard, Scene4Backyard, Scene4Garage,
        
        // Menus
        TitleScene, LoginScene,
        
        // UI
        UIManager, TextOnlyScene
    ],
    autoFocus: true,
    // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    disableContextMenu: true,
    render: {
        antialias: true,
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,   // CENTER_BOTH, CENTER_HORIZONTALLY, CENTER_VERTICALLY
        mode: Phaser.Scale.FIT,                 // ENVELOP, FIT, HEIGHT_CONTROLS_WIDTH, NONE, RESIZE, WIDTH_CONTROLS_HEIGHT
        min: {
            width: min_w,
            height: min_h
        },
        max: {
            width: max_w,
            height: max_h,
        },
        zoom: 1,
        parent: 'game',
    },
}

const game = new Phaser.Game(config);
// Propiedad debug
game.debug = {
    enable: false,
    color: '0x00ff00'
}