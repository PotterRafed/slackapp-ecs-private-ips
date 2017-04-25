var AWS = require('aws-sdk');

function getEcsTasksList (ecs) {

    var cluster = this.cluster;
    return new Promise(function(resolve, reject) {
        var params = {
            cluster: cluster
        };

        ecs.listTasks(params, function(err, data) {
            if (err) {
                console.log("Error while trying to list tasks: " + err.message, err.stack);
                reject(err.message);
            } else {
                console.log("Received tasks...");
                var tasks = data.taskArns;
                if (tasks.length <= 0) {
                    reject("No running tasks.");
                }
                resolve(tasks);
            }
        });

    });
}

function getContainerInstancesList (ecs, tasks) {

    var cluster = this.cluster;
    return new Promise(function(resolve, reject) {
        var params = {
            cluster: cluster,
            tasks: tasks
        };

        ecs.describeTasks(params, function(err, data) {
            if (err) {
                console.log("Error while trying to get container instances: " + err.message, err.stack);
                reject(err.message);
            } else {
                var containerInstances = [];

                data.tasks.forEach( function(task) {
                    containerInstances.push(task.containerInstanceArn);
                });

                console.log("Received container instances list...");
                resolve(containerInstances);
            }
        });
    });
}

function getEc2InstanceIds (ecs, containerInstances) {

    var cluster = this.cluster;
    return new Promise(function(resolve, reject) {
        var params = {
            cluster: cluster,
            containerInstances: containerInstances
        };

        ecs.describeContainerInstances(params, function(err, data) {
            if (err) {
                console.log("Error while trying to get EC2 instances: " + err.message, err.stack);
                reject(err.message);
            } else {
                var ec2InstanceIds = [];

                data.containerInstances.forEach( function(containerInst) {
                    ec2InstanceIds.push(containerInst.ec2InstanceId);
                });
                console.log("Received EC2 instances list...");
                resolve(ec2InstanceIds);
            }
        });
    });
}

function getEc2InstancesIps (ec2, ec2InstanceIds) {

    var cluster = this.cluster;
    return new Promise(function(resolve, reject) {
        var params = {
            DryRun: false,
            InstanceIds: ec2InstanceIds
        };

        ec2.describeInstances(params, function(err, data) {
            if (err) {
                console.log("Error while trying to get EC2 IPs: " + err.message, err.stack);
                reject(err.message);
            } else {
                var ipAddresses = [];

                data.Reservations.forEach( function(reservation) {
                    reservation.Instances.forEach( function(instance) {
                        ipAddresses.push(instance.PrivateIpAddress);
                    });
                });

                console.log("Received EC2 IPs: " + ipAddresses.join(", "));
                resolve(ipAddresses.join(", "));
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
        var ec2 = new AWS.EC2(config);

        return getEcsTasksList.call(this, ecs)
            .then(getContainerInstancesList.bind(this, ecs))
            .then(getEc2InstanceIds.bind(this, ecs))
            .then(getEc2InstancesIps.bind(this, ec2));
};

module.exports = EcsIps;