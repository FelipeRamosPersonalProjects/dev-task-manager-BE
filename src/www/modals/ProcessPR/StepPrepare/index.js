const StepModel = require('../StepModel');
const Spinner = require('@www/components/Spinner');
const Button = require('@www/components/DocForm/FormField/Button');
const ErrorMessage = require('@www/components/ErrorMessage');

class StepPrepare extends StepModel {
    get SOURCE_PATH() {
        return require.resolve('./StepPrepare.html');
    }

    constructor(settings, parent) {
        super(settings, parent);

        const { isLoading, error, currentBranch, headBranch } = Object(settings);
        
        if (isLoading) {
            this.isLoading = new Spinner();
        } else {
            if (error) {
                this.setError[error] && this.setError[error];
            }

            // Setting properties
            this.currentBranch = currentBranch;
            this.headBranch = headBranch;
            this.recommendedBranch = headBranch;
            this.setButton.skip(true);

            if (currentBranch === headBranch) {
                this.setQuestion.stayCurrent();
                this.setButton.stayCurrentBranch(true);
            } else {
                this.setQuestion.createRecommended();
                this.setButton.createRecommended(true);
                this.setButton.switchBranch(true);
            }
        }
    }

    setRecommended(branchName) {
        this.recommendedBranch = branchName;
    }

    get setQuestion() {
        return {
            stayCurrent: () => {
                this.question = `<p>You're already using the correct branch for the task <b>${this.headBranch}</b>. Please stay on the current branch to proceed.</p>`
            },
            createRecommended: () => {
                this.question = `<p>Would you like to create the <b>${this.headBranch}</b> branch bringing the changes with?</p>`;
            }
        };
    }

    get setError() {        
        this.error = 'error';

        return {
            DUPLICATED_BRANCH: (branchName) => {
                try {
                    this.errorMessage = new ErrorMessage({
                        message: `This pull request already have a branch with the same name. The next version name is "${branchName}" you can switch to the opened branch or create a new version.`
                    });

                    this.setButton.createBranch(true);
                } catch (err) {
                    throw new Error.Log(err);
                }
            }
        };
    }

    get setButton() {
        return {
            createRecommended: (state) => {
                if (state) {
                    this.createRecommendedButton = new Button({
                        label: 'Create ' + this.headBranch,
                        attributes: 'js="step-prepare:create-recommended"'
                    });
                } else {
                    delete this.createRecommendedButton;
                }
            },
            createBranch: (state) => {
                if (state) {
                    this.createBranchButton = new Button({
                        label: 'Create Branch',
                        attributes: 'js="step-prepare:create-branch"'
                    });
                } else {
                    delete this.createBranchButton;
                }
            },
            switchBranch: (state) => {
                if (state) {
                    this.switchBranchButton = new Button({
                        label: 'Switch Branch',
                        attributes: 'js="step-prepare:switch-branch"'
                    });
                } else {
                    delete this.switchBranchButton;
                }
            },
            stayCurrentBranch: (state) => {
                if (state) {
                    this.stayCurrentBranchButton = new Button({
                        label: 'Stay on Current',
                        attributes: 'js="step-prepare:staycurrent"'
                    });
                } else {
                    delete this.stayCurrentBranchButton;
                }
            },
            skip: (state) => {
                if (state) {
                    this.skipButton = new Button({
                        label: 'Skip Step',
                        attributes: 'js="step-prepare:skip"'
                    });
                } else {
                    delete this.skipButton;
                }
            }
        };
    }

