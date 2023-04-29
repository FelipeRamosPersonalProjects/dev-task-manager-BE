module.exports = {
    id: 'chooseRepo',
    next: 'stashTitle',
    text: `From which repository do you like to save the stash? Enter the index number on the list above: `,
    events: {
        onAnswer: async (ev, {print}, answer) => {
            try {
                const project = ev.getValue('choosedProject');
                if (!project) {
                    print(`Any project is stored on "choosedProject" value.`, '[PROJECT-NOT-FOUND]');
                    return ev.trigger();
                }

                const repo = project.repos.find(item => item.index === answer);
                if (!repo) {
                    print(`Index "${answer}" is not valid, any project was found!`, '[REPO-NOT-FOUND]');
                    return ev.trigger();
                }

                return ev.setValue('repo', repo);
            } catch (err) {
                throw new Error.Log(err);
            }
        }
    }
};
