const APPCONFIG_LOCATION = './config/app.yml';

var _config = require('yaml-config');
var Parameter = require('./Parameter');
var paramsConfig = require('../ConfigHandler/ConfigHandler.js');

/**
 * Registers the available commands by reading the app configuration
 * @constructor
 */
var ParameterHandler = function() {

    var settings = _config.readConfig(APPCONFIG_LOCATION);

    if (settings.parameters === undefined) {
        return;
    }

    this.parameters = {};
    this.rawCommandText = '';

    (settings.parameters).forEach(function (paramConfig) {
        var param = new Parameter(paramConfig);
        param.setDefaultValue(paramsConfig.getParameterSetting(param.getName(), 'defaultValue'));
        this.parameters[param.getName()] = param;

    }.bind(this));
};

ParameterHandler.prototype.getRawCommandText = function () {
    return this.rawCommandText;
};

/**
 * Initialises parameter values by reading a command-line text input and
 * checking against registered commands
 *
 * @param commandText
 */
ParameterHandler.prototype.initParams = function (commandText) {

    this.rawCommandText = commandText;

    for (var paramName in this.parameters) {
        if (this.parameters.hasOwnProperty(paramName)) {
            var parameter = this.parameters[paramName];

            var match = commandText.match(parameter.getFullCommand() + '="(.*?)"');

            if (match !== null) {
                parameter.setValue(match[1]);
            } else {
                //Try with the short command
                match = commandText.match(parameter.getShortCommand() + '="(.*?)"');
                if (match !== null) {
                    parameter.setValue(match[1]);
                }
            }
            //Check if the parameter is required and it's value is not null
            if (parameter.isRequired() && parameter.getValue() === '') {
                throw new Error("Parameter '" + parameter.getName() + "' is required and there is no default value set.");
            }
        }
    }
};

/**
 * Returns a parameter object by name
 * @param parameterName - name of the parameter requested
 * @returns Parameter {*}
 */
ParameterHandler.prototype.getParam = function (parameterName) {
    if (this.parameters.hasOwnProperty(parameterName)) {
        return this.parameters[parameterName];
    }
};

ParameterHandler.prototype.getAllParams = function () {
    var allParams = {};
    for (var paramName in this.parameters) {
        if (this.parameters.hasOwnProperty(paramName)) {
            allParams[paramName] = (this.parameters[paramName]).getValue();
        }
    }
    return allParams;
};

module.exports = ParameterHandler;