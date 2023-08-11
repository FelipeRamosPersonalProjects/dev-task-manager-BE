const Component = require('@interface/Component');
const ErrorMessage = require('../ErrorMessage');

class BranchSwitcher extends Component {
    get SOURCE_PATH() {
        return require.resolve('./BranchSwitcher.html');
    }

    constructor(settings) {
        super(settings);

        const { currentBranch, error } = Object(settings);
        
        this.currentBranch = currentBranch;

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

    setSuccess() {
        try {
            
        } catch (err) {
            throw new Error.Log(err);
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
