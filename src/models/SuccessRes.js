class SuccessRes {
    constructor(setup = {
        data: Object(),
        message: String(),
    }) {
        this.success = true;
        this.data = setup.data;
        this.message = setup.message;
    }
}

module.exports = SuccessRes;
