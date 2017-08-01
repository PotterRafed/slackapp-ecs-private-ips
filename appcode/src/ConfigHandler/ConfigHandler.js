const DEFAULT_PORT = 80;
const PARAMS_LOCATION = './config/config.yml';

var _config = require('yaml-config').readConfig(PARAMS_LOCATION);

var getPort = function()
{
    if (_config.port !== undefined) {
        return _config.port;
    } else {
        return DEFAULT_PORT;
    }
};

var getParameterSetting = function (param, setting)
{
    try {
        return _config["parameters"][param][setting];
    } catch (error) {
        return '';
    }
};

var getAWSCredentials = function (awsEnvironment) {

    if (awsEnvironment === undefined || awsEnvironment === '') {
        throw new Error('No environment specified');
    }

    try {
        var key = _config["aws"][awsEnvironment]["key"];
        var secret = _config["aws"][awsEnvironment]["secret"];

    } catch (error) {
        throw new Error("Could not get AWS credentials for environment '" + awsEnvironment + "'");
    }

    return {
        "key": key,
        "secret": secret
    }
};

var getSlackCredentials = function () {

    try {
        var clientId = _config.slack.clientId;
        var clientSecret = _config.slack.clientSecret;
    } catch (error) {
        throw new Error('Could not find Slack APP credentials');
    }

    return {
        "clientId": clientId,
        "clientSecret": clientSecret
    }
};

module.exports = {
    getAWSCredentials: getAWSCredentials,
    getParameterSetting: getParameterSetting,
    getSlackCredentials: getSlackCredentials,
    getPort: getPort
};

