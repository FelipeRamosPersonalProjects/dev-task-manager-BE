const Component = require('@interface/Component');

class ThisDeclaration extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/ThisDeclaration.md');
    }

    constructor(settings) {
        super(settings);

        const { propName } = Object(settings);
        
        this.propName = propName;
    }
}

module.exports = ThisDeclaration;
