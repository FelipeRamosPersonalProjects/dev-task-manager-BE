const ViewCLI = require('@CLI/ViewCLI');

async function RepoManagerMenuView({ viewParams, defaultData, dataDoc }) {
    return new ViewCLI({
        name: 'repoManager',
        navigator: { options: [
            {
                title: 'Create Branch                ',
                description: 'Create a new branch on your repository.',
                targetView: 'repoManager/createBranch'
            },
            {
                title: 'Checkout branch              ',
                description: 'Checkout to another branch on your repository.',
                targetView: 'repoManager/checkoutBranch'
            },
            {
                title: 'Fetch                        ',
                description: 'Fetch your repository.',
                targetView: 'repoManager/fetch'
            },
            {
                title: 'Commit changes               ',
                description: 'Commit changes to your repository.',
                targetView: 'repoManager/commit'
            },
            {
                title: 'Push changes                 ',
                description: 'Push changes to your repository.',
                targetView: 'repoManager/push'
            },
            {
                title: 'Pull                         ',
                description: 'Pull changes from your repository.',
                targetView: 'repoManager/pull'
            }
        ]}
    }, this);
}

module.exports = RepoManagerMenuView;
