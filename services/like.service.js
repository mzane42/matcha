var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var Q = require('q');
var db = require('../lib/db');
var _ = require('underscore');


var service = {};
service.createRelation = createRelation;
service.matchedUsers = matchedUsers;
service.deleteRelation = deleteRelation;
service.isConnected = isConnected;
service.updateRelation = updateRelation;
service.isConnectedMatched = isConnectedMatched;
module.exports = service;


function createRelation(id_author, id_receiver, connected) {
    var deferred = Q.defer();
    var d = new Date,
        dformat = [ (d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/')+
            ' ' +
            [ d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');

    var data = [
        id_author,
        id_receiver,
        dformat,
        connected
    ];
    var sql = 'INSERT INTO matched(id_author, id_receiver, created_at, connected) VALUES (?, ?, ?, ?)';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function isConnectedMatched(id_author, id_receiver) {
    var deferred = Q.defer();
    var data = [
        id_receiver,
        id_author
    ]
    var sql = 'SELECT * FROM `matched` WHERE (id_author = ? AND id_receiver=?)';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ':' + err.message)
        if (result) {
            deferred.resolve(result[0]);
        }
    })
    return deferred.promise
}

function isConnected(id_author, id_receiver) {
    var deferred = Q.defer();
    var data = [
        id_author,
        id_receiver
    ]
    var sql = 'SELECT * FROM `matched` WHERE (id_author = ? AND id_receiver=?)';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ':' + err.message)
        if (result) {
            deferred.resolve(result[0]);
        }
    })
    return deferred.promise
}


function  updateRelation(id_author, id_receiver, connected) {
    var deferred = Q.defer();
    var data = [connected, id_receiver, id_author]
    var sql = 'UPDATE `matched` SET connected = ? WHERE (id_author = ? AND id_receiver = ?)';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': ', err.message);
        if (result) {
            deferred.resolve();
        }
    })
    return deferred.promise;
}

function deleteRelation(id_author, id_receiver) {
var deferred = Q.defer();
    var data = [
        id_author,
        id_receiver,
    ];
    var sql = 'DELETE FROM `matched` WHERE (id_author = ? AND id_receiver = ?)';
    db.connection.query(sql, data, function (err, result) {
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }
        if (result){
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function matchedUsers(id_author, id_receiver) {
    var deferred = Q.defer();
    var data = [
        id_author,
        id_receiver
    ];
    var sql = 'SELECT * FROM `matched` WHERE (id_author = ? AND id_receiver = ?)';
    db.connection.query(sql, data,function(err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve(result);
        }else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
};