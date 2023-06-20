const Component = require('@interface/Component');
const DocForm = require('@www/components/DocForm');
const { Input, SelectInput, TextArea } = require('@www/components/DocForm/FormField/fields');

class EstimationCreate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./createEstimation.html');
    }

    constructor(settings) {
        super(settings);

        const { } = Object(settings);

        this.docForm = new DocForm({
            collection: 'estimations',
            fields: [
            ]
        });
    }
}

module.exports = EstimationCreate;
