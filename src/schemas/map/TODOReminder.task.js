class TODOReminderTask {
    static reminderType = {
        type: String,
        default: 'standard',
        enum: ['standard', 'meeting', 'to-reply']
    };

    static toObject() {
        return {...this};
    }
}

module.exports = TODOReminderTask;
