var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var multer = require('multer');
var mkdirp = require('mkdirp');


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
router.get('/current', getCurrentUser);
//router.get('/interests?query=', getInterests)
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/uploads/profil', uploadPhotoProfil);
router.post('/uploads/album', uploadPhotosAlbum);
router.get('/current/profile', getUserPhotoProfile);
router.get('/current/album', getUserPhotosAlbum);
router.put('/location/update', updateLocationUser);

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

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateLocationUser(req,res) {
    userService.updateLocationUser(req.body, req.user.sub)
        .then(function (result) {
            res.send();
        })
        .catch(function (err) {
            res.status(400).send(err)
        })
    
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