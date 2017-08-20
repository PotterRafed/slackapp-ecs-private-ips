# AWS ECS IP Report Tool

This is a Dockerised application meant to serve as the backend of a Slack App.

There are 2 parts of setting the process to work from Slack.  
1) Setting up the Slack App itself
2) Setting up the Backend App (this one) which the Slack App will "talk" to


### Setup the Slack Application
In order to set this up in your slack channel you have to do the following:

(Lets assume you are running this application under <http://myslackapp-backend.com>)

- Create a Slack Application from <https://api.slack.com>
- Create a Slash Command within your APP
- Set the "Request URL" for the Slash Command to be <http://myslackapp-backend.com/aws-get-ips>
- Under "OAuth and Permissions", "Add a new Redirect URL" to point to <http://myslackapp-backend.com/oauth>
- Lastly under "Interactive Messages" set the "Request URL" to be <http://myslackapp-backend.com/button-response>

### Setup the Backend Application (this code)

This is a Dockerised application and all you need to do is run the __potter/slackapp-aws-ips__ (available in DockerHub) image in a server of your own.

You will need to setup a few Environment variables in order to correctly configure the backend to be able to connect to your AWS accounts:

Currently the Application comes with support for 2 different AWS environments "stag" and "prod" and you can provide the AWS
access key and secret for whichever you want to use(or both)

- __AWS_STAGING_KEY__ - The AWS key for your staging environment (optional)
- __AWS_STAGING_SECRET__ - The AWS secret for your staging environment  (optional)
- __AWS_PROD_KEY__ - The AWS key for your production environment (optional if Staging is provided)
- __AWS_PROD_SECRET__ - The AWS secret for your production environment (optional if Staging is provided)
- __SLACK_CLIENT_ID__ - This is you Slack APP's client ID (found under Basic Information)
- __SLACK_CLIENT_SECRET__ - This is you Slack APP's client Secret (found under Basic Information)
- __DEFAULT_ENV__ - The default env the app is going to use if none is provided (recommended)
- __DEFAULT_REGION__ - The default region the app is going to use if none is provided (recommended)
- __DEFAULT_CLUSTER__ - The default cluster the app is going to use if none is provided (optional)
- __DEFAULT_SERVICE__ - The default service the app is going to use if none is provided (optional)


## Using the both Applications through Slack

Lets assume you called your slash command __/aws-ecs-ips__

Once you have installed the application to your team you will have access to this command.

The command can be ran with or without parameters depending on your defaults (mentioned above).  
I strongly recommend you set defaults for Region and Env as those are less likely to change between user invocations.

The application uses Interactive Messages to find out which Cluster and which Service the user wants to query.
 
If all the information, however, is provided via parameters, the app will immediately show you the answer.
### Parameters:

Once integrated with slack you can issue your command with the following parameters:

- __-e__, __--env__ - the aws environment query [*Required* - either through input or default]
- __-r__, __--region__ - the aws region query [*Required* - either through input or default]
- __-s__, __--service__ - the ECS service name you want to query [*Optional* - but will use input or default if set]
- __-c__, __--cluster__ - the ECS cluster name you want to query [*Optional* - but will use input or default if set]

### Usage
If you have already set defaults for Env and Region you can just call the command without any parameters.

`/aws-ecs-ips` - The app will the give you a list of Clusters to select from, followed by a list of Services, once you've chosen a Cluster

You can specify the Cluster and Service via parameters, which will skip the selection processes:  

```
/aws-ecs-ips --cluster="my-cluster" --service="my-service"
#/aws-ecs-ips -c="my-cluster" -s="my-service" [shorthand version]
```

Alternatively you can override and call the full command with all parameters
```
/aws-ecs-ips --env="prod" --region="eu-west-1" --cluster="my-cluster" --service="my-service"
#/aws-ecs-ips -e="prod" -r="eu-west-1" -c="my-cluster" -s="my-service" [shorthand version]
```










