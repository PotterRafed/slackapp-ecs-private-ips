# AWS ECS IP Report Tool

Used to report the IPs an ECS cluster is currently running on.

### Parameters:

Once integrated with slack you can issue your command with the following parameters:
- __-c__, __--cluster__ - the ECS cluster name you want to query [*Default:* The name of the channel the command was issued to]
- __-e__, __--env__ - the aws environment query [*Default:* "stag"] (you can configure your environments in config/default.json )
- __-r__, __--region__ - the aws region query [*Default:* Will use the "default-region" specified in config/default.json]

### Usage
Lets say your slash command is registered as `/aws-ecs-ips`

```
/aws-ecs-ips --cluster="my-cluster" --env="prod" --region="eu-west-1"
```
 
- Will return all the IPS the cluster "my-cluster" is running on the "prod" environment in the "eu-west-1" region
    
-----
    
```
/aws-ecs-ips -c="my-cluster" -e="prod" --r="eu-west-1"
```
-  Shorthand version of the same command
    
-----

(If ran on a slack channel called `#my-cluster`, and `default-region` is set to `eu-west-1`)
```
/aws-ecs-ips -e="prod"`
```
- Same command using the defaults

---- 

```
/aws-ecs-ips
``` 
- Will query the same cluster in the same region as above but it will use "stag" environment
    