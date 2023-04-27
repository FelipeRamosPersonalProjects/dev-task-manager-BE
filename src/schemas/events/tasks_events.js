const CRUD = require('@CRUD');

function getTaskIdFromURL(url) {
    const slittedURL = url.split('/');
    return slittedURL[slittedURL.length - 1];
}

async function preSave(next) {
    this.taskID = getTaskIdFromURL(this.taskURL);
    return next();
}

async function preUpdate(next) {
    const $inc = this._update.$inc;

    try {
        if ($inc && $inc.taskVersion) {
            const updated = await CRUD.update({collectionName: 'pull_requests', filter: {
                task: this.getFilter()._id,
                prStage: { $ne: 'initialized' }
            }, type: 'many', data: { isCurrentVersion: false }});
    
            if (updated instanceof Error.Log) {
                throw updated;
            }
        }

        next();
    } catch (err) {
        throw new Error.Log(err);   
    }
}

module.exports = {
    preSave,
    preUpdate
}
