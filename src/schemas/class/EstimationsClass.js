const Estimation = require('../../models/collections/Estimation');

class EstimationsClass {
    static Model = Estimation;
    
    get frontURL() {
        return `/estimations/read-edit/${this.index}`;
    }

    get parsedTime() {
        return {
            FE: Date.convertMillisTo(this.FE, this.unit),
            BE: Date.convertMillisTo(this.BE, this.unit),
            QA: Date.convertMillisTo(this.QA, this.unit),
            others: Date.convertMillisTo(this.others, this.unit)
        };
    }
}

module.exports = EstimationsClass;
