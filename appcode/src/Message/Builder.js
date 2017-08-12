'use strict';

var MessageBuilder = function() {

};

MessageBuilder.prototype.getSelectedClusterResponseMessage = function (clustersList)
{
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

    return {
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
};

module.exports = MessageBuilder;
