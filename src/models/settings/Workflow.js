const Status = require('@models/settings/Status');
const workflows = require('@CONFIGS/workflows');

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
     * @param {Status[]} setup.statuses - Array with the configurated Status class for the workflow.
     */
    constructor(setup) {
        try {
            const { workflowID, displayName, statuses } = Object(setup);
            

            /**
             * Identification for the workflow.
             * @type {string}
             */
            this.workflowID = workflowID;

            /**
             * A name for the workflow to be displayed to the user.
             * @type {string}
             */
            this.displayName = displayName;

            if (Array.isArray(statuses)) {
                const currStatus = {};

                statuses.map(item => {
                    if (currStatus[item.statusID]) {
                        throw new Error.Log({
                            name: 'DUPLICATED-STATUS',
                            message: `The status "${item.statusID}" on the workflow "${this.workflowID}" is duplicated, the statuses ID should be unique.`
                        });
                    } else {
                        currStatus[item.statusID] = item;
                    }
                });

                /**
                 * Array with the configurated Status classes for the workflow.
                 * @type {Status[]}
                 */
                this.statuses = Array.isArray(statuses) ? statuses.map(status => new Status(status)) : [];
            }
            // Adds the event listeners when it’s constructed
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static loadWorkflow(workflowName) {
        try {
            const workflow = workflows[workflowName];

            if (!workflow) return null;
            // Finish logic here
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Workflow;
