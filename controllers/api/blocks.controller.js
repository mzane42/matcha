var config = require('config.json');
var express = require('express');
var router = express.Router();
var blockService = require('services/block.service');
var http = require('http');
var server = require('../../server');

router.post('/blocked', blocked);
router.get('/cancel_blocked', cancel_blocked);

module.exports = router;


function blocked(req, res) {
    var id_receiver = req.body.id_receiver;
    var id_author = req.user.sub;

    blockService.blocked(id_author, id_receiver)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).send(err)
        })
}

function cancel_blocked(req, res) {
    var id_receiver = req.query.id_receiver;
    var id_author = req.user.sub;

    blockService.cancel_blocked(id_author, id_receiver)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).send(err)
        })
}