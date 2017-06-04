var config = require('config.json');
var express = require('express');
var router = express.Router();
var reportService = require('services/report.service');
var http = require('http');
var server = require('../../server');

router.post('/reported', reported);
router.post('/cancel_reported', cancel_reported);

module.exports = router;


function reported(req, res) {
    var id_receiver = req.body.id_receiver;
    var id_author = req.user.sub;

    reportService.reported(id_author, id_receiver)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).send(err)
        })
}

function cancel_reported(req, res) {
    var id_receiver = req.body.id_receiver;
    var id_author = req.user.sub;

    reportService.cancel_reported(id_author, id_receiver)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).send(err)
        })
}