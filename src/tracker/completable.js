export default class Completable {
    constructor(tracker) {
        this.tracker = tracker;

        this.types = {
            game: 0,
            properties: ["game"]
        }

        this.ids = {
            game: 'https://w3id.org/xapi/lab/activity-types/serious-game',
            session: 'https://w3id.org/xapi/lab/activity-types/session',
            level: 'https://w3id.org/xapi/lab/activity-types/level',
            quest: 'https://w3id.org/xapi/lab/activity-types/quest',
            stage: 'https://w3id.org/xapi/lab/activity-types/stage',
            storyNode: 'https://w3id.org/xapi/lab/activity-types/story-node',
            completable: 'https://w3id.org/xapi/lab/activity-types/completable'
        };

        this.descriptions = {
            game: "A collectable game object whose use or interaction results in an effect in a game. Items are common elements in video games. Players can collect/use/combine them."
        }
    }

    // REVISAR EJEMPLO
    initialized(name, type) {
        let property = this.types.properties[type]

        this.tracker.addEvent({
            verb: {
                id: 'https://w3id.org/xapi/lab/verbs/initialized',
                type: "initialized"
            },
            object: {
                id: this.ids[property],
                type: property,
                description: this.descriptions[property],
                name: name,
            },
        });
    }

    // CAMBIAR
    progressed(id, progress, type = 'Completable') {
        this.tracker.addEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/progressed',
            objectType: this.types[type],
            id: id,
            progress: progress
        });
    }

    // CAMBIAR
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
