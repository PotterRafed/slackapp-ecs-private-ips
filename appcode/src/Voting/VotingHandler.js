'use strict';
// var db = require('../Persistance/db');
// var RetroUserRatingModel = require('../Models/RetroUserRating');
var RetroUserRatingRepo = require('../Repository/RetroUserRating');

var Step = require('step');

var RetroModel = require('../Models/Retrospective');
var RetroUserRatingModel = require('../Models/RetroUserRating');
var RetroRepo = require('../Repository/Retrospective');
var QuestionRepo = require('../Repository/Question');


var VotingHandler = function() {
    this.sprintId = '';
    this.participants = [];
    this.noVoters = [];
};

VotingHandler.prototype.init = function(retroName, owner, ownerId, participants, noVoters) {
    // this.participants = participants;
    // this.noVoters = noVoters;

    var ratedPeople = participants.filter(function(element) {
        return !noVoters.includes(element);
    } );

    var retroModel = new RetroModel();
    retroModel.setName(retroName);
    retroModel.setOwnerName(owner);
    retroModel.setOwnerId(ownerId);

    var insertUserModels = [];

    Step(
        function createRetro() {
            console.log("=================step 1 - create repo ");
            RetroRepo.create(retroModel, this);
        },
        function getQuestions(err, retroModel) {
            console.log("================step 2 - get questions ");

           _handleError(err);

            // console.log(retroModel);
            QuestionRepo.getAll(this);
        },
        function createRetroUserRatings(err, questions) {
            console.log("=================step 3 - create retro user ratings");

           _handleError(err);

            insertUserModels = _generateInsertUserRatingModels(participants, ratedPeople, questions, retroModel);
            RetroUserRatingRepo.create(insertUserModels, this);
        },
        function sendInitialQuestions(err) {
            console.log("=================step 4 - send initial questions");

            _handleError(err);

            // select min(q.id) as question_id, min(q.question) as quesiton, user_id,
            //     SUBSTRING_INDEX(GROUP_CONCAT(rated_user_id order by rated_user_id asc), ',', 1) as rated_user_id
            // from retro_user_ratings rur
            // join questions q on q.id = rur.question_id
            // where retro_id = 3
            // and rating is null
            // group by user_id



            //for each row -> send to user_id to rate rated_user_id with question

            console.log(insertUserModels);
        }
    );

    // console.log("--- PAST STEP ");


};

var _generateInsertUserRatingModels = function (participants, ratedPeople, questions, retroModel) {
    var insertUserModels = [];

    //Participant is the person who is going to rate the person being rated
    participants.forEach(function(participantId) {

        //The rating person will never have to rate themselves
        var filteredRatedPeople = ratedPeople.slice(); //copy array
        if (ratedPeople.includes(participantId)) {
            filteredRatedPeople.splice(filteredRatedPeople.indexOf(participantId), 1);
        }

        //Create a record for each question within the sprint
        filteredRatedPeople.forEach(function(ratedPersonId) {
            questions.forEach(function(question) {
                var UserRatingModel = new RetroUserRatingModel();
                UserRatingModel.setQuestionId(question.getId());
                UserRatingModel.setUserId(participantId);
                UserRatingModel.setRatedUserId(ratedPersonId);
                UserRatingModel.setRetroId(retroModel.getId());

                insertUserModels.push(UserRatingModel);
            });
        });
    });
    return insertUserModels;
};

var _handleError = function(err) {
    if (err) {
        console.log(err.message);
        throw err;
    }
};

VotingHandler.prototype.initBySprintId = function(sprintId) {

};

module.exports = VotingHandler;
