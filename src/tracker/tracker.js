function generateStatementId() {
    return crypto.randomUUID();
}

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

export default class Tracker {
    constructor(config) {
        this.debug = false
        this.baseUrl = null
        this.authorization = null

        this.queue = [];

        this.completable = new Completable(this);
        this.gameObject = new GameObject(this);

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
            this.authorization = "Basic " + btoa(config.username + ":" + config.password)
        }

        if (config.hasOwnProperty("version")) {
            if (!Versions.isValidVersion(config.version)) {
                console.error("LRS invalid version:", config.version);
            }
        } 
        else {
            this.version = Versions.getAllVersions()[0];
        }
    }

    httpRequest(fullUrl, method, headers, body, onSuccess, onError) {
        method = method.toUpperCase()

        let config = {
            method: method,
            headers: headers,
        }

        if (["POST", "PUT"].includes(method)) {
            config.body = JSON.stringify(body)
        }

        fetch(fullUrl, config)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP Error status:" + response.status)
                }
                return response.json()
            })
            .then(data => {
                if (onSuccess) {
                    onSuccess(data)
                }
            })
            .catch(error => {
                if(this.debug) {
                    console.error("Request failed:", error.message)
                }

                if (onError) {
                    onError(error)
                }
            })
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
        let fullUrl = this.baseUrl + endpoint

        if (endpoint.startsWith("http")) {
            fullUrl = endpoint
        }

        return this.httpRequest(fullUrl, method, this.buildHeaders(headers), body, onSuccess, onError)
    }

    sendEvent(event, onSuccess, onError) {
        let endpoint = "statements"
        let method = "POST"
        let headers = {
            "Content-Type": "application/json"
        }

        // TODO - serializeXApi()
        const statement = {
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

        this.sendRequest(endpoint, method, headers, statement, onSuccess, onError)
    }

    sendEvents(events, onSuccess, onError) {
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
        events.push(statement1)
        events.push(statement2)
        
        let statements = []

        if (events.length !== 0) {
            for (let event of events) {
                // TODO - serializeXApi
                // statements.push(event.serializeXApi(this.version))
                statements.push(event)
            }
            
            this.sendRequest(endpoint, method, headers, statements, onSuccess, onError)
        }
    }
    
    validateParams(params) {
        const REQUIRE_FIELDS = ['verb', 'objectType', 'id'];
        for (let field of REQUIRE_FIELDS) {
            if (!params.hasOwnProperty(field)) {
                // console.error("Invalid Event--------------------------");
                return false;
            }
        }
        // console.log("Valid Event-----------------------------");
        return true;
    }

    saveEvent(params) {
        if (this.validateParams(params)) {
            let event = new TrackerEvent()
            event.setId(generateStatementId())

            this.queue.push(event);
        }
    }
}

class Actor {
    constructor(name, email) {
        this.name = name
        this.email = email
    }

    serializeXApi(version) {
        return {
            mbox: "mailto:" + this.email,
            name: this.name,
            objectType: "Agent"
        }
    }
}

class TrackerEvent {
    constructor() {
        this.actor = null;
        this.verb = null;
        this.object = null;
        this.result = null;
        this.context = null;
        this.id = null;
        this.timeStamp = Date.now()
    }

    setId(id) {
        this.id = id
    }

    serializeXApi(version) {
        return {
            timeStamp: this.timeStamp,
            id: this.id,
            version: version,
            actor: this.actor.serializeXApi(version)
        }
    }
}

class Completable {
    constructor(tracker) {
        this.tracker = tracker;
        this.types = {
            Game: 'https://w3id.org/xapi/lab/activity-types/serious-game',
            Session: 'https://w3id.org/xapi/lab/activity-types/session',
            Level: 'https://w3id.org/xapi/lab/activity-types/level',
            Quest: 'https://w3id.org/xapi/lab/activity-types/quest',
            Stage: 'https://w3id.org/xapi/lab/activity-types/stage',
            StoryNode: 'https://w3id.org/xapi/lab/activity-types/story-node',
            Completable: 'https://w3id.org/xapi/lab/activity-types/completable'
        };
    }

    initialized(id, type = 'Completable') {
        this.tracker.saveEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/initialized',
            objectType: this.types[type],
            id: id
        });
    }

    progressed(id, progress, type = 'Completable') {
        this.tracker.saveEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/progressed',
            objectType: this.types[type],
            id: id,
            progress: progress
        });
    }

    completed(id, success = true, score = 1, type = 'Completable') {
        this.tracker.saveEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/completed',
            objectType: this.types[type],
            id: id,
            success: success,
            score: score
        });
    }
}

class GameObject {
    constructor(tracker) {
        this.tracker = tracker;
        this.types = {
            NPC: 'https://w3id.org/xapi/lab/activity-types/non-player-character',
            Item: 'https://w3id.org/xapi/lab/activity-types/item',
            GameObject: 'https://w3id.org/xapi/lab/activity-types/game-object'
        };
    }

    interacted(id, type = 'GameObject') {
        this.tracker.saveEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/interacted',
            objectType: this.types[type],
            id: id
        });
    }

    used(id, type = 'GameObject') {
        this.tracker.saveEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/used',
            objectType: this.types[type],
            id: id
        });
    }
}

console.log(generateStatementId())