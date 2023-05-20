const Component = require('@interface/Component');

class ObjectPropNoValue extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/ObjectPropNoValue.md');
    }

    constructor(settings) {
        super(settings);

        const { propName } = Object(settings);
        
        this.propName = propName;
    }
}

module.exports = ObjectPropNoValue;
