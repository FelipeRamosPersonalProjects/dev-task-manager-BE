class DevelopmentTask {
    static salesForceConfigs = {
        type: Object
    };
    
    static toObject() {
        return {...this};
    }
}

module.exports = DevelopmentTask;
