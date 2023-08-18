const Component = require('@interface/Component');
const BranchSwitcher = require('@src/www/components/BranchSwitcher');
const Button = require('@src/www/components/DocForm/FormField/Button');

class RepoTile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./RepoTile.html');
    }

    constructor(settings) {
        super(settings);

        const { _id, frontURL, repoName, nodeVersion, baseBranch, localPath, url, repoManager, subscriptionUID } = Object(settings);
        
        this._id = _id;
        this.frontURL = frontURL;
        this.repoName = repoName;
        this.nodeVersion = nodeVersion;
        this.baseBranch = baseBranch;
        this.localPath = localPath;
        this.url = url;
        this.subscriptionUID = subscriptionUID;

        this.branchSwitcher = new BranchSwitcher({ repoManager, repoUID: _id, subscriptionUID });
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
