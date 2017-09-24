FROM node:alpine
MAINTAINER Potter Rafed <r.s.rafed@gmail.com>

# Set working directory
WORKDIR /var/www/html

# -----------------------------------------------------------------------------
# Copy Custom Run Command Script
# -----------------------------------------------------------------------------
COPY /node/run.sh /usr/local/bin/

# -----------------------------------------------------------------------------
# Install required node modules
# -----------------------------------------------------------------------------
RUN npm install \
    && chmod 755 /usr/local/bin/run.sh


EXPOSE 80

CMD ["/usr/local/bin/run.sh"]