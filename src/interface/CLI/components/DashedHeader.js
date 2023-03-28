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

    toString(params) {
        const {headerText, headerDescription} = params || {};

        return new StringTemplateBuilder()
            .text('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>').newLine()
            .text('------------------------------------------------------------------------------------------------------------------')
            .newLine().newLine()
            .indent().text(this.string(headerText || this.headerText).toLocaleUpperCase()).newLine()
            .indent().text(this.string(headerDescription || this.headerDescription))
            .newLine().newLine()
            .text('------------------------------------------------------------------------------------------------------------------').newLine()
            .text('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            .newLine()
        .end();
    }

    async render() {
        console.log(this.toString());
    }
}

module.exports = DashedHeader;
