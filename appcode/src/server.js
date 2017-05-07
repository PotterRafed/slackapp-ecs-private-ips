'use strict';

const express = require('express');
const appconfig = require('./appconfig.js');
const commandParams = require('./commandParams.js');
var EcsIps = require('./EcsIps.js');
var request = require('request');
var bodyParser = require('body-parser');

const defaultRegion = appconfig.awsDefaultRegion();
const slackCredentials = appconfig.slackCredentials();

// Constants
const PORT = 8091;

// App

var requestNo = 1;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

// var text = '--region="myregion"';
// var cn = 'hardcoded-channel-name';
//
// var params = commandParams.extractParams(text, cn);
//
// console.log(params);

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

    var params = commandParams.extractParams(req.body.text, req.body.channel_name);

    res.header('Content-Type', 'application/json');
    res.send(
        {
            "text": "Getting IPs for Cluster: '" +  params.cluster + "', Env:'" + params.env + "', Region: '" + params.region + "'"
        }
    );

    console.log(" ++++++++++++++++++ Processing request #" + requestNo + " +++++++++++++++++ From user: " + req.body.user_name);
    console.log(req.body);
    console.log("Running with settings: " + params.cluster + ", " + params.env + ", " + params.region);


    try {
        var credentials = appconfig.awsCredentials(params.env);
    } catch (ex) {
        console.log(ex.message);
    }

    var ecsIps = new EcsIps(
        credentials.key,
        credentials.secret,
        params.region,
        params.cluster
    );

    ecsIps.get().then(function(result) {

        request.post(
            req.body.response_url,
            {
                json: {
                    "response_type": "in_channel",
                    "text": "CLUSTER: '" +  params.cluster + "', ENV: '" + params.env + "', REGION: '" + params.region + "' is running on: " + result
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
        console.log(" ----- Finished request #"+ requestNo + " ------" );
        requestNo++;
    });

    ecsIps = null;
});

