const Component = require('@interface/Component');

class ListItem extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ListItem.html');
    }

    constructor(settings) {
        super(settings);

        const { displayName, url } = Object(settings);
        
        this.displayName = displayName;
        this.url = url;
    }
}

module.exports = ListItem;
