const ViewCLI = require('@CLI/ViewCLI');

async function StashesBackupsMenuView() {
    const view = new ViewCLI({
        name: 'stashesBackupsMenu',
        navigator: { options: [
            {
                title: 'Save stash and backup   ',
                description: 'To save a stash of the current changes and create a files backup as well',
                targetView: 'stashesBackups/saveStashBackup'
            },
            {
                title: 'Save stash              ',
                description: 'To only save a stash of the current changes',
                targetView: 'stashesBackups/saveStashBackup',
                viewParams: { isOnlyStash: true }
            },
            {
                title: 'Save backup             ',
                description: 'To only save a files backup',
                targetView: 'stashesBackups/saveStashBackup',
                viewParams: { isOnlyBackup: true }
            },
            {
                title: 'Apply stash             ',
                description: 'Apply some saved stash',
                targetView: 'stashesBackups/applyStash'
            },
            {
                title: 'Restore backup          ',
                description: 'Restore a files backup',
                targetView: 'home'
            }
        ]}
    }, this);

    return view;
}

module.exports = StashesBackupsMenuView;
