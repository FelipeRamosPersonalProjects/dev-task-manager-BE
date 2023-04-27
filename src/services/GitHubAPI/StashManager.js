const Prompt = require('@services/Prompt');
const Stash = require('@models/collections/Stash');
const config = require('@config');

class StashManager {
    constructor (setup, repoManager) {
        const { localPath } = Object(setup || {});

        this.prompt = new Prompt({ rootPath: localPath });
        this._repoManager = () => repoManager;
    }

    get repo() {
        return this.repoManager && this.repoManager.repo;
    }

    get repoUID() {
        return this.repo && this.repo._id;
    }

    get repoManager() {
        return this._repoManager();
    }

    buildStashName({_id, type, ticketID, taskID, taskVersion}) {
        ticketID = ticketID || this.repo && this.repo.ticketID;
        taskID = taskID || this.repo && this.repo.taskID;
        taskVersion = this.repo && this.repo.parentTask && this.repo.parentTask.taskVersion;

        return `[${config.projectName}]${_id}__${type}__${ticketID}__${taskID}${taskVersion ? '-v'+taskVersion : ''}`;
    }

    async createStash(setup) {
        const { type, title, description, ticketUID, taskUID, repoUID, backupFolder } = setup || {};

        try {
            const currentBranch = this.repoManager.getCurrentBranch();
            const repo = repoUID || this.repoUID;

            if (!repo) {
                throw new Error.Log('services.GitHubAPI.RepoManager.repo_uid_required');
            }

            // Creating stash on database
            const newStash = await Stash.create({
                type,
                title,
                description,
                repo,
                branch: currentBranch,
                task: taskUID,
                ticket: ticketUID,
                backupFolder
            });
            if (newStash instanceof Error.Log) {
                throw newStash;
            }

            // Adding changes
            const added = this.repoManager.addChanges();
            if (added instanceof Error.Log) {
                throw added;
            }

            // Creating stash
            const stashed = await this.stash(newStash.gitName);
            if (stashed instanceof Error.Log) {
                throw stashed;
            }

            return newStash;
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.creating_stash');
        }
    }

    async getStash(filter) {
        try {
            const stashesList = this.prompt.cmd(`git stash list`);
            const validFilter = stashesList.out.split('\n').filter(item => item);
            const stashes = await Stash.load(filter);

            for (const stash of stashes) {
                validFilter.map(item =>{
                    const [prefix, _, title] = item.split(': ');
                    const stashIndex = prefix.replace('stash@{', '').replace('}', '');
                    const [_id] = title.split('__');
    
                    if (stash._id === _id) {
                        return stash.setIndex(stashIndex);
                    }
                });
            }

            if (typeof filter === 'string') {
                const stash = stashes.find(item => item._id === filter);
                return stash;
            } else {
                return stashes;
            }
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.getting_stash');
        }
    }

    async applyStash(filter) {
        try {
            const currentChanges = await this.repoManager.currentChanges();

            if (currentChanges instanceof Error.Log) {
                return currentChanges;
            }

            if (currentChanges.changes.length) {
                await this.createStash({
                    type: 'backup',
                    title: 'auto-backup-' + Date.now(),
                    description: `Autostash done to avoid loose unstashed changes when it's applying another stash`,
                    repoUID: this.repoUID
                });
            }

            const { stashIndex } = await this.getStash(filter) || {};
            const applied = await this.prompt.exec(`git stash apply${stashIndex ? ` --index ${stashIndex}` : ''}`);

            if (applied instanceof Error.Log) {
                return applied;
            }

            if (applied.success) {
                return applied;
            }
        } catch (err) {
            return new Error.Log(err).append('services.GitHubAPI.RepoManager.apply_stash');
        }
    }

    async drop(index) {
        try {
            const deleted = await this.prompt.exec(`git stash drop ${index}`);
            if (deleted instanceof Error.Log) {
                throw deleted;
            }

            return deleted;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async stash(stashName) {
        try {
            const stashed = await this.prompt.exec(`git stash save "${stashName}"`);

            if (stashed instanceof Error.Log) {
                throw stashed;
            }

            if (stashed.success) {
                return stashed;
            }
        } catch (err) {
            throw new Error.Log(err).append('services.GitHubAPI.RepoManager.saving_stash');
        }
    }
}

module.exports = StashManager;
