const Component = require('@interface/Component');
const CommentDisplay = require('./CommentDisplay');
const InputComment = require('./InputComment');

class CommentsSection extends Component {
    get SOURCE_PATH() {
        return require.resolve('./CommentsSection.html');
    }

    constructor(settings) {
        super(settings);

        const { headTitle, comments, attr } = Object(settings);
        
        this.headTitle = headTitle || 'Comments';
        this.comments = comments || [];
        this.inputComment = new InputComment({ attr });

        this.types = {
            CommentDisplay
        }
    }
}

module.exports = CommentsSection;
