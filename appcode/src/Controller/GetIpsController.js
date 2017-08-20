const config = require('../ConfigHandler/ConfigHandler.js');
var EcsIps = require('../EcsIps.js');

var ParameterHandler = require('../ConfigHandler/ParameterHandler');
var Responder = require('../ResponseHandler/Responder');

/**
 * @param req
 * @param res
 * @constructor
 */
var GetIpsController = function(req, res) {
    var commandParams = (req.body.text === undefined) ? '' : req.body.text;

    this.ParamHandler = new ParameterHandler();
    this.ParamHandler.initParams(commandParams);

    this.Responder = new Responder(res, req.body.response_url);
    this.handle();
};

/**
 * Handles the request;
 */
GetIpsController.prototype.handle = function ()
{
    try {
        var allParams = this.ParamHandler.getAllParams();
        var AWSCredentials = config.getAWSCredentials(allParams.env);
        var ecsIps = new EcsIps(AWSCredentials, allParams.region);

        this.Responder.sendAcknowledgement(allParams);

    } catch (ex) {
        this.Responder.sendError(ex.message, true);
        console.log(ex.message);
        console.log(" -------------------- Finished request ---------------------" );
        return;
    }

    if (allParams.service !== '' && allParams.cluster !== '') {
        //There is no additional information required - get the IPs and respond
        ecsIps.getIPs(allParams.cluster, allParams.service)
            .then(function (IPs) {
                this.Responder.sendFullIPs(IPs, allParams);
                console.log(" ------------------- Finished request ---------------------" );
        }.bind(this))
            .catch(function(error) {
                this.Responder.sendError(error);
                console.log(error);
                console.log(" -------------------- Finished request ---------------------" );
            }.bind(this));

    } else {
        //There is missing information.
        //Send a list of clusters for selection

        ecsIps.getClusters()
            .then(function(clusters) {
                this.Responder.sendClusterSelection(clusters, this.ParamHandler.getRawCommandText());
                console.log(" ------------------- Finished request ---------------------" );
            }.bind(this))
            .catch(function(error) {
                this.Responder.sendError(error);
                console.log(error);
                console.log(" -------------------- Finished request ---------------------" );
            }.bind(this));
    }

    ecsIps = null;
};

module.exports = GetIpsController;


