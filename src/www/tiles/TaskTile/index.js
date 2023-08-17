const Component = require('@interface/Component');
const Button = require('@www/components/DocForm/FormField/Button');

class TaskTile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./TaskTile.html');
    }

    constructor(settings) {
        super(settings);

        const { displayName, externalURL } = Object(settings);
        
        this.displayName = displayName;
        this.externalURL = externalURL;
        this.openButton = new Button({
            label: 'Open Task'
        });
    }
}

module.exports = TaskTile;

