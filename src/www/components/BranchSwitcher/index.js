const Component = require('@interface/Component');

class BranchSwitcher extends Component {
    get SOURCE_PATH() {
        return require.resolve('./BranchSwitcher.html');
    }

    constructor(settings) {
        super(settings);

        const { currentBranch } = Object(settings);
        
        this.currentBranch = currentBranch;
    }
}

module.exports = BranchSwitcher;
