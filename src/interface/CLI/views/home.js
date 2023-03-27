const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');

function HomeView(setup) {
    return new ViewCLI({
        name: 'home',
        Template: new DashedHeaderLayout({
            componentName: 'Home View Template',
            headerText: 'Welcome to DevDESK CLI'
        }),
        ...setup
    }, this);
}

module.exports = HomeView;
