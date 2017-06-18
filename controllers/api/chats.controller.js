var config = require('config.json');
var express = require('express');
var router = express.Router();
var chatService = require('services/chat.service');
var http = require('http');
var server = require('../../server');

router.post('/SendMessage', send_message);
router.get('/getMessagesById', getMessagesById);
router.get('/lastConversations', lastConversations)

module.exports = router;


function send_message(req, res) {
    var id_receiver = req.body.id_receiver;
    var id_author = req.user.sub;
    var content = req.body.content;

    chatService.SendMessage(id_author, id_receiver, content)
        .then(function (result) {
            chatService.LastMessage(id_author, id_receiver)
                .then(function (result) {
                    server.io.io.to('user_room_'+ id_receiver).emit('upcoming_message', result);
                    res.send(result)
                })
                .catch(function (err) {
                    console.log(err)
                })
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).send(err)
        })
}

function getMessagesById(req, res) {
    var id_receiver = req.query.id_receiver;
    var id_author = req.user.sub;

    chatService.getMessagesById(id_author, id_receiver)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).send(err)
        })
}

function lastConversations(req, res) {
    var id = req.user.sub
    chatService.lastConversations(id)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).send(err)
        })
}