var AWS = require('aws-sdk');

function getTasksList (service) {
    var params = {
        cluster: this.cluster,
        serviceName: service
    };

    var ecs = this.ecs;
    return new Promise(function(resolve, reject) {

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

function getContainerInstancesList (tasks) {
    var params = {
        cluster: this.cluster,
        tasks: tasks
    };
    var ecs = this.ecs;

    return new Promise(function(resolve, reject) {

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

function getEc2InstanceIds (containerInstances) {
    var params = {
        cluster: this.cluster,
        containerInstances: containerInstances
    };
    var ecs = this.ecs;

    return new Promise(function(resolve, reject) {

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

function getEc2InstancesIps (ec2InstanceIds) {
    var params = {
        DryRun: false,
        InstanceIds: ec2InstanceIds
    };

    var ec2 = this.ec2;
    return new Promise(function(resolve, reject) {

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

function getClusters(ecs) {

    return new Promise(function(resolve, reject) {

        ecs.listClusters({}, function(err, data) {
            if (err) {
                console.log("Error while trying to list clusters: " + err.message, err.stack);
                reject(err.message);
            } else {
                var clusters = data.clusterArns;

                if (clusters.length <= 0) {
                    reject("No clusters found.");
                }

                var clusterShortNames = [];
                clusters.forEach( function(cluster) {
                    clusterShortNames.push(cluster.replace(/.*cluster\//g, ''));
                });
                console.log("Received clusters list.");
                resolve(clusterShortNames);
            }
        });
    });
}

function listServices(ecs, cluster, servicesList, nextToken) {
    var params = {cluster: cluster};

    if (nextToken !== undefined) {
        params.nextToken = nextToken;
    }

    if (servicesList === undefined) {
        servicesList = [];
    }

    var newServicesList = servicesList;

    return new Promise(function(resolve, reject) {
        ecs.listServices(params, function(err, data) {
            if (err) {
                console.log("Error while trying to list services: " + err.message, err.stack);
                reject(err.message);
            } else {
                var services = data.serviceArns;

                if (services.length <= 0) {
                    reject("No services found for cluster '" + cluster + "'");
                }

                services.forEach( function(service) {
                    newServicesList.push(service.replace(/.*service\//g, ''));
                });

                resolve({
                    "services" : newServicesList,
                    "nextToken" : (data.nextToken === undefined) ? undefined : data.nextToken
                });
            }
        });
    })
    .then(function (resolvedData) {

        if (resolvedData.nextToken === undefined) {
            console.log("Received services.");
            return resolvedData.services;
        } else {
            return listServices(ecs, cluster, resolvedData.services, resolvedData.nextToken)
        }
    });

}

function getServices(ecs, cluster) {
    return new Promise(function(resolve, reject) {

        console.log("Getting Services for cluster '" + cluster + "'...");
        resolve(listServices(ecs, cluster));

    });
}

var EcsIps = function(AWSCredentials, region) {
    this.key = AWSCredentials.key;
    this.secret = AWSCredentials.secret;
    this.region = region;

    var config = new AWS.Config({
        accessKeyId: this.key,
        secretAccessKey: this.secret,
        region: this.region
    });

    this.ecs = new AWS.ECS(config);
    this.ec2 = new AWS.EC2(config);
};

EcsIps.prototype.getIPs = function(cluster, service) {
    this.cluster = cluster;
    return getTasksList.call(this, service)
        .then(getContainerInstancesList.bind(this))
        .then(getEc2InstanceIds.bind(this))
        .then(getEc2InstancesIps.bind(this));
};

EcsIps.prototype.getClusters = function() {
    return getClusters.call(this, this.ecs);
};

EcsIps.prototype.getServices = function(cluster) {
    return getServices.call(this, this.ecs, cluster);
};

module.exports = EcsIps;