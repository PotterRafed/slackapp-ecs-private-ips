'use strict';

const express = require('express');

var appconfig = require('./appconfig.js');

var defaultRegion = appconfig.awsDefaultRegion();

var EcsIps = require('./EcsIps.js');

// Constants
const PORT = 80;

// App
const app = express();

app.get('/', function (req, res) {

    var awsEnv = 'staging';
    var clusterName = 'test-order-broker';
    var region = defaultRegion;

    try {
        var credentials = appconfig.awsCredentials(awsEnv);
    } catch (ex) {
        console.log(ex.message);
    }

    var ecsIps = new EcsIps(
        credentials.key,
        credentials.secret,
        region,
        clusterName
    );

    // return res.write("test");

    ecsIps.get().then(function(result) {
        return res.send(result);
    });


});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