    get feedback() {
        return {
            preparingBranch: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('preparingBranchFeedback', 'success', 'The final branch is ready to commit!');
                        } else {
                            delete this.preparingBranchFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('preparingBranchFeedback', 'error', err.message);
                        } else {
                            delete this.preparingBranchFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        if (state) {
                            this.setFeedback('preparingBranchFeedback', 'loading', 'Preparing final branch to commit the changes...');
                        } else {
                            delete this.preparingBranchFeedback;
                        }

                        subscription.toClient();
                    }
                }
            },
            gettingCurrentChanges: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('gettingCurrentChangesFeedback', 'success', `Current changes checked!`);
                        } else {
                            delete this.gettingCurrentChangesFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('gettingCurrentChangesFeedback', 'error', err.message);
                        } else {
                            delete this.gettingCurrentChangesFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        if (state) {
                            this.setFeedback('gettingCurrentChangesFeedback', 'loading', 'Getting local current changes...');
                        } else {
                            delete this.gettingCurrentChangesFeedback;
                        }

                        subscription.toClient();
                    }
                }
            },
            connectingRemote: (subscription) => {
                return {
                    setSuccess: (state) => {
                        if (state) {
                            this.setFeedback('connectingRemoteFeedback', 'success', `Repository connected!`);
                        } else {
                            delete this.connectingRemoteFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('connectingRemoteFeedback', 'error', err.message);
                        } else {
                            delete this.connectingRemoteFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state) => {
                        if (state) {
                            this.setFeedback('connectingRemoteFeedback', 'loading', 'Connection to remote repository...');
                        } else {
                            delete this.connectingRemoteFeedback;
                        }

                        subscription.toClient();
                    }
                }
            },
            switchingBranch: (subscription) => {
                return {
                    setSuccess: (state, currentBranch) => {
                        if (state) {
                            this.setFeedback('switchingBranchFeedback', 'success', `Branch switched to "${currentBranch || ''}"!`);
                        } else {
                            delete this.switchingBranchFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('switchingBranchFeedback', 'error', err.message);
                        } else {
                            delete this.switchingBranchFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state, branchName) => {
                        if (state) {
                            this.setFeedback('switchingBranchFeedback', 'loading', `Switching branch to "${branchName || ''}"...`);
                        } else {
                            delete this.switchingBranchFeedback;
                        }

                        subscription.toClient();
                    }
                }
            },
            checkingBranchExistence: (subscription) => {
                return {
                    setSuccess: (state, currentBranch) => {
                        if (state) {
                            this.setFeedback('checkingBranchExistenceFeedback', 'success', `${currentBranch || ''} name is available!`);
                        } else {
                            delete this.checkingBranchExistenceFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('checkingBranchExistenceFeedback', 'error', err.message);
                        } else {
                            delete this.checkingBranchExistenceFeedback;
                        }

                        subscription.toClient();
                    },
                    setErrorAlreadyExist: (state, branchName) => {
                        if (state) {
                            this.setFeedback(`checkingBranchExistenceFeedback', 'error', 'The branch "${branchName}" already exist!`);
                        } else {
                            delete this.checkingBranchExistenceFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state, branchName) => {
                        if (state) {
                            this.setFeedback('checkingBranchExistenceFeedback', 'loading', `Checking if branch "${branchName || ''}" already exist...`);
                        } else {
                            delete this.checkingBranchExistenceFeedback;
                        }

                        subscription.toClient();
                    }
                }
            },
            creatingBranch: (subscription) => {
                return {
                    setSuccess: (state, currentBranch) => {
                        if (state) {
                            this.setFeedback('creatingBranchFeedback', 'success', `The branch "${currentBranch || ''}" created successfully!`);
                        } else {
                            delete this.creatingBranchFeedback;
                        }

                        subscription.toClient();
                    },
                    setError: (state, err) => {
                        if (state) {
                            this.setFeedback('creatingBranchFeedback', 'error', err.message);
                        } else {
                            delete this.creatingBranchFeedback;
                        }

                        subscription.toClient();
                    },
                    setLoading: (state, branchName) => {
                        if (state) {
                            this.setFeedback('creatingBranchFeedback', 'loading', `Creating branch "${branchName || ''}"...`);
                        } else {
                            delete this.creatingBranchFeedback;
                        }

                        subscription.toClient();
                    }
                }
            }
        }
    }
}

module.exports = StepPrepare;
