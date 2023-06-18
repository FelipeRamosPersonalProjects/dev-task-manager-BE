function getExternalKeyFromURL(url) {
    const slittedURL = url.split('/');
    return slittedURL[slittedURL.length - 1];
}

function getExternalURLFromKey(sessionUser, key) {
    const baseURL = new URL(sessionUser.jira.self);
    return `${baseURL.origin}/browse/${key}`;
}

async function preSave(next) {
    if (this.externalURL && !this.externalKey) {
        this.externalKey = getExternalKeyFromURL(this.externalURL);
    }

    if (this.externalKey && !this.externalURL) {
        this.externalURL = getExternalURLFromKey(this.raw.sessionUser, this.externalKey);
    }

    this.title = this.displayName;

    return next();
}

async function preUpdate() {
    if (this._update.externalURL) {
        this._update.externalKey = getExternalKeyFromURL(this._update.externalURL);
    } else if (this._update.externalKey) {
        this._update.externalURL = getExternalURLFromKey(this.raw.sessionUser, this._update.externalKey);
    }
}

module.exports = {
    preSave,
    preUpdate
}
