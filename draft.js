require('./src/global');
const config = require('./config.json');
const { RepoManager } = require('./src/services/GitHubAPI');
const repo = new RepoManager({
    userName: 'FelipeRamos1202',
    ...config.projects[0].repos[0]
});

(async () => {
    // const branch = await repo.checkout('feature/testing1');
    // const fileChanges = await repo.currentChanges();
    // const commit = await repo.commit();
    // const push = await repo.push('feature/testing1');
})()

