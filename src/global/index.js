const ajax = require('./ajax');
const ResourceCenter = require('../resources/Resources');
const validation = require('../validation');
const ErrorLog = require('../models/logs/ErrorLog');
const configs = require('../../config.json');
const ToolsCLI = require('../interface/CLI/ToolsCLI');
const toolsCLI = new ToolsCLI();

global.ajax = ajax;
// Resources
global.Resource = new ResourceCenter(configs.defaultLanguage);
global.toolsCLI = toolsCLI;

// Declarations
global.Error.Log = ErrorLog;
// Utils
Boolean.isValid = validation.base.build;
global.isObjectID = validation.base.ValidationBase.isObjectID;
