const Component = require('@interface/Component');

class StandardPage extends Component {
    get SOURCE_PATH() {
        return require.resolve('./standardPage.html');
    }

    constructor(settings) {
        super(settings);

        const { pageTitle, body } = Object(settings);
        
        this.pageTitle = pageTitle;
        this.body = body;
    }
}

module.exports = StandardPage;
