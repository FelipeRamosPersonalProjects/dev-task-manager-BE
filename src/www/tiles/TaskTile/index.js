const Component = require('@interface/Component');

class TaskTile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./TaskTile.html');
    }

    constructor(settings) {
        super(settings);

        const { displayName, externalURL, frontURL } = Object(settings);
        
        this.displayName = displayName;
        this.externalURL = externalURL;
        this.frontURL = frontURL;
    }
}

module.exports = TaskTile;

