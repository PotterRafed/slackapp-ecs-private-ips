const config = require('../ConfigHandler/ConfigHandler.js');
var EcsIps = require('../EcsIps.js');

var ParameterHandler = require('../ConfigHandler/ParameterHandler');
var CallbackIdHndlr = require('../Message/CallbackIdHandler');
var Responder = require('../ResponseHandler/Responder');

/**
 * @param req
 * @param res
 * @constructor
 */
var InteractiveResponseController = function(req, res) {

    this.reqData = JSON.parse(req.body.payload);

    this.CallbackIdHandler = new CallbackIdHndlr(this.reqData.callback_id);

    this.ParamHandler = new ParameterHandler();
    this.ParamHandler.initParams(this.CallbackIdHandler.getCommandParams());

    this.Responder = new Responder(res, this.reqData.response_url);
    this.handle();
};

InteractiveResponseController.prototype.handle = function ()
{
    try {
        var AWSCredentials = config.getAWSCredentials(this.ParamHandler.getParam('env').getValue());
        var ecsIps = new EcsIps(AWSCredentials, this.ParamHandler.getParam('region').getValue());

        this.Responder.sendLoading();
    } catch (ex) {
        this.Responder.sendError(ex.message, true);
        console.log(ex.message);
        console.log(" -------------------- Finished request ---------------------" );
        return;
    }

    if (this.CallbackIdHandler.isClusterSelectionAction()) {

        var selectedCluster = ((this.reqData.actions)[0].selected_options)[0].value;
        ecsIps.getServices(selectedCluster)
            .then(function(servicesList) {

                this.Responder.sendServiceSelection(servicesList, selectedCluster, this.ParamHandler.getRawCommandText());
                console.log(" -------------------- Finished request ---------------------" );

            }.bind(this))
            .catch(function(error) {

                this.Responder.sendError(error);
                console.log(error);
                console.log(" -------------------- Finished request ---------------------" );

            }.bind(this));

    } else if (this.CallbackIdHandler.isServiceSelectionAction()) {

        var cluster = this.CallbackIdHandler.getCluster();
        var service = ((this.reqData.actions)[0].selected_options)[0].value;

        console.log("Getting IPs for service '" + service + "'");

        ecsIps.getIPs(cluster, service)
            .then(function (IPs) {
                this.Responder.sendFullIPs(IPs, {cluster: cluster, service: service});
                console.log(" ------------------- Finished request ---------------------" );
            }.bind(this))
            .catch(function(error) {
                this.Responder.sendError(error);
                console.log(" -------------------- Finished request ---------------------" );
            }.bind(this));
    }
};

module.exports = InteractiveResponseController;


