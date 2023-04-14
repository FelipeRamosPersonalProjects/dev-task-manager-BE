const ViewCLI = require('../../ViewCLI');
const DashedHeaderLayout = require('../../templates/DashedHeaderLayout');
const StringTemplateBuilder = require('../../../StringTemplateBuilder');

async function CRUDView() {
    const headerDescription = new StringTemplateBuilder()
        .text(`Create, Read, Update or Delete your document on database collections`)
    .end();
    
    const Template = new DashedHeaderLayout({
        componentName: 'CRUD view template',
        headerText: 'DevDESK CLI - CRUD',
        headerDescription
    });
    
    const navigator = new ViewCLI.ViewNavigator({ options: [
        { title: 'Create', description: 'Create documents under a collection.', targetView: 'crud/create' },
        { title: 'Search', description: 'Search for documents in a collection.', targetView: 'crud/search' },
        { title: 'Read  ', description: 'Read documents under a collection.', targetView: 'crud/read' },
        { title: 'Update', description: 'Update documents under a collection.', targetView: 'crud/update' },
        { title: 'Delete', description: 'Delete documents under a collection.', targetView: 'crud/remove' },
    ]});

    return new ViewCLI({
        name: 'crud/main',
        Template,
        navigator
    }, this);
}

module.exports = CRUDView;
