var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var db = require('../lib/db');


var service = {};
service.blocked = blocked;
service.cancel_blocked = cancel_blocked;
service.isBlocked = isBlocked;

module.exports = service;


function blocked(id_author, id_receiver) {
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
        dformat
    ];
    var sql = 'INSERT INTO blocked(id_author, id_receiver, created_at) VALUES (?, ?, ?)';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve(result);
        }else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function isBlocked(id_author, id_receiver) {
    var deferred = Q.defer();
    var data = [
        id_author,
        id_receiver
    ]
    var sql = 'SELECT * FROM `blocked` WHERE (id_author = ? AND id_receiver=?)';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ':' + err.message)
        if (result) {
            deferred.resolve(result[0]);
        }
    })
    return deferred.promise
}

function cancel_blocked(id_author, id_receiver) {
    var deferred = Q.defer();
    var data = [
        id_author,
        id_receiver
    ];
    var sql = 'DELETE FROM `blocked` WHERE (id_author = ? AND id_receiver = ?)';
    db.connection.query(sql, data, function (err, result) {
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }
        if (result){
            deferred.resolve(result[0]);
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