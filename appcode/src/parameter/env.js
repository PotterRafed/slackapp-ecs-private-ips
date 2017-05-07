
var _name = 'env';
var _fullCommand = '--env';
var _shortCommand = '-e';
var _required = false;
var _defaultValue = '';
var _value = 'staging';

var Parameter = function() {
    this.required = _required;
    this.defaultValue = _defaultValue;
    this.value = _value;
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

Parameter.prototype.isRequired = function () {
    return this.required;
};

Parameter.prototype.setRequired = function (isRequired) {
    this.required = isRequired;
};

Parameter.prototype.getDefaultValue = function () {
    return this.defaultValue;
};

Parameter.prototype.setDefaultValue = function (defaultValue) {
    this.defaultValue = defaultValue
};

Parameter.prototype.getValue = function () {
    if (this.value !== '') {
        return this.value;
    }

    return this.defaultValue;
};

Parameter.prototype.setValue = function (value) {
    this.value = value
};

module.exports = Parameter;