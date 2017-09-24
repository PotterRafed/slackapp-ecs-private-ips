#!/bin/sh

if [ $ENV != "dev" ]; then
    # Setup configuration
    cp /var/www/html/config/config.yml.dist /var/www/html/config/config.yml

    #AWS Credentials
    if [ "$AWS_STAGING_KEY" ]; then
       sed -i "s/your-aws-staging-key/$AWS_STAGING_KEY/" "/var/www/html/config/config.yml"
    fi

    if [ "$AWS_STAGING_SECRET" ]; then
       sed -i "s/your-aws-staging-secret/$AWS_STAGING_SECRET/" "/var/www/html/config/config.yml"
    fi

    if [ "$AWS_PROD_KEY" ]; then
       sed -i "s/your-aws-prod-key/$AWS_PROD_KEY/" "/var/www/html/config/config.yml"
    fi

    if [ "$AWS_PROD_SECRET" ]; then
       sed -i "s/your-aws-prod-secret/$AWS_PROD_SECRET/" "/var/www/html/config/config.yml"
    fi


    #Slack Credentials

    if [ "$SLACK_CLIENT_ID" ]; then
       sed -i "s/your-client-id/$SLACK_CLIENT_ID/" "/var/www/html/config/config.yml"
    fi

    if [ "$SLACK_CLIENT_SECRET" ]; then
       sed -i "s/your-client-secret/$SLACK_CLIENT_SECRET/" "/var/www/html/config/config.yml"
    fi

    #Default Settings

    if [ "$DEFAULT_CLUSTER" ]; then
       sed -i "s/\"\" #your-default-cluster/\"$DEFAULT_CLUSTER\"/" "/var/www/html/config/config.yml"
    fi

    if [ "$DEFAULT_ENV" ]; then
       sed -i "s/\"\" #your-default-env/\"$DEFAULT_ENV\"/" "/var/www/html/config/config.yml"
    fi

    if [ "$DEFAULT_REGION" ]; then
       sed -i "s/\"\" #your-default-region/\"$DEFAULT_REGION\"/" "/var/www/html/config/config.yml"
    fi

    if [ "$DEFAULT_SERVICE" ]; then
       sed -i "s/\"\" #your-default-service/\"$DEFAULT_SERVICE\"/" "/var/www/html/config/config.yml"
    fi

fi
echo "Initialising Database..."
echo "Waiting 25s for Container Network to be established...."
# Give MySql Service a chance to start
sleep 25

#Run migrations
node_modules/db-migrate/bin/db-migrate up --config config/database.json

if [ $ENV -ne "dev" ]; then
    # Start Supervisor and services
    /usr/bin/supervisord -c /etc/supervisord.conf
else
    #Keep container running
    /bin/sh
fi