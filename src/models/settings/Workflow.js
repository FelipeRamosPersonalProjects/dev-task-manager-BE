const Status = require('@models/settings/Status');
const EventStd = require('@models/EventStd');
const Collection = require('@Collection');

/**
 * It's a setting model to configurate the collection's workflows.
 * @module Workflow
 */
class Workflow {
    /**
     * Creates a new instance of the Workflow class.
     * @param {Object} setup - The setup object.
     * @param {string} setup.workflowID - String with a identification for the workflow.
     * @param {string} setup.displayName - A name for the workflow to be displayed to the user.
     * @param {EventStd[]} setup.workflowEvents - Array with the general workflow events.
     * @param {Status[]} setup.statuses - Array with the configurated Status class for the workflow.
     * @param {Collection} collection - The parent Collection of wrokflow.
     */
    constructor(setup) {
        try {
            const { collection, workflowID, displayName, workflowEvents, statuses } = Object(setup);

            /**
             * The parent Collection of wrokflow.
             * @property {Collection}
             */
            this.collection = collection;

            /**
             * Identification for the workflow.
             * @property {string}
             */
            this.workflowID = workflowID || collection;

            /**
             * A name for the workflow to be displayed to the user.
             * @property {string}
             */
            this.displayName = displayName;

            /**
             * Array with the configurated Status classes for the workflow.
             * @property {Status[]}
             */
            this.statuses = [];

            /**
             * Array with the general workflow events.
             * @property {EventStd[]}
             */
            this.workflowEvents = Array.isArray(workflowEvents) ? workflowEvents.map(event => new EventStd({
                ...event,
                name: `${event.name}:${this.workflowID}`,
                target: this
            })) : [];

            if (Array.isArray(statuses)) {
                const currStatus = {};

                statuses.map(item => {
                    if (currStatus[item.statusID]) {
                        throw new Error.Log({
                            name: 'DUPLICATED-STATUS',
                            message: `The status "${item.statusID}" on the workflow "${this.workflowID}" is duplicated, the statuses ID should be unique.`
                        });
                    } else {
                        currStatus[item.statusID] = true;
                    }
                });

                this.statuses = statuses.map(status => new Status(status, this));
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    addListeners() {
        try {
            this.workflowEvents.map(event => event.add(this));
            this.statuses.map(status => status.addListeners());
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    getStatus(statusID) {
        return this.statuses.find(item => item.statusID === statusID);
    }

    getJiraID(statusID) {
        const current = this.getStatus(statusID);
        return current && current.statusID;
    }
}

module.exports = Workflow;
