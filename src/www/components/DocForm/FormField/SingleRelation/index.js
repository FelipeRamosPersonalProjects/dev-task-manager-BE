const FormField = require('..');
const RelationOption = require('./RelationOption');

class SingleRelation extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./SingleRelation.html');
    }

    constructor(settings) {
        super(settings);

        const { view, wrapperTag, classes, options, currentValue } = Object(settings);

        this.frontURL = this.currentValue.frontURL;
        this.currentValue = this.currentValue ? this.currentValue.displayName : '';
        this.view = view || 'create';
        this.wrapperTag = this.view === 'create' ? 'div' : 'form';
        this.classes = this.view === 'create' ? `class="float-input ${classes || ''}"` : `class="readedit-form float-input ${classes || ''}"`;
        this.options = Array.isArray(options) && options.map(item => {
            if (item._id === currentValue) {
                item.selected = true;
            }

            return item;
        });
        this.types = {
            RelationOption
        }

        if (wrapperTag) {
            this.wrapperTag = wrapperTag;
        }
    }
}

module.exports = SingleRelation;
