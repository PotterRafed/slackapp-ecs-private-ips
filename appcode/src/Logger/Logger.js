
var _consoleLogger = require('./Type/ConsoleLogger.js');

var _logRequest = function (req) {

    _consoleLogger.write(" ++++++++++++++++++ Received Request +++++++++++++++++ ");
    _consoleLogger.write(req.body);
};

module.exports = {
    logRequest: _logRequest
};

