'use strict';

var Express = require('express');
var config = require('./ConfigHandler/ConfigHandler.js');
var logger = require('./Logger/Logger.js');

var GetIpsController = require('./Controller/GetIpsController.js');
var InteractiveResponseController = require('./Controller/InteractiveResponseController.js');
var OAuthController = require('./Controller/OAuthController.js');
var NewSprintHeroController = require('./Controller/NewSprintHeroController.js');


var db = require('./Persistance/db');
db.connect(function(err) {
    if (err) {
        throw new Error('Unable to connect to MySQL.');
    }
});


const app = Express();
app.use(require('body-parser').urlencoded({ extended: false }));
app.listen(config.getPort(), config.getHost());

console.log('Running on ' + config.getHost() + ':' + config.getPort());


new NewSprintHeroController();


app.get('/', function(req, res) {
    res.send('Server is working! Path Hit: ' + req.url);
});

app.post('/oauth', function(req, res) {
    logger.logRequest(req);
    new OAuthController(req, res);
});

app.post('/button-response', function (req, res) {
    logger.logRequest(req);
    new InteractiveResponseController(req, res);
});

app.post('/aws-get-ips', function (req, res) {
    logger.logRequest(req);
    new GetIpsController(req, res);
});

app.get('/start-sprint-hero', function (req, res) {
    // logger.logRequest(req);
    // new NewSprintHeroController(req, res);
});


app.get('/test', function (req, res) {


});