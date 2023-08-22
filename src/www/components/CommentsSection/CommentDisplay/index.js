const Component = require('@interface/Component');
const { TextAreaEdit } = require('@www/components/DocForm/FormField/fields');

class CommentDisplay extends Component {
    get SOURCE_PATH() {
        return require.resolve('./CommentDisplay.html');
    }

    constructor(settings) {
        super(settings);

        const { createdAt, body, index } = Object(settings);
        
        this.createdAt = createdAt;
        this.body = new TextAreaEdit({
            notField: true,
            currentValue: body,
            label: 'message',
            css: ['comment-input'],
            attr: { padding: 'l', js: 'edit-comment', 'data-commentindex': index }
        });
    }
}

module.exports = CommentDisplay;
