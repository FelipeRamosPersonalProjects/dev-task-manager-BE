const FormField = require('..');
const RelationOption = require('./RelationOption');

class SingleRelation extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./SingleRelation.html');
    }

    constructor(settings) {
        super(settings);

        const { view, wrapperTag, classes, options } = Object(settings);

        this.frontURL = this.currentValue.frontURL;
        this.currentValue = this.currentValue ? this.currentValue.displayName : '';
        this.view = view || 'create';
        this.wrapperTag = this.view === 'create' ? 'div' : 'form';
        this.classes = this.view === 'create' ? `class="${classes || ''}"` : `class="readedit-form ${classes || ''}"`;
        this.options = options;
        this.types = {
            RelationOption
        }

        if (wrapperTag) {
            this.wrapperTag = wrapperTag;
        }
    }
}

module.exports = SingleRelation;
