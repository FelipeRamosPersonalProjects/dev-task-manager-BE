const FS = require('@services/FS');
const config = require('@config');

class BackupService {
    constructor(setup) {
        const { backupFolder } = Object(setup);

        try {
            this.backupFolder = backupFolder || config.backupFolder;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    buildBranchBackupPath(repo, currentBranch, title) {
        const parsedTitle = title && title.replace(/ /g, '_');
        const date = new Date();
        const repoPath = repo.repoPath;
        const ticket = repo.externalKey;
        const branch = currentBranch;
        const headBranch = repo.parentTask && repo.parentTask.taskBranch;
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const mode = config.mode === 'production' ? 'PROD' : 'DEV';

        return `${config.backupFolder}/${mode}/${repoPath}/${ticket ? `${ticket}/` : 'STASH-BACKUP/'}${branch}__${headBranch ? headBranch : parsedTitle ? parsedTitle : ''}/${year}-${month}-${day}__${hour}-${minute}`;
    }

    async createBranchBackup(repo, setup) {
        const { title } = Object(setup);

        try {
            const currentBranch = repo.repoManager.getCurrentBranch();
            const current = await repo.repoManager.currentChanges();

            if (currentBranch instanceof Error.Log) {
                throw currentBranch;
            }
            if (current instanceof Error.Log) {
                throw current;
            }

            const filesToCopy = current.success && current.changes || [];
            const destDir = this.buildBranchBackupPath(repo, currentBranch, title);
            const files = await FS.copyFiles(filesToCopy, repo.localPath, destDir);

            return {
                success: true,
                backupFolder: destDir,
                currentChanges: current,
                copiesResponse: files
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = BackupService;
