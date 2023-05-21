class ValidationTask {
    static status = {
        type: String,
        default: 'TO-ADD-TESTING-STEPS',
        enum: [
            'TO-ADD-TESTING-STEPS',
            'DEV',
            'STG',
            'PROD',
            'VALIDATED'
        ]
    }

    static testingSteps = {
        type: [Object]
    };
    
    static toObject() {
        return {...this};
    }
}

module.exports = ValidationTask;
