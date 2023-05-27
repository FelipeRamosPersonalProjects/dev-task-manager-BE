class ValidationTask {
    constructor(setup) {
        try {
            const { testingSteps } = Object(setup);

            this.testingSteps = testingSteps;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ValidationTask;
