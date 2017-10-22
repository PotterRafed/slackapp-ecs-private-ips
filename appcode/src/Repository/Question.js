'use strict';

const TABLE_NAME = 'questions';

const FIELDS = {
    'id': 'id',
    'question': 'question'
};

var db = require('../Persistance/db');
var QuestionModel = require('../Models/Question');

var getAll = function(callback) {

    db.get().query('SELECT * FROM ' + TABLE_NAME,  function(err, rows) {

        if (err) {
            callback(err, rows);
        }

        var questions = [];
        rows.forEach(function(questionRow, index) {
            var question = new QuestionModel(questionRow.id, questionRow.question);
            questions.push(question);
        });

        callback(err, questions);
    }.bind(callback));
};

module.exports = {
    getAll: getAll
};