function getObjectPath(obj, path) {
    try {
        let parsedPath = path;

        if (typeof path === 'string') {
            parsedPath = path.split('.');
        }

        if (Array.isArray(parsedPath)) {
            parsedPath.map(key => (obj = obj && obj[key]));
        } else {
            return;
        }

        return obj;
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = {
    getObjectPath
};
