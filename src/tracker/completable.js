export default class Completable {
    constructor(tracker) {
        this.tracker = tracker;

        this.types = {
            seriousGame: 0,
            area: 1,
            level: 2,
            quest: 3,
            dialogTree: 4,
            properties: ["serious-game", "area", "level", "quest", "dialog-tree"]
        }

        this.ids = {
            "serious-game": 'https://w3id.org/xapi/seriousgames/activity-types/serious-game',
            "area": 'https://w3id.org/xapi/seriousgames/activity-types/area',
            "level": 'https://w3id.org/xapi/seriousgames/activity-types/level',
            "quest": 'https://w3id.org/xapi/seriousgames/activity-types/quest',
            "dialog-tree": 'https://w3id.org/xapi/lab/activity-types/story-node'
        };

        this.descriptions = {
            "serious-game": "A collectable game object whose use or interaction results in an effect in a game. Items are common elements in video games. Players can collect/use/combine them.",
            "area": "An identified area inside the game world. In some games they can also be worlds. Represents an aggregation of zones.	",
            "level": "A level of a game or of a gamified learning platform. A level is logic partition of progression in any video game. Completing a level means advancing in the progression of the game.",
            "quest": "A accomplishable challenge or mission presented inside a game. Completing quests marks the players' progress."
        }
    }

    initialized(type, completableName, extensions = null) {
        let property = this.types.properties[type]
        this.tracker.addEvent({
            verb: {
                id: 'https://w3id.org/xapi/dod-isd/verbs/initialized',
                type: "initialized"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: completableName
            },
            extensions: extensions

        });
    }

    progressed(type, completableName, score = 0, extensions = null) {
        let property = this.types.properties[type]
        this.tracker.addEvent({
            verb: {
                id: 'http://adlnet.gov/expapi/verbs/progressed',
                type: "progressed"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: completableName
            },
            result: {
                scoreScaled: score
            },
            extensions: extensions
        });
    }

    completed(type, completableName, completion = true, success = true, score = 0, extensions = null) {
        let property = this.types.properties[type]
        this.tracker.addEvent({
            verb: {
                id: 'https://w3id.org/xapi/dod-isd/verbs/completed',
                type: "completed"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: completableName
            },
            result: {
                success: success,
                completion: completion,
                scoreScaled: score
            },
            extensions: extensions
        });
    }
}
