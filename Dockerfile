FROM node:alpine

# Set working directory
WORKDIR /var/www/html

# Copy app and install dependencies
ADD ./appcode /var/www/html

# -----------------------------------------------------------------------------
# Copy Custom Run Command Script
# -----------------------------------------------------------------------------
COPY /container-run/run.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/run.sh

VOLUME /var/www/html

CMD ["/usr/local/bin/run.sh"]
