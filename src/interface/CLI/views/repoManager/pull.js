const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');

async function PullView() {
    return new ViewCLI({
        name: 'pull',
        poolForm: new PoolForm({
            questions: [
                PoolForm.getQuestion('chooseRepoFromUser', { next: 'confirmPullOrigin' }),
                {
                    id: 'confirmPullOrigin',
                    text: `Do you confirm to pull from remote origin repository (Y/N)? `,
                    events: {
                        onAnswer: async (ev, {boolAnswer, print, printTemplate}, answer) => {
                            try {
                                if (boolAnswer(answer)) {
                                    const repo = ev.getValue('selectedRepo');
    
                                    if (!repo) {
                                        throw new Error.Log('cli.repos.repo_not_found');
                                    }
    
                                    const pulled = await repo.repoManager.pull();
                                    if (pulled instanceof Error.Log || !pulled.success) {
                                        throw pulled;
                                    }
    
                                    printTemplate(pulled.out);
                                    print('The branch was pulled with success!', 'SUCCESS');
                                }

                                return await ev.redirectTo();
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                }
            ]
        }, this)
    }, this);
}

module.exports = PullView;
