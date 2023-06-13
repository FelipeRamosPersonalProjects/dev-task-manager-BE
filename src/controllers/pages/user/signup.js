const SignUp = require('@src/www/user/signup/index');

module.exports = async (req, res) => {
    const content = new SignUp();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content.renderToString());
}
