const Repo = require('../../models/collections/Repo');

class ReposClass {
    static Model = Repo;

    get displayName() {
        return `[${this.cod}] ${this.repoName}`;
    }
    
    get frontURL() {
        return `/repos/read-edit/${this.index}`;
    }
}

module.exports = ReposClass;
