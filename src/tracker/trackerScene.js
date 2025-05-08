import Tracker from './tracker.js'
import LRS from './lrs.js';
import { AccountActor } from './actor.js';
import { BasicAuthentication, OAuth2 } from './authentication.js';
import { generateTrackerFromURL } from './index.js';

export default class TrackerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TrackerScene' })
    }

    create() {
        // var tracker = new Tracker(
        //     new LRS({
        //         baseUrl: "https://cloud.scorm.com/lrs/I43WO3TFWH/sandbox/",
        //         authScheme: new BasicAuthentication("oMsoz51hM_OQbNNR3Nk", "LfWapsOhe1V-ryV2C6o")
        //     }),
        //     new AccountActor("http://example.com", "holita")
        // );

        // var tracker = new Tracker(
        //     new LRS({
        //         baseUrl: "https://simva-api.simva-beta.e-ucm.es/activities/681b46a0fbe4c00023c56cc4/",
        //         authScheme: new OAuth2({
        //             tokenEndpoint: "https://sso.simva-beta.e-ucm.es/realms/simva/protocol/openid-connect/token",
        //             grantType: "password",
        //             clientId: "simva-plugin",
        //             password: "slpa",
        //             username: "slpa",
        //             loginHint: "6818e70cfbe4c00023c50ab4"
        //         }),
        //         backup: {
        //             endpoint: "https://simva-api.simva-beta.e-ucm.es:443/activities/681b46a0fbe4c00023c56cc4/result",
        //             type: "XAPI"
        //         }
        //     }),
        //     new AccountActor("http://example.com", "holita")
        // )

        var tracker = generateTrackerFromURL()

        var completable = tracker.completable
        var gameObject = tracker.gameObject
        var accessible = tracker.accessible
        var alternative = tracker.alternative

        completable.initialized(completable.types.area, "Hola")

        setTimeout(() => {
            tracker.sendEvents()
        }, 2000);
    }
}