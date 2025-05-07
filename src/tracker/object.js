export default class Object {
    constructor({id, type, description, name}) {
        this.id = id;
        this.type = type
        this.description = description;
        this.name = name;
    }

    serializeToXApi(version) {
        let definition = {
            name: { "en-US": this.type },
            type: this.id
        };

        if (this.description) {
            definition.description = { "en-US": this.description };
        }

        return {
            id: this.id + "/" + this.name,
            definition,
            objectType: "Activity"
        };
    }
}