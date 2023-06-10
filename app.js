const express = require('express');
const app = express();
// const cors = require('cors');

// Declaring globals
// require('./src/global');
// Initializing MongoDB
// require('./src/services/database/init');

// Importing Routes
// const routes = require('./src/routes');

// Configuring server
app.use(express.static('public'));
// app.use(cors());
// app.use(express.json());

// Server routes
// app.use('/collection', routes.collection);

module.exports = app;
