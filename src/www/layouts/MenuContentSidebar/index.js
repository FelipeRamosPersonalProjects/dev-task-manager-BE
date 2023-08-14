const Component = require('@interface/Component');
const LeftSideMenu = require('@src/www/menus/LeftSideMenu');

class MenuContentSidebarLayout extends Component {
    get SOURCE_PATH() {
        return require.resolve('./MenuContentSidebar.html');
    }

    constructor(settings) {
        super(settings);

        const { menu, content, sidebar } = Object(settings);
        
        this.menu = menu || new LeftSideMenu();
        this.content = content;
        this.sidebar = sidebar;
    }

    async load() {
        try {
            debugger;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = MenuContentSidebarLayout;
