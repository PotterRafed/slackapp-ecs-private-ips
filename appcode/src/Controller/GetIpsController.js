const config = require('../ConfigHandler/ConfigHandler.js');
var EcsIps = require('../EcsIps.js');
var Request = require('request');

var ParameterHandler = require('../ConfigHandler/ParameterHandler');

var Responder = require('../ResponseHandler/Responder');

/**
 * @param req
 * @param res
 * @constructor
 */
var GetIpsController = function(req, res) {
    this._req = req;
    this._res = res;
    this.ParamHandler = new ParameterHandler();
    this.handle();
};

/**
 * Handles the reques;
 */
GetIpsController.prototype.handle = function ()
{
    try {
        var paramsText = (this._req.body.text === undefined) ? '' : this._req.body.text;

        this.ParamHandler.initParams(paramsText);
        var allParams = this.ParamHandler.getAllParams();
        var AWSCredentials = config.getAWSCredentials(allParams.env);

    } catch (ex) {

        Responder.sendError(ex.message, this._res);
        console.log(ex.message);
        console.log(" -------------------- Finished request ---------------------" );
        return;
    }

    var ecsIps = new EcsIps(AWSCredentials, allParams.region);

    Responder.sendAcknowledgement(allParams, this._res);

    if (allParams.service !== '' && allParams.cluster !== '') {
        //There is no additional information required - get the IPs and respond
        ecsIps.getIPs(allParams.cluster, allParams.service)
            .then(function (IPs) {
                Responder.sendFullIPs(IPs, this._req.body.response_url, allParams);
                console.log(" ------------------- Finished request ---------------------" );
        }.bind(this))
            .catch(function(error) {
                Responder.sendError(error, '', this._req.body.response_url);
                console.log(" -------------------- Finished request ---------------------" );
            }.bind(this));

    } else {
        //There is missing information.
        //Get a list of clusters so the user can select one

        ecsIps.getClusters()
            .then(function(clusters) {


                // //Message builder
                // var actions = [];
                // var action = {};
                //
                // action.name = "Clusters List";
                // action.text = "Pick a cluster...";
                // action.type = "select";
                //
                // var options = [];
                // clusters.forEach(function(cluster) {
                //     var option = {};
                //     option.text = cluster;
                //     option.value = cluster;
                //     options.push(option);
                //
                //     });
                //
                // action.options = options;
                // actions.push(action);
                //
                // var responseBody =
                //     {
                //         "attachments": [
                //         {
                //             "text": "Select a cluster",
                //             "fallback": "Error: was not able to select a cluster",
                //             "callback_id": "cluster_selection:::text:=" + this._req.body.text,
                //             "attachment_type": "default",
                //             "actions" : actions
                //         }
                //     ]
                // };

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


