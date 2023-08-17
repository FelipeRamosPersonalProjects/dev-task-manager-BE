const Component = require('@interface/Component');

class ProjectTile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ProjectTile.html');
    }

    constructor(settings) {
        super(settings);

        const { displayName, frontURL } = Object(settings);
        
        this.projectName = displayName;
        this.frontURL = frontURL;
    }
}

module.exports = ProjectTile;

