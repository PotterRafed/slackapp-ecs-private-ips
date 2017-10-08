'use strict';

var Retrospective = function() {
    this.id = undefined;
    this.name = undefined;
    this.ownerId = undefined;
    this.ownerName = undefined;
    this.createdAt = new Date();
};

Retrospective.prototype.setId = function (id) {
    this.id = id;
};

Retrospective.prototype.getId = function () {
    return this.id;
};

Retrospective.prototype.setName = function (name) {
  this.name = name;
};

Retrospective.prototype.getName = function () {
    return this.name;
};

Retrospective.prototype.setOwnerId = function (ownerId) {
    this.ownerId = ownerId;
};

Retrospective.prototype.getOwnerId = function () {
    return this.ownerId;
};

Retrospective.prototype.setOwnerName = function (ownerName) {
    this.ownerName = ownerName;
};

Retrospective.prototype.getOwnerName = function () {
    return this.ownerName;
};

Retrospective.prototype.setCreatedAt = function (createdAt) {
    this.createdAt = createdAt;
};

Retrospective.prototype.getCreatedAt = function () {
    return this.createdAt;
};

Retrospective.prototype.getInsertObject = function() {
    var insertObj = {};
    for (var property in this) {
        if(this.hasOwnProperty(property) && this[property] !== undefined) {
            insertObj[property] = this[property];
        }
    }
    return insertObj;
};

module.exports = Retrospective;