module.exports = {
    id: 'commitChanges',
    text: `Do you like to commmit your current changes? (Y/N)?`,
    next: `savePullRequest`,
    events: {
        onAnswer: async (ev, { boolAnswer, print }, answer) => {
            const task = ev.getValue('task');
            const prDOC = ev.getValue('prDOC');
            const currentChanges = ev.getValue('commitFileChanges');

            if (boolAnswer(answer)) {
                const isReadyToCommit = ev.getValue('isReadyToCommit');

                if (isReadyToCommit.isReady) {
                    print('The branch is ready to commit!');
                    const isReadyToPR = await task.repo.commitChanges(currentChanges);

                    if (isReadyToPR instanceof Error.Log) {
                        isReadyToPR.consolePrint();
                        return ev.trigger();
                    }

                    if (prDOC) {
                        const updateStage = await prDOC.changeStage('commit-created');
                        if (updateStage instanceof Error.Log) {
                            updateStage.consolePrint();
                            return ev.trigger();
                        }
                    }

                    return ev.setValue('isReadyToPR', isReadyToPR);
                } else {
                    return ev.trigger();
                }
            }
        }
    }
};
