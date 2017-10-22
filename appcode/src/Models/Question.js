'use strict';

var Question = function(id, name) {
    this.id = id;
    this.name = name;
};

Question.prototype.setId = function (id) {
    this.id = id;
};

Question.prototype.getId = function () {
    return this.id;
};

Question.prototype.setName = function (name) {
  this.name = name;
};

Question.prototype.getName = function () {
    return this.name;
};

module.exports = Question;