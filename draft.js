require('./src/global');

const RepoManager = require('./src/services/GitHubAPI/RepoManager');
console.log('RepoManager', RepoManager);
// const repo = new RepoManager({
//     repoName: 'FelipeRamosLab/nodejs-lab',
//     localPath: 'C:/Users/Felipe/Documents/my-lab/nodejs-lab'
// });

// repo.createBranch('feature/SBBW-225-v2', 'support').then(response => {
//     console.log(response)
// });
