const EventStd = require('@models/EventStd');
const Workflow = require('@models/settings/Workflow');

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
     * @param {EventStd[]} setup.events - Array with the EventStd configured.
     * @param {Workflow} workflow - The parent Workflow wrapping the Status.
     */
    constructor(setup, workflow) {
        try {
            const { statusID, jiraID, displayName, next, events } = Object(setup);

            /**
             * The parent Workflow wrapping the Status.
             * @property {Workflow}
             */
            this.workflow = workflow;

            /**
             * String with a identification for the Status.
             * @property {string}
             */
            this.statusID = statusID;

            /**
             * String with a identification for the Status on JIRA.
             * @property {string}
             */
            this.jiraID = jiraID;

            /**
             * A name for the workflow to be displayed to the user.
             * @property {string}
             */
            this.displayName = displayName;

            /**
             * The next status ID on the flow.
             * @property {string}
             */
            this.next = next;

            /**
             * Array with the EventStd configured.
             * @property {EventStd[]}
             */
            this.events = Array.isArray(events) ? events.map(ev => new EventStd({
                ...ev,
                name: `status:${ev.name}:${this.workflow.collection}`,
                target: this
            })) : [];
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    addListeners() {
        try {
            this.events.map(event => event.add(this));
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Status;
