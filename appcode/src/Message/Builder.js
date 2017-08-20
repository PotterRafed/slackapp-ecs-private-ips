'use strict';

var MessageBuilder = function() {
    this.callbackIdHandler = new (require('./CallbackIdHandler'))();
};

MessageBuilder.prototype.getClusterSelectionRequestBody = function (clustersList, commandParams)
{
    //Message builder
    var actions = [];
    var action = {};

    action.name = "Clusters List";
    action.text = "Pick a cluster...";
    action.type = "select";

    var options = [];
    clustersList.forEach(function(cluster) {
        var option = {};
        option.text = cluster;
        option.value = cluster;
        options.push(option);

    });

    action.options = options;
    actions.push(action);

    return {
            "attachments": [
                {
                    "text": "Select a cluster",
                    "fallback": "Error: was not able to select a cluster",
                    "callback_id": this.callbackIdHandler.generateClusterSelectionId(commandParams),
                    "attachment_type": "default",
                    "actions" : actions
                }
            ]
        };
};

MessageBuilder.prototype.getServiceSelectionRequestBody = function (servicesList, selectedCluster, commandParams) {

    var servicesOptions = [];

    servicesList.forEach(function (serviceResult) {
        servicesOptions.push({
            "text": serviceResult,
            "value": serviceResult
        });
    });

    return {
        "attachments": [
            {
                "text": "Select a service",
                "fallback": "Error: was not able to select a cluster",
                "callback_id": this.callbackIdHandler.generateServiceSelectionId(selectedCluster, commandParams),
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
};

module.exports = MessageBuilder;
