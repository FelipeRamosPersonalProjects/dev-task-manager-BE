const axios = require('axios');
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = (url, data) => {
    return {
        get: async (config, getAxiosResponse) => {
            try {
                const response = await axios.get(url, {
                    ...config,
                    data,
                    httpsAgent: agent
                });

                if (!getAxiosResponse) {
                    return response.data;
                }

                return response;
            } catch(err) {
                const errorRes = err && err.response;

                if (errorRes) {
                    throw new Error.Log({
                        status: errorRes.status,
                        name: errorRes.statusText,
                        message: errorRes.data ? errorRes.data.message : ''
                    });
                } else {
                    throw new Error.Log(err);
                }
            }
        }, 
        post: async (config, getAxiosResponse) => {
            try {
                const response = await axios.post(url, data, {
                    ...config,
                    httpsAgent: agent
                });

                if (!getAxiosResponse) {
                    return response.data;
                }

                return response;
            } catch(err) {
                throw new Error.Log(err);
            }
        },
        put: async (config, getAxiosResponse) => {
            try {
                const response = await axios.put(url, data, {
                    ...config,
                    httpsAgent: agent
                });

                if (!getAxiosResponse) {
                    return response.data;
                }

                return response;
            } catch(err) {
                throw new Error.Log(err);
            }
        },
        delete: async (config, getAxiosResponse) => {
            try {
                const response = await axios.delete(url, {
                    ...config,
                    data,
                    httpsAgent: agent
                });

                if (!getAxiosResponse) {
                    return response.data;
                }

                return new Error.Log(response);
            } catch(err) {
                throw new Error.Log(err);
            }
        }
    }
};
