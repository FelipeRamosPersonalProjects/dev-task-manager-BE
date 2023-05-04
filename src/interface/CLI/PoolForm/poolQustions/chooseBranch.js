module.exports = {
    id: 'chooseBranch',
    text: `Choose the branch by typing the index for the list above (Y/N)? `,
    events: {
        onTrigger: async (ev) => {
            try {
                const repo = ev.getValue('selectedRepo');
                if (!repo) {
                    printError(new Error.Log('cli.repos.repo_not_found'));
                    return await ev.goNext('chooseRepoFromUser');
                }

                const BRANCHES = repo.repoManager.getAllBranches();
                return ev.setValue('branches', BRANCHES);
            } catch (err) {
                throw new Error.Log(err);
            }
        },
        onAnswer: async (ev, {}, answer) => {
            try {
                const repo = ev.getValue('selectedRepo');
                if (!repo && !isNaN(answer)) {
                    printError(new Error.Log('cli.repos.repo_not_found'));
                    return await ev.goNext('chooseRepoFromUser');
                }
                
                const BRANCHES = ev.getValue('branches');
                const selectedBranch = BRANCHES[Number(answer.trim())];

                if (selectedBranch) {
                    return ev.setValue('selectedBranch', selectedBranch);
                } else {
                    return await ev.trigger();
                }
            } catch (err) {
                throw new Error.Log(err);
            }
        }
    }
}
