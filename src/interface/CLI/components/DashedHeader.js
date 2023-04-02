const Component = require('../../Component');
const StringTemplateBuilder = require('../../StringTemplateBuilder');

class DashedHeader extends Component {
    constructor(setup = {
        ...this,
        headerText: '',
        headerDescription: ''
    }) {
        super(setup);
        const { headerText, headerDescription } = setup || {};

        this.headerText = headerText;
        this.headerDescription = headerDescription;
    }

    getString(params) {
        const {headerText, headerDescription} = params || {};

        return new StringTemplateBuilder()
            .text('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            .text('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            .newLine()
            .text('------------------------------------------------------------------------------')
            .text('------------------------------------------------------------------------------')
            .newLine().newLine()
            .indent().text(this.string(headerText || this.headerText).toLocaleUpperCase()).newLine()
            .indent().text(this.string(headerDescription || this.headerDescription))
            .newLine().newLine()
            .text('------------------------------------------------------------------------------')
            .text('------------------------------------------------------------------------------')
            .newLine()
            .text('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            .text('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            .newLine()
        .end();
    }

    async render() {
        console.log(this.getString());
    }
}

module.exports = DashedHeader;
