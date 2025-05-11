export default class Object {
    constructor({ id, type, description, name,extensions }) {
        this.id = id;
        this.type = type
        this.description = description;
        this.name = name;
        this.extensions= extensions;
    }

    serializeToXApi(version) {
        let definition = {
            name: { "en-US": this.type },
            type: this.id
        };

        if (this.description) {
            definition.description = { "en-US": this.description };
        }
         if (this.extensions) {
            definition.extensions = this.extensions;
        }

        return {
            id: this.id + "/" + this.name,
            definition,
            objectType: "Activity"
        };
    }
}