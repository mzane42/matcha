var config = require('config.json');
var express = require('express');
var router = express.Router();
var notificationService = require('services/notification.service');

router.post('/create', NewNotification);
router.get('/getNotifications', GetNotifications);

module.exports = router;

function NewNotification(req, res) {
    var id_author = req.body.id_author;
    var action = req.body.action;
    var id_receiver = req.user.sub;

    notificationService.newNotification(id_author, id_receiver, action)
        .then(function () {
            res.sendStatus(201);
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