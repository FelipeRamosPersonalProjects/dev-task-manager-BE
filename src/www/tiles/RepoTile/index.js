const Component = require('@interface/Component');
const Button = require('@src/www/components/DocForm/FormField/Button');

class RepoTile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./RepoTile.html');
    }

    constructor(settings) {
        super(settings);

        const { _id, frontURL, repoName, nodeVersion, baseBranch, localPath, url, stashes } = Object(settings);
        
        this.frontURL = frontURL;
        this.repoName = repoName;
        this.nodeVersion = nodeVersion;
        this.baseBranch = baseBranch;
        this.localPath = localPath;
        this.url = url;

        this.openEditorButton = new Button({
            label: 'Open VS Code',
            attributes: `js="open-vscode" data-repouid="${_id}"`
        });

        this.createPRButton = new Button({
            label: 'Create PR',
            attributes: 'js="create-pr"'
        });
    }
}

module.exports = RepoTile;
