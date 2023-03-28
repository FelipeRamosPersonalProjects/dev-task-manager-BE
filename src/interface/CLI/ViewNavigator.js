const ToolsCLI = require('./ToolsCLI');
const NavigatorOption = require('./NavigatorOption');

class ViewNavigator extends ToolsCLI {
    constructor(setup = {
        options: [],
        navSuccessCallback,
        navErrorCallback
    }, parentView) {
        super();
        const {options, navSuccessCallback, navErrorCallback} = setup || {};

        this.options = [];
        this.navSuccessCallback = navSuccessCallback && navSuccessCallback.bind(this);
        this.navErrorCallback = navErrorCallback && navErrorCallback.bind(this);
        this.parentView = parentView;

        Array.isArray(options) && options.map((opt) => this.addOption(opt));
    }

    navTo(viewName) {
        this.parentView.goToView(viewName);
    }

    getOption(index) {
        return this.options[index];
    }

    addOption(data) {
        const newOption = new NavigatorOption(data);

        this.options.push(newOption);
        return this;
    }

    setOption(index, data, override) {
        const i = String(index);

        if (override) {
            this.options[i] = new NavigatorOption(data);
        } else {
            this.options[i] = {...this.options[i], ...data};
        }
    }

    render(headers) {
        try {
            this.printTable(this.options, headers);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ViewNavigator;
