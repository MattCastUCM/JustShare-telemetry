export default class GameObject {
    constructor(tracker) {
        this.tracker = tracker;
        this.types = {
            NPC: 'https://w3id.org/xapi/lab/activity-types/non-player-character',
            Item: 'https://w3id.org/xapi/lab/activity-types/item',
            GameObject: 'https://w3id.org/xapi/lab/activity-types/game-object'
        };
    }

    // CAMBIAR
    interacted(id, type = 'GameObject') {
        this.tracker.addEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/interacted',
            objectType: this.types[type],
            id: id
        });
    }

    // CAMBIAR
    used(id, type = 'GameObject') {
        this.tracker.addEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/used',
            objectType: this.types[type],
            id: id
        });
    }
}
