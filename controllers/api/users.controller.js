﻿var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var multer = require('multer');
var mkdirp = require('mkdirp');
var jwt = require('jsonwebtoken');
var server = require('../../server');



var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
/*        mkdirp('/content/'+req.user.sub, function(err) {

            // path exists unless there was an error

        });*/
        cb(null, './content');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, req.user.sub + '-' + datetimestamp + '.' + file.originalname)
    }
});

var upload = multer({ //multer settings
    storage: storage
}).any();
// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.post('/haveSeen', haveSeen);
router.get('/getSeen', getSeen);
router.get('/current', getCurrentUser);
router.get('/user', getByIdUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/uploads/profil', uploadPhotoProfil);
router.post('/uploads/album', uploadPhotosAlbum);
router.get('/current/profile', getUserPhotoProfile);
router.get('/current/album', getUserPhotosAlbum);
router.get('/user/album', getUserPhotosAlbumById);
router.put('/location/update', updateLocationUser);
router.get('/suggestion', getSuggestions)
router.get('/search', searchUsers);
router.post('/')

module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.login, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('pseudo et/ou mot de passe incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/* 15 + 50 + 10 + 100 + 50 + 100 + 25
* get position (25 pts)
* 350 -> 500
* inscription (50 pts)
* complete profile (100 pts)
* profil vu (50 pts)
* profil matched (100 pts)
* add photos (25 pts)
* blocked (-100 pts)
* reported (-50 pts)
*
*
*
* */
function getUserPhotosAlbumById(req, res) {
    userService.getPhotosAlbum(req.query.user_id)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function haveSeen(req, res) {
    var popularity = 50;
    if (req.user.sub != req.body.user_id) {
        userService.haveSeen( req.user.sub, req.body.user_id)
            .then(function (result) {
                console.log('have Seen : ', result)
                userService.setPopularity(req.body.user_id, popularity)
                    .then(function (result) {
                        console.log('setPopularity')
                        res.sendStatus(200);
                    })
                    .catch(function (err) {
                        if (err) {
                            res.status(400).send(err);
                        }
                    })
            })
            .catch(function (err) {
                res.status(400).send(err)
            })
    }
}

function getSeen(req, res) {
    userService.getSeen(req.user.sub)
        .then(function (result) {
            if (result){
                console.log('getSeen', result)
                res.send(result)
            }
        })
        .catch(function (err) {
            res.status(400).send(err)
        })}

function updateLocationUser(req,res) {
    userService.updateLocationUser(req.body, req.user.sub)
        .then(function (result) {
            res.send();
        })
        .catch(function (err) {
            res.status(400).send(err)
        })
    
}

function getSuggestions(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user){
                userService.getSuggestion(user)
                    .then(function (result) {
                        if (result) {
                            res.send(result)
                        }
                        else {
                            res.sendStatus(404);
                        }
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    })
            }
        })
        .catch(function (err) {
            if (err) {
                console.log(err)
            }
        })
}


function searchUsers(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                userService.searchUsers(user)
                    .then(function (result) {
                        if (result) {
                            res.send(result)
                        }
                        else {
                            res.sendStatus(404);
                        }
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    })
            }
        })
        .catch(function (err) {
            if (err) {
                console.log(err)
            }
        })
}

function getByIdUser(req, res) {
    userService.getByIdUser(req.query.user_id, req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getUserPhotoProfile(req, res) {
     userService.getPhotoProfil(req.user.sub)
        .then(function (result) {
            if (result) {
                res.send(result);
            }else {
                res.send();
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getUserPhotosAlbum(req, res) {
    userService.getPhotosAlbum(req.user.sub)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
/* SELECT u.*, u.id AS id_user, u.city, (ABS(2.31843 - u.lng) + ABS(48.8967  - u.lat)) AS distance, u.zip, u.lat, u.lng, COUNT(ci.id_interest) as commonInterest, ABS(STR_TO_DATE('23/02/1994', '%d/%m/%Y') - STR_TO_DATE(u.birth_date, '%d/%m/%Y')) AS diff_birth, u.birth_date
 FROM users u
 LEFT JOIN usersInterests ui ON ui.id_user = u.id
 LEFT JOIN (SELECT id_interest FROM usersInterests WHERE id_user = 1) ci ON ci.id_interest = ui.id_interest
 WHERE u.id <> 1
 GROUP BY u.id, distance, ui.id_user
 ORDER BY distance ASC, diff_birth ASC, commonInterest DESC */

function uploadPhotoProfil(req, res) {
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        userService.getPhotoProfil(req.user.sub)
            .then(function (result) {
                if (result){
                    return userService.UpdatePhotoProfil(req.user.sub, res.req.files[0].path)
                }
                else {
                    return userService.InsertPhotoProfil(req.user.sub, res.req.files[0].path)
                }

            })
            .then (function (result) {
                userService.getPhotoProfil(req.user.sub)
                    .then(function (result) {
                        if (result) {
                            res.send(result);
                        } else {
                            res.sendStatus(404);
                        }
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    });
                })
            .catch(function (err) {
                res.status(400).send(err);
            })
    })
}

/*             .finally(function (result) {
 userService.getPhotoProfil(req.user.sub)
 .then(function (result) {
 if (result) {
 res.send(result);
 } else {
 res.sendStatus(404);
 }
 })
 .catch(function (err) {
 res.status(400).send(err);
 });
 }) */

function uploadPhotosAlbum(req, res) {
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }

        userService.addPhotosAlbum(req.user.sub, res.req.files)
            .then(function (result) {
                if (result) {
                    userService.getPhotosAlbum(req.user.sub)
                        .then(function (result) {
                            if (result) {
                                res.send(result);
                            } else {
                                res.sendStatus(404);
                            }
                        })
                        .catch(function (err) {
                            res.status(400).send(err);
                        });
                    //res.send(result);
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    })
}


function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.body.id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.body.id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}