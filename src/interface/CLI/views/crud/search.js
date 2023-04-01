const ViewCLI = require('../../ViewCLI');
const DashedHeaderLayout = require('../../templates/DashedHeaderLayout');
const CRUD = require('../../../../services/database/crud');

const bodySchema = {
    collectionName: {
        type: String,
        required: true
    },
    filter: {
        type: Object
    },
    options: {
        default: {},
        type: {
            paginate: { type: Object, default: {} },
            populate: { type: Object, default: {} },
            readable: { type: Boolean },
            select: { type: [String], default: [] }
        }
    }
};

function SearchView() {
    return new ViewCLI({
        name: 'crud/search',
        Template: new DashedHeaderLayout({
            headerText: 'Search - CRUD',
            headerDescription: 'Search for documents on your collections.'
        }),
        poolForm: {
            startQuestion: 'search-document',
            events: {
                onEnd: async (ev) => {
                    const data = ev.current.formCtrl.formData;

                    try {
                        const search = await CRUD.query(data).initialize();
                        const nav = new ViewCLI.ViewNavigator({
                            type: 'doc-list',
                            parentView: ev.view()
                        });

                        search.map(doc => {
                            nav.addOption({type: 'doc-list', doc});
                        });

                        nav.render({headers: ['displayName']});
                    } catch (err) {
                        throw new Error.Log('database.querying_collection', data);
                    }
                }
            },
            questions: [
                {
                    id: 'search-document',
                    formCtrl: {
                        schema: {obj: bodySchema}
                    }
                }
            ]
        }
    }, this);
}

module.exports = SearchView;
