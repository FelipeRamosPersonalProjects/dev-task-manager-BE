const _Global = require('../maps/_Global');
const RepoManager = require('../../services/GitHubAPI/RepoManager');

class Repo extends _Global {
    constructor(setup = {
        ...Repo.prototype,
        nodeVersion: '',
        baseBranch: '',
        url: '',
        localPath: '',
        collaborators: [Object],
        projects: [Object],
        owner: Object,
        repoManager: RepoManager.prototype
    }){
        super({...setup, validationRules: 'repos'}, setup);
        if (!setup.isComplete && !setup.isNew) return;

        const User = require('./User');
        const Project = require('./Project');

        try {
            const { nodeVersion, baseBranch, url, repoName, repoPath, localPath, owner, collaborators, organization, projects } = setup || {};

            this.nodeVersion = nodeVersion;
            this.baseBranch = baseBranch;
            this.url = url;
            this.localPath = localPath;
            this.collaborators = Array.isArray(collaborators) ? collaborators.map(collab => new User(collab)) : [];
            this.projects = Array.isArray(projects) ? projects.map(project => new Project(project)) : [];
            this.owner = owner ? new User(owner) : {};

            if (url) {
                const separateHost = url.split('https://github.com/');
                const repoPathArray = separateHost[1] && separateHost[1].split('/');

                if (repoPathArray.length < 2) return;

                this.organization = repoPathArray[0];
                this.repoName = repoPathArray[1];
                this.repoPath = [repoPathArray[0], repoPathArray[1]].join('/');
            } else {
                this.organization = organization;
                this.repoName = repoName;
                this.repoPath = repoPath;
            }

            this.displayName = this.repoPath;
            this.repoManager = new RepoManager({
                localPath: this.localPath,
                repoName: this.repoName,
                repoPath: this.repoPath,
                organization: this.organization
            }, this);

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'Repo');
        }
    }
}

module.exports = Repo;
