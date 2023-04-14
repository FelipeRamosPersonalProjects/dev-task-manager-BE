const Component = require('../../Component');

class DashedHeader extends Component {
    constructor(setup = {
        ...Component.prototype,
        headerText: '',
        headerDescription: ''
    }) {
        super(setup);
        const { headerText, headerDescription } = setup || {};

        this.SOURCE_PATH = require.resolve('./source/DashedHeader.md');
        this.headerText = headerText;
        this.headerDescription = headerDescription;
        
        this.init();
    }
}

module.exports = DashedHeader;
