require('module-alias/register');

const express = require('express');
const https = require('https');
const app = express();
const cors = require('cors');
const fs = require('fs');

// Declaring globals
require('./src/global');

// Initializing MongoDB
require('@services/database/init').then(async () => {
    // Importing Routes
    const routes = require('./src/routes');

    // Configuring server
    app.use(cors());
    app.use(express.json());

    // Server routes
    app.use('/auth', routes.auth);
    app.use('/collection', routes.collection);
    app.use('/user', routes.pages.user);
    app.get('/health-check', async (req, res) => {
        res.status(200).end('API Health: OK');
    });

    if (process.env.ENV_NAME === 'STG' || process.env.ENV_NAME === 'PROD') {
        const SSL_KEY = fs.readFileSync(__dirname + '/cert/ca.key');
        const SSL_CERT = fs.readFileSync(__dirname + '/cert/ca.crt');

        if (SSL_KEY && SSL_CERT) {
            const options = {
                key: SSL_KEY,
                cert: SSL_CERT
            };

            https.createServer(options, app).listen(Number(process.env.PORT_HTTPS), () => {
                console.log(`Server listening on port ${process.env.PORT_HTTPS}`);
            });
        } else {
            throw new Error.Log({
                name: 'SSLCertificateNotFound',
                message: `The SSL certificate wasn't found on the directory!`
            });
        }
    } else {
        app.listen(Number(process.env.PORT_HTTP), ()=>{
            console.log('Server connected in http://localhost:80');
        });
    }
}).catch(err => {
    throw err;
});
