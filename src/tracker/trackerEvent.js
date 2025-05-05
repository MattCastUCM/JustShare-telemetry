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
        let output = {
            timestamp: this.timestamp,
            id: this.id,
            version: version,
            actor: this.actor.serializeToXApi(),
            verb: this.verb.serializeToXApi(),
            object: this.object.serializeToXApi()
        }
        if(this.result) {
            output.result = this.result.serializeToXApi();
        }
        if(this.context) {
            output.context = this.context.serializeToXApi();
        }

        return output;
    }
}
