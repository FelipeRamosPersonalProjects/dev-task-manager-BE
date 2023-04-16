class FileChange {
    constructor (setup, pullRequest) {
        const { additions, blob_url, changes, contents_url, deletions, filename, patch, raw_url, sha, status, description } = setup || {};

        this._pullRequest = () => pullRequest;
        this.additions = additions;
        this.blob_url = blob_url;
        this.changes = changes;
        this.contents_url = contents_url;
        this.deletions = deletions;
        this.filename = filename;
        this.patch = patch;
        this.raw_url = raw_url;
        this.sha = sha;
        this.status = status;
        this.description = description;
    }

    get pullRequest() {
        if (typeof this._pullRequest === 'function') {
            return this._pullRequest();
        }
    }

    get gitHubNumber() {
        return this.pullRequest && this.pullRequest.gitHubPR && this.pullRequest.gitHubPR.number;
    }

    get htmlGitHubDiffURL() {
        if (this.gitHubNumber) {
            return this.raw_url.replace(`/blob/${this.sha}/`, `/pull/${this.gitHubNumber}/files/`) + `#${this.filename}`;
        }
    }
}

module.exports = FileChange;
