const ajax = require('./ajax');
const ResourceCenter = require('../resources/Resources');
const validation = require('../validation');
const ErrorLog = require('../models/logs/ErrorLog');
const configs = require('../../config.json');

global.ajax = ajax;
// Resources
global.Resource = new ResourceCenter(configs.defaultLanguage);

// Declarations
global.Error.Log = ErrorLog;
// Utils
Boolean.isValid = validation.base.build;
