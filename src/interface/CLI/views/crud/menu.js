const ViewCLI = require('../../ViewCLI');
const DashedHeaderLayout = require('../../templates/DashedHeaderLayout');
const MainMenuDescription = require('../../components/MainMenuDescription');
const StringTemplateBuilder = require('../../../StringTemplateBuilder');

function CRUDView() {
    const headerDescription = new StringTemplateBuilder()
        .text(`Create, Read, Update or Delete your document on database collections`)
    .end();
    
    const Template = new DashedHeaderLayout({
        componentName: 'CRUD view template',
        headerText: 'DevDESK CLI - CRUD',
        headerDescription,
        Content: new MainMenuDescription()
    });
    
    const navigator = new ViewCLI.ViewNavigator({ options: [
        { title: 'Create a document', description: 'Create a document under a collection.', targetView: 'crud/create' },
        { title: 'Read a document', description: 'Read a document under a collection.', targetView: 'crud/read' },
        { title: 'Update a document', description: 'Update a document under a collection.', targetView: 'crud/update' },
        { title: 'Delete a document', description: 'Delete a document under a collection.', targetView: 'crud/delete' },
    ]});

    return new ViewCLI({
        name: 'crud/menu',
        Template,
        navigator
    }, this);
}

module.exports = CRUDView;
