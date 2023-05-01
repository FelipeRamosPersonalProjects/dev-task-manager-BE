const Component = require('@interface/Component');

class BranchTile extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/BranchTile.md');
    }

    constructor(settings) {
        super(settings);
        const { branchName } = Object(settings);
        
        this.branchName = branchName;
    }
}

module.exports = BranchTile;
