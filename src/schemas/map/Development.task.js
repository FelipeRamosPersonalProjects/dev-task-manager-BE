const Collection = require("@Collection");
const { ObjectId } = Collection.Types;

class DevelopmentTask {
    static salesForceConfigs = {
        type: [ObjectId],
        ref: 'sf_configs',
        refConfig: {
            relatedField: 'task',
            type: 'ObjectId'
        }
    };

    static testingSteps = {
        type: [ObjectId],
        default: [],
        ref: 'testing_steps',
        refConfig: {
            relatedField: 'task',
            type: 'ObjectId'
        }
    };

    static implementationSteps = {
        type: String
    };

    static developmentProofs = {
        type: String
    };

    static toObject() {
        return {...this};
    }
}

module.exports = DevelopmentTask;
