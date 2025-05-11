export default class Alternative {
    constructor(tracker) {
        this.tracker = tracker;

        this.types = {
            question: 0,
            menu: 1,
            dialog: 2,
            path: 3,
            arena: 4,
            properties: ["question", "menu", "dialog", "path", "arena"]
        }

        this.ids = {
            "question": 'http://adlnet.gov/expapi/activities/question',
            "menu": 'https://w3id.org/xapi/seriousgames/activity-types/menu',
            "dialog-tree": 'https://w3id.org/xapi/seriousgames/activity-types/dialog-tree'
        };

        this.descriptions = {
            "question": 'A question is typically part of an assessment and requires a response from the learner, a response that is then evaluated for correctness.',
            "menu": 'A menu with several buttons/options whose selection produces different effects. Represents a menu, integrated in the user interface (UI), with several a options.',
            "dialog-tree": 'An alternative presented during a conversation with an non-playable character. Dialog trees are a common mechanic in video games, where players can answer questions to NPC. This activity represents that type of alternative.'
        };
    }

    selected(type, alternativeName, extensions = null) {
        let property = this.types.properties[type]
        this.tracker.addEvent({
            verb: {
                id: 'https://w3id.org/xapi/adb/verbs/selected',
                type: "selected"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: alternativeName,
                extensions: extensions
            }
        });
    }

    unlocked(type, alternativeName, extensions = null) {
        let property = this.types.properties[type]
        this.tracker.addEvent({
            verb: {
                id: 'https://w3id.org/xapi/seriousgames/verbs/unlocked',
                type: "unlocked"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: alternativeName,
                extensions: extensions
            }
        });
    }
}