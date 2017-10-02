'use strict';

var RetroUserRating = function() {
    this.retroId = undefined;
    this.questionId = undefined;
    this.userId = undefined;
    this.ratedUserId = undefined;
    this.rating = undefined;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
};

RetroUserRating.prototype.setRetroId = function (retroId) {
    this.retroId = retroId;
};

RetroUserRating.prototype.getRetroId = function () {
    return this.retroId;
};

RetroUserRating.prototype.setQuestionId = function (questionId) {
    this.questionId = questionId;
};

RetroUserRating.prototype.getQuestionId = function () {
    return this.questionId;
};

RetroUserRating.prototype.setUserId = function (userId) {
    this.userId = userId;
};

RetroUserRating.prototype.getUserId = function () {
    return this.userId;
};

RetroUserRating.prototype.getRatedUserId = function () {
    return this.ratedUserId;
};

RetroUserRating.prototype.setRatedUserId = function (ratedUserId) {
    this.ratedUserId = ratedUserId;
};

RetroUserRating.prototype.getRating = function () {
    return this.rating;
};

RetroUserRating.prototype.setRating = function (rating) {
    this.rating = rating;
};


module.exports = RetroUserRating;