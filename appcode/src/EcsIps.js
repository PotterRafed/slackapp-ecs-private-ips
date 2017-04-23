var AWS = require('aws-sdk');

function getEcsTasksList (ecs) {

    var cluster = this.cluster;
    return new Promise(function(resolve, reject) {
        var params = {
            cluster: cluster
        };

        ecs.listTasks(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } else {
                // successful response
                console.log(data);
                resolve(data.taskArns[0]);
            }
        });

    });
}

var EcsIps = function(key, secret, region, clusterName) {
    this.key = key;
    this.secret = secret;
    this.region = region;
    this.cluster = clusterName;
};

EcsIps.prototype.get = function() {

        var config = new AWS.Config({
            accessKeyId: this.key,
            secretAccessKey: this.secret,
            region: this.region
        });

        var ecs = new AWS.ECS(config);
        // var ec2 = new AWS.EC2(config);
        return getEcsTasksList.call(this, ecs);
};

module.exports = EcsIps;