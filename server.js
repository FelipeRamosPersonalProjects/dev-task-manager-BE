const express = require('express');
const app = express();
const cors = require('cors');

// Declaring globals
require('./src/core/globals');
// Initializing MongoDB
require('./src/services/database/init');

// Importing Routes
const routes = require('./src/routes');

// Configuring server
app.use(cors());
app.use(express.json());

// Server routes
app.use('/collection', routes.collection);
app.use('/projects', routes.projects);

app.listen(80, () => {
    console.log('Server connected in http://localhost:80');
});
