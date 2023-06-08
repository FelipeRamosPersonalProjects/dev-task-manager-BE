class TODOReminderTask {
    constructor(setup) {
        try {
            const { reminderType } = Object(setup);

            this.reminderType = reminderType;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = TODOReminderTask;
