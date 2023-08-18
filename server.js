require('module-alias/register');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const cors = require('cors');
const fs = require('fs');
const Config = require('@config');
const SocketServer = require('@services/SocketServer');

// Declaring globals
require('./src/global');

// Initializing MongoDB
require('@services/database/init').then(async () => {
    // Importing Routes
    const routes = require('./src/routes');
    const { execSync } = require('child_process');

    // Compiling frontend code
    const compile = execSync('npm run build');
    // Printiting webpack compile result
    console.log(compile.toString());

    // Configuring server
    app.use(cors());
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(express.json());
    app.use(express.static('./src/www/static'));
    app.use(session({
        secret: process.env.API_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: Config.sessionMaxAge }
    }));

    // API routes
    app.use('/auth', routes.auth);
    app.use('/collection', routes.collection);
    app.use('/components', routes.components);
    app.use('/pulls', routes.pulls);
    app.use('/repositories', routes.repositories);

    // Front-end routes
    app.get('/', (req, res) => res.redirect('/dashboard'));
    app.get('/dashboard', routes.pages.dashboard);
    app.use('/tickets', routes.pages.ticket);
    app.use('/tasks', routes.pages.tasks);
    app.use('/estimations', routes.pages.estimations);
    app.use('/pullrequests', routes.pages.pullrequests);
    app.use('/validations', routes.pages.validations);
    app.use('/projects', routes.pages.projects);
    app.use('/repos', routes.pages.repos);
    app.use('/spaces', routes.pages.spaces);
    app.use('/templates', routes.pages.templates);
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
    
    // Initializing socket server
    global.socketServer = new SocketServer({ hosts: ['http://192.168.15.54'] });
}).catch(err => {
    throw err;
});
