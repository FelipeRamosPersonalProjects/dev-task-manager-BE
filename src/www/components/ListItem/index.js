const Component = require('@interface/Component');

class ListItem extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ListItem.html');
    }

    constructor(settings) {
        super(settings);

        const { displayName } = Object(settings);
        
        this.displayName = displayName;
    }
}

module.exports = ListItem;
