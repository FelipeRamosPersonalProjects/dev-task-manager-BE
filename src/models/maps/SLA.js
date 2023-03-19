class SLAModel {
    constructor(setup = {
        expiration: Date,
        startDate: Date,
        acumulatedPausedTime: Date,
    }) {
        const { expiration, startDate, acumulatedPausedTime } = setup || {};

        this.expiration = expiration;
        this.startDate = startDate;
        this.acumulatedPausedTime = acumulatedPausedTime;
    }
}

module.exports = SLAModel;
