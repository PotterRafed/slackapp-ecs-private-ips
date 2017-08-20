'use strict';

const PARAMS = Object.freeze({
    ACTION: 'action',
    CLUSTER: 'cluster',
    COMMAND_PARAMS: 'commandParams'
});

const ACTIONS = Object.freeze({
   CLUSTER_SELECTION: 'cluster_selection',
   SERVICE_SELECTION: 'service_selection'
});

var CallbackId = require('./CallbackId');

var CallbackIdHandler = function (callbackIdString) {
    if (callbackIdString !== undefined) {
        this.callbackId = new CallbackId(callbackIdString);
    }
};

CallbackIdHandler.prototype.generateClusterSelectionId = function (commandParams) {
    var callbackId = new CallbackId();
    callbackId.addParam(PARAMS.ACTION, ACTIONS.CLUSTER_SELECTION);
    callbackId.addParam(PARAMS.COMMAND_PARAMS, commandParams);

    return callbackId.toString();
};

CallbackIdHandler.prototype.generateServiceSelectionId = function (selectedCluster, commandParams) {
    var callbackId = new CallbackId();
    callbackId.addParam(PARAMS.ACTION, ACTIONS.SERVICE_SELECTION);
    callbackId.addParam(PARAMS.COMMAND_PARAMS, commandParams);
    callbackId.addParam(PARAMS.CLUSTER, selectedCluster);

    return callbackId.toString();
};

CallbackIdHandler.prototype.isClusterSelectionAction = function () {
    return this.actionEquals(ACTIONS.CLUSTER_SELECTION);
};

CallbackIdHandler.prototype.isServiceSelectionAction = function () {
    return this.actionEquals(ACTIONS.SERVICE_SELECTION);
};

CallbackIdHandler.prototype.actionEquals = function (action) {
    if (this.callbackId !== undefined) {
        return (this.callbackId.getValue(PARAMS.ACTION) == action)
    } else {
        return false;
    }
};

CallbackIdHandler.prototype.getCommandParams = function () {
    if (this.callbackId !== undefined) {
        return this.callbackId.getValue(PARAMS.COMMAND_PARAMS);
    }
};

CallbackIdHandler.prototype.getCluster = function () {
    if (this.callbackId !== undefined) {
        return this.callbackId.getValue(PARAMS.CLUSTER);
    }
};

module.exports = CallbackIdHandler;