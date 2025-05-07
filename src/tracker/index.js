import Tracker from './tracker.js'
import LRS from './lrs.js';
import { AccountActor } from './actor.js';
import { OAuth2 } from './authentication.js';

export function generateTrackerFromURL() {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.size > 0) {
        let authConfig = {}

        let result_uri = urlParams.get('result_uri');

        let actor_homepage = urlParams.get('actor_homepage');
        let actor_username = urlParams.get('actor_user');

        let sso_token_endpoint = urlParams.get('sso_token_endpoint');
        if (sso_token_endpoint) {
            authConfig.tokenEndpoint = sso_token_endpoint;
        }
        let sso_client_id = urlParams.get('sso_client_id');
        if (sso_client_id) {
            authConfig.clientId = sso_client_id;
        }
        const sso_login_hint = urlParams.get('sso_login_hint');
        if (sso_login_hint) {
            authConfig.loginHint = sso_login_hint;
        }
        const sso_grant_type = urlParams.get('sso_grant_type');
        if (sso_grant_type) {
            authConfig.grantType = sso_grant_type;
        }
        const sso_scope = urlParams.get('sso_scope');
        if (sso_scope) {
            authConfig.scope = sso_scope;
        }
        const sso_username = urlParams.get('sso_username');
        if (sso_username) {
            authConfig.username = sso_username;
        }
        const sso_password = urlParams.get('sso_password');
        if (sso_password) {
            authConfig.password = sso_password;
        }
        else if (sso_username) {
            authConfig.password = sso_username;
        }

        return new Tracker(
            new LRS({
                baseUrl: result_uri,
                authScheme: new OAuth2(authConfig)
            }),
            new AccountActor(actor_homepage, actor_username)
        )
    }

    return null
}

