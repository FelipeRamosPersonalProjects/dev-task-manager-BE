const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');
const CRUD = require('@CRUD');
const PullRequestTemplate = require('../../templates/PullRequest');

async function ReadPRView({ viewParams, defaultData, dataDoc }) {
    const view = new ViewCLI({
        name: 'pullRequests/readPR',
        poolForm: new PoolForm({
            questions: [{
                id: 'searchPR',
                text: `Search your pull requests by:\n- PR remote ID\n- PR name\n- Task ID\n- Ticket ID\n- GitHub URL\n\nType you param to search: `,
                events: {
                    onAnswer: async (ev, {print}, answer) => {
                        answer = answer.trim();
                        const searchParams = [
                            { remoteID: answer },
                            { name: answer },
                            { cod: answer },
                            { index: !isNaN(answer) && Number(answer) },
                            { 'gitHubPR.html_url': answer }
                        ];

                        const task = await CRUD.getDoc({ collectionName: 'tasks', filter: { taskID: answer }});
                        const ticket = await CRUD.getDoc({ collectionName: 'tickets', filter: { ticketID: answer }});

                        if (task) {
                            searchParams.push({ task: task._id });
                        }

                        if (ticket) {
                            searchParams.push({ ticket: ticket._id });
                        }

                        try {
                            const docQuery = await CRUD.query({ collectionName: 'pull_requests', filter: {
                                $or: searchParams
                            }}).defaultPopulate();
                            if (docQuery instanceof Error.Log) {
                                throw docQuery;
                            }

                            if (!docQuery.length) {
                                print(`The pull request for the filter ${answer} doesn't exist! Please try again.`);
                                return ev.trigger();
                            }

                            const pullRequest = docQuery.map(item => item.initialize());
                            if (pullRequest instanceof Error.Log) {
                                throw pullRequest;
                            }

                            ev.setValue('pullRequest', pullRequest);
                        } catch (err) {
                            throw new Error.Log(err);
                        }
                    }
                }
            }],
            events: {
                onEnd: async (ev, {print}) => {
                    try {
                        const pullRequest = ev.getValue('pullRequest');

                        if (Array.isArray(pullRequest) && pullRequest.length === 1) {
                            const template = new PullRequestTemplate(pullRequest[0]);
                            if (template instanceof Error.Log) {
                                throw template;
                            }

                            template.printOnScreen();
                        } else if (Array.isArray(pullRequest) && pullRequest.length > 1) {
                            const nav = new ViewCLI.ViewNavigator({
                                type: 'doc-list',
                                parentView: ev.parent,
                                question: {
                                    id: 'navigation',
                                    text: `Enter the index related to your choosed option and hit enter to open: `
                                }
                            }, ev.parent);
    
                            pullRequest.map((doc) => {
                                nav.addOption({index: doc.stringIndex, type: 'doc-list', doc, targetView: 'docDisplay'});
                            });
    
                            const fired = await nav.fire();
                            if (fired instanceof Error.Log) {
                                throw fired;
                            }

                            return fired;
                        }
                    } catch (err) {
                        throw new Error.Log(err);
                    }
                }
            }
        }, this)
    }, this);

    return view;
}

module.exports = ReadPRView;
