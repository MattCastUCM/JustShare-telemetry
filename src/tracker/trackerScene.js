// import Tracker from './tracker.js'
import LRS from './lrs.js';
import { Actor } from './parameters.js';

import Tracker from "./oldTracker.js"

export default class TrackerScene extends Phaser.Scene {
    constructor() {
        super({key: 'TrackerScene'})
    }

    create() {
        // var tracker = new Tracker(
        //     new LRS({
        //         baseUrl: "https://cloud.scorm.com/lrs/I43WO3TFWH/sandbox/",
        //         username: "oMsoz51hM_OQbNNR3Nk",
        //         password: "LfWapsOhe1V-ryV2C6o"
        //     }),
        //     new Actor("Tyler", "tyler@yopmail.es")
        // );

        // var completable = tracker.completable
        // var gameObject = tracker.gameObject
        
        // // Ejemplos de eventos
        // // completable.initialized("hola1", "storyNode");
        // // tracker.sendEvents();

        // tracker.sendEvents([], data => console.log(data), error => console.log(error.message))

        var tracker = new Tracker({
            lrs: new LRS({
                baseUrl: "https://cloud.scorm.com/lrs/I43WO3TFWH/sandbox/",
                username: "oMsoz51hM_OQbNNR3Nk",
                password: "LfWapsOhe1V-ryV2C6o"
            }),
            actor: new Actor("Tyler", "tyler@yopmail.es")
        })

        tracker.sendEvents([], data => console.log(data), error => console.log(error.message))
    }
}