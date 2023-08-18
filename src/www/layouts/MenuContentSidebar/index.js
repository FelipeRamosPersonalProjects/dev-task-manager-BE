const Component = require('@interface/Component');
const LeftSideMenu = require('@src/www/menus/LeftSideMenu');
const PullRequestSB = require('@src/www/sidebars/PullRequestSB');
const ReadEditPullRequest = require('@src/www/content/pullrequests/readEditPullRequest');

class MenuContentSidebarLayout extends Component {
    get SOURCE_PATH() {
        return require.resolve('./MenuContentSidebar.html');
    }

    constructor(settings) {
        super(settings);

        const { menu, subscriptionUID } = Object(settings);

        this.subscriptionUID = subscriptionUID;
        this.menu = menu || new LeftSideMenu();
    }

    get setters() {
        return {
            pullRequest: (value) => {
                if (value) {
                    this.pullRequest = value;
                }

                this.setters.content();
                this.setters.sidebar();
            },
            content: () => {
                this.content = new ReadEditPullRequest({
                    ...this,
                    pullRequestDoc: this.pullRequest
                });
            },
            sidebar: () => {
                this.sidebar = new PullRequestSB(this, this);
            }
        }
    }

    async load() {
        try {
            await this.loadDependencies();
            
            this.setters.pullRequest();
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = MenuContentSidebarLayout;
