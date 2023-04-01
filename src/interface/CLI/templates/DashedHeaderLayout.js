const Component = require('../../Component');
const StringTemplateBuilder = require('../../StringTemplateBuilder');
const DashedHeader = require('../components/DashedHeader');

class DashedHeaderLayout extends Component {
    constructor(settings = {
        ...Component.prototype,
        headerText: '',
        headerDescription: '',
        Content: [Component],
        contentSettings: {}
    }) {
        super(settings, {
            headerText: { type: String, required: true },
            Content: { type: [Object], required: true }
        });

        const {contentSettings, headerText, headerDescription, Content} = settings || {};

        this.contentSettings = contentSettings;
        this.Content = Content;
        this.headerText = headerText;
        this.headerDescription = headerDescription;
    }

    getString() {
        const header = new DashedHeader({
            headerText: this.headerText,
            headerDescription: this.headerDescription
        }).getString();

        return new StringTemplateBuilder()
            .text(header)
            .newLine()
            .text(this.children(this.Content))
            .newLine()
        .end();
    }

    async render() {
        console.log(this.getString());
        return this;
    }
}

module.exports = DashedHeaderLayout;
