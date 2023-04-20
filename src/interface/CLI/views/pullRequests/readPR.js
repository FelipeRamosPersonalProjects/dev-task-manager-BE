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
                text: `Search pull requrest by the PR number, PR name or task ID: `,
                events: {
                    onAnswer: async (ev, {print}, answer) => {
                        try {
                            const docQuery = await CRUD.query({ collectionName: 'pull_requests', filter: {
                                $or: [
                                    { number: answer },
                                    { name: answer },
                                    { cod: answer },
                                    { index: Number(answer) }
                                ]
                            }}).defaultPopulate();
                            if (docQuery instanceof Error.Log) {
                                throw docQuery;
                            }

                            if (!docQuery) {
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
                onEnd: async (ev) => {
                    try {
                        const pullRequest = ev.getValue('pullRequest');

                        if (pullRequest && pullRequest.length) {
                            const template = new PullRequestTemplate(pullRequest[0]);
                            if (template instanceof Error.Log) {
                                throw template;
                            }

                            template.printOnScreen();
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
