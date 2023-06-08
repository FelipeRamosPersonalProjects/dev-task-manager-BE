const Label = require('@models/collections/Label');

class LabelsClass {
    static Model = Label;

    get slug() {
        return typeof this.displayName === 'string' ? this.displayName.toLowerCase().replace(/ /g, '-') : '';
    }
}

module.exports = LabelsClass;
