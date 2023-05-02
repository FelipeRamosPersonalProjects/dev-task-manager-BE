const Component = require('@interface/Component');
const DashedHeader = require('@CLI/components/DashedHeader');
const CodIndexTile = require('@CLI/components/tiles/CodIndexTile');
const StringTemplateBuilder = require('@STRING');

class RepoTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/Repo.md');
    }

    constructor(settings) {
        super(settings);
        const { cod, displayName, repoName, nodeVersion, baseBranch, url, localPath, projects, pullRequests } = Object(settings);

        this.header = new DashedHeader({
            headerText: `💽  ${displayName}`,
            headerDescription: new StringTemplateBuilder()
                .text(`📌  Node version: ${nodeVersion}`).newLine()
                .indent().text(`🔧  Base branch: ${baseBranch}`)
            .end()
        });

        this.types = {
            CodIndexTile
        }

        this.displayName = displayName;
        this.cod = cod;
        this.repoName = repoName;
        this.nodeVersion = nodeVersion;
        this.baseBranch = baseBranch;
        this.url = url;
        this.localPath = localPath;
        this.projects = projects;
        this.pullRequests = pullRequests;
    }
}

module.exports = RepoTemplate;
