const ajax = require('./ajax');
const ResourceCenter = require('../resources/Resources');
const validation = require('../validation');
const ErrorLog = require('../models/logs/ErrorLog');
const configs = require('@config');
const ToolsCLI = require('../interface/CLI/ToolsCLI');
const toolsCLI = new ToolsCLI();
const Success = require('@SUCCESS');
const utils = require('@UTILS');

global.ajax = ajax;
// Resources
global.Resource = new ResourceCenter(configs.defaultLanguage);
global.toolsCLI = toolsCLI;

// Declarations
global.Error.Log = ErrorLog;
// Utils
Boolean.isValid = validation.base.build;

/**
 * @method oid
 * @description Method that evaluate if the provided object on "Object(objectToEval)" is a mongoose ObjectID or not. 
 * @returns {boolean}
 */
Object.prototype.oid = function(toValue) {
    const isValid = validation.base.ValidationBase.isObjectID(this);

    if (toValue) {
        return isValid ? this.valueOf() : {};
    } else {
        return isValid;
    }
}

Object.prototype.toSuccess = function(message) {
    return new Success(this.valueOf(), message);
}

/**
 * @method prototype.getPath
 * 
 * @description Method that that safely gets the values of an object property without throw errors bay an undefined path.
 * @param {string|array<string>} path - Can be a string path for the object property with each property separated by a ".", or can be an array of string where each string is a path.
 * @returns {*} - Anything that can be stored on the provided path
 */
Object.prototype.getSafe = function(path, obj) {
    return utils.getObjectPath(obj || this, path);
}

String.prototype.toCamelCase = function() {
    return this.valueOf().replace(/[-_ ](.)/g, (_, char) => char.toUpperCase()).replace(/^(.)/, (_, char) => char.toUpperCase());
}

global.isObjectID = validation.base.ValidationBase.isObjectID;
global.isCompleteDoc = validation.base.ValidationBase.isCompleteDoc;
