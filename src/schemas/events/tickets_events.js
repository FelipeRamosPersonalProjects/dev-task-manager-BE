function getTicketIdFromURL(url) {
    const slittedURL = url.split('/');
    return slittedURL[slittedURL.length - 1];
}

async function preSave(next) {
    this.ticketID = getTicketIdFromURL(this.ticketURL);
    return next();
}

module.exports = {
    preSave
}
