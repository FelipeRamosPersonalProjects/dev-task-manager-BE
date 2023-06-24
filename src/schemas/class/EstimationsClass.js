const Estimation = require('../../models/collections/Estimation');

class EstimationsClass {
    static Model = Estimation;
    
    get frontURL() {
        return `/estimations/read-edit/${this.index}`;
    }
}

module.exports = EstimationsClass;
