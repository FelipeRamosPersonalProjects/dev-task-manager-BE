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

                        if (pullRequest && pullRequest.length === 1) {
                            const template = new PullRequestTemplate(pullRequest[0]);
                            if (template instanceof Error.Log) {
                                throw template;
                            }

                            template.printOnScreen();
                        } else if (pullRequest) {
                            print(`Your search resulted in more than 1 pull requests! For a while this feature can only get 1.`);
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
