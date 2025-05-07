export default class Alternative {
    constructor(tracker) {
        this.tracker = tracker;
        this.types = {
            question: 'http://adlnet.gov/expapi/activities/question',
            menu: 'https://w3id.org/xapi/seriousgames/activity-types/menu',
            dialog: 'https://w3id.org/xapi/seriousgames/activity-types/dialog-tree',
            path: 'https://w3id.org/xapi/seriousgames/activity-types/path',
            arena: 'https://w3id.org/xapi/seriousgames/activity-types/arena',
            alternative: 'https://w3id.org/xapi/seriousgames/activity-types/alternative'
        };
    }

    selected(id, type = 'Alternative') {
        this.tracker.addEvent({
            verb: 'https://w3id.org/xapi/adb/verbs/selected',
            objectType: this.types[type],
            id: id
        });
    }

    unlocked(id, type = 'Alternative') {
        this.tracker.addEvent({
            verb: 'https://w3id.org/xapi/seriousgames/verbs/unlocked',
            objectType: this.types[type],
            id: id
        });
    }
}