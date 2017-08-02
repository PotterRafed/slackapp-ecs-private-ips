'use strict';

const express = require('express');
const config = require('./ConfigHandler/ConfigHandler.js');

var GetIpsController = require('./Controller/GetIpsController.js');
var InteractiveResponseController = require('./Controller/InteractiveResponseController.js');
var OAuthController = require('./Controller/OAuthController.js');

var Logger = require('./Logger/Logger.js');

var request = require('request');
var bodyParser = require('body-parser');

var port = config.getPort();

console.log(port);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port);

console.log('Running on http://localhost:' + port);

app.get('/', function(req, res) {
    res.send('Server is working! Path Hit: ' + req.url);
});

app.post('/oauth', function(req, res) {
    Logger.logRequest(req);
    new OAuthController(req, res);
});

app.post('/button-response', function (req, res) {
    Logger.logRequest(req);
    new InteractiveResponseController(req, res);
});

app.post('/aws-get-ips', function (req, res) {
    Logger.logRequest(req);
    new GetIpsController(req, res);
});

app.get('/test', function (req, res) {
    // Logger.logRequest(req);
    // new GetIpsController(req, res);


    var ParamHandler = require('./ConfigHandler/ParameterHandler');

    var pH = new ParamHandler();

    pH.initParams('--cluster="someclust" -e="myenv" -s="someserv" --region="namaikatiregiona"');

});