'use strict';

var db = require('../Persistance/db');
var VotingHandler = require('../Voting/VotingHandler');

var NewSprintHeroController = function() {

    // var commandParams = (req.body.text === undefined) ? '' : req.body.text;

    var commandParams = "WEB-2017.05 @oras @potter @rosi";

    ///retro-start -n|--name WEB-2017.05 -p|--participants @oras @potter @rosi --no-vote @potter

    // this.ParamHandler = new ParameterHandler();
    // this.ParamHandler.initParams(commandParams);
    //
    // this.Responder = new Responder(res, req.body.response_url);
    this.handle();
};

NewSprintHeroController.prototype.handle = function () {


    var participans = ["333", "111", "222"];
    var noVoters = ["333"];
    var sprintName = "CHKT 2017.05";

    //By default all questions


    //If voting handler is created with participants and noVoters it will
    //create the records in the DB

    // VotingHandler can also be created using the sprint-id in which case the sprint participants
    // wont be init in the db
    var VotingHandler = new VotingHandler(sprintName, participans, noVoters);

    //First init
    VotingHandler.init(participans, noVoters);


    //Second init (when sprint exists)
    VotingHandler.initBySprintId("22");

    var VotingRequester = new VotingRequester();

    (VotingHandler.getRemainingVotes()).forEach(function(voteSpec) {
        //Will send a request to the user with the question
        //voteSpec.voterId = 111
        //voteSpec.voteForId = 222
        //voteSpec.sprintId = 1
        //voteSpec.question = "Rate guy"
        //voteSpec.questionId = 1

        VotingRequester.sendVoteRequest(voteSpec);
    });


};


module.exports = NewSprintHeroController;
