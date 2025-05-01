import { httpRequest } from './utils.js'

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
    constructor(config) {
        this.debug = false
        this.baseUrl = null
        this.authorization = null

        if (config.hasOwnProperty("debug")) {
            this.debug = config.debug
        }
        
        if (config.hasOwnProperty("baseUrl")) {
            this.baseUrl = String(config.baseUrl)
            if (this.baseUrl.slice(-1) !== "/") {
                this.baseUrl += "/"
            }
        }

        if (config.hasOwnProperty("username") && config.hasOwnProperty("password")) {
            this.authorization = "Basic", btoa(config.username + ":" + config.password)
        }

        if (config.hasOwnProperty("version")) {
            if (!Versions.isValidVersion(config.version)) {
                console.error("LRS not supported: invalid version", "(", config.version, ")");
            }
        } 
        else {
            this.version = Versions.getAllVersions()[0];
        }
    }

    setDebug(debug) {
        this.debug = debug
    }

    buildHeaders(headers) {
        const headersAux = {
            ...headers,
            Authorization: this.authorization,
        }

        if (this.version !== "0.9") {
            headersAux["X-Experience-API-Version"] = this.version;
        }

        return headersAux
    }

    sendRequest(endpoint, method, headers, body, onSuccess, onError) {
        let fullUrl;

        if (endpoint.startsWith("http")) {
            fullUrl = endpoint
        } else {
            fullUrl = this.baseUrl + endpoint
        }

        return httpRequest(fullUrl, method, this.buildHeaders(headers), body, onSuccess, onError, this.debug)
    }

    saveStatement(statement, onSuccess, onError) {
        let endpoint = "statements"
        let method = "POST"
        let headers = {
            "Content-Type": "application/json"
        }

        // TODO - serializeXApi()
        const statement1 = {
            "id": "e0226276-c4a8-4512-991d-f5808946bf2d",
            "actor": {
                "mbox": "mailto:tyler@yopmail.es",
                "name": "Tyler",
                "objectType": "Agent"
            },
            "verb": {
                "id": "http://adlnet.gov/expapi/verbs/answered",
                "display": {
                    "en-US": "answered"
                }
            },
            "object": {
                "id": "http://adlnet.gov/expapi/activities/example",
                "definition": {
                    "name": {
                        "en-US": "Example Activity"
                    },
                    "description": {
                        "en-US": "Example activity description"
                    }
                },
                "objectType": "Activity"
            }
        }

        this.sendRequest(endpoint, method, headers, statement1, onSuccess, onError)
    }

    saveStatements(statements, onSuccess, onError) {
        let endpoint = "statements"
        let method = "POST"
        let headers = {
            "Content-Type": "application/json"
        }

        const statement1 = {
            "id": "e0226276-c4a8-4512-991d-f5808946bf2d",
            "actor": {
                "mbox": "mailto:tyler@yopmail.es",
                "name": "Tyler",
                "objectType": "Agent"
            },
            "verb": {
                "id": "http://adlnet.gov/expapi/verbs/answered",
                "display": {
                    "en-US": "answered"
                }
            },
            "object": {
                "id": "http://adlnet.gov/expapi/activities/example",
                "definition": {
                    "name": {
                        "en-US": "Example Activity"
                    },
                    "description": {
                        "en-US": "Example activity description"
                    }
                },
                "objectType": "Activity"
            }
        }
        const statement2 = {
            "id": "c78dd525-5f33-4e42-a980-542279c12074",
            "actor": {
                "mbox": "mailto:tyler@yopmail.es",
                "name": "Tyler",
                "objectType": "Agent"
            },
            "verb": {
                "id": "http://adlnet.gov/expapi/verbs/answered",
                "display": {
                    "en-US": "answered"
                }
            },
            "object": {
                "id": "http://adlnet.gov/expapi/activities/example",
                "definition": {
                    "name": {
                        "en-US": "Example Activity"
                    },
                    "description": {
                        "en-US": "Example activity description"
                    }
                },
                "objectType": "Activity"
            }
        }
        statements.push(statement1)
        statements.push(statement2)
        
        let statementsAux = []

        if (statements.length !== 0) {
            for (let statement of statements) {
                // TODO - serializeXApi
                statementsAux.push(statement)
            }
            
            this.sendRequest(endpoint, method, headers, statementsAux, onSuccess, onError)
        }
    }
}
