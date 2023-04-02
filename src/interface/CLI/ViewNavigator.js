const ToolsCLI = require('./ToolsCLI');
const NavigatorOption = require('./NavigatorOption');
const StringTemplateBuilder = require('../StringTemplateBuilder')

const navDefaultQuestions = {
    startQuestion: 'navigation',
    questions: [
        {
            id: 'navigation',
            text: 'Choose an option above to navigate, type the index of the choosed option: ',
            required: true
        }
    ]
};

class ViewNavigator extends ToolsCLI {
    static navDefaultQuestions = navDefaultQuestions;

    constructor(setup = {
        ...this,
        type: '', // nav or doc-list
        options: [NavigatorOption.prototype],
        navSuccessCallback,
        navErrorCallback
    }, parentView) {
        super();
        const {type, options, navSuccessCallback, navErrorCallback} = setup || {};

        this.type = type || 'nav';
        this.options = [];
        this.navSuccessCallback = navSuccessCallback && navSuccessCallback.bind(this);
        this.navErrorCallback = navErrorCallback && navErrorCallback.bind(this);
        this.parentView = parentView;

        if (Array.isArray(options)) {
            this.options = options.map((opt) => new NavigatorOption(opt));
        }
    }

    async navTo(index, params) {
        const opt = this.getOption(index);

        if (typeof opt.trigger === 'function') {
            return await opt.trigger.call(opt, this);
        }

        if (this.parentView && opt && opt.targetView){
            return await this.parentView.goToView(opt.targetView, {
                ...opt.viewParams,
                ...params,
                defaultData: opt.defaultData
            });
        }
    }

    getOption(index) {
        return this.options[index];
    }

    addOption(data) {
        const newOption = new NavigatorOption(data);

        newOption.type = this.type;
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

    render(params) {
        let { headers, exclude } = params || {};
        let options = [];

        if (this.type === 'doc-list') {
            this.options.map(opt => options.push(opt.doc));
        } else {
            options = this.options;
            exclude = ['type', 'targetView'];
        }

        try {
            let template = new StringTemplateBuilder().newLine();
            
            options.map((opt, i) => {
                if (opt._schema) {
                    let title = '';

                    if (Array.isArray(headers)) {
                        title = headers.map(item => opt[item]).join(' | ');
                    }
                    template = template.indent().text(`${i}. ${title}${opt.description ? (' - ' + opt.description) : ''}`).newLine();
                } else {
                    template = template.indent().text(`${i}. ${opt.title}${opt.description ? (' - ' + opt.description) : ''}`).newLine();
                }
            });

            console.log(template.end() || '--no-records--');
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ViewNavigator;
