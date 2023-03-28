const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');
const MainMenuDescription = require('../components/MainMenuDescription');
const StringTemplateBuilder = require('../../StringTemplateBuilder')

function HomeView(setup) {
    return new ViewCLI({
        name: 'home',
        Template: new DashedHeaderLayout({
            componentName: 'Home View Template',
            headerText: 'DevDESK CLI',
            headerDescription: new StringTemplateBuilder()
                .text(`It's an application to automate and help the developer in organization and procedures such as:`)
                .newLine()
                .indent().text(`Pull Requests, Reviews, Testing Steps, etc.`)
            .end(),
            Content: [
                new MainMenuDescription()
            ]
        }),
        ...setup
    }, this);
}

module.exports = HomeView;
