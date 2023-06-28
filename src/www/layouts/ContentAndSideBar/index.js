const Component = require('@interface/Component');

class ContentAndSideBarLayout extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ContentAndSideBar.html');
    }

    constructor(settings) {
        super(settings);

        const { firstField } = Object(settings);
        
        this.firstField = firstField;
    }
}

module.exports = ContentAndSideBarLayout;
