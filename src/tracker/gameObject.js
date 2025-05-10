export default class GameObject {
    constructor(tracker) {
        this.tracker = tracker;

        this.types = {
            item: 0,
            npc: 1,

            properties: ["item", "non-player-character"]
        }

        this.ids = {
            "item": 'https://w3id.org/xapi/seriousgames/activity-types/item',
            "non-player-character": 'https://w3id.org/xapi/seriousgames/activity-types/non-player-character'
        };

        this.descriptions = {
            "item": "A collectable game object whose use or interaction results in an effect in a game. Items are common elements in video games. Players can collect/use/combine them.",
            "non-player-character": "A character that can offer a conversation or other type of interaction inside a game. Players usually have conversations with non-player characters."
        }
    }


    interacted(type, gameObjectName, extensions = null) {
        let property = this.types.properties[type]

        this.tracker.addEvent({
            verb: {
                id: 'http://adlnet.gov/expapi/verbs/interacted',
                type: "interacted"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: gameObjectName
            },
            extensions: extensions

        });
    }

    used(type, gameObjectName, extensions = null) {
        let property = this.types.properties[type]

        this.tracker.addEvent({
            verb: {
                id: 'https://w3id.org/xapi/seriousgames/verbs/used',
                type: "used"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: gameObjectName
            },
            extensions: extensions
        });
    }
}
