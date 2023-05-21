class DiscoveryTask {
    static findings = {
        type: String
    };

    static issueCauses = {
        type: String
    };

    static solution = {
        type: String
    };

    static toObject() {
        return {...this};
    }
}

module.exports = DiscoveryTask;
