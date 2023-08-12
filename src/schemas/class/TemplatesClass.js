const Template = require('@models/collections/Template');

class TemplatesClass {
    static Model = Template;

    get displayName() {
        return this.title;
    }

    get frontURL() {
        return `/templates/read-edit/${this.index}`;
    }
}

module.exports = TemplatesClass;
