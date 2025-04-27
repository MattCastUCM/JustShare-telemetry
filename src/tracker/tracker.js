
class Tracker { //placeholder
    constructor() {
        this.queue = [];
    }

    sendEvent(event) {
        this.queue.push(event);
    }
}


class Completable {
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
        this.tracker.sendEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/initialized',
            objectType: this.types[type],
            id: id
        });
    }

    progressed(id, progress, type = 'Completable') {
        this.tracker.sendEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/progressed',
            objectType: this.types[type],
            id: id,
            progress: progress
        });
    }

    completed(id, success = true, score = 1, type = 'Completable') {
        this.tracker.sendEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/completed',
            objectType: this.types[type],
            id: id,
            success: success,
            score: score
        });
    }
}

class GameObject {
    constructor(tracker) {
        this.tracker = tracker;
        this.types = {
            NPC: 'https://w3id.org/xapi/lab/activity-types/non-player-character',
            Item: 'https://w3id.org/xapi/lab/activity-types/item',
            GameObject: 'https://w3id.org/xapi/lab/activity-types/game-object'
        };
    }

    interacted(id, type = 'GameObject') {
        this.tracker.sendEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/interacted',
            objectType: this.types[type],
            id: id
        });
    }

    used(id, type = 'GameObject') {
        this.tracker.sendEvent({
            verb: 'https://w3id.org/xapi/lab/verbs/used',
            objectType: this.types[type],
            id: id
        });
    }
}

// ---------------- Ejemplo----------------

const tracker = new Tracker();
const completable = new Completable(tracker);
const gameObject = new GameObject(tracker);

// Ejemplos de eventos
completable.initialized("hola1", "StoryNode");
completable.progressed("hola2", 0.5, "StoryNode");
completable.completed("hola3", true, 100, "StoryNode");

gameObject.interacted("telefono_movil", "Item");
gameObject.used("ordenador", "GameObject");


//validación 
function validateEvent(event) {
    console.log("Generated Event", event);
    const requiredFields = ['verb', 'objectType', 'id'];
    for (const field of requiredFields) {
        if (!event.hasOwnProperty(field)) {
            console.error("Invalid Event--------------------------");
            return false;
        }
    }
    console.log("Valid Event-----------------------------");
    return true;
}

// Validar los eventos generados
tracker.queue.forEach(validateEvent);
