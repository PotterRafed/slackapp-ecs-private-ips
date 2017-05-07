const appconfig = require('./appconfig.js');

const defaultEnv = 'staging';
const defaultRegion = appconfig.awsDefaultRegion();

const availableParams = [
    {
        'paramName': 'cluster',
        'fullCommand': '--cluster',
        'shortCommand': '-c',
        'required': false,
        'defaultValue' : ''
    },
    {
        'paramName': 'region',
        'fullCommand': '--region',
        'shortCommand': '-r',
        'required': false,
        'defaultValue' : defaultRegion
    },
    {
        'paramName': 'env',
        'fullCommand': '--env',
        'shortCommand': '-e',
        'required': false,
        'defaultValue' : defaultEnv
    }
];

function extractParams(commandText, defaultCluster) {

    var returnObject = [];
    availableParams.forEach(function(param) {

        if (param.paramName === 'cluster') {
            param.defaultValue = defaultCluster;
        }

        var match = commandText.match(param.fullCommand+'="(.*?)"');
        var value = param.defaultValue;
        if (match !== null) {
            value = match[1];
        } else {
            //Try with the short command
            match = commandText.match(param.shortCommand+'="(.*?)"');
            if (match !== null) {
                value = match[1];
            }
        }
        param.value = value;
        var obj = {};
        obj[param.paramName] = value;

        returnObject.push(obj);
    });

    return returnObject;
}

module.exports = {
    extractParams: extractParams
}