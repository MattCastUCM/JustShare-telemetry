export default class Accessible {
    constructor(tracker) {
        this.tracker = tracker;
        this.types = {
            screen: 'https://w3id.org/xapi/seriousgames/activity-types/screen',
            area: 'https://w3id.org/xapi/seriousgames/activity-types/area',
            zone: 'https://w3id.org/xapi/seriousgames/activity-types/zone',
            cutscene: 'https://w3id.org/xapi/seriousgames/activity-types/cutscene',
            accessible: 'https://w3id.org/xapi/seriousgames/activity-types/accessible'
        };
    }

    accessed(id, type = 'Accessible') {
        this.tracker.addEvent({
            verb: 'https://w3id.org/xapi/seriousgames/verbs/accessed',
            objectType: this.types[type],
            id: id
        });
    }

    skipped(id, type = 'Accessible') {
        this.tracker.addEvent({
            verb: 'http://id.tincanapi.com/verb/skipped',
            objectType: this.types[type],
            id: id
        });
    }
}