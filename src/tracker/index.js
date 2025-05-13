import Tracker from './tracker.js'
import LRS from './lrs.js';
import { AccountActor } from './statement/actor.js';
import { OAuth2 } from './authentication.js';
import ms from './lib/ms.js'

export function generateTrackerFromURL() {
    let urlParams = new URLSearchParams(window.location.search);

    let resultUri = null;

    // let batchLength = 100;
    // let batchTimeout = 180000;

    let backupUri = null;
    let backupType = "XAPI"

    let actorHomepage = null;
    let actorUsername = null;

    let authConfig = {}

    if (urlParams.size > 0) {
        resultUri = urlParams.get('result_uri');

        // batchLength = urlParams.get('batch_length');
        // batchTimeout = urlParams.get('batch_timeout');
        // batchTimeout = ms(batchTimeout)

        backupUri = urlParams.get('backup_uri');
        backupType = urlParams.get('backup_type');

        actorHomepage = urlParams.get('actorHomepage');
        actorUsername = urlParams.get('actor_user');

        let sso_token_endpoint = urlParams.get('sso_token_endpoint');
        if (sso_token_endpoint) {
            authConfig.tokenEndpoint = sso_token_endpoint;
        }
        let sso_client_id = urlParams.get('sso_client_id');
        if (sso_client_id) {
            authConfig.clientId = sso_client_id;
        }
        let sso_login_hint = urlParams.get('sso_login_hint');
        if (sso_login_hint) {
            authConfig.loginHint = sso_login_hint;
        }
        let sso_grant_type = urlParams.get('sso_grant_type');
        if (sso_grant_type) {
            authConfig.grantType = sso_grant_type;
        }
        let sso_scope = urlParams.get('sso_scope');
        if (sso_scope) {
            authConfig.scope = sso_scope;
        }
        let sso_username = urlParams.get('sso_username');
        if (sso_username) {
            authConfig.username = sso_username;
        }
        let sso_password = urlParams.get('sso_password');
        if (sso_password) {
            authConfig.password = sso_password;
        }
        else if (sso_username) {
            authConfig.password = sso_username;
        }
    }

    return new Tracker(
        new LRS({
            baseUrl: resultUri,
            authScheme: new OAuth2(authConfig),
            backup: {
                endpoint: backupUri,
                type: backupType
            }
        }),
        new AccountActor(actorHomepage, actorUsername)
    )
}
