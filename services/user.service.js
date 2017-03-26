var config = require('config.json');
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
service.getSuggestion = getSuggestion;
service.searchUsers = searchUsers;
service.getByIdUser = getByIdUser;
service.haveSeen = haveSeen;
service.getSeen = getSeen;
service.getPopularity = getPopularity;
service.setPopularity = setPopularity;

module.exports = service;

function authenticate(login, password) {
    var deferred = Q.defer();

    var sql = 'SELECT * FROM users WHERE login = ?';
    db.connection.query(sql, login, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result[0] && bcrypt.compareSync(password, result[0]['password'])) {
            // authentication successful
            var user = {
                id: result[0]['id'],
                name: result[0]['first_name'] + ' ' + result[0]['last_name'],
                email: result[0]['email'],
                login: result[0]['login']
            }
            deferred.resolve(jwt.sign({ sub: result[0]['id'], user: user}, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    }) 
    return deferred.promise;
}

function getPopularity(user_id) {
    var deferred = Q.defer();
    var sql = 'SELECT id, popularity FROM users WHERE id = ?'
    db.connection.query(sql, user_id, function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message);
        if (result){
            deferred.resolve(result[0])
        }else {
            deferred.resolve();
        }
    })
    return deferred.promise;
}

function  setPopularity(user_id, value) {
    var deferred = Q.defer();
    var data = [user_id, value]
    var sql = 'UPDATE users SET popularity = popularity + ? WHERE id = ?';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': ', err.message);
        if (result) {
            deferred.resolve();
        }
    })
    return deferred.promise;
}

function searchUsers(user) {
    var deferred = Q.defer();
    var sql = "SELECT u.id AS id_user, u.first_name, u.last_name, u.login,u.city, u.popularity,(ABS(ROUND("+db.connection.escape(user.lng)+", 2) - ROUND(u.lng, 2)) + ABS(ROUND("+db.connection.escape(user.lat)+", 2) - ROUND(u.lat, 2))) AS distance, u.zip, u.lat, u.lng, COUNT(ci.id_interest) as commonInterest, ABS(STR_TO_DATE("+db.connection.escape(user.birth_date)+", '%d/%m/%Y') - STR_TO_DATE(u.birth_date, '%d/%m/%Y')) AS diff_birth, u.birth_date, u.gender, u.orientation, p.photo_link, GROUP_CONCAT(i.interest_name) as interests, (ma.id IS NOT NULL) AS matched FROM users u LEFT JOIN usersInterests ui ON ui.id_user = u.id LEFT JOIN (SELECT id_interest FROM usersInterests WHERE id_user = "+db.connection.escape(user.id)+") ci ON ci.id_interest = ui.id_interest LEFT JOIN interests i ON i.id = ui.id_interest LEFT JOIN photos p ON p.id_user = u.id AND p.isProfil = 1 LEFT JOIN matched ma ON (ma.id_author = "+db.connection.escape(user.id)+" AND ma.id_receiver = u.id)  WHERE u.id <> "+db.connection.escape(user.id)+" GROUP BY u.id, ui.id_user, p.id, ma.id ORDER BY distance ASC, commonInterest DESC, diff_birth ASC"
    db.connection.query(sql, function (err, result) {
        if (err) deferred.reject(err.name + ':' + err.message);
        if (result) {
            deferred.resolve(Array.prototype.slice.call(result));
        }else {
            deferred.resolve()
        }
    })
    return deferred.promise;
}

