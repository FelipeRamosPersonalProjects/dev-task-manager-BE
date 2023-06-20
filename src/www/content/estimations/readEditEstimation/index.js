const Component = require('@interface/Component');
const workflow = require('@CONFIGS/workflows/estimations.workflow');
const DocForm = require('@www/components/DocForm');
const { InputEdit, SelectInputEdit, TextArea } = require('@www/components/DocForm/FormField/fields');

class EstimationEdit extends Component {
    get SOURCE_PATH() {
        return require.resolve('./readEditEstimation.html');
    }

    constructor(settings) {
        super(settings);

        const { estimationDoc } = Object(settings);
        const {  } = Object(estimationDoc);

        this.displayName = displayName;
        this.docForm = new DocForm({
            collection: 'estimations',
            wrapperTag: 'div',
            fields: [
            ]
        });
    }
}

module.exports = EstimationEdit;
