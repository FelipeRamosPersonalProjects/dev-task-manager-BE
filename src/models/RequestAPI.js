const ValidateSchema = require('../validation/validateSchema');

class RequestAPI extends ValidateSchema {
    constructor(request, bodySchema) {
        super(bodySchema);

        const Model = Boolean.isValid(this._schema).path('statics.Model').eval();
        this.originalRequest = request;

        if (Model) {
            this.body = new Model(request.body || {});
        } else {
            const hasError = this.validate(request.body);

            if (!hasError) {
                this.body = request.body;
            } else {
                throw hasError;
            }
        }
    }

    getBody() {
        return this.placeDefault(this.body);
    }
}

module.exports = RequestAPI;
