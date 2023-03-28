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
        { title: 'Option 1', description: 'This is the first option!' },
        { title: 'Option 2', description: 'This is the second option!' },
        { title: 'Option 3', description: 'This is the third option!' },
        { title: 'Option 4', description: 'This is the fourth option!' },
        { title: 'Option 5', description: 'This is the fiveth option!' },
        { title: 'Option 6', description: 'This is the sixth option!' },
    ], navSuccessCallback, navErrorCallback});

    return new ViewCLI({
        name: 'home',
        Template,
        navigator
    }, this);
}

module.exports = HomeView;
