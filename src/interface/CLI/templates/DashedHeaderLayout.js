const Component = require('../../Component');
const DashedHeader = require('@CLI/components/DashedHeader');

class DashedHeaderLayout extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/DashedHeaderLayout.md')
    }

    constructor(settings = {
        ...Component.prototype,
        headerText: '',
        headerDescription: '',
        Content: [Component]
    }) {
        super(settings, {
            headerText: { type: String },
            headerDescription: { type: String },
            Content: { type: [Object] }
        });

        const {menu, headerText, headerDescription, Content} = settings || {};

        this.menu = menu;
        this.DashedHeader = new DashedHeader({headerText, headerDescription});
        this.Content = Content;

        this.init();
    }
}

module.exports = DashedHeaderLayout;
