var config = require('config');

var awsCredentials = function (awsEnvironment) {

    if (awsEnvironment == undefined || awsEnvironment == '') {
        awsEnvironment = 'default';
    }

    var key = '';
    if (config.has("aws.credentials."+awsEnvironment+".key")) {
        key = config.get("aws.credentials."+awsEnvironment+".key")
    }
    var secret = '';
    if (config.has("aws.credentials."+awsEnvironment+".secret")) {
        secret = config.get("aws.credentials."+awsEnvironment+".secret")
    }

    if (key =='' || secret == '') {
        throw new Error('Error: "key" or "secret" for AWS environment "' + awsEnvironment + '" has not been found. Please make sure they are set in config/default.json');
    }

    return {
        "key": key,
        "secret": secret
    }
};

var awsDefaultRegion = function() {
    if (config.has("aws.default-region")) {
        return config.get("aws.default-region");
    } else {
        throw new Error('Default region not found. Please set a "default-region" under "aws" config in config/default.json');
    }
};

module.exports = {
    awsCredentials: awsCredentials,
    awsDefaultRegion: awsDefaultRegion
}