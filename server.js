require('module-alias/register');

const express = require('express');
const session = require('express-session');
const https = require('https');
const app = express();
const cors = require('cors');
const fs = require('fs');
const Config = require('@config');

// Declaring globals
require('./src/global');

// Initializing MongoDB
require('@services/database/init').then(async () => {
    // Importing Routes
    const routes = require('./src/routes');

    // Configuring server
    app.use(cors());
    app.use(express.json());
    app.use(session({
        secret: process.env.API_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: Config.sessionMaxAge }
    }));

    // API routes
    app.use('/auth', routes.auth);
    app.use('/collection', routes.collection);

    // Front-end routes
    app.get('/dashboard', routes.pages.dashboard);
    app.use('/ticket', routes.pages.ticket);
    app.use('/user', routes.pages.user);

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
