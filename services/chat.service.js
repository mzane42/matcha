var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var Q = require('q');
var db = require('../lib/db');
var _ = require('underscore');


var service = {};
service.SendMessage = SendMessage;
service.deleteNotification = deleteNotification;
service.getMessagesById = getMessagesById;
service.LastMessage = LastMessage;
service.updateSeen = updateSeen;
/*service.matchedUsers = matchedUsers;
 service.deleteRelation = deleteRelation;*/

module.exports = service;


function SendMessage(id_author, id_receiver, content) {
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
        content
    ];
    var sql = 'INSERT INTO chat(id_author, id_receiver, created_at, message) VALUES (?, ?, ?, ?)';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}

function updateSeen(id_receiver) {
    var seen = 1,
        data = [
            seen,
            id_receiver
        ]
    var deferred = Q.defer();
    var sql = 'UPDATE notification SET seen = ? WHERE (id_receiver = ?)';
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

function deleteNotification(id_author, id_receiver) {
    var deferred = Q.defer();
    var data = [
        user_id2,
        user_id1
    ];
    var sql = 'DELETE FROM `notification` WHERE (id_author = ? AND id_receiver = ?)';
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

function getMessagesById(id_author, id_receiver) {
    var deferred = Q.defer();
    var data = [
        id_author,
        id_receiver,
        id_receiver,
        id_author
    ]
    var sql = 'SELECT id_author, aut.last_name as author_last_name, aut.first_name as author_first_name, aut_p.photo_link as author_img, id_receiver, re.last_name as receiver_last_name, re.first_name as receiver_first_name, re_p.photo_link as receiver_img, chat.created_at , chat.message FROM chat LEFT JOIN users aut ON aut.id = id_author LEFT JOIN photos aut_p ON aut_p.id_user = aut.id and aut_p.isProfil = 1 LEFT JOIN users re ON re.id = id_receiver LEFT JOIN photos re_p ON re_p.id_user = re.id and re_p.isProfil = 1 WHERE (id_author = ? AND id_receiver = ?) OR (id_author = ? AND id_receiver = ?) ORDER BY chat.created_at DESC';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message);
        if (result){
            deferred.resolve(result);
        }
    });
    return deferred.promise
}

function LastMessage(id_author, id_receiver) {
    var deferred = Q.defer()
    var data = [
        id_author,
        id_receiver
    ]
    var sql = 'SELECT id_author, aut.last_name as author_last_name, aut.first_name as author_first_name, aut_p.photo_link as author_img, re.last_name as receiver_last_name, re.first_name as receiver_first_name, re_p.photo_link as receiver_img, chat.created_at, chat.message FROM chat LEFT JOIN users aut ON aut.id = id_author LEFT JOIN photos aut_p ON aut_p.id_user = aut.id and aut_p.isProfil = 1 LEFT JOIN users re ON re.id = id_receiver LEFT JOIN photos re_p ON re_p.id_user = re.id and re_p.isProfil = 1 WHERE id_author = ? AND id_receiver = ? AND chat.created_at = (SELECT MAX(chat.created_at) FROM chat WHERE chat.id_author = aut.id) ORDER BY chat.created_at DESC LIMiT 1;'
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message);
        if (result){
            deferred.resolve(result[0]);
        }
    });
    return deferred.promise
}



/*
 function matchedUsers(user_id1, user_id2) {
 var deferred = Q.defer();
 var data = [
 user_id1,
 user_id2
 ];
 var sql = 'SELECT * FROM `matched` WHERE (id_author = ? AND id_receiver = ?) OR (id_author = '+db.connection.escape(user_id1)+' AND id_receiver = '+db.connection.escape(user_id2)+')';
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
 */
Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
};