require('./src/global');
const { GitHubUser } = require('./src/services/GitHubAPI');

const service = new GitHubUser({
    GITHUB_USER_TOKEN: process.env.GITHUB_USER_TOKEN
});

(async () => {
    const user = await service.getUser();

    console.log(user);
})()
