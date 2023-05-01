module.exports = {
    id: 'pushCommit',
    text: `Would you like to publish the commits ahead to remote (Y/N)? `,
    events: {
        onAnswer: async (ev, {print, boolAnswer}, answer) => {
            try {
                const repo = ev.getValue('selectedRepo');

                if (boolAnswer(answer)) {
                    if (!repo) {
                        throw new Error.Log({
                            name: 'REPO-NOT-FOUND',
                            message: `The selected repository wan't found on the pool values!`
                        });
                    }
    
                    const pushed = await repo.repoManager.push();
                    if (pushed instanceof Error.Log || !pushed.success) {
                        throw pushed;
                    }
    
                    print('Commit pushed with success to remote!', 'SUCCESS');
                }

                return await new Promise((resolve, reject) => {
                    print('Redirecting to the home view...', 'REDIRECTING');

                    setTimeout(async () => {
                        try {
                            const redirect = await ev.parentPool.goToView('home');
                            resolve(redirect);
                        } catch (err) {
                            reject(err);
                        }
                    }, 2000);
                });
            } catch (err) {
                await ev.parentPool.end();
                throw new Error.Log(err);
            }
        }
    }
};
