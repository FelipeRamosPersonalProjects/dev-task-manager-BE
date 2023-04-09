class FileChange {
    constructor (setup) {
        const { additions, blob_url, changes, contents_url, deletions, filename, patch, raw_url, sha, status } = setup || {};

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
    }
}

module.exports = FileChange;
