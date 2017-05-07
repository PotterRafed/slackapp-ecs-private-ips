'use strict';

const express = require('express');
const appconfig = require('./appconfig.js');

var CommandParams = require('./CommandParams.js');
var EcsIps = require('./EcsIps.js');
var request = require('request');
var bodyParser = require('body-parser');

const defaultRegion = appconfig.awsDefaultRegion();
const defaultEnv = 'stag';
const slackCredentials = appconfig.slackCredentials();

// Constants
const PORT = 8091;

// App

var requestNo = 1;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

app.get('/', function(req, res) {

    res.send('Server is working! Path Hit: ' + req.url);
});

app.get('/oauth', function(req, res) {
    console.log(" +++++ Processing request #" + requestNo + " ------" );
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("There was no 'code' parameter passed ot the the /oauth endpoint.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access',
            qs: {
                code: req.query.code,
                client_id: slackCredentials.clientId,
                client_secret: slackCredentials.clientSecret
            },
            method: 'GET'

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
    console.log(" ----- Finished request #"+ requestNo + " ------" );
    requestNo++;
});

app.post('/aws-get-ips', function (req, res) {

    res.header('Content-Type', 'application/json');
    console.log(" ++++++++++++++++++ Processing request #" + requestNo + " +++++++++++++++++ From user: " + req.body.user_name);
    console.log("Request:");
    console.log(req.body);

    try {
        var params = new CommandParams(req.body.text);

        params.getParam('region').setDefaultValue(defaultRegion);
        params.getParam('cluster').setDefaultValue(req.body.channel_name);

        var credentials = appconfig.awsCredentials(params.getParam('env').getValue());

    } catch (ex) {
        res.send(
                {
                    "text": "Could not retrieve IPs: " + ex.message + ". [ _" + req.body.command + " " + req.body.text + "_ ]"
                }
        );
        console.log(ex.message);
        console.log(" -------------------- Finished request #"+ requestNo + " ---------------------" );
        requestNo++;
        return;
    }

    res.send(
        {
            "text": "Getting IPs for Cluster: '" +  params.getParam('cluster').getValue() + "', Env:'" + params.getParam('env').getValue() + "', Region: '" + params.getParam('region').getValue() + "'. [ _" + req.body.command + " " + req.body.text + "_ ]"
        }
    );




    console.log("Running with settings:");
    console.log(params);

    var ecsIps = new EcsIps(
        credentials.key,
        credentials.secret,
        params.getParam('region').getValue(),
        params.getParam('cluster').getValue()
    );

    ecsIps.get().then(function(result) {

        request.post(
            req.body.response_url,
            {
                json: {
                    "response_type": "in_channel",
                    "text": "Cluster: *'" +  params.getParam('cluster').getValue() + "'*, Env: *'" + params.getParam('env').getValue() + "'*, Region: *'" + params.getParam('region').getValue() + "'* is running on: *" + result + "*. [ _" + req.body.command + " " + req.body.text + "_ ]"
                }
            },

            function (error, response, body) {
                if (error) {
                    console.log(error);
                }
            }
        );
        console.log(" ------------------- Finished request #"+ requestNo + " ---------------------" );
        requestNo++;
    }).catch(function(reason) {
        request.post(
            req.body.response_url,
            {
                json: {
                    "text": "Could not retrieve IPs: " + reason
                }
            },

            function (error, response, body) {
                if (error) {
                    console.log(error);
                }
            }
        );
        console.log(" -------------------- Finished request #"+ requestNo + " ---------------------" );
        requestNo++;
    });

    ecsIps = null;
});

