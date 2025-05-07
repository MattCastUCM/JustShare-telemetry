import { generateUUID } from "./utils.js";

export default class TrackerEvent {
    constructor({ actor, verb, object, result, context }) {
        this.id = generateUUID();
        this.timestamp = new Date().toISOString();
        this.actor = null;

        this.actor = actor
        this.verb = verb;
        this.object = object;
        this.result = result;
        this.context = context;
    }

    serializeToXApi(version) {
        let event = {
            timestamp: this.timestamp,
            id: this.id,
            version: version,
            actor: this.actor.serializeToXApi(version),
            verb: this.verb.serializeToXApi(version),
            object: this.object.serializeToXApi(version)
        }
        if (this.result) {
            event.result = this.result.serializeToXApi(version);
        }
        if (this.context) {
            event.context = this.context.serializeToXApi(version);
        }

        return event;
    }
}
