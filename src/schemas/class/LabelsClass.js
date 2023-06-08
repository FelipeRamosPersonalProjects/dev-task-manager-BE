const Label = require('@models/collections/Label');

class LabelsClass {
    static Model = Label;

    get slug() {
        return typeof this.name === 'string' ? this.name.toLowerCase().replace(/ /g, '-') : '';
    }
}

module.exports = LabelsClass;
