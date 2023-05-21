class DevelopmentModel {
    constructor(setup) {
        try {
            const { salesForceConfigs } = Object(setup);

            this.salesForceConfigs = salesForceConfigs;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = DevelopmentModel;
