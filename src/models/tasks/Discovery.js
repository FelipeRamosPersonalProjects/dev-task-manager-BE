class DiscoveryModel {
    constructor(setup) {
        try {
            const { findings, issueCauses, solution } = Object(setup);

            this.findings = findings;
            this.issueCauses = issueCauses;
            this.solution = solution;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = DiscoveryModel;
