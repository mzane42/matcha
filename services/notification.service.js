var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var Q = require('q');
var db = require('../lib/db');
var _ = require('underscore');


var service = {};
service.newNotification = newNotification;
service.deleteNotification = deleteNotification;
service.getNotifications = getNotifications;
service.getLastNotification = getLastNotification;
service.updateSeen = updateSeen;
/*service.matchedUsers = matchedUsers;
service.deleteRelation = deleteRelation;*/

module.exports = service;


function newNotification(id_author, id_receiver, action_type) {
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
        action_type
    ];
    var sql = 'INSERT INTO notification(id_author, id_receiver, created_at, action_type) VALUES (?, ?, ?, ?)';
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

function getNotifications(id) {
    var deferred = Q.defer()
    var sql = 'SELECT id_author, aut.last_name as author_last_name, aut.first_name as author_first_name, aut_p.photo_link as author_img, id_receiver, re.last_name as receiver_last_name, re.first_name as receiver_first_name, re_p.photo_link as receiver_img, notification.created_at , notification.seen, notification.action_type FROM notification LEFT JOIN users aut ON aut.id = id_author LEFT JOIN photos aut_p ON aut_p.id_user = aut.id and aut_p.isProfil = 1 LEFT JOIN users re ON re.id = id_receiver LEFT JOIN photos re_p ON re_p.id_user = re.id and re_p.isProfil = 1 WHERE id_receiver = ? AND notification.created_at = (SELECT MAX(notification.created_at) FROM notification WHERE notification.id_author = aut.id) ORDER BY notification.created_at DESC LIMiT 8'
    db.connection.query(sql, id, function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message);
        if (result){
            deferred.resolve(result);
        }
    });
    return deferred.promise
}

function getLastNotification(id) {
    var deferred = Q.defer()
    var sql = 'SELECT id_author, aut.last_name as author_last_name, aut.first_name as author_first_name, aut_p.photo_link as author_img, id_receiver, re.last_name as receiver_last_name, re.first_name as receiver_first_name, re_p.photo_link as receiver_img, notification.created_at , notification.seen, notification.action_type FROM notification LEFT JOIN users aut ON aut.id = id_author LEFT JOIN photos aut_p ON aut_p.id_user = aut.id and aut_p.isProfil = 1 LEFT JOIN users re ON re.id = id_receiver LEFT JOIN photos re_p ON re_p.id_user = re.id and re_p.isProfil = 1 WHERE id_receiver = ? AND notification.created_at = (SELECT MAX(notification.created_at) FROM notification WHERE notification.id_author = aut.id) ORDER BY notification.created_at DESC LIMiT 1'
    db.connection.query(sql, id, function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message);
        if (result){
            deferred.resolve(result);
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