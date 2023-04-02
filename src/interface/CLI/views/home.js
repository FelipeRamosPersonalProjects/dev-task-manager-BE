const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');
const StringTemplateBuilder = require('../../StringTemplateBuilder');
const MainMenuDescription = require('../components/MainMenuDescription');

function HomeView() {
    const headerDescription = new StringTemplateBuilder()
        .text(`It's an application to automate and help the developer in organization and procedures such as:`)
        .newLine()
        .indent().text(`Pull Requests, Reviews, Testing Steps, etc.`)
    .end();

    return new ViewCLI({
        name: 'home',
        Template: new DashedHeaderLayout({
            headerText: 'DevDESK CLI - Home',
            headerDescription,
            Content: new MainMenuDescription()
        }, this),
        navigator: { options: [
            { title: 'Database CRUD operations', targetView: 'crud/main' }
        ]}
    }, this);
}

module.exports = HomeView;
