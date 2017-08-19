#!/bin/sh

# Setup configuration
cp /var/www/html/config/config.yml.dist /var/www/html/config/config.yml

if [ $COMPOSER_INSTALL = "true" ]; then
    composer install --no-interaction --verbose
fi

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

if [ "$AWS_PROD_KEY" ]; then
   sed -i "s/your-aws-prod-key/$AWS_PROD_KEY/" "/var/www/html/config/config.yml"
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

# Start Supervisor and services
/usr/bin/supervisord -c /etc/supervisord.conf