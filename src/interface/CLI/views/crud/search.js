const ViewCLI = require('@CLI/ViewCLI');
const DashedHeaderLayout = require('@CLI/templates/DashedHeaderLayout');
const CRUD = require('@CRUD');

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

async function SearchView() {
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
                            parentView: ev.parent,
                            question: {
                                id: 'navigation',
                                text: `Enter the index related to your choosed option and hit enter to open: `
                            }
                        }, ev.parent);

                        search.map((doc, index) => {
                            nav.addOption({index, type: 'doc-list', doc, targetView: 'docDisplay'});
                        });

                        const fired = await nav.fire();
                        if (fired instanceof Error.Log) {
                            throw fired;
                        }

                        return fired;
                    } catch (err) {
                        throw new Error.Log('database.querying_collection', data);
                    }
                }
            },
            questions: [
                {
                    id: 'search-document',
                    formCtrl: {
                        schema: bodySchema,
                        events: {
                            onEnd: async (ev) => {
                                return await ev.parent.goNext();
                            }
                        }
                    }
                }
            ]
        }
    }, this);
}

module.exports = SearchView;
