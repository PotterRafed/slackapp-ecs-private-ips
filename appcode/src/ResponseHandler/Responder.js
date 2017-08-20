'use strict';

var Request = require('request');
var MessageBuilder = require('../Message/Builder');

var _errorHandler = function (error, response, body) {
    if (error) {
        console.log("Error sending IPs: " + error);
        throw new Error(error);
    }
};

var Responder = function (res, responseUrl) {
    this.res = res;
    this.responseUrl = responseUrl;
};

/**
 * Sends initial acknowledgement that the request is being processed
 * @param params
 */
Responder.prototype.sendAcknowledgement = function(params) {
    this.res.header('Content-Type', 'application/json');

    if (params.service !== '' && params.cluster !== '') {
        this.res.send({
                "text": "Getting IPs for Cluster: '" + params.cluster + "', Service: '" + params.service + "', Env:'" + params.env + "', Region: '" + params.region
            }
        );
    } else {
        this.res.send({
                "text": "Environment: *'" + params.env + "'*. Region: *'" + params.region + "'*"
            }
        );
    }
};

Responder.prototype.sendLoading = function(params) {
    this.res.header('Content-Type', 'application/json');
    this.res.send('Loading...');
};

/**
 * Sends an error to the response url form the request unless "useOriginalResponseObject"
 * is set to true, at which point the response is sent via the original response
 * @param error
 * @param useOriginalResponseObject
 */
Responder.prototype.sendError = function (error, useOriginalResponseObject) {
    var message = {"text": "Could not retrieve IPs: " + error};

    if (useOriginalResponseObject !== undefined && useOriginalResponseObject === true) {
        this.res.header('Content-Type', 'application/json');
        this.res.send(message);
    } else {
        Request.post(
            this.responseUrl,
            {
                json: message
            },
            _errorHandler
        );
    }
};

Responder.prototype.sendFullIPs = function (IPs, params) {

    var text = '';
    if (params.env === undefined || params.region === undefined) {
        text = "Cluster: *'" + params.cluster + "'*, Service: *'" + params.service + "'* is running on: *" + IPs + "*."
    } else {
        text = "Cluster: *'" + params.cluster + "'*, Service: *'" + params.service + "'*, Env: *'" + params.env + "'*, Region: *'" + params.region + "'* is running on: *" + IPs + "*."
    }
    Request.post(
        this.responseUrl,
        {
            json: {
                "response_type": "in_channel",
                "text": text
            }
        },
        _errorHandler
    );
};

Responder.prototype.sendClusterSelection = function (clusters, commandParams) {
    var messageBuilder = new MessageBuilder();
    Request.post(
        this.responseUrl,
        {
            json: messageBuilder.getClusterSelectionRequestBody(clusters, commandParams)
        },
        _errorHandler
    );
};

Responder.prototype.sendServiceSelection = function (servicesList, selectedCluster, commandParams) {
    var messageBuilder = new MessageBuilder();

    Request.post(
        this.responseUrl,
        {
            //@TODO get the full message object as a param
            json:  messageBuilder.getServiceSelectionRequestBody(servicesList, selectedCluster, commandParams)
        },
        _errorHandler
    );
};

module.exports = Responder;

