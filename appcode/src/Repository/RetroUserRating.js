'use strict';

const TABLE_NAME = 'retro_user_ratings';

const FIELDS = {
    'retroId': 'retro_id',
    'question_id': 'question_id',
    'userId': 'user_id',
    'ratedUserId': 'rated_user_id',
    'rating': 'rating',
    'createdAt': 'created_at',
    'updatedAt': 'updated_at'
};

var db = require('../Persistance/db');

var create = function(retroModelArray, callback) {

    var inserts = [];
    retroModelArray.forEach(function(retroModel) {
       inserts.push(retroModel.valuesToArray());
    });

    var sql = 'INSERT INTO ' + TABLE_NAME + '(' + getModelFieldsString() + ') VALUES ?';

    db.get().query(sql, [inserts], function(err, rows) {
        callback(err, retroModelArray);
    }.bind(callback));
};

var getModelFieldsString = function() {
    return (Object.values(FIELDS)).join(",");
};

var getInsertObject = function(obj) {
    var insertObj = {};
    for (var property in obj) {
        if(obj.hasOwnProperty(property) && obj[property] !== undefined) {
            insertObj[FIELDS[property]] = obj[property];
        }
    }
    return insertObj;
};

module.exports = {
    create: create
};