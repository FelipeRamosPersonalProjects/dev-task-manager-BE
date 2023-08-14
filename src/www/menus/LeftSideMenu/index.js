const Component = require('@interface/Component');

class LeftSideMenu extends Component {
    get SOURCE_PATH() {
        return require.resolve('./LeftSideMenu.html');
    }

    constructor(settings) {
        super(settings);
    }
}

module.exports = LeftSideMenu;
