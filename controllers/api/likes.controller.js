var config = require('config.json');
var express = require('express');
var router = express.Router();
var likeService = require('services/like.service');

router.post('/likeUser', AddLikeUser);
router.get('/getMatched', GetMatched)
router.delete('/unLikeUser', UnLikeUser)

module.exports = router;

function AddLikeUser(req, res) {
    var id_author = req.body.id_author;
    var id_receiver = req.user.sub;

    likeService.matchedUsers(id_author, id_receiver)
        .then(function (matched) {
            if (matched && matched.length > 0){
                console.log(matched)
                res.status(401).send('tu peux flasher une seule fois par personne');
            }
            else {
                likeService.createRelation(id_author, id_receiver)
                    .then(function () {
                        res.sendStatus(200);
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    });
            }
        })
        .catch(function (err) {
            res.status(400).send(err)
        })
}

function UnLikeUser(req, res) {
    var id_author = req.query.user_id
    var id_receiver = req.user.sub
    likeService.deleteRelation(id_author, id_receiver)
        .then(function () {
                res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
//        return res.status(401).send('You can only delete your own account');

function GetMatched(req, res) {
    var id_user1 = req.query.user_id;
    var id_user2 = req.user.sub;
    likeService.matchedUsers(id_user1, id_user2)
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

