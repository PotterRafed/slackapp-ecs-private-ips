
var _consoleLogger = require('./Type/ConsoleLogger.js');

var _logRequest = function (req) {

    _consoleLogger.write(" ++++++++++++++++++ Received Request +++++++++++++++++ ");
    if (req.body.payload === undefined ) {
        _consoleLogger.write(req.body);
    } else {
        _consoleLogger.write(JSON.parse(req.body.payload));
    }
};

module.exports = {
    logRequest: _logRequest
};

