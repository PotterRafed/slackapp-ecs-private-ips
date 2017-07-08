const _availableParams = [
    'cluster', 'env', 'region', 'service'
];

var CommandParams = function(commandText) {
    this._commandText = commandText;
    this._parameters = {};

    _availableParams.forEach(function (paramName) {

        var parameter = new (require('./parameter/' + paramName));

        var match = this._commandText.match(parameter.getFullCommand() + '="(.*?)"');

        if (match !== null) {
            parameter.setValue(match[1]);
        } else {
            //Try with the short command
            match = this._commandText.match(parameter.getShortCommand() + '="(.*?)"');
            if (match !== null) {
                parameter.setValue(match[1]);
            } else {
                //If the parameter is not found but is required throw an exception
                if (parameter.isRequired()) {
                    throw new Error("Parameter '" + parameter.getName() + "' is required.");
                }
            }
        }
        this._parameters[paramName] = parameter;

    }.bind(this));
};

CommandParams.prototype.getParam = function (parameterName) {
    if (this._parameters.hasOwnProperty(parameterName)) {
        return this._parameters[parameterName];
    }
};

module.exports = CommandParams;