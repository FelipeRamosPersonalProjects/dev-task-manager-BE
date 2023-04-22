const CRUD = require('@CRUD');

function getTicketIdFromURL(url) {
    const slittedURL = url.split('/');
    return slittedURL[slittedURL.length - 1];
}

async function preSave(next) {
    this.taskID = getTicketIdFromURL(this.taskURL);
    return next();
}

async function preUpdate(next) {
    const $inc = this._update.$inc;
    if ($inc && $inc.taskVersion) {
        const updated = await CRUD.update({collectionName: 'pull_requests', filter: {
            task: this.getFilter()._id,
            prStage: { $ne: 'initialized' }
        }, type: 'many', data: { isCurrentVersion: false }});
    }

    next();
}

module.exports = {
    preSave,
    preUpdate
}
