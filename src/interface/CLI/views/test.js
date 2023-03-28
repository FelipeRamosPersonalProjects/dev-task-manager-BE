const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');
const MainMenuDescription = require('../components/MainMenuDescription');

function TestView() {
    return new ViewCLI({
        name: 'Testing View',
        Template: new DashedHeaderLayout({
            headerText: 'Test view',
            Content: new MainMenuDescription()
        })
    }, this);
}

module.exports = TestView;
