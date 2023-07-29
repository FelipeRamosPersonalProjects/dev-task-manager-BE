class ProgressPR {
    constructor(setup) {
        try {
            const { currentStep, doc } = Object(setup);

            this.doc = doc;
            this.currentStep = currentStep;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ProgressPR;
