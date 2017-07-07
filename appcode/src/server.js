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

// App

var requestNo = 1;
var port = appconfig.getPort();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port);
console.log('Running on http://localhost:' + port);

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

app.post('/button-response', function (req, res) {
    res.header('Content-Type', 'application/json');
    console.log("Button-Response:");

    // var params = new CommandParams(req.body.text);
    var params = new CommandParams('');


    params.getParam('region').setDefaultValue(defaultRegion);
    params.getParam('cluster').setDefaultValue(req.body.channel_name);

    var credentials = appconfig.awsCredentials(params.getParam('env').getValue());

    res.send('');

    var ecsIps = new EcsIps(
        credentials.key,
        credentials.secret,
        params.getParam('region').getValue(),
        params.getParam('cluster').getValue()
    );

    var reqData = JSON.parse(req.body.payload);
    console.log(reqData);
    // console.log(((reqData.actions)[0].selected_options)[0].value);

    if (reqData.callback_id === 'cluster_selection') {
        //Response generator


        ecsIps.getServices(((reqData.actions)[0].selected_options)[0].value).then(function (services) {

            var servicesOptions = [];

            services.forEach(function(service) {
                servicesOptions.push({
                    "text": service,
                    "value": service
                });
            });

            var responseBody =
                {
                    "attachments": [
                        {
                            "text": "Select a service",
                            "fallback": "Error: was not able to select a cluster",
                            "callback_id": "service_selection",
                            "attachment_type": "default",
                            "actions" : [
                                {
                                    "name": "Services list",
                                    "text": "Pick a service...",
                                    "type": "select",
                                    "options": servicesOptions
                                }
                            ]
                        }
                    ]
                };
            request.post(
                reqData.response_url,
                {
                    'body': JSON.stringify(responseBody)
                },
                function (error, response, body) {
                    if (error) {
                        console.log(error);
                    }
                }
            );
        });

    } else if (reqData.callback_id === 'service_selection') {

    }



});

app.post('/aws-get-ips', function (req, res) {

    res.header('Content-Type', 'application/json');
    console.log(" ++++++++++++++++++ Processing request #" + requestNo + " +++++++++++++++++ From user: " + req.body.user_name);
    console.log("Request:");
    console.log(req.body);

    try {
        // var params = new CommandParams(req.body.text);
        var params = new CommandParams('');


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

    res.send('');
        // {
            // "text": "Getting IPs for Cluster: '" +  params.getParam('cluster').getValue() + "', Env:'" + params.getParam('env').getValue() + "', Region: '" + params.getParam('region').getValue() + "'. [ _" + req.body.command + " " + req.body.text + "_ ]"
        // }
    // );




    console.log("Running with settings:");
    console.log(params);

    var ecsIps = new EcsIps(
        credentials.key,
        credentials.secret,
        params.getParam('region').getValue(),
        params.getParam('cluster').getValue()
    );

    ecsIps.getClusters().then(function(clusters) {


        //Message builder
        var actions = [];
        var action = {};

        action.name = "Clusters List";
        action.text = "Pick a cluster...";
        action.type = "select";

        var options = [];
        clusters.forEach(function(cluster) {
            var option = {};
            option.text = cluster;
            option.value = cluster;
            options.push(option);

        });

        action.options = options;
        actions.push(action);

        console.log(actions);

        var responseBody =
            {
                "attachments": [
                {
                    "text": "Select a cluster",
                    "fallback": "Error: was not able to select a cluster",
                    "callback_id": "cluster_selection",
                    "attachment_type": "default",
                    "actions" : actions
                }
            ]
        };

        console.log(JSON.stringify(responseBody));

        request.post(
                    req.body.response_url,
                    {
                        'body': JSON.stringify(responseBody)
                    },
                    function (error, response, body) {
                        if (error) {
                            console.log(error);
                        }
                    }
                );

    });

    // ecsIps.get().then(function(result) {
    //
    //     request.post(
    //         req.body.response_url,
    //         {
    //             json: {
    //                 "response_type": "in_channel",
    //                 "text": "Cluster: *'" +  params.getParam('cluster').getValue() + "'*, Env: *'" + params.getParam('env').getValue() + "'*, Region: *'" + params.getParam('region').getValue() + "'* is running on: *" + result + "*. [ _" + req.body.command + " " + req.body.text + "_ ]"
    //             }
    //         },
    //
    //         function (error, response, body) {
    //             if (error) {
    //                 console.log(error);
    //             }
    //         }
    //     );
    //     console.log(" ------------------- Finished request #"+ requestNo + " ---------------------" );
    //     requestNo++;
    // }).catch(function(reason) {
    //     request.post(
    //         req.body.response_url,
    //         {
    //             json: {
    //                 "text": "Could not retrieve IPs: " + reason
    //             }
    //         },
    //
    //         function (error, response, body) {
    //             if (error) {
    //                 console.log(error);
    //             }
    //         }
    //     );
    //     console.log(" -------------------- Finished request #"+ requestNo + " ---------------------" );
    //     requestNo++;
    // });

    ecsIps = null;
});

