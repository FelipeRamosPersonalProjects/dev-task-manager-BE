const Request = require('@models/RequestAPI');
const { FS } = require('@src/services');

const bodySchema = {
    path: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        default: {}
    }
};

module.exports = async (req, res) => {
    try {
        const request = new Request(req, bodySchema);
        const body = request.getBody();

        if (!FS.isExist('src/www/' + body.path + '/index.js')) {
            throw new Error.Log({
                status: 404,
                name: 'COMPONENT_NOT_FOUND',
                message: `The component path "${body.path}" doesn't exist!`
            });
        }

        const Component = require('@www/' + body.path);
        const component = new Component(body.data);

        if (component instanceof Error.Log) {
            throw component;
        }

        const stringComponent = component.renderToString();

        if (stringComponent) {
            res.status(200).send(stringComponent.toSuccess());
        } else {
            throw new Error.Log({
                name: 'RENDER_ERROR',
                message: `An error occured when redering the compoenent "${body.path}" path!`
            });
        }
    } catch (err) {
        const error = new Error.Log(err);
        return res.status(error.status || 500).send(error.toJSON());
    }
}