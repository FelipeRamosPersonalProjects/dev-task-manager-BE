const _Global = require('../maps/_Global');
const User = require('./User');

class PullRequests extends _Global {
    constructor(setup = {
        prName: String,
        prGitHubID: String,
        description: String,
        fileChanges: [Object],
        assignedUsers: [User.prototype],
        reviewers: [User.prototype],
        labels: [String],
        bmConfigs: [Object],
        comments: [Object],
    }){
        super({...setup, validationRules: 'pull_requests'});
        const { prName, prGitHubID, description, fileChanges, assignedUsers, reviewers, labels, bmConfigs, comments } = setup || {};

        try {
           this.prName = prName; 
           this.prGitHubID = prGitHubID; 
           this.description = description; 
           this.fileChanges = fileChanges; 
           this.assignedUsers = assignedUsers; 
           this.reviewers = reviewers; 
           this.labels = labels; 
           this.bmConfigs = bmConfigs; 
           this.comments = comments; 

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'PullRequests');
        }
    }
}

module.exports = PullRequests;
