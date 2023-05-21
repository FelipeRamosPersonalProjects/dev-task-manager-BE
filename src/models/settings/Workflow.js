const statusConfigs = require('@CONFIGS/workflows');

class Workflow {
    constructor(setup) {
        try {
            const { currentStatus, statusList } = Object(setup);

            this.currentStatus = currentStatus;
            this.statusList = statusList;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Workflow;
