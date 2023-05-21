module.exports = class DiscoveryMap {
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
