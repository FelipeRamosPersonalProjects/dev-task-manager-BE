const ScreenHelperCLI = require('./screen');

module.exports = {
    screen: (() => new ScreenHelperCLI())()
}
