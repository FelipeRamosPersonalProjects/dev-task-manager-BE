const SignIn = require('@src/www/user/signin/index');

module.exports = async (req, res) => {
    const content = new SignIn();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
