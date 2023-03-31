const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');
const MainMenuDescription = require('../components/MainMenuDescription');
const StringTemplateBuilder = require('../../StringTemplateBuilder')

function navSuccessCallback() {
    debugger;
}

function navErrorCallback() {
    debugger;
}

function HomeView() {
    const headerDescription = new StringTemplateBuilder()
        .text(`It's an application to automate and help the developer in organization and procedures such as:`)
        .newLine()
        .indent().text(`Pull Requests, Reviews, Testing Steps, etc.`)
    .end();
    
    const Template = new DashedHeaderLayout({
        componentName: 'Home View Template',
        headerText: 'DevDESK CLI',
        headerDescription,
        Content: new MainMenuDescription()
    });
    
    const navigator = new ViewCLI.ViewNavigator({ options: [
        { title: 'Test view', description: 'This is the first test!', targetView: 'test' }
    ], navSuccessCallback, navErrorCallback});

    return new ViewCLI({
        name: 'home',
        Template,
        navigator
    }, this);
}

module.exports = HomeView;
