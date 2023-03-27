const Component = require('../../Component');

class DashedHeaderLayout extends Component {
    constructor(settings = {
        ...Component.prototype,
        headerText: '',
        Content: Component,
        contentSettings: {}
    }) {
        super(settings, {
            headerText: { type: String, required: true },
            Content: { type: settings.Content, required: true }
        });

        const {contentSettings} = settings || {};

        this.contentSettings = contentSettings;
    }

    async render(settings = this.contentSettings) {
        
    }
}

module.exports = DashedHeaderLayout;
