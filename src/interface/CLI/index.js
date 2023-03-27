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
        const loaded = await this.loadView(this.startView);
        loaded.render();
        return this;
    }

    setCurrentView(viewName) {
        this._currView = viewName;
        return this._currView;
    }

    async loadView(viewName) {
        console.log('[dev-task]: Loading view "' + viewName + '"...');
        const View = views[viewName];

        if (View) {
            const loadedView = View.call(this);
            
            this.setCurrentView(loadedView);
            console.log('[dev-task]: View "' + viewName + '" was loaded!');

            return loadedView;
        } else {
            debugger;
        }
    }

    async goToStart() {
        return await this.loadView(this.startView);
    }

    print(txt) {
        console.log('[dev-task]: ' + txt);
    }
}

module.exports = CLI;
