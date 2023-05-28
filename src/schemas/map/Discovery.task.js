class DiscoveryTask {
    static status = {
        type: String,
        default: 'TO-INVETIGATE',
        enum: [
            'TO-INVETIGATE',
            'UNDER-INVESTIGATION',
            'QUESTION-RAISED',
            'TO-REPLY-CLIENT',
            'DONE',
            'STUCK',
            'ABORTED'
        ]
    }

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
        return Object.keys(this).map(item => ({...this[item], fieldName: item}));
    }
}

module.exports = DiscoveryTask;
