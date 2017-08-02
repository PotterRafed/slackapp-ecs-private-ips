const _SLACK_OAUTH_URL = 'https://slack.com/api/oauth.access';

const config = require('../ConfigHandler/ConfigHandler.js');

var OAuthController = function(req, res) {
    this._req = req;
    this._res = res;

    this.handle();
};

OAuthController.prototype.handle = function ()
{

    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint.
    // If that code is not there, we respond with an error message
    if (!this._req.query.code) {
        this._res.status(500);
        this._res.send({"Error": "A code needs to be passed."});
        console.log("There was no 'code' parameter passed ot the the oauth endpoint.");
    } else {
        // If it's there...
        var slackCredentials = config.getSlackCredentials();

        // Do a GET call to Slack's `oauth.access` endpoint, with our app's client ID, client secret, and the code we just got
        request({
            url: _SLACK_OAUTH_URL,
            qs: {
                code: this._req.query.code,
                client_id: slackCredentials.clientId,
                client_secret: slackCredentials.clientSecret
            },
            method: 'GET'

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                this._res.json(body);
            }
        }.bind(this))
    }
    console.log(" ----- Finished request ------" );
};

module.exports = OAuthController;
