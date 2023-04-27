const ViewCLI = require('@CLI/ViewCLI');
const DashedHeaderLayout = require('@CLI/templates/DashedHeaderLayout');

async function PullRequestsView() {
    return new ViewCLI({
        name: 'prsMenu',
        Template: new DashedHeaderLayout({
            headerText: 'PULL REQUESTS',
            headerDescription: `Manage your pull requests.`
        }, this),
        navigator: { options: [
            {
                title: 'Create new pull request   ',
                targetView: 'pullRequests/createPR'
            },
            {
                title: 'Load pull request',
                description: `Load and read your pull requests.`,
                targetView: 'pullRequests/readPR'
            }
        ]}
    }, this);
}

module.exports = PullRequestsView;
