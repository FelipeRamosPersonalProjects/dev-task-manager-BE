const Component = require('../../Component');

class DashedHeaderLayout extends Component {
    get SOURCE_PATH() {
        return 'src/interface/CLI/templates/source/DashedHeaderLayout.template.txt';
    }

    constructor(settings = {
        ...Component.prototype,
        headerText: '',
        headerDescription: '',
        Content: [Component]
    }) {
        super(settings, {
            headerText: { type: String, required: true },
            Content: { type: [Object], required: true }
        });

        const {menu, headerText, headerDescription, Content} = settings || {};

        this.Content = Content;
        this.menu = menu;
        this.headerText = headerText;
        this.headerDescription = headerDescription;
    }
}

module.exports = DashedHeaderLayout;
