var config = require('config.json');
var express = require('express');
var router = express.Router();
var notificationService = require('services/notification.service');
var http = require('http');
var server = require('../../server');

router.post('/create', NewNotification);
router.get('/getNotifications', GetNotifications);
router.put('/updateSeen', updateSeen)

module.exports = router;

function updateSeen(req, res) {
    notificationService.updateSeen(req.user.sub)
        .then(function (result) {
            console.log(result)
            res.send(result)
                //server.io.io.to('user_room_'+req.user.sub)
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).send(err)
        })
}

function NewNotification(req, res) {
    var id_receiver = req.body.id_receiver;
    var action = req.body.action;
    var id_author = req.user.sub;

    notificationService.newNotification(id_author, id_receiver, action)
        .then(function (result) {
            notificationService.getLastNotification(id_receiver)
                .then(function (result) {
                    if (result) {
                        server.io.io.to('user_room_'+ id_receiver).emit('notification', result);
                        res.send(result);
                    } else {
                        res.send();
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

/*function deleteNotification(req, res) {
    var id_author = req.query.user_id
    var id_receiver = req.user.sub
    notificationService.deleteNotification(id_author, id_receiver)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}*/
//        return res.status(401).send('You can only delete your own account');

function GetNotifications(req, res) {
    var _id = req.user.sub;
    notificationService.getNotifications(_id)
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