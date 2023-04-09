const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');

async function PullRequestsView() {
    return new ViewCLI({
        name: 'prs_menu',
        Template: await new DashedHeaderLayout({
            headerText: 'PULL REQUESTS',
            headerDescription: `Manage your pull requests.`
        }, this).init(),
        navigator: { options: [
            {
                title: 'Create new pull request   ',
                targetView: 'create_pr'
            }
        ]}
    }, this);
}

module.exports = PullRequestsView;
