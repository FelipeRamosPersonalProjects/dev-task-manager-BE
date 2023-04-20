const ViewCLI = require('../ViewCLI');
const DashedHeaderLayout = require('../templates/DashedHeaderLayout');
const DisplayDocument = require('../components/DisplayDocument');
const CRUD = require('../../../services/database/crud');
const ToolsCLI = require('../ToolsCLI');
const tools = new ToolsCLI();

async function DocDisplay(params) {
    tools.print(`Loading view's resources from database...`);
    const { collectionName, filter, headerText, headerDescription, docData } = params || {};

    if (!docData && (!collectionName || !filter)) {
        throw new Error.Log('common.missing_params', ['collectionName', 'filter'], 'DocDisplay', 'docDisplay.js');
    }

    try {
        let document;
        
        if (!docData) {
            document = await CRUD.getDoc({ collectionName, filter });

            if (document.defaultPopulate) {
                document = document.defaultPopulate().initialize();
            } else {
                document = document.initialize();
            }
        } else {
            document = docData;
        }
    
        return new ViewCLI({
            name: 'docDisplay',
            Template: new DashedHeaderLayout({
                componentName: 'Document View',
                headerText: headerText || document.displayName,
                headerDescription: headerDescription,
                Content: new DisplayDocument({ document })
            }),
            navigator: new ViewCLI.ViewNavigator({ options: [
                {
                    title: 'Go back to home view',
                    description: 'You will be redirected to the home view!',
                    targetView: this.startView
                },
                {
                    title: 'Search documents',
                    description: 'Go to the search documents view!',
                    targetView: 'crud/search'
                },
                {
                    index: 'prev',
                    title: 'Previous document',
                    description: 'Go to the search documents view!',
                    targetView: 'crud/search'
                },
                {
                    index: 'next',
                    title: 'Next document',
                    description: 'Go to the search documents view!',
                    targetView: 'crud/search'
                }
            ]}, this)
        }, this);
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = DocDisplay;
