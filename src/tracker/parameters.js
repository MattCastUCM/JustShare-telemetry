export class Actor {
    constructor(name, email) {
        this.name = name
        this.email = email
    }

    serializeToXApi() {
        return {
            mbox: "mailto:" + this.email,
            name: this.name,
            objectType: "Agent"
        }
    }
}

export class Verb {
    constructor({id, type}) {
        this.id = id;
        this.type = type
    }

    serializeToXApi() {
        return {
            id: this.id,
            display: { "en-US": this.type }
        }
    }
}

export class Object {
    constructor({id, type, description, name}) {
        this.id = id;
        this.type = type
        this.description = description;
        this.name = name;
    }

    serializeToXApi() {
        let definition = {
            name: { "en-US": this.type },
            type: this.id + "/" + this.name
        };

        if (this.description) {
            definition.description = { "en-US": this.description };
        }

        return {
            id: this.id,
            definition,
            objectType: "Activity"
        };
    }
}

// TODO: ¿¿Quizás no debería ser clase??
export class Context {
    constructor(contextActivities = {}) {
        this.contextActivities = contextActivities;
    }

    serializeToXApi() {
        return {
            contextActivities: this.contextActivities
        };
    }
}

export class Result {
    constructor({ success = null, completion = null, scoreScaled = null, response = null } = {}) {
        this.success = success;
        this.completion = completion;
        this.scoreScaled = scoreScaled;
        this.response = response;
    }

    serializeToXApi() {
        let result = {};
        if (this.success) result.success = this.success;
        if (this.completion) result.completion = this.completion;
        if (this.scoreScaled) result.score = { scaled: this.scoreScaled };
        if (this.response) result.response = this.response;
        return result;
    }
}
