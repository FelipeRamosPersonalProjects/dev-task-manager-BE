const Component = require('@interface/Component');

class Spinner extends Component {
    get SOURCE_PATH() {
        return require.resolve('./Spinner.html');
    }

    constructor(settings) {
        super(settings);

        const {  } = Object(settings);
    }
}

module.exports = Spinner;
