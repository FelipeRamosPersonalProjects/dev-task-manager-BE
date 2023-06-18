function getTicketIdFromURL(url) {
    const slittedURL = url.split('/');
    return slittedURL[slittedURL.length - 1];
}

async function preSave(next) {
    this.externalKey = getTicketIdFromURL(this.externalURL);
    return next();
}

module.exports = {
    preSave
}
