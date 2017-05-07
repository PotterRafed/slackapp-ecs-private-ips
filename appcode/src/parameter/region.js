
var _name = 'region';
var _fullCommand = '--region';
var _shortCommand = '-r';
var _required = false;
var _defaultValue = '';


var Parameter = function() {
};

Parameter.prototype.getName = function () {
    return _name;
};

Parameter.prototype.getFullCommand = function () {
    return _fullCommand;
};

Parameter.prototype.getShortCommand = function () {
    return _shortCommand;
};

Parameter.prototype.getRequired = function () {
    return _required;
};

Parameter.prototype.setRequired = function (isRequired) {
    _required = isRequired;
};

Parameter.prototype.getDefaultValue = function () {
    return _defaultValue;
};

Parameter.prototype.setDefaultValue = function (defaultValue) {
    _defaultValue = defaultValue
};

module.exports = Parameter;