const FormField = require('..');
const ListItem = require('@www/components/ListItem');
const RelationOption = require('./RelationOption');
const crypto = require('crypto');

class MultiRelation extends FormField {
    get SOURCE_PATH() {
        return require.resolve('./MultiRelation.html');
    }

    constructor(settings) {
        super(settings);

        const { view, wrapperTag, classes, options } = Object(settings);

        this.view = view || 'create';
        this.wrapperTag = this.view === 'create' ? 'div' : 'form';
        this.classes = this.view === 'create' ? `class="${classes || ''}"` : `class="readedit-form ${classes || ''}"`;
        this.options = options.map(item => {
            item.uniqueID = crypto.randomUUID();
            item.selected = this.currentValue && this.currentValue.some(value => value._id === item._id)

            return item;
        });
        this.types = {
            ListItem,
            RelationOption
        }

        if (wrapperTag) {
            this.wrapperTag = wrapperTag;
        }
    }
}

module.exports = MultiRelation;
