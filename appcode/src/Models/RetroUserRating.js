'use strict';

var RetroUserRating = function() {
    this.retroId = undefined;
    this.questionId = undefined;
    this.userId = undefined;
    this.ratedUserId = undefined;
    this.rating = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
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

RetroUserRating.prototype.getCreatedAt = function () {
    return this.createdAt;
};

RetroUserRating.prototype.getUpdatedAt = function () {
    return this.updatedAt;
};

RetroUserRating.prototype.valuesToArray = function () {
    var arrayOfValues = [];
    for (var property in this) {
        if(this.hasOwnProperty(property) && this[property] !== undefined) {
            arrayOfValues.push(this[property]);
        }
    }
    return arrayOfValues;
};

module.exports = RetroUserRating;