import Tracker from './tracker.js'
import { LRS, Actor } from './tracker.js';

export default class TrackerScene extends Phaser.Scene {
    constructor() {
        super({key: 'TrackerScene'})
    }

    create() {
        var tracker = new Tracker({
            debug: true,
            lrs: new LRS({
                username: "oMsoz51hM_OQbNNR3Nk",
                password: "LfWapsOhe1V-ryV2C6o",
                baseUrl: "https://cloud.scorm.com/lrs/I43WO3TFWH/sandbox/"
            }),
            actor: new Actor("Tyler", "tyler@yopmail.es")
        });

        var completable = tracker.completable
        var gameObject = tracker.gameObject
        
        // Ejemplos de eventos
        completable.initialized("hola1", "StoryNode");
        completable.progressed("hola2", 0.5, "StoryNode");
        completable.completed("hola3", true, 100, "StoryNode");

        gameObject.interacted("telefono_movil", "Item");
        gameObject.used("ordenador", "GameObject");

        // tracker.sendEvents([], data => console.log(data), error => console.log(error.message))
    }
}