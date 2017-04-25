const appconfig = require('./appconfig.js');

const defaultEnv = 'staging';
const defaultRegion = appconfig.awsDefaultRegion();

function extractFullyQualifiedParams(commandText, defaultCluster) {

    var clusterMatch = commandText.match('--cluster="(.*?)"');
    var cluster = defaultCluster;
    if (clusterMatch !== null) {
        cluster = clusterMatch[1];
    } else {
        //Try with a -c
        clusterMatch = commandText.match('-c="(.*?)"');
        if (clusterMatch !== null) {
            cluster = clusterMatch[1];
        }
    }

    var regionMatch = commandText.match('--region="(.*?)"');
    var region = defaultRegion;
    if (regionMatch !== null) {
        region = regionMatch[1];
    } else {
        //Try with a -c
        regionMatch = commandText.match('-r="(.*?)"');
        if (regionMatch !== null) {
            region = regionMatch[1];
        }
    }

    var envMatch = commandText.match('--env="(.*?)"');
    var env = defaultEnv;
    if (envMatch !== null) {
        env = envMatch[1];
    } else {
        //Try with a -c
        envMatch = commandText.match('-e="(.*?)"');
        if (envMatch !== null) {
            env = envMatch[1];
        }
    }

    return {
        'cluster' : cluster,
        'env' : env,
        'region' : region
    }
}

module.exports = {
    extractFullyQualifiedParams: extractFullyQualifiedParams
}