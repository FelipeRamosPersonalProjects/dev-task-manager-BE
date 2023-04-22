const Component = require('../../Component');

class DashedHeader extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/DashedHeader.md');
    }

    constructor(setup = {
        ...Component.prototype,
        headerText: '',
        headerDescription: ''
    }) {
        super(setup);
        const { headerText, headerDescription } = setup || {};

        this.headerText = headerText;
        this.headerDescription = headerDescription;
    }
}

module.exports = DashedHeader;
