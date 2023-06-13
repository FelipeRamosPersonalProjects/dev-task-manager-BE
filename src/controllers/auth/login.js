const Request = require('@models/RequestAPI');
const User = require('@models/collections/User');

const bodySchema = {
    email: { type: String, required: true },
    password: { type: String, required: true }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const body = request.getBody();
        const user = await User.signIn(body.email, body.password);

        if (user instanceof Error.Log) {
            let status = 500;

            if (user.name === 'AUTH_INVALID_CREDENTIALS') {
                status = 401;
            }

            return res.status(status).send(user.toJSON());
        }

        const response = user.toPublic({token: user.token});
        return res.status(200).send(response.toSuccess().toJSON());
    } catch(err) {
        return res.status(500).send(new Error.Log(err).toJSON());
    }
}
