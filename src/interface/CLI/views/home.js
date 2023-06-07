const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('@CLI/templates/DashedHeaderLayout');
const StringTemplateBuilder = require('@interface/StringTemplateBuilder');
const HomeContent = require('@CLI/templates/content/Home');
const User = require('@models/collections/User');

async function HomeView() {
    const user = await User.getMyUser();
    const openedPRs = await user.loadOpenedPRs();
    const templateInit = new DashedHeaderLayout({
        headerText: 'DevDESK CLI - Home',
        headerDescription: new StringTemplateBuilder()
            .text(`It's an application to automate and help the developer in organization and procedures such as:`)
            .newLine()
            .indent().text(`Pull Requests, Reviews, Testing Steps, etc.`)
        .end(),
        Content: new HomeContent({ openedPRs })
    }, this);

    return new ViewCLI({
        name: 'home',
        Template: templateInit,
        navigator: { options: [
            {
                title: 'CRUD                ',
                description: 'Database CRUD operations',
                targetView: 'crud/main'
            },
            {
                title: 'Tickets and Tasks   ',
                description: 'Manage your tickets and tasks',
                targetView: 'menus/ticketsAndTasks'
            },
            {
                title: 'Pull Requests       ',
                description: 'Manage your pull requests',
                targetView: 'menus/prsMenu'
            },
            {
                title: 'Stashes and Backups ',
                description: 'Manage your stashes and backups',
                targetView: 'menus/stashesBackups'
            },
            {
                title: 'Repo Manager        ',
                description: 'Manage your repositories, perform actions like: commit, push, pull, checkout, etc.',
                targetView: 'menus/repoManager'
            },
            {
                title: 'Users               ',
                description: 'Manage your user: edit, open or delete. Manage other users.',
                targetView: 'menus/user'
            }
        ]}
    }, this);
}

module.exports = HomeView;
