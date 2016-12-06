﻿var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var db = require('../lib/db');
var _ = require('underscore');


var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getInterests = getInterests;
//service.addPhotoProfil = addPhotoProfil;
service.addPhotosAlbum = addPhotosAlbum;
service.getPhotoProfil = getPhotoProfil;
service.getPhotosAlbum = getPhotosAlbum;
service.InsertPhotoProfil = InsertPhotoProfil;
service.UpdatePhotoProfil = UpdatePhotoProfil;
service.updateLocationUser = updateLocationUser;


module.exports = service;

function authenticate(login, password) {
    var deferred = Q.defer();

    var sql = 'SELECT * FROM users WHERE login = ?';
    db.connection.query(sql, login, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result[0] && bcrypt.compareSync(password, result[0]['password'])) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: result[0]['id'] }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    }) 
    return deferred.promise;
}

function getPhotosAlbum(_id) {
    var deferred = Q.defer();
    var sql = 'SELECT users.id, users.login, photos.photo_link, photos.isProfil FROM `users` LEFT JOIN photos ON photos.id_user = users.id WHERE users.id = ? AND photos.isProfil = ?';
    db.connection.query(sql, [_id, 0], function(err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
                deferred.resolve(Array.prototype.slice.call(result));
        }else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();  
    var sql = 'SELECT users.id, bio, email, last_name, first_name, login, password, birth_date, gender, orientation, GROUP_CONCAT(interests.interest_name) as interests, lat, lng, city, zip, country FROM `users` LEFT JOIN usersInterests ON usersInterests.id_user = users.id LEFT JOIN interests ON interests.id = usersInterests.id_interest WHERE users.id = ? GROUP BY users.id';
    db.connection.query(sql, _id, function(err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve(_.omit(result[0], 'password'));
        }else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getInterests() {
    var deferred = Q.defer();
    var sql = 'SELECT interest_name as text FROM interests';
    db.connection.query(sql, function(err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve(result);
        }else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}


function create(userParam) {
    var deferred = Q.defer();

    // validation
    var sql = 'SELECT * FROM users WHERE login = ? LIMIT 1';
    db.connection.query(sql, userParam.login, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result.length > 0) {
            // login already exists
            deferred.reject('login "' + userParam.login + '" is already taken');
        } else {
            createUser();
        }
    })
    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
        // add hashed password to user object
        user.password = bcrypt.hashSync(userParam.password, 10);
        var data = [
            user.first_name,
            user.login,
            user.last_name,
            user.email,
            user.password
        ]
        var sql = 'INSERT INTO users(first_name, login, last_name, email,password) VALUES (?,?,?,?,?);';
        db.connection.query(sql, data, function (err, result) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }

    return deferred.promise;
}


function update(_id, userParam) {
    var deferred = Q.defer();
    var sql = 'SELECT * FROM users WHERE id = ?';
    db.connection.query(sql, _id, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result){
            if (result[0].login !== userParam.login) {
                // login has changed so check if the new login is already taken
                var sql = 'SELECT * FROM users WHERE login = ?';
                db.connection.query(sql, userParam.login, function (err, result) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    if (result[0]) {
                        deferred.reject('login "' + req.body.login + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
            } else {
                updateUser();
            }
        }else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            first_name: userParam.first_name,
            last_name: userParam.last_name,
            login: userParam.login,
            email: userParam.email,
            gender: userParam.gender,
            birth_date: userParam.birth_date,
            orientation: userParam.orientation,
            bio: userParam.bio
        }
        // update password if it was entered
        if (userParam.password) {
            set.password = bcrypt.hashSync(userParam.password, 10);
        }

        var sql = 'UPDATE users SET ? WHERE id ='+_id;
        db.connection.query(sql, set, function (err, result) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            deletedInterest(_id, userParam.interests);
            _.each(userParam.interests, function (one) {
                var sql = 'SELECT users.id, interest_name FROM `users` LEFT JOIN usersInterests ON usersInterests.id_user = users.id LEFT JOIN interests ON interests.id = usersInterests.id_interest WHERE interest_name = ? AND users.id = ?';
                db.connection.query(sql, [one, _id], function (err, result) {
                    if (err) {
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    if (result.length == 0) {
                        checkInterest(one);
                    }
                })
            });
            function deletedInterest(id_user, interests) {
                var sql = 'SELECT users.id, GROUP_CONCAT(interests.interest_name) as interests FROM `users` LEFT JOIN usersInterests ON usersInterests.id_user = users.id LEFT JOIN interests ON interests.id = usersInterests.id_interest WHERE users.id = ? GROUP BY users.id';
                db.connection.query(sql, [id_user], function (err, result) {
                    if (err) {
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    if (result[0].interests){
                        _.each(result[0].interests.split(','), function (one) {
                            if (interests.indexOf(one) == -1) {
                                var sql = 'DELETE ui.* FROM `usersInterests` as ui LEFT JOIN interests as i ON i.id = ui.id_interest WHERE ui.id_user = ? AND i.interest_name = ?';
                                db.connection.query(sql, [_id, one], function () {
                                    if (err) deferred.reject(err.name + ': ' + err.message);
                                })
                            }
                        })
                    }

                })
            }
            function checkInterest(interest) {
                var sql = 'SELECT * FROM interests WHERE interest_name = ?'
                db.connection.query(sql, interest, function (err, result) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    if (result.length > 0) {
                        assignInterest(_id,result[0].id);
                    }else {
                        addInterest(interest);
                    }
                })
            }
            function addInterest(interest) {
                var sql = 'INSERT INTO interests(interest_name) VALUES(?)';
                db.connection.query(sql, interest, function (err, result) {
                    if (err) {
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    assignInterest(_id, result.insertId)
                })
            }
            function assignInterest(id_user, id_interest) {
                var sql = 'INSERT INTO usersInterests(id_user, id_interest) VALUES(?,?)';
                db.connection.query(sql, [id_user, id_interest], function (err, result) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                })
            }
            deferred.resolve();
        });
    }

    return deferred.promise;
}


function addPhotosAlbum(_id, files) {
    var deferred = Q.defer();
    _.each(files, function (one) {
        var data = [
            one.path,
            _id,
            0,
        ]
        var sql = 'INSERT INTO photos(photo_link, id_user, isProfil) VALUES (?, ?, ?)';
        db.connection.query(sql, data, function (err, result) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            if (result){
                deferred.resolve(result.insertId);
            }

        })
    });
    return deferred.promise;
}


function updateLocationUser(address, _id) {
    var deferred = Q.defer();
    var sql = 'UPDATE users SET ? WHERE id ='+_id;
    db.connection.query(sql, address, function (err, result) {
        if (err) {
            deferred.reject(err.name + ':' + err.message);
        }
        if (result){
            deferred.resolve()
        }
    });
    return deferred.promise
}

function getPhotoProfil(_id) {
    var deferred = Q.defer();
    var sql = 'SELECT users.id, users.login, photos.photo_link, photos.isProfil FROM `users` LEFT JOIN photos ON photos.id_user = users.id WHERE users.id = ? AND photos.isProfil = ?';
    db.connection.query(sql, [_id, 1], function(err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve(result[0]);
        }else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function UpdatePhotoProfil(_id, url_path) {
    var deferred = Q.defer();
    var data = [
        url_path,
    ]
    var sql = 'UPDATE photos SET photo_link = ? WHERE isProfil = 1 AND id_user ='+_id;
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve();
        }
    })
    return deferred.promise
}

function InsertPhotoProfil(_id, url_path) {
    var deferred = Q.defer();
    var data = [
        url_path,
        _id,
        1
    ]
    var sql = 'INSERT INTO photos(photo_link, id_user, isProfil) VALUES (?, ?, ?)';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve();
        }
    })
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    var sql = 'DELETE users WHERE id = ?'
    db.connection.query(sql, _id, function () {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    })
    return deferred.promise;
}