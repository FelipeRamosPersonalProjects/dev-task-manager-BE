const Component = require('@interface/Component');
const ErrorMessage = require('../ErrorMessage');
const SelectInput = require('../DocForm/FormField/SelectInput');

class BranchSwitcher extends Component {
    get SOURCE_PATH() {
        return require.resolve('./BranchSwitcher.html');
    }

    constructor(settings) {
        super(settings);

        const { repoUID, currentBranch, error, repoManager, subscriptionUID } = Object(settings);
        
        this.currentBranch = currentBranch;
        this.subscriptionUID = subscriptionUID;
        this.repoUID = repoUID || '';
        this.repoManager = repoManager;

        this.refresh();
        
        if (error) {
            this.setError.BAD_BRANCH_NAME();
        }
    }

    get setters() {
        return {
            errorMessage: (error) => {
                if (error === 'BAD_BRANCH_NAME') {
                    this.errorMessage = new ErrorMessage({ message: `This branch name is not recommandable for the project stardards!` });
                } else {
                    this.errorMessage = new ErrorMessage({ message: error });
                }
            }
        };
    }
    
    get setError() {
        this.error = 'error';

        return {
            BAD_BRANCH_NAME: () => {
                try {
                    this.setters.errorMessage('BAD_BRANCH_NAME');
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        }
    }

    refresh() {
        if (this.repoManager) {
            this.currentBranch = this.repoManager.getCurrentBranch();
            this.branches = this.repoManager.getAllBranches();
            this.options = new SelectInput({
                label: 'Switch Branch',
                notField: true,
                currentValue: this.currentBranch,
                options: this.branches.map(item => ({label: item, value: item}))
            });
        }
    }

    resolve() {
        try {
            
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = BranchSwitcher;
