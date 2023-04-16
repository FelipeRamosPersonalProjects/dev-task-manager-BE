function getTicketIdFromURL(url) {
    const slittedURL = url.split('/');
    return slittedURL[slittedURL.length - 1];
}

async function preSave(next) {
    this.taskID = getTicketIdFromURL(this.taskURL);
    return next();
}

module.exports = {
    preSave
}
