const Component = require('@interface/Component');

class ObjectProp extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/ObjectProp.md');
    }

    constructor(settings) {
        super(settings);

        const { key, value } = Object(settings);
        
        this.key = key;
        this.value = value;
    }
}

module.exports = ObjectProp;
