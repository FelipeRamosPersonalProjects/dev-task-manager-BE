const PullRequest = require('../../models/collections/PullRequest');

class PullRequestsClass {
    static Model = PullRequest;
    
    get frontURL() {
        return `/pullrequests/read-edit/${this.index}`;
    }
}

module.exports = PullRequestsClass;
