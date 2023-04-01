const views = require('./views');
const ToolsCLI = require('./ToolsCLI');

class CLI extends ToolsCLI {
    constructor(setup = {
        startView,
    }) {
        super();
        const { startView } = setup || {};

        this.startView = startView;
        this._currView;

        this.getCurrentView = () => {
            return this._currView;
        }
    }

    async init() {
        this.loadView(this.startView);
        return this;
    }

    setCurrentView(viewName) {
        this._currView = viewName;
        return this._currView;
    }

    loadView(viewPath) {
        console.log('[dev-task]: Loading view "' + viewPath + '"...');
        const parsedPath = viewPath.split('/');
        let View = views;

        parsedPath.map(path => {
            if (View) {
                View = View[path];
            }
        });

        if (typeof View === 'function') {
            const loadedView = View.call(this);
            
            this.setCurrentView(loadedView);
            loadedView.render();

            return this;
        } else {
            this.printError(new Error.Log({
                name: 'LoadingView',
                message: `View path not found! ${viewPath}`
            }));
        }
    }

    goToStart() {
        return this.loadView(this.startView);
    }
}

module.exports = CLI;
