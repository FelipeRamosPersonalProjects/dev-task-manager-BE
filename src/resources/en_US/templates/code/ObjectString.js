const Component = require('@interface/Component');
const ObjectProp = require('./ObjectProp');

class ObjectString extends Component {
    get SOURCE_PATH() {
        return require.resolve('./source/ObjectString.md');
    }

    constructor(settings) {
        super(settings);
        const { objectProps } = Object(settings);
        
        this.objectProps = [];
        this.Types = {
            ObjectProp
        }

        objectProps.map(item => {
            objectProps.push({
                key: item.fieldName,
                value: item
            });
        });

        debugger;
    }
}

module.exports = ObjectString;
