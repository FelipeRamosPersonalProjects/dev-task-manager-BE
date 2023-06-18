const StringTemplateBuilder = require("@STRING");
const workflows = require('@CONFIGS/workflows');

class JIRAStatusTransition {
    constructor(event) {
        try {
            this.transition = { id: event.jiraID };
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRAStatusTransition;
