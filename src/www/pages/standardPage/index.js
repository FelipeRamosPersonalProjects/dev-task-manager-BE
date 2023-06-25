const Component = require('@interface/Component');

class StandardPage extends Component {
    get SOURCE_PATH() {
        return require.resolve('./standardPage.html');
    }

    constructor(settings) {
        super(settings);

        const { pageID, pageTitle, body } = Object(settings);
        
        this.pageID = pageID;
        this.pageTitle = pageTitle;
        this.body = body;
    }
}

module.exports = StandardPage;
