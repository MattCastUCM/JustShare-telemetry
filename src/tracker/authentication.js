import { makeRequest } from "./utils.js"

class Authentication {
    initAuth() { }
    refreshAuth() { }
}

export class BasicAuthentication extends Authentication {
    constructor(username, password) {
        super()
        this.credentials = btoa(username + ":" + password)
        this.auth = "Basic " + this.credentials
    }

    async initAuth() {
        return this.auth
    }

    async refreshAuth() {
        return this.auth
    }
}

export class OAuth2 extends Authentication {
    constructor({ tokenEndpoint, grantType, clientId, scope, state, username, password, loginHint }) {
        super()
        this.tokenEndpoint = tokenEndpoint

        this.grantType = grantType

        this.clientId = clientId
        this.scope = scope
        this.state = state
        this.username = username
        this.password = password
        this.loginHint = loginHint

        this.token = null
        this.refreshTokenInProgress = false
    }

    async initAuth() {
        switch (this.grantType) {
            case "password":
                try {
                    this.token = await this.resourceOwnerPasswordFlow(this.clientId, this.scope, this.state, this.username, this.password, this.loginHint)
                }
                catch (error) {
                    this.token = null
                    console.error(`Authentication failed: ${error.message}`);
                }
                break;
            case "code":
                // TODO
                break;
        }

        if (this.token) {
            return "Bearer " + this.token.access_token
        }
        return this.token
    }

    async refreshAuth() {
        if (!this.refreshTokenInProgress) {
            let form = {
                refresh_token: this.token.refresh_token
            }

            try {
                this.refreshTokenInProgress = true;
                this.token = await this.sendTokenRequest("refresh_token", form)
                this.refreshTokenInProgress = false
            }
            catch (error) {
                this.refreshTokenInProgress = false
                this.token = null
                console.error(`Token refresh failed: ${error.message}`)
            }

            if (this.token) {
                return "Bearer " + this.token.access_token
            }
            return this.token
        }
        else {
            while (this.refreshTokenInProgress) {
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }
    }

    async sendTokenRequest(grantType, clientId, customForm) {
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }

        let form = {
            ...customForm,
            grant_type: grantType,
            client_id: clientId
        }
        let body = new URLSearchParams(form)

        try {
            return await makeRequest(this.tokenEndpoint, "POST", headers, body)
        }
        catch (error) {
            throw error
        }
    }

    async resourceOwnerPasswordFlow(clientId, scope, state, username, password, loginHint) {
        let form = {
            username: username,
            password: password,
            login_hint: loginHint
        }
        if (scope) {
            form.scope = scope
        }
        if (state) {
            form.state = state
        }

        try {
            return await this.sendTokenRequest("password", clientId, form)
        }
        catch (error) {
            throw error
        }
    }

    // TODO
    async authorizationCodeFlow() {

    }
}