const config = require('../ConfigHandler/ConfigHandler.js');
var EcsIps = require('../EcsIps.js');
var Request = require('request');

var ParameterHandler = require('../ConfigHandler/ParameterHandler');

var InteractiveResponseController = function(req, res) {
    this._req = req;
    this._res = res;
    this.ParamHandler = new ParameterHandler();
    this.handle();
};

InteractiveResponseController.prototype.handle = function ()
{
    this._res.header('Content-Type', 'application/json');

    var reqData = JSON.parse(this._req.body.payload);

    var paramsText = (reqData.callback_id).replace(/.*:::text:\=/g, '');
    this.ParamHandler.initParams(paramsText);

    var AWSCredentials = config.getAWSCredentials(this.ParamHandler.getParam('env').getValue());

    this._res.send('Loading...');

    var ecsIps = new EcsIps(
        AWSCredentials.key,
        AWSCredentials.secret,
        this.ParamHandler.getParam('region').getValue()
    );

    if (reqData.callback_id.includes('cluster_selection'))
    {
        //Response generator

        var selectedCluster = ((reqData.actions)[0].selected_options)[0].value;
        ecsIps.getServices(selectedCluster)
            .then(function(servicesList) {

                var servicesOptions = [];

                servicesList.forEach(function (serviceResult) {
                    servicesOptions.push({
                        "text": serviceResult,
                        "value": serviceResult
                    });
                });

                var responseBody =
                    {
                        "attachments": [
                            {
                                "text": "Select a service",
                                "fallback": "Error: was not able to select a cluster",
                                "callback_id": selectedCluster + ":::service_selection:::text:=" + paramsText,
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
                Request.post(
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

            })
            .catch(function(reason) {
                    Request.post(
                        reqData.response_url,
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
                    console.log(reason);
                    console.log(" -------------------- Finished request ---------------------" );
            });

    } else if (reqData.callback_id.includes(':::service_selection')) {

        var cluster = reqData.callback_id.substr(0, reqData.callback_id.indexOf(":::"));
        var service = ((reqData.actions)[0].selected_options)[0].value;

        console.log("Getting IPs for service '" + service + "'");

        //TODO: PUT IN A CLASS - DUPLICATED
        ecsIps.getIPs(cluster, service)
            .then(function (IPs) {
                Request.post(
                    reqData.response_url,
                    {
                        json: {
                            "response_type": "in_channel",
                            "text": "Cluster: *'" + cluster + "'*, Service: *'" + service + "'* is running on: *" + IPs + "*."
                        }
                    },

                    function (error, response, body) {
                        if (error) {
                            console.log(error);
                        }
                    }
                );
                console.log(" ------------------- Finished request ---------------------" );

            })
            .catch(function(reason) {
                Request.post(
                    reqData.response_url,
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
                console.log(" -------------------- Finished request ---------------------" );
            });
    }
};

module.exports = InteractiveResponseController;


