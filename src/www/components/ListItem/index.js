const Component = require('@interface/Component');

class ListItem extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ListItem.html');
    }

    constructor(settings) {
        super(settings);

        const { displayName, frontURL } = Object(settings);
        
        this.displayName = displayName;
        this.frontURL = frontURL;
    }
}

module.exports = ListItem;
