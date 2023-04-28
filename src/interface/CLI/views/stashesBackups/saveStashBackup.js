const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');
const DashedHeaderLayout = require('@CLI/templates/DashedHeaderLayout');
const ListFileChangesTemplate = require('@CLI/components/ListFileChanges');
const ListTileTemplate = require('@CLI/templates/ListTiles');
const Stash = require('@models/collections/Stash');
const CRUD = require('@CRUD');

async function SaveStashBackupView({ viewParams }) {
    const { isOnlyStash, isOnlyBackup } = new Object(viewParams || {});

    return new ViewCLI({
        name: 'saveStashBackup',
        Template: new DashedHeaderLayout({
            headerText: 'Save Stash and Backup',
            headerDescription: 'Follow the steps below to save a stash of the current changes and the files backup.'
        }),
        poolForm: new PoolForm({
            autoSaveAnswers: true,
            questions: [
                {
                    id: 'pickProject',
                    next: 'chooseRepo',
                    text: `Which project do you like to save the stash? Enter the index number on the list above: `,
                    events: {
                        onTrigger: async (ev) => {
                            try {
                                const projects = await CRUD.query({ collectionName: 'projects', filter: {}}).initialize(true);
                                if (projects instanceof Error.Log) {
                                    return ev.trigger();
                                }

                                projects.map((item, index) => {
                                    item.index = String(item.index);
                                    projects[index] = item;
                                });
                                const template = new ListTileTemplate({
                                    items: projects
                                });

                                ev.setValue('projects', projects);
                                return template.printOnScreen();
                            } catch (err) {
                                throw new Error.Log('database.querying_collection', data);
                            }
                        },
                        onAnswer: async (ev, {}, answer) => {
                            try {
                                const projects = ev.getValue('projects');
                                if (isNaN(answer)) {
                                    return ev.trigger();
                                }

                                const project = projects.find(proj => proj.index === answer);
                                if (!project) {
                                    return ev.trigger();
                                }

                                project.repos.map((item, index) => {
                                    item.index = String(item.index);
                                    project.repos[index] = item;
                                });
                                const template = new ListTileTemplate({
                                    items: project.repos
                                });

                                ev.setValue('choosedProject', project);
                                return template.printOnScreen();
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'chooseRepo',
                    next: 'stashTitle',
                    text: `From which repository do you like to save the stash? Enter the index number on the list above: `,
                    events: {
                        onAnswer: async (ev, {print}, answer) => {
                            try {
                                const project = ev.getValue('choosedProject');
                                if (!project) {
                                    print(`Any project is stored on "choosedProject" value.`, '[PROJECT-NOT-FOUND]');
                                    return ev.trigger();
                                }

                                const repo = project.repos.find(item => item.index === answer);
                                if (!repo) {
                                    print(`Index "${answer}" is not valid, any project was found!`, '[REPO-NOT-FOUND]');
                                    return ev.trigger();
                                }

                                return ev.setValue('repo', repo);
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'stashTitle',
                    text: `Enter a title to identify the stash: `,
                    next: 'stashDescription',
                    events: {
                        onTrigger: async (ev) => {
                            try {
                                const repo = ev.getValue('repo');
                                if (!repo) {
                                    print(`Any repository is stored on "repo" value.`, '[REPO-NOT-FOUND]');
                                    return ev.trigger();
                                }

                                const currentChanges = await repo.repoManager.currentChanges();
                                if (currentChanges instanceof Error.Log) {
                                    throw currentChanges;
                                }

                                if (!currentChanges.success) {
                                    print(`Something went wrong when getting the current changes for the repository "${repo.repoName}"`, '[ERROR-FILE-CHANGES]');
                                    return ev.trigger();
                                }

                                const template = new ListFileChangesTemplate({ fileChanges: currentChanges.changes });
                                
                                return template.printOnScreen();
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'stashDescription',
                    text: `Enter a description for the stash: `,
                    next: 'confirmation'
                },
                {
                    id: 'confirmation',
                    text: `Do you confirm to create${!isOnlyBackup ? 'the stash ' : ''}${!isOnlyStash ? ' and the files backup' : ''} (Y/N)? `,
                    events: {
                        onAnswer:  async (ev, {boolAnswer, print}, answer) => {
                            try {
                                const repo = ev.getValue('repo');
                                const stashTitle = ev.getValue('stashTitle');
                                const stashDescription = ev.getValue('stashDescription');
                                let backup;
                                let result;

                                if (boolAnswer(answer)) {
                                    if (!isOnlyStash) {
                                        backup = await repo.createBranchBackup({title: stashTitle});
                                        if (backup instanceof Error.Log) {
                                            throw backup;
                                        }
                                    }

                                    if (!isOnlyBackup) {
                                        result = await repo.repoManager.stashManager.createStash({
                                            type: isOnlyStash && 'stash' || 'stash-backup',
                                            title: stashTitle,
                                            description: stashDescription,
                                            backupFolder: backup && backup.backupFolder
                                        });
    
                                        if (result instanceof Error.Log) {
                                            throw result;
                                        }
                                    } else {
                                        // TODO: This will be part of one of the changes that it's recommneded to do when it's implementing the Backup instance.
                                        result = await Stash.create({
                                            type: 'backup',
                                            title: stashTitle,
                                            description: stashDescription,
                                            backupFolder: backup && backup.backupFolder,
                                            branch: repo && repo.repoManager.getCurrentBranch(),
                                            repo: repo && repo._id
                                        });

                                        if (result instanceof Error.Log) {
                                            throw result;
                                        }
                                    }

                                    if (!result.errors) {
                                        print(`Backup finished successfully!\n`);
                                        print(`Type: ${result.type}`);
                                        print(`Title: ${result.title}`);
                                        print(`Description: ${result.description}`);
                                        print(`Branch: ${result.branch}`);
                                        print(`Repository: ${result.repo ? result.repo.repoName : '--empty--'}`);
                                        print(`Backup file available at: ${result.backupFolder}`);
                                        print(`Intarnal DB document: ${result._id}`);
                                        return ev.goNext();
                                    }
                                } else {
                                    return ev.goNext();
                                }
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                }
            ]
        }, this)
    }, this);
}

module.exports = SaveStashBackupView;
