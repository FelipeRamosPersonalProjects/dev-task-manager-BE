const Comment = require('@models/collections/Comment');

class DiscoveryModel {
    constructor(setup) {
        try {
            const { findings, rootCauses, solutionSummary } = Object(setup);

            this.rootCauses = rootCauses;
            this.solutionSummary = solutionSummary;
            this.findings = Array.isArray(findings) && !findings.oid() ? findings.map(item => new Comment(item)) : [];
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = DiscoveryModel;
