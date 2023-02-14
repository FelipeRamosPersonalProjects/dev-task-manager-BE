const Utils = require('../utils');
const ResourceCenter = require('./Resources');
const validation = require('../validation');
const ErrorLog = require('../models/logs/ErrorLog');
const configs = require('../../config.json');

// Resources
global.Resource = new ResourceCenter(configs.defaultLanguage);

// Declarations
global.Error.Log = ErrorLog;
// Utils
Boolean.isValid = validation.base.build;
Date.calcTimestamp = Utils.calcTimestamp;
Date.getStringDate = Utils.getStringDate;
