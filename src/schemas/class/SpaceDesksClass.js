const SpaceDesk = require('../../models/collections/SpaceDesk');

class SpaceDesksClass {
    static Model = SpaceDesk;

    get displayName() {
        return this.spaceName;
    }

    get frontURL() {
        return `/spaces/read-edit/${this.index}`;
    }
}

module.exports = SpaceDesksClass;
