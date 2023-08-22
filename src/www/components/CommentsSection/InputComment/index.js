const Component = require('@interface/Component');
const Button = require('@www/components/DocForm/FormField/Button');
const TextArea = require('@www/components/DocForm/FormField/TextArea');

class InputComment extends Component {
    get SOURCE_PATH() {
        return require.resolve('./InputComment.html');
    }

    constructor(settings) {
        super(settings);

        this.bodyInput = new TextArea({
            notField: true
        });

        this.addButton = new Button({
            type: 'submit',
            label: 'Add Comment'
        });
    }
}

module.exports = InputComment;
