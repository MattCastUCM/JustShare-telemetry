import Tracker from './tracker.js'
import LRS from './lrs.js';
import { AccountActor } from './actor.js';
import { BasicAuthentication, OAuth2 } from './authentication.js';

export default class TrackerScene extends Phaser.Scene {
    constructor() {
        super({key: 'TrackerScene'})
    }

    create() {
        // var tracker = new Tracker(
        //     new LRS({
        //         baseUrl: "https://cloud.scorm.com/lrs/I43WO3TFWH/sandbox/",
        //         authScheme: new BasicAuthentication("oMsoz51hM_OQbNNR3Nk", "LfWapsOhe1V-ryV2C6o")
        //     }),
        //     new AccountActor("http://example.com", "holita")
        // );

        var tracker = new Tracker(
            new LRS({
                baseUrl: "https://simva-api.simva-beta.e-ucm.es/activities/6818e775fbe4c00023c50c20/",
                authScheme: new OAuth2("https://sso.simva-beta.e-ucm.es/realms/simva/protocol/openid-connect/token", 
                    "password", "simva-plugin", null, null, "weoh", "weoh", "6818e70cfbe4c00023c50ab4")
            }),
            new AccountActor("http://example.com", "holita")
        );


        var completable = tracker.completable
        var gameObject = tracker.gameObject
        var accessible= tracker.accessible
        var alternative= tracker.alternative

        completable.initialized(completable.types.area, "Hola")

        tracker.sendEvents()
    }
}