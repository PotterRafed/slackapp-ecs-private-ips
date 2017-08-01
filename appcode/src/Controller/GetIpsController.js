const config = require('../ConfigHandler/ConfigHandler.js');
var EcsIps = require('../EcsIps.js');
var Request = require('request');

var ParameterHandler = require('../ConfigHandler/ParameterHandler');

var GetIpsController = function(req, res) {
    this._req = req;
    this._res = res;
    this.ParamHandler = new ParameterHandler();
    this.handle();
};

GetIpsController.prototype.handle = function ()
{
    this._res.header('Content-Type', 'application/json');

    try {
        var paramsText = (this._req.body.text === undefined) ? '' : this._req.body.text;

        this.ParamHandler.initParams(paramsText);

        var cluster = this.ParamHandler.getParam('cluster').getValue();
        var service = this.ParamHandler.getParam('service').getValue();
        var region = this.ParamHandler.getParam('region').getValue();
        var env = this.ParamHandler.getParam('env').getValue();

        var AWSCredentials = config.getAWSCredentials(env);

    } catch (ex) {
        this._res.send(
            {
                "text": "Could not retrieve IPs: " + ex.message
            }
        );
        console.log(ex.message);
        console.log(" -------------------- Finished request ---------------------" );
        return;
    }

    var ecsIps = new EcsIps(AWSCredentials.key, AWSCredentials.secret, region);

    if (service !== '' && cluster !== '') {
        //We've got all the info! Get the IPs and respond
        this._res.send({
                "text": "Getting IPs for Cluster: '" +  cluster + "', Service: '" +  service + "', Env:'" + env + "', Region: '" + region
            }
        );

        ecsIps.getIPs(cluster, service)
            .then(function (IPs) {

                Request.post(
                    this._req.body.response_url,
                    {
                        json: {
                            "response_type": "in_channel",
                            "text": "Cluster: *'" + cluster + "'*, Service: *'" + service + "'*, Env: *'" + env + "'*, Region: *'" + region + "'* is running on: *" + IPs + "*."
                        }
                    },

                    function (error, response, body) {
                        if (error) {
                            console.log(error);
                        }
                    }
                );
                console.log(" ------------------- Finished request ---------------------" );

        }.bind(this))
            .catch(function(reason) {
                Request.post(
                    this._req.body.response_url,
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
            }.bind(this));

    } else {
        //We are missing information.
        //Get a list of clusters so the user can select one
        this._res.send({
                "text": "Environment: *'" + env + "'*. Region: *'" + region + "'*"
            }
        );

        ecsIps.getClusters()
            .then(function(clusters) {

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

                var responseBody =
                    {
                        "attachments": [
                        {
                            "text": "Select a cluster",
                            "fallback": "Error: was not able to select a cluster",
                            "callback_id": "cluster_selection:::text:=" + this._req.body.text,
                            "attachment_type": "default",
                            "actions" : actions
                        }
                    ]
                };

                Request.post(
                            this._req.body.response_url,
                            {
                                'body': JSON.stringify(responseBody)
                            },
                            function (error, response, body) {
                                if (error) {
                                    console.log(error);
                                }
                            }
                );

            }.bind(this))
            .catch(function(reason) {

                Request.post(
                    this._req.body.response_url,
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
            }.bind(this));
    }

    ecsIps = null;

};

module.exports = GetIpsController;


