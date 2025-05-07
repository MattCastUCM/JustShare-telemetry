export default class Result {
    constructor({ success = null, completion = null, scoreScaled = null, response = null } = {}) {
        this.success = success;
        this.completion = completion;
        this.scoreScaled = scoreScaled;
        this.response = response;
    }

    serializeToXApi(version) {
        let result = {};
        if (this.success) result.success = this.success;
        if (this.completion) result.completion = this.completion;
        if (this.scoreScaled) result.score = { scaled: this.scoreScaled };
        if (this.response) result.response = this.response;
        return result;
    }
}