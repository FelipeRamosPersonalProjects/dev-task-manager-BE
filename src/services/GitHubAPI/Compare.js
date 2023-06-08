const FileChange = require('./FileChange');

class Compare {
    constructor (setup) {
        const { ahead_by, base_commit, behind_by, commits, diff_url, files, html_url, merge_base_commit, patch_url, permalink_url, status, total_commits, url } = setup || {};

        this.ahead_by = ahead_by;
        this.base_commit = base_commit;
        this.behind_by = behind_by;
        this.commits = commits;
        this.diff_url = diff_url;
        this.files = files.map(item => new FileChange(item));
        this.html_url = html_url;
        this.merge_base_commit = merge_base_commit;
        this.patch_url = patch_url;
        this.permalink_url = permalink_url;
        this.status = status;
        this.total_commits = total_commits;
        this.url = url;
    }
}

module.exports = Compare;
