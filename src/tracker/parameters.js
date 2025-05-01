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

export class Object {
    constructor(id, name, description = null) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    serializeToXApi() {
        const definition = {
            name: { "en-US": this.name }
        };
        if (this.description) {
            definition.description = { "en-US": this.description };
        }

        return {
            id: this.id,
            definition
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
        const result = {};
        if (this.success) result.success = this.success;
        if (this.completion) result.completion = this.completion;
        if (this.scoreScaled) result.score = { scaled: this.scoreScaled };
        if (this.response) result.response = this.response;
        return result;
    }
}

export class Verb {
    constructor(id, display) {
        this.id = id;
        this.display = { "en-US": display };
    }

    serializeToXApi() {
        return {
            id: this.id,
            display: this.display
        }
    }
}
