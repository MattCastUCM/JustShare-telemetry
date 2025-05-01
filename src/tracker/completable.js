export default class Completable {
    constructor(tracker) {
        this.tracker = tracker;
        this.types = {
            game: 'https://w3id.org/xapi/lab/activity-types/serious-game',
            session: 'https://w3id.org/xapi/lab/activity-types/session',
            level: 'https://w3id.org/xapi/lab/activity-types/level',
            quest: 'https://w3id.org/xapi/lab/activity-types/quest',
            stage: 'https://w3id.org/xapi/lab/activity-types/stage',
            storyNode: 'https://w3id.org/xapi/lab/activity-types/story-node',
            completable: 'https://w3id.org/xapi/lab/activity-types/completable'
        };
    }

    // REVISAR EJEMPLO
    initialized(name, type = 'completable') {
        this.tracker.addEvent({
            verb: {
                id: 'https://w3id.org/xapi/lab/verbs/initialized',
                type: "initialized"
            },
            object: {
                id: this.types[type],
                type: type,
                description: "Hola",
                name: name,
            }
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
