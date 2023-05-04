const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');

async function CheckoutBranchView() {
    const view = new ViewCLI({
        name: 'checkoutBranch',
        poolForm: new PoolForm({
            questions: [
                PoolForm.getQuestion('chooseRepoFromUser', { next: 'chooseBranch' }),
                PoolForm.getQuestion('chooseBranch', { next: 'bringChanges' }),
                {
                    id: 'bringChanges',
                    text: `Would you like to bring the current changes with you (Y/N)? `,
                    events: {
                        onAnswer: async (ev, {print, printError, boolAnswer}, answer) => {
                            try {
                                const repo = ev.getValue('selectedRepo');
                                const branchName = ev.getValue('selectedBranch');
                                const bringChanges = boolAnswer(answer);

                                if (!repo) {
                                    printError(new Error.Log('cli.repos.repo_not_found'));
                                    return await ev.goNext('chooseRepoFromUser');
                                }

                                const checked = await repo.repoManager.checkout(branchName, { bringChanges });
                                if (!checked || checked instanceof Error.Log) {
                                    throw checked;
                                }

                                print(`Branch switched with success!`, 'SUCCESS');
                                return await ev.redirectTo();
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
            ]
        }, this)
    }, this);

    return view;
}

module.exports = CheckoutBranchView;
