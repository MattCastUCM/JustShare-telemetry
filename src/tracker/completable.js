export default class Completable {
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
        this.tracker.addEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/initialized',
            objectType: this.types[type],
            id: id
        });
    }

    progressed(id, progress, type = 'Completable') {
        this.tracker.addEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/progressed',
            objectType: this.types[type],
            id: id,
            progress: progress
        });
    }

    completed(id, success = true, score = 1, type = 'Completable') {
        this.tracker.addEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/completed',
            objectType: this.types[type],
            id: id,
            success: success,
            score: score
        });
    }
}
