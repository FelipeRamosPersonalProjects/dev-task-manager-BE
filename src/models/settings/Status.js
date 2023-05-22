/**
 * Model to set the a status configuration.
 * @module Status
 */
class Status {
    /**
     * Creates a new instance of the Status class.
     * @param {Object} setup - The setup object.
     * @param {string} setup.statusID - String with a identification for the Status.
     * @param {string} setup.displayName - A name for the workflow to be displayed to the user.
     * @param {string} setup.next - The next status ID on the flow.
     */
    constructor(setup) {
        try {
            const { statusID, displayName, next } = Object(setup);

            /**
             * String with a identification for the Status.
             * @type {string}
             */
            this.statusID = statusID;

            /**
             * A name for the workflow to be displayed to the user.
             * @type {string}
             */
            this.displayName = displayName;

            /**
             * The next status ID on the flow.
             * @type {string}
             */
            this.next = next;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async switchToNext() {
        try {
    
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async jumpTo(statusID) {
        try {
    
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Status;
