const { Types: { ObjectId } } = require('@models/settings/Collection')

class DiscoveryTask {
    static findings = {
        type: [ObjectId],
        default: [],
        ref: 'comments',
        refConfig: {
            relatedField: 'task',
            type: 'ObjectId'
        }
    };

    static rootCauses = {
        type: String
    };

    static solutionSummary = {
        type: String
    };

    static toObject() {
        const result = {};

        Object.keys(this).map(item => (result[item] = {...this[item], fieldName: item}));
        return result;
    }
}

module.exports = DiscoveryTask;
