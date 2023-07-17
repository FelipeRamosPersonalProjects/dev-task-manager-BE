class DevelopmentModel {
    constructor(setup) {
        try {
            const { salesForceConfigs, testingSteps, implementationSteps, developmentProofs } = Object(setup);

            this.implementationSteps = implementationSteps;
            this.developmentProofs = developmentProofs;

            this.salesForceConfigs = Array.isArray(salesForceConfigs) && !salesForceConfigs.oid() ? salesForceConfigs.map(item => item) : [];
            this.testingSteps = Array.isArray(testingSteps) && !testingSteps.oid() ? testingSteps.map(item => item) : [];
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = DevelopmentModel;
