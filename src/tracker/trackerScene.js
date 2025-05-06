import Tracker from './tracker.js'
import LRS from './lrs.js';
import { Actor } from './parameters.js';

export default class TrackerScene extends Phaser.Scene {
    constructor() {
        super({key: 'TrackerScene'})
    }

    create() {
        var tracker = new Tracker(
            new LRS({
                baseUrl: "https://cloud.scorm.com/lrs/I43WO3TFWH/sandbox/",
                username: "oMsoz51hM_OQbNNR3Nk",
                password: "LfWapsOhe1V-ryV2C6o"
            }),
            new Actor("Tyler", "tyler@yopmail.es")
        );

       // var completable = tracker.completable
      //  var gameObject = tracker.gameObject
      //  var accessible= tracker.accessible
     //   var alternative= tracker.alternative

        // completable.initialized("Collect", completable.types.game)
        
        // // Ejemplos de eventos
        // completable.initialized("hola1", "storyNode");
        // gameObject.interacted("Matt","👒")
        // accessible.accessed("Emm","Emmm")
        // alternative.selected("Hola","aaaaa")
        // tracker.sendEvents();
        // console.log("Hola:👒")

    }
}