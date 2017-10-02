'use strict';
var db = require('../Persistance/db');
var RetroUserRatingModel = require('../Models/RetroUserRating');
var RetroUserRatingRepo = require('../Repository/RetroUserRating');

var VotingHandler = function() {
    this.sprintId = '';
    this.participants = [];
    this.noVoters = [];
};

VotingHandler.prototype.init = function(sprintName ,participants, noVoters) {
    this.participants = participants;
    this.noVoters = noVoters;

    var ratedPeople = participants - noVoters;

    var retro = RetroRepo.create(sprintName);

    var questions = QuestionsRepo.findAll();


    //part = pot, oras, rosi
    //novote = pot
    //quet = oras, rosi

    participants.forEach(function(participantId) {
        //Participant is the person who is going to rate the person being rated
        ratedPeople.forEach(function(ratedPersonId) {
            //Create a record for each question within the sprint
            questions.forEach(function(question) {
                var UserRatingModel = new RetroUserRatingModel();
                UserRatingModel.setQuestionId(question.id);
                UserRatingModel.setUserId(participantId);
                UserRatingModel.setRatedUserId(ratedPersonId);
                UserRatingModel.setRetroId(retro.id)

                RetroUserRatingRepo.create(UserRatingModel);
            });

        });


    });

};

VotingHandler.prototype.initBySprintId = function(sprintId) {

};

module.exports = VotingHandler;
