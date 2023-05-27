const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('@CLI/templates/DashedHeaderLayout');
const StringTemplateBuilder = require('@interface/StringTemplateBuilder');
const Sync = require('@services/Sync');

async function HomeView() {
    const headerDescription = new StringTemplateBuilder()
        .text(`It's an application to automate and help the developer in organization and procedures such as:`)
        .newLine()
        .indent().text(`Pull Requests, Reviews, Testing Steps, etc.`)
    .end();
    const templateInit = new DashedHeaderLayout({
        headerText: 'DevDESK CLI - Home',
        headerDescription
    }, this);

    const sync = new Sync();
    const syncComplete = await sync.fullSync();

    if (syncComplete instanceof Error.Log) {
        throw syncComplete;
    }

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
                title: 'My User             ',
                description: 'Manage your user: edit, open or delete.',
                targetView: 'menus/user'
            }
        ]}
    }, this);
}

module.exports = HomeView;
