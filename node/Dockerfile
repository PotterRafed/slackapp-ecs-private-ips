FROM node:alpine
MAINTAINER Potter Rafed <r.s.rafed@gmail.com>

# Set working directory
WORKDIR /var/www/html

# -----------------------------------------------------------------------------
# Install required node modules
# -----------------------------------------------------------------------------
RUN npm install

EXPOSE 80

CMD ["/var/www/html/node_modules/nodemon/bin/nodemon.js"]