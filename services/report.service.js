var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var db = require('../lib/db');


var service = {};
service.reported = reported;
service.cancel_reported = cancel_reported;

module.exports = service;


function reported(id_author, id_receiver) {
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
    var sql = 'INSERT INTO reported(id_author, id_receiver, created_at) VALUES (?, ?, ?)';
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

function cancel_reported(id_author, id_receiver) {
    var deferred = Q.defer();
    var data = [
        id_author,
        id_receiver
    ];
    var sql = 'DELETE FROM `reported` WHERE (id_author = ? AND id_receiver = ?)';
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