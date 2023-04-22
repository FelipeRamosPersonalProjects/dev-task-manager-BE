const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('@CLI/templates/DashedHeaderLayout');
const StringTemplateBuilder = require('@interface/StringTemplateBuilder');

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

    return new ViewCLI({
        name: 'home',
        Template: templateInit,
        navigator: { options: [
            { title: 'CRUD                ', description: 'Database CRUD operations', targetView: 'crud/main' },
            { title: 'Tickets and Tasks   ', description: 'Manage your tickets and tasks', targetView: 'ticketsAndTasks' },
            { title: 'Pull Requests       ', description: 'Manage your pull requests', targetView: 'prs_menu' },
        ]}
    }, this);
}

module.exports = HomeView;
