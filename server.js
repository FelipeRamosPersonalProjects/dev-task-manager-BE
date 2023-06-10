require('module-alias/register');
const app = require("./app.js");
 
require("greenlock-express").init({
    packageRoot: __dirname,

    // contact for security and critical bug notices
    configDir: "./greenlock.d",

    // whether or not to run at cloudscale
    cluster: false,

    maintainerEmail: 'felipe@feliperamos.info'
}).serve(app);
