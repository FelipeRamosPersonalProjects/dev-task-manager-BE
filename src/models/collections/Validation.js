const _Global = require('@models/maps/_Global');

class Validation extends _Global {
    constructor(setup, parent){
        super({...setup, validationRules: 'validations'}, parent);
        if (!setup || isObjectID(setup)) return;

        const {
            /*## ModelParams_Start ##*/
            index,
            cod,
            createdAt,
            modifiedAt,
            author,
            title,
            description,
            instance,
            reportSummary,
            conclusion,
            testingSteps,
            ticket,
            tasks,
            pullRequest,
        } = Object(setup);
            /*## ModelParams_End ##*/

        // Virtuals
        const { frontURL } = Object(setup);
        
        try {
            /*## ModelProps_Start ##*/
            this.index = index;
            this.cod = cod;
            this.createdAt = createdAt;
            this.modifiedAt = modifiedAt;
            this.author = author;
            this.title = title;
            this.description = description;
            this.instance = instance;
            this.reportSummary = reportSummary;
            this.conclusion = conclusion;
            this.testingSteps = testingSteps;
            this.ticket = ticket;
            this.tasks = tasks;
            this.pullRequest = pullRequest;

            this.placeDefault();
            /*## ModelProps_End ##*/

            // Virtuals
            this.frontURL = frontURL;
        } catch(err) {
            throw new Error.Log(err).append('common.model_construction', 'Validation');
        }
    }

    get displayName() {
        let result = '';

        if (this.externalTicketKey) result += `[${this.externalTicketKey}]`;
        if (this.instance) result += `[${this.instance}]`;
        if (this.title) result += (' ' + this.title);
        return result;
    }

    get externalTicketKey() {
        return this.getSafe('ticket.externalKey');
    }
}

module.exports = Validation;
