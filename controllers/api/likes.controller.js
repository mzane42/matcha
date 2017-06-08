var config = require('config.json');
var express = require('express');
var router = express.Router();
var likeService = require('services/like.service');
var userService = require('services/user.service');

router.post('/likeUser', AddLikeUser);
router.get('/getMatched', GetMatched)
router.delete('/unLikeUser', UnLikeUser)

module.exports = router;

function AddLikeUser(req, res) {
    var id_receiver = req.body.id_receiver;
    var id_author = req.user.sub;

    userService.hasPicture(id_author)
        .then(function (hasPicture) {
            if (hasPicture && hasPicture.length > 0) {
                likeService.isConnectedMatched(id_author, id_receiver)
                    .then(function (isConnected) {
                        var connected = 0;
                        if (isConnected) {
                            connected = 1;
                            likeService.updateRelation(id_author, id_receiver, connected)
                                .then(function () {
                                    res.send({success: 'Vous avez flasher', action: 'connected'})
                                })
                                .catch(function (err) {
                                    if (err)
                                        res.status(400).send(err)
                                })
                        }
                        likeService.createRelation(id_author, id_receiver, connected)
                            .then(function (result) {
                                res.send({success: 'Vous avez flasher', action: 'matched'})
                            })
                            .catch(function (err) {
                                res.status(400).send(err);
                            });
                    })
                    .catch(function (err) {
                        res.status(400).send(err)
                    })
            }else {
                res.status(403).send({error: 'You must have at least one picture to flash someone'})
            }
        })
        .catch(function (err) {
            res.status(400).send(err)
        })
}

function UnLikeUser(req, res) {
    var id_receiver = req.query.user_id
    var id_author = req.user.sub

    likeService.deleteRelation(id_author, id_receiver)
        .then(function () {
            likeService.isConnectedMatched(id_author, id_receiver)
                .then(function (isConnected) {
                    var connected = 0;
                    if (isConnected) {
                        likeService.updateRelation(id_author, id_receiver, connected)
                            .then(function () {
                                res.send({success: 'Vous avez deflasher', action: 'deleted'})
                            })
                            .catch(function (err) {
                                if (err)
                                    res.status(400).send(err)
                            })
                    }else {
                        res.send({success: 'Vous avez deflasher', action: 'deflasher'})
                    }
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
//        return res.status(401).send('You can only delete your own account');

function GetMatched(req, res) {
    var id_receiver = req.query.user_id;
    var id_author = req.user.sub;
    likeService.matchedUsers(id_author, id_receiver)
        .then(function (result) {
            if (result) {
                res.send(result);
            } else {
                res.send();
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

}


