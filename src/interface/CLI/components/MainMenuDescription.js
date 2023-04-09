const Component = require('../../Component');
const StringTemplateBuilder = require('../../StringTemplateBuilder');

class MainMenuDescription extends Component {
    constructor(setup = {
        ...MainMenuDescription.prototype,
    }) {
        super(setup);
        const {} = setup || {};

        this.outputModel = new StringTemplateBuilder()
            .text(`Choose one of the options bellow to take an action by typing the related index to the choosed item:`)
        .end();
    }
}

module.exports = MainMenuDescription;
