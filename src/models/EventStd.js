/**
 * Model to set the events to that will trigger the actions through the app.
 * @module EventStd
 */
class EventStd {
    /**
     * Creates a new instance of the EventStd class.
     * @param {Object} setup - The setup object.
     * @param {string} setup.name - String with the event's name.
     * @param {function} setup.handler - Function with the handler to be executed when the event is triggered
     */
    constructor(setup) {
        try {
            const { name, handler, target } = Object(setup);

            /**
             * String with the event's name.
             * @property {string}
             */
            this.name = name;

            /**
             * Function with the handler to be executed when the event is triggered
             * @property {function}
             */
            this.handler = handler || Function();

            /**
             * The object that is wrapping the event. For example: Workflow, Collection, etc.
             * @property {Object}
             */
            this.target = target;

            this.add(target)
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    trigger(target) {
        try {
            return process.emit(this.name, target);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    add(status) {
        try {
            this.listener = process.on(this.name, this.handler.bind(status));
            return this.listener;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = EventStd;
