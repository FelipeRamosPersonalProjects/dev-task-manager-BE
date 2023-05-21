class DevelopmentTask {
    static status = {
        type: String,
        default: 'TO-START-DEVELOPMENT',
        enum: [
            'TO-START-DEVELOPMENT',
            'IN-DEVELOPMENT',
            'QUESTION-RAISED',
            'TO-REPLY-CLIENT',
            'DONE',
            'STUCK',
            'ABORTED'
        ]
    }

    static salesForceConfigs = {
        type: Object
    };
    
    static toObject() {
        return {...this};
    }
}

module.exports = DevelopmentTask;
