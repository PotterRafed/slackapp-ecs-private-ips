/**
 * Creates a parameter
 *
 * @param paramConfig - parameter configuration, see below for structure
 * {
 *    'name' - the name of the parameter (required)
 *    'fullCommand' - the full-syntax of the parameter e.g. "--region" (required)
 *    'shortCommand' - the short-syntax of the parameter e.g. "-r" (required)
 *    'required' - boolean indicating if this parameter is required or not (optional, default: false)
 *    'defaultValue': default value for this parameter (optional, default: '')
 * }
 * @constructor
 */
var Parameter = function(paramConfig) {
    this.required = (paramConfig.required !== undefined) ? paramConfig.required : false;
    this.defaultValue = (paramConfig.defaultValue !== undefined) ? paramConfig.defaultValue : '';
    this.value = undefined;

    if (paramConfig.name === undefined) {
        throw new Error("'name' was not provided in the 'paramConfig' while trying to create a Parameter object");
    }
    this.name = paramConfig.name;

    if (paramConfig.fullCommand === undefined) {
        throw new Error("'fullCommand' was not provided in the 'paramConfig' while trying to create a Parameter object");
    }
    this.fullCommand = paramConfig.fullCommand;

    if (paramConfig.shortCommand === undefined) {
        throw new Error("'shortCommand' was not provided in the 'paramConfig' while trying to create a Parameter object");
    }
    this.shortCommand = paramConfig.shortCommand;
};

/**
 * @returns {*}
 */
Parameter.prototype.getName = function () {
    return this.name;
};

/**
 * @returns {*}
 */
Parameter.prototype.getFullCommand = function () {
    return this.fullCommand;
};

/**
 * @returns {*}
 */
Parameter.prototype.getShortCommand = function () {
    return this.shortCommand;
};

/**
 * @returns {boolean|*}
 */
Parameter.prototype.isRequired = function () {
    return this.required;
};

/**
 * @param defaultValue
 */
Parameter.prototype.setDefaultValue = function (defaultValue) {
    this.defaultValue = defaultValue
};

/**
 * @returns {*}
 */
Parameter.prototype.getValue = function () {
    if (this.value !== undefined) {
        return this.value;
    }
    return this.defaultValue;
};

/**
 * @param value
 */
Parameter.prototype.setValue = function (value) {
    this.value = value
};

module.exports = Parameter;
