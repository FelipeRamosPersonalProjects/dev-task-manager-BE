class ProgressPR {
    constructor(setup) {
        try {
            const { currentStep, docQuery, socketConnectionID, subscriptionUID } = Object(setup);

            this.docQuery = docQuery;
            this.currentStep = currentStep;
            this.socketConnectionID = socketConnectionID;
            this.subscriptionUID = subscriptionUID;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ProgressPR;
