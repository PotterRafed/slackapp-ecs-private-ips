
var _name = 'service';
var _fullCommand = '--service';
var _shortCommand = '-s';
var _required = false;
var _defaultValue = '';
var _value = '';

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