'use strict';

var Request = require('request');

/**
 * Sends initial acknowledgement that the request is being processed
 * @param params
 * @param originalResponse
 */
var sendAcknowledgement = function(params, originalResponse)
{
    originalResponse.header('Content-Type', 'application/json');

    if (params.service !== '' && params.cluster !== '') {
        originalResponse.send({
                "text": "Getting IPs for Cluster: '" + params.cluster + "', Service: '" + params.service + "', Env:'" + params.env + "', Region: '" + params.region
            }
        );
    } else {
        originalResponse.send({
                "text": "Environment: *'" + params.env + "'*. Region: *'" + params.region + "'*"
            }
        );
    }
};

/**
 * Sends an error to the initial originalResponse object if it exists.
 * Otherwise it sends it to the a given alternative endpoint
 * @param error
 * @param originalResponse
 * @param altEndpoint
 */
var sendError = function (error, originalResponse, altEndpoint) {

    var message = {"text": "Could not retrieve IPs: " + error};

    if (originalResponse !== undefined && originalResponse !== '') {
        originalResponse.header('Content-Type', 'application/json');
        originalResponse.send(message);
    } else {
        Request.post(
            altEndpoint,
            {json: message},
            _errorHandler
        );
    }

};

var _errorHandler = function (error, response, body)
{
    if (error) {
        console.log("Error sending IPs: " + error);
    }
};

var sendFullIPs = function (IPS, uri, params) {
    Request.post(
        uri,
        {
            json: {
                "response_type": "in_channel",
                "text": "Cluster: *'" + params.cluster + "'*, Service: *'" + params.service + "'*, Env: *'" + params.env + "'*, Region: *'" + params.region + "'* is running on: *" + IPs + "*."
            }
        },
        _errorHandler
    );
};

module.exports = {
    sendAcknowledgement: sendAcknowledgement,
    sendError: sendError,
    sendFullIPs: sendFullIPs
};

