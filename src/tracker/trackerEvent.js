export default class TrackerEvent {
    constructor({ verb = null, object = null, result = null, context = null } = {}) {
        this.id = generateStatementId();
        this.timestamp = new Date().toISOString();
        this.actor = null;
        this.verb = verb;
        this.object = object;
        this.result = result;
        this.context = context;
    }

    serializeToXApi(version) {
        let output = {
            timeStamp: this.timestamp,
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
