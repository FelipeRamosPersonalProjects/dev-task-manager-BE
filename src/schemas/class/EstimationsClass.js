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
    
    get totalEstimation() {
        return this.FE + this.BE + this.QA + this.others;
    }

    get fullEstimation() {
        let resultString = '';

        if (this.FE) {
            if (resultString) resultString += ' | ';
            resultString += `${this.FE}${this.unit[0]} FE`;
        }

        if (this.BE) {
            if (resultString) resultString += ' | ';
            resultString += `${this.BE}${this.unit[0]} BE`;
        }

        if (this.QA) {
            if (resultString) resultString += ' | ';
            resultString += `${this.QA}${this.unit[0]} QA`;
        }

        if (this.others) {
            if (resultString) resultString += ' | ';
            resultString += `${this.others}${this.unit[0]} Other`
        };

        return resultString;
    }
}

module.exports = EstimationsClass;
