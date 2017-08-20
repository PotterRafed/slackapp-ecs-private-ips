const PARAM_DELIM = ':::';
const VALUE_DELIM = ":=";

var CallbackId = function (callbackIdString) {

    this.params = {};

    if (callbackIdString !== undefined && callbackIdString !== '') {
        (callbackIdString.split(PARAM_DELIM)).forEach(function(paramValuePairString) {
            var paramValueArray = paramValuePairString.split(VALUE_DELIM);
            this.addParam(paramValueArray[0], paramValueArray[1]);
        }.bind(this));
    }
};

CallbackId.prototype.addParam = function(name, value) {
    this.params[name] = value;
};

CallbackId.prototype.getValue = function(paramName) {
    if (this.params.hasOwnProperty(paramName)) {
        return this.params[paramName];
    }
};

CallbackId.prototype.toString = function() {
    var callbackIdString = '';
    for (var paramName in this.params) {
        if (this.params.hasOwnProperty(paramName)) {
            if (callbackIdString !== '') {
                callbackIdString += PARAM_DELIM;
            }
            callbackIdString += paramName + VALUE_DELIM + this.params[paramName]
        }
    }
    return callbackIdString;
};

module.exports = CallbackId;