function getSuggestion(user) {
    var deferred = Q.defer();
    var sql = "SELECT u.id AS id_user, u.first_name, u.last_name,u.city, u.popularity,(ABS(ROUND("+db.connection.escape(user.lng)+", 2) - ROUND(u.lng, 2)) + ABS(ROUND("+db.connection.escape(user.lat)+", 2) - ROUND(u.lat, 2))) AS distance, u.zip, u.lat, u.lng, COUNT(ci.id_interest) as commonInterest, ABS(STR_TO_DATE("+db.connection.escape(user.birth_date)+", '%d/%m/%Y') - STR_TO_DATE(u.birth_date, '%d/%m/%Y')) AS diff_birth, u.birth_date, u.gender, u.orientation, p.photo_link, GROUP_CONCAT(i.interest_name) as interests, (ma.id IS NOT NULL) AS matched  FROM users u LEFT JOIN usersInterests ui ON ui.id_user = u.id LEFT JOIN (SELECT id_interest FROM usersInterests WHERE id_user = "+db.connection.escape(user.id)+") ci ON ci.id_interest = ui.id_interest LEFT JOIN interests i ON i.id = ui.id_interest LEFT JOIN photos p ON p.id_user = u.id AND p.isProfil = 1 LEFT JOIN matched ma ON (ma.id_author = "+db.connection.escape(user.id)+" AND ma.id_receiver = u.id) WHERE u.id <> "+db.connection.escape(user.id)+" AND u.gender LIKE (CASE "+db.connection.escape(user.gender)+" WHEN 'm' THEN ( CASE "+db.connection.escape(user.orientation)+" WHEN 'Hetero' THEN 'f' WHEN 'Homo' THEN 'm' ELSE '%%' END) WHEN 'f' THEN ( CASE "+db.connection.escape(user.orientation)+" WHEN 'Hetero' THEN 'm' WHEN 'Homo' THEN 'f' ELSE '%%' END) END) AND u.orientation LIKE (CASE "+db.connection.escape(user.orientation)+" WHEN ('Hetero' AND u.orientation = 'Hetero') THEN 'Hetero' WHEN ('Hetero' AND u.orientation = 'Bi') THEN 'Bi' WHEN ('Homo' AND u.orientation = 'Homo') THEN 'Homo' WHEN ('Homo' AND u.orientation = 'Bi') THEN 'Bi' WHEN 'Bi' THEN (CASE WHEN u.gender = "+db.connection.escape(user.gender)+" AND u.orientation = 'Bi' THEN 'Bi' WHEN u.gender = "+db.connection.escape(user.gender)+" AND u.orientation = 'Homo' THEN 'Homo' WHEN (u.gender <> "+db.connection.escape(user.gender)+" AND u.orientation = 'Bi') THEN 'Bi' WHEN (u.gender <> "+db.connection.escape(user.gender)+" AND u.orientation = 'Hetero') THEN 'Hetero' END) END) GROUP BY u.id, ui.id_user, p.id, ma.id ORDER BY distance ASC, diff_birth ASC, commonInterest DESC"
    db.connection.query(sql, function (err, result) {
        if (err) deferred.reject(err.name + ':' + err.message);
        if (result) {
            deferred.resolve(Array.prototype.slice.call(result));
        }else {
            deferred.resolve()
        }
    });
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


function haveSeen(id_author, id_receiver) {
    var deferred = Q.defer();
    var d = new Date,
        dformat = [ (d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/')+
            ' ' +
            [ d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
    console.log(d);
    var data = [
        id_author,
        id_receiver,
        dformat
    ]
    var sql = 'INSERT INTO seen(id_author, id_receiver, created_at) VALUES (?, ?, ?)';
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve();
        }
    })
    return deferred.promise;
}


function getSeen(id) {
    var deferred = Q.defer();
    var sql = 'SELECT id_author, aut.last_name as author_last_name, aut.first_name as author_first_name, aut_p.photo_link as author_img, id_receiver, re.last_name as receiver_last_name, re.first_name as receiver_first_name, re_p.photo_link as receiver_img, seen.created_at FROM seen LEFT JOIN users aut ON aut.id = id_author LEFT JOIN photos aut_p ON aut_p.id_user = aut.id and aut_p.isProfil = 1 LEFT JOIN users re ON re.id = id_receiver LEFT JOIN photos re_p ON re_p.id_user = re.id and re_p.isProfil = 1 WHERE id_receiver = ? AND seen.created_at = (SELECT MAX(seen.created_at) FROM seen WHERE seen.id_author = aut.id) ORDER BY seen.created_at DESC'
    db.connection.query(sql, id, function(err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve(result);
        }else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();  
    var sql = 'SELECT users.id, bio, email, last_name, first_name, login, password,  birth_date, gender, popularity,orientation, GROUP_CONCAT(i.interest_name) as interests, lat, lng, city, zip, country FROM `users` LEFT JOIN usersInterests ui ON ui.id_user = users.id LEFT JOIN interests i On i.id = ui.id_interest WHERE users.id = ? GROUP BY users.id'
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

function getByIdUser(_id, me) {
    var deferred = Q.defer();
    var sql = 'SELECT users.id, bio, email, last_name, first_name, login, password, birth_date, gender, popularity,orientation, GROUP_CONCAT(i.interest_name) as interests, lat, lng, city, zip, country, p.photo_link, (ma.id IS NOT NULL) AS matched FROM `users` LEFT JOIN usersInterests ui ON ui.id_user = users.id LEFT JOIN interests i On i.id = ui.id_interest LEFT JOIN photos p ON p.id_user = users.id AND p.isProfil = 1 LEFT JOIN matched ma ON (ma.id_author = '+db.connection.escape(me)+' AND ma.id_receiver = users.id)  WHERE users.id = ? GROUP BY users.id, ma.id, p.id, ui.id_user'
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
        user.popularity = 50;
        var data = [
            user.first_name,
            user.login,
            user.last_name,
            user.email,
            user.password,
            user.popularity
        ]
        var sql = 'INSERT INTO users(first_name, login, last_name, email,password, popularity) VALUES (?,?,?,?,?,?);';
        db.connection.query(sql, data, function (err, result) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (result){
                deferred.resolve();
            }
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
            bio: userParam.bio,
            city: userParam.city,
            country: userParam.country,
            lat: userParam.lat,
            lng: userParam.lng
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