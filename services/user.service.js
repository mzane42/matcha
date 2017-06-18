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
service.CheckEmail = CheckEmail;
service.recoveryStep1 = recoveryStep1;
service.check_token_reset = check_token_reset;
service.recoveryStep2 = recoveryStep2;
service.getLastSeen = getLastSeen;
service.hasPicture = hasPicture;
service.connectedUser = connectedUser;
service.disconnectedUser = disconnectedUser;
service.getUserInterests = getUserInterests

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

function disconnectedUser(id) {
    var deferred = Q.defer();
    var d = new Date,
        offline_since = [ (d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/')+
            ' ' +
            [ d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
    var connected = 0;
    var active_since = "NULL"
    var data = {
        connected: connected,
        offline_since: offline_since,
        active_since: active_since
    }
    var sql = 'UPDATE users SET ? WHERE id = ?';
    db.connection.query(sql, [data, id], function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    })
    return deferred.promise;
}

function connectedUser(id) {
    var deferred = Q.defer();
    var d = new Date,
        active_since = [ (d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/')+
            ' ' +
            [ d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
    var connected = 1;
    var offline_since = "NULL"

    var data = {
        connected: connected,
        active_since: active_since,
        offline_since: offline_since
    }

    var sql = 'UPDATE users SET ? WHERE id ='+ +id;
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    })
    return deferred.promise;
}

function CheckEmail(email) {
    var deferred = Q.defer();

    var sql = 'SELECT * FROM users WHERE email = ?';
    db.connection.query(sql, email, function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result[0]) {
            // authentication successful
            var nameUpperCase = result[0]['first_name'].charAt(0).toUpperCase() + result[0]['first_name'].substring(1)
            var user = {
                name: nameUpperCase,
                email: result[0]['email']
            }
            deferred.resolve(user);
        } else {
            // authentication failed
            deferred.resolve();
        }
    })
    return deferred.promise;
}


function recoveryStep1(email, token, token_expires) {
    var deferred = Q.defer();
    var reset = {
        reset_token: token,
        reset_token_expires: token_expires,
    }
    var sql = 'UPDATE users SET ?  WHERE email = ?';
    db.connection.query(sql, [reset, email], function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message)
        if (result) {
            deferred.resolve()
        }
    })
    return deferred.promise;
}

function check_token_reset(token) {
    var deferred = Q.defer();
    var data = [
        token,
        Date.now()
    ]
    var sql = 'SELECT * FROM users WHERE reset_token = ? and reset_token_expires > ?'
    db.connection.query(sql, data, function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message);
        if (result){
            deferred.resolve(result[0])
        }else {
            deferred.resolve();
        }
    })
    return deferred.promise;
}

function recoveryStep2(token, password) {
    var deferred = Q.defer();
    var reset = {
        reset_token: null,
        reset_token_expires: null,
        password: bcrypt.hashSync(password, 10)
    }
    var sql = 'UPDATE users SET ? WHERE reset_token = ?';
    db.connection.query(sql, [reset, token], function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message)
        if (result) {
            deferred.resolve()
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
    var sql = "SELECT u.id AS id_user, u.first_name, u.last_name, u.login,u.city, u.created_at, u.connected as actif, u.offline_since, u.active_since,(ABS(ROUND("+db.connection.escape(user.lng)+", 2) - ROUND(u.lng, 2)) + ABS(ROUND("+db.connection.escape(user.lat)+", 2) - ROUND(u.lat, 2))) AS distance, u.zip, u.lat, u.lng, COUNT(ci.id_interest) as commonInterest, ABS(STR_TO_DATE("+db.connection.escape(user.birth_date)+", '%d/%m/%Y') - STR_TO_DATE(u.birth_date, '%d/%m/%Y')) AS diff_birth, u.birth_date, u.gender, u.orientation, p.photo_link, GROUP_CONCAT(i.interest_name) as interests, (ma.id IS NOT NULL) AS matched, (cn.id IS NOT NULL) as connected, (bk.id IS NOT NULL) AS blocked, (rp.id IS NOT NULL) AS reported, LEAST(ROUND(GREATEST(((COUNT(distinct mac.id) * 50) + (COUNT(distinct cnc.id) * 20) + (COUNT(distinct bkc.id) * -20) + (COUNT(distinct rpc.id) * -10) + (COUNT(distinct snc.id) * 20) + u.popularity), 0), 0), 1000) as popularity FROM users u LEFT JOIN usersInterests ui ON ui.id_user = u.id LEFT JOIN (SELECT id_interest FROM usersInterests WHERE id_user = "+db.connection.escape(user.id)+") ci ON ci.id_interest = ui.id_interest LEFT JOIN interests i ON i.id = ui.id_interest LEFT JOIN photos p ON p.id_user = u.id AND p.isProfil = 1 LEFT JOIN matched ma ON (ma.id_author = "+db.connection.escape(user.id)+" AND ma.id_receiver = u.id) LEFT JOIN matched cn ON ((cn.id_author = "+db.connection.escape(user.id)+" AND cn.id_receiver = u.id) and cn.connected = 1) LEFT JOIN blocked bk ON (bk.id_author = "+db.connection.escape(user.id)+" AND bk.id_receiver = u.id)  LEFT JOIN reported rp ON (rp.id_author = "+db.connection.escape(user.id)+" AND rp.id_receiver = u.id) LEFT JOIN matched mac ON (mac.id_receiver = u.id) LEFT JOIN matched cnc ON ((cnc.id_receiver = u.id) and cnc.connected = 1) LEFT JOIN blocked bkc ON (bkc.id_receiver = u.id)  LEFT JOIN reported rpc ON (rpc.id_receiver = u.id) LEFT JOIN ( SELECT seen.id, id_author, id_receiver FROM seen LEFT JOIN users aut ON aut.id = id_author LEFT JOIN users re ON re.id = id_receiver WHERE id_receiver = re.id AND seen.created_at = (SELECT MAX(seen.created_at) FROM seen WHERE seen.id_author = aut.id)) snc ON snc.id_receiver = u.id WHERE u.id <> "+db.connection.escape(user.id)+" and (bk.id IS NULL) GROUP BY u.id, ui.id_user, p.id, ma.id, cn.id, bk.id, rp.id ORDER BY distance ASC, commonInterest DESC, diff_birth ASC"
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
    var sql = "SELECT u.id AS id_user, u.first_name, u.last_name,u.city, u.created_at, u.connected as actif, u.offline_since, u.active_since ,(ABS(ROUND("+db.connection.escape(user.lng)+", 2) - ROUND(u.lng, 2)) + ABS(ROUND("+db.connection.escape(user.lat)+", 2) - ROUND(u.lat, 2))) AS distance, u.zip, u.lat, u.lng, COUNT(ci.id_interest) as commonInterest, ABS(STR_TO_DATE("+db.connection.escape(user.birth_date)+", '%d/%m/%Y') - STR_TO_DATE(u.birth_date, '%d/%m/%Y')) AS diff_birth, u.birth_date, u.gender, u.orientation, p.photo_link, GROUP_CONCAT(i.interest_name) as interests, (ma.id IS NOT NULL) AS matched, (cn.id IS NOT NULL) as connected, (bk.id IS NOT NULL) AS blocked, (rp.id IS NOT NULL) AS reported, LEAST(ROUND(GREATEST(((COUNT(distinct mac.id) * 50) + (COUNT(distinct cnc.id) * 20) + (COUNT(distinct bkc.id) * -20) + (COUNT(distinct rpc.id) * -10) + (COUNT(distinct snc.id) * 20) + u.popularity), 0), 0), 1000) as popularity FROM users u LEFT JOIN usersInterests ui ON ui.id_user = u.id LEFT JOIN (SELECT id_interest FROM usersInterests WHERE id_user = "+db.connection.escape(user.id)+") ci ON ci.id_interest = ui.id_interest LEFT JOIN interests i ON i.id = ui.id_interest LEFT JOIN photos p ON p.id_user = u.id AND p.isProfil = 1 LEFT JOIN matched ma ON (ma.id_author = "+db.connection.escape(user.id)+" AND ma.id_receiver = u.id) LEFT JOIN matched cn ON ((cn.id_author = "+db.connection.escape(user.id)+" AND cn.id_receiver = u.id) and cn.connected = 1) LEFT JOIN blocked bk ON (bk.id_author = "+db.connection.escape(user.id)+" AND bk.id_receiver = u.id)  LEFT JOIN reported rp ON (rp.id_author = "+db.connection.escape(user.id)+" AND rp.id_receiver = u.id) LEFT JOIN matched mac ON (mac.id_receiver = u.id) LEFT JOIN matched cnc ON ((cnc.id_receiver = u.id) and cnc.connected = 1) LEFT JOIN blocked bkc ON (bkc.id_receiver = u.id)  LEFT JOIN reported rpc ON (rpc.id_receiver = u.id) LEFT JOIN ( SELECT seen.id, id_author, id_receiver FROM seen LEFT JOIN users aut ON aut.id = id_author LEFT JOIN users re ON re.id = id_receiver WHERE id_receiver = re.id AND seen.created_at = (SELECT MAX(seen.created_at) FROM seen WHERE seen.id_author = aut.id)) snc ON snc.id_receiver = u.id WHERE u.id <> "+db.connection.escape(user.id)+" AND (bk.id IS NULL) AND u.gender LIKE (CASE "+db.connection.escape(user.gender)+" WHEN 'm' THEN ( CASE "+db.connection.escape(user.orientation)+" WHEN 'Hetero' THEN 'f' WHEN 'Homo' THEN 'm' ELSE '%%' END) WHEN 'f' THEN ( CASE "+db.connection.escape(user.orientation)+" WHEN 'Hetero' THEN 'm' WHEN 'Homo' THEN 'f' ELSE '%%' END) END) AND u.orientation LIKE (CASE "+db.connection.escape(user.orientation)+" WHEN ('Hetero' AND u.orientation = 'Hetero') THEN 'Hetero' WHEN ('Hetero' AND u.orientation = 'Bi') THEN 'Bi' WHEN ('Homo' AND u.orientation = 'Homo') THEN 'Homo' WHEN ('Homo' AND u.orientation = 'Bi') THEN 'Bi' WHEN 'Bi' THEN (CASE WHEN u.gender = "+db.connection.escape(user.gender)+" AND u.orientation = 'Bi' THEN 'Bi' WHEN u.gender = "+db.connection.escape(user.gender)+" AND u.orientation = 'Homo' THEN 'Homo' WHEN (u.gender <> "+db.connection.escape(user.gender)+" AND u.orientation = 'Bi') THEN 'Bi' WHEN (u.gender <> "+db.connection.escape(user.gender)+" AND u.orientation = 'Hetero') THEN 'Hetero' END) END) GROUP BY u.id, ui.id_user, p.id, ma.id, cn.id, rp.id, bk.id ORDER BY distance ASC, diff_birth ASC, commonInterest DESC"
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


function getLastSeen(id) {
    var deferred = Q.defer()
    var sql = 'SELECT id_author, aut.last_name as author_last_name, aut.first_name as author_first_name, aut_p.photo_link as author_img, id_receiver, re.last_name as receiver_last_name, re.first_name as receiver_first_name, re_p.photo_link as receiver_img, seen.created_at FROM seen LEFT JOIN users aut ON aut.id = id_author LEFT JOIN photos aut_p ON aut_p.id_user = aut.id and aut_p.isProfil = 1 LEFT JOIN users re ON re.id = id_receiver LEFT JOIN photos re_p ON re_p.id_user = re.id and re_p.isProfil = 1 WHERE id_receiver = ? AND seen.created_at = (SELECT MAX(seen.created_at) FROM seen WHERE seen.id_author = aut.id) ORDER BY seen.created_at DESC LIMiT 1'
    db.connection.query(sql, id, function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message);
        if (result){
            deferred.resolve(result);
        }else{
            deferred.resolve();
        }
    });
    return deferred.promise
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
    var sql = 'SELECT users.id, bio, email, last_name, first_name, login, password,  birth_date, gender, LEAST(ROUND(GREATEST(((COUNT(distinct mac.id) * 50) + (COUNT(distinct cnc.id) * 20) + (COUNT(distinct bkc.id) * -20) + (COUNT(distinct rpc.id) * -10) + (COUNT(distinct snc.id) * 20) + users.popularity), 0), 0), 1000) as popularity, p.photo_link,orientation, lat, lng, city, zip, country  FROM `users` LEFT JOIN photos p ON p.id_user = users.id AND p.isProfil = 1  LEFT JOIN matched mac ON (mac.id_receiver = users.id) LEFT JOIN matched cnc ON ((cnc.id_receiver = users.id) and cnc.connected = 1) LEFT JOIN blocked bkc ON (bkc.id_receiver = users.id)  LEFT JOIN reported rpc ON (rpc.id_receiver = users.id) LEFT JOIN ( SELECT seen.id, id_author, id_receiver FROM seen LEFT JOIN users aut ON aut.id = id_author LEFT JOIN users re ON re.id = id_receiver WHERE id_receiver = re.id AND seen.created_at = (SELECT MAX(seen.created_at) FROM seen WHERE seen.id_author = aut.id)) snc ON snc.id_receiver = users.id WHERE users.id = ? GROUP BY users.id, p.id'
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
    var sql = 'SELECT users.id, bio, last_name, first_name, login, password, birth_date, gender, users.created_at, users.connected as actif, offline_since, active_since,orientation, lat, lng, city, zip, country, p.photo_link, (ma.id IS NOT NULL) AS matched, (bk.id IS NOT NULL) AS blocked, (rp.id IS NOT NULL) AS reported, (cn.id IS NOT NULL) AS connected, LEAST(ROUND(GREATEST(((COUNT(distinct mac.id) * 50) + (COUNT(distinct cnc.id) * 20) + (COUNT(distinct bkc.id) * -20) + (COUNT(distinct rpc.id) * -10) + (COUNT(distinct snc.id) * 20) + users.popularity), 0), 0), 1000) as popularity FROM `users` LEFT JOIN photos p ON p.id_user = users.id AND p.isProfil = 1 LEFT JOIN matched ma ON (ma.id_author = '+db.connection.escape(me)+' AND ma.id_receiver = users.id) LEFT JOIN matched cn ON ((cn.id_author = '+db.connection.escape(_id)+' AND cn.id_receiver = '+db.connection.escape(me)+') and cn.connected = 1) LEFT JOIN blocked bk ON (bk.id_author = '+db.connection.escape(me)+' AND bk.id_receiver = users.id)  LEFT JOIN reported rp ON (rp.id_author = '+db.connection.escape(me)+' AND rp.id_receiver = users.id) LEFT JOIN matched mac ON (mac.id_receiver = users.id) LEFT JOIN matched cnc ON ((cnc.id_receiver = users.id) and cnc.connected = 1) LEFT JOIN blocked bkc ON (bkc.id_receiver = users.id)  LEFT JOIN reported rpc ON (rpc.id_receiver = users.id) LEFT JOIN ( SELECT seen.id, id_author, id_receiver FROM seen LEFT JOIN users aut ON aut.id = id_author LEFT JOIN users re ON re.id = id_receiver WHERE id_receiver = re.id AND seen.created_at = (SELECT MAX(seen.created_at) FROM seen WHERE seen.id_author = aut.id)) snc ON snc.id_receiver = users.id WHERE users.id = ? GROUP BY users.id, ma.id, cn.id, p.id, rp.id, bk.id'
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

function getUserInterests(id) {
    var deferred = Q.defer();
    var sql = 'select GROUP_CONCAT(i.interest_name) as interests from usersInterests ui LEFT JOIN interests i On i.id = ui.id_interest where id_user = ?';
    db.connection.query(sql, id ,function(err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result) {
            deferred.resolve(result[0]);
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


function hasPicture(id) {
    var deferred = Q.defer();
    var sql = 'select * from photos where id_user = ? and isProfil = 1'
    db.connection.query(sql, id, function (err, result) {
        if (err) deferred.reject(err.name + ': '+ err.message)
        if (result) {
            deferred.resolve(result)
        }else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}


function create(userParam) {
    var deferred = Q.defer();

    // validation
    var sql = 'SELECT * FROM users WHERE login = ? OR email = ? LIMIT 1';
    db.connection.query(sql, [userParam.login, userParam.email], function (err, result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (result.length > 0) {
            // login already exists
            deferred.reject('login or email is already taken');
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
        var d = new Date,
            dformat = [ (d.getMonth()+1).padLeft(),
                    d.getDate().padLeft(),
                    d.getFullYear()].join('/')+
                ' ' +
                [ d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');
        var data = [
            user.first_name,
            user.login,
            user.last_name,
            user.email,
            user.password,
            user.popularity,
            dformat
        ]
        var sql = 'INSERT INTO users(first_name, login, last_name, email,password, popularity, created_at) VALUES (?,?,?,?,?,?,?);';
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
            0
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