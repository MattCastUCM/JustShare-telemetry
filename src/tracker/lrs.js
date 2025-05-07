import { makeRequest } from './utils.js'

class Versions {
    static getAllVersions() {
        return [
            "1.0.2",
            "1.0.1",
            "1.0.0",
            "0.95",
            "0.9"
        ];
    }

    static isValidVersion(version) {
        return this.getAllVersions().includes(version);
    }
}

export default class LRS {
    constructor({ baseUrl, authScheme, version = null }) {
        this.baseUrl = String(baseUrl)
        if (this.baseUrl.slice(-1) !== "/") {
            this.baseUrl += "/"
        }
        this.endpoint = "statements"

        this.authScheme = authScheme
        this.auth = null
        this.online = false
        this.initAuth()

        if (version) {
            if (!Versions.isValidVersion(version)) {
                console.error(`LRS not supported: invalid version (${version})`);
                this.version = Versions.getAllVersions()[0];
            }
            else {
                this.version = version
            }
        }
        else {
            this.version = Versions.getAllVersions()[0];
        }
    }

    async initAuth() {
        this.auth = await this.authScheme.initAuth()
        if (this.auth) {
            this.onOnline()
        }
    }

    async refreshAuth() {
        this.auth = await this.authScheme.refreshAuth()
        if (this.auth) {
            this.onOnline()
        }
    }

    onOnline() {
        this.online = true
    }

    onOffline() {
        this.offline = false
    }

    buildHeaders(customHeaders) {
        let headers = {
            ...customHeaders,
            Authorization: this.auth,
        }

        if (this.version !== "0.9") {
            headers["X-Experience-API-Version"] = this.version;
        }

        return headers
    }

    async sendRequest(endpoint, method, customHeaders, body) {
        let fullUrl = this.baseUrl + endpoint
        let headers = this.buildHeaders(customHeaders)
        body = JSON.stringify(body)

        try {
            return await makeRequest(fullUrl, method, headers, body)
        }
        catch (error) {
            throw error
        }
    }

    async saveStatements(statements) {
        if (this.online) {
            let endpoint = "statements"
            let method = "POST"
            let headers = {
                "Content-Type": "application/json"
            }

            if (statements.length !== 0) {
                let statementsXApi = []
                statementsXApi = statements.map(statement => statement.serializeToXApi(this.version))

                try {
                    return await this.sendRequest(endpoint, method, headers, statementsXApi)
                }
                catch (error) {
                    if (error.response) {
                        let status = error.response.status;
                        let message = error.message;

                        switch (status) {
                            // Unauthorized
                            case 401:
                                this.onOffline();
                                console.error(`Unauthorized: ${message}`);
                                await this.refreshAuth()
                                break;
                            // Forbidden
                            case 403:
                                this.onOffline();
                                console.error(`Forbidden: ${message}`);
                                await this.refreshAuth();
                                break;
                        }
                        throw error
                    }
                }
            }
        }
    }
}
