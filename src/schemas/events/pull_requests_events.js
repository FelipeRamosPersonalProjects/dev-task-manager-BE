async function preSave(next) {
    return next();
}

module.exports = {
    preSave
}
