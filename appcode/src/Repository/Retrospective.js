'use strict';

const TABLE_NAME = 'retro';

const FIELDS = {
    'id': 'id',
    'name': 'name',
    'ownerId': 'owner_id',
    'ownerName': 'owner_name',
    'createdAt': 'created_at'
};

var db = require('../Persistance/db');

var create = function(retroModel, callback) {

    var insertObj = getInsertObject(retroModel);
    db.get().query('INSERT INTO ' + TABLE_NAME + ' SET ?', insertObj, function(err, rows, fields) {
        if (err) {
            console.log(err.message);
            callback(null, err);
        }
        retroModel.setId(rows.insertId);
        callback(retroModel);
    });
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