export default class Accessible {
    constructor(tracker) {
        this.tracker = tracker;

        this.types = {
            screen: 0,
            area: 1,
            zone: 2,
            cutscene: 3,
            properties: ["screen", "area", "zone", "cutscene"]
        }

        this.ids = {
            "screen": 'https://w3id.org/xapi/seriousgames/activity-types/screen',
            "area": 'https://w3id.org/xapi/seriousgames/activity-types/area',
            "zone": 'https://w3id.org/xapi/seriousgames/activity-types/zone',
            "cutscene": 'https://w3id.org/xapi/seriousgames/activity-types/cutscene'
        };

        this.descriptions = {
            "screen": 'A game screen where a concrete game task is developed. Games are usually composed by a set of screens the player navigates. A screen has a concrete function within the game. A screen contains a menu, or the gameplay. To define virtual zones inside the game world, it is recommended to use area or zone.',
            "area": 'An identified area inside the game world. In some games they can also be worlds. Represents an aggregation of zones.',
            "zone": 'An identified zone inside an area of the game world. A zone is inside an area, and defines a logic self-contained place.',
            "cutscene": 'A non-interactive scene that can be skipped. A cutscene is a non-interactive scene within the game (e.g., a video, a conversation, an automated sequence). The player can usually skip them pressing some button.'
        }
    }

    accessed(type, accessibleName, extensions = null) {
        let property = this.types.properties[type]
        this.tracker.addEvent({
            verb: {
                id: 'https://w3id.org/xapi/seriousgames/verbs/accessed',
                type: "accessed"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: accessibleName,
                extensions: extensions
            }
        });
    }

    skipped(type, accessibleName, extensions = null) {
        let property = this.types.properties[type]
        this.tracker.addEvent({
            verb: {
                id: 'http://id.tincanapi.com/verb/skipped',
                type: "skipped"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: accessibleName,
                extensions: extensions
            }
        });
    }
}