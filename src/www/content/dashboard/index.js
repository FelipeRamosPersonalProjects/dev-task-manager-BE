const Component = require('@interface/Component');

class Dashboard extends Component {
    get SOURCE_PATH() {
        return require.resolve('./dashboard.html');
    }

    constructor(settings) {
        super(settings);

        const {  } = Object(settings);
    }
}

module.exports = Dashboard;
