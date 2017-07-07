var AWS = require('aws-sdk');


function getEcsListServices (ecs) {

    var cluster = this.cluster;
    return new Promise(function(resolve, reject) {
        var params = {
            cluster: cluster
        };

        ecs.listServices(params, function(err, data) {
            if (err) {
                console.log("Error while trying to list services: " + err.message, err.stack);
                reject(err.message);
            } else {
                console.log("Received services...");
                console.log(data);

                // var tasks = data.taskArns;
                // if (tasks.length <= 0) {
                //     reject("No running services.");
                // }
                // resolve(tasks);
            }
        });

    });
}

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

    var config = new AWS.Config({
        accessKeyId: this.key,
        secretAccessKey: this.secret,
        region: this.region
    });

    this.ecs = new AWS.ECS(config);
    this.ec2 = new AWS.EC2(config);
};

EcsIps.prototype.get = function() {

    getClusters.call(this, ecs);

        // return getEcsListServices.call(this, ecs)
        //     .then(getEcsTasksList.bind(this, ecs))
        //     .then(getContainerInstancesList.bind(this, ecs))
        //     .then(getEc2InstanceIds.bind(this, ecs))
        //     .then(getEc2InstancesIps.bind(this, ec2));
};


function getClusters(ecs) {

    return new Promise(function(resolve, reject) {

        ecs.listClusters({}, function(err, data) {
            if (err) {
                console.log("Error while trying to list clusters: " + err.message, err.stack);
                reject(err.message);
            } else {
                console.log("Received clusters...");
                var clusters = data.clusterArns;

                if (clusters.length <= 0) {
                    reject("No clusters found.");
                }

                var clusterShortNames = [];
                clusters.forEach( function(cluster) {
                    clusterShortNames.push(cluster.replace(/.*cluster\//g, ''));
                });

                resolve(clusterShortNames);
            }
        });

    });
}

EcsIps.prototype.getClusters = function() {

    return getClusters.call(this, this.ecs);
};

function listServices(ecs, cluster, firstCall, servicesList, nextToken) {

    var params = {
        cluster: cluster
    };

    console.log("list on top");
    console.log(servicesList);

    if (nextToken !== undefined) {
        params.nextToken = nextToken;
    }

    var newServicesList = [];


    return new Promise(function(resolve, reject) {
        ecs.listServices(
        params,
        function(err, data) {
            if (err) {
                console.log("Error while trying to list services: " + err.message, err.stack);
                reject(err.message);
            } else {

                var services = data.serviceArns;

                if (services.length <= 0) {
                    reject("No services found.");
                }

                // data.serviceArns.forEach( function(cluster) {
                //     newServicesList.push(cluster.replace(/.*service\//g, ''));
                // });

                console.log("new list on middle");
                console.log(newServicesList);

                console.log("Received services for '" + cluster + "'...");

                var newNextToken = (data.nextToken === undefined) ? undefined : data.nextToken;

                resolve(services, newServicesList, newNextToken);
            }
        });
    })
    .then(function (services, newServicesList, newNextToken) {

        console.log("list on bottom");
        console.log(newServicesList);
        console.log(services);
        console.log(newNextToken);

        services.forEach( function(cluster) {
            newServicesList.push(cluster.replace(/.*service\//g, ''));
        });

        if (nextToken === undefined) {
            return newServicesList;
        } else {
            return listServices(ecs, cluster, newServicesList, newNextToken)
        }
    });

}

function getServices(ecs, cluster) {

    return new Promise(function(resolve, reject) {

        listServices(ecs, cluster, true)

    });
}

EcsIps.prototype.getServices = function(cluster) {

    return getServices.call(this, this.ecs, cluster);
};

module.exports = EcsIps;