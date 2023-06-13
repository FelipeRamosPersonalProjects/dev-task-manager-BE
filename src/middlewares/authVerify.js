const ErrorPage = require('@www/error');

module.exports = async (req, res, next) => {
    if (!req.session.currentUser) {
        res.setHeader('Content-Type', 'text/html');
        const errorPage = new ErrorPage({
            code: '401',
            name: 'AUTHENTICATION_REQUIRED',
            message: 'Endpoint protected by user authentication!'
        });

        return res.status(401).send(errorPage.renderToString());
    } else {
        return next();
    }
}
