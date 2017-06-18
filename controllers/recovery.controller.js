var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/recovery_step1', function (req, res) {
    res.render('recovery_step1');
});

router.get('/recovery_step2/:token', function (req, res) {
    request.post({
        url: config.apiUrl + '/users/check_token',
        form: req.params,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('recovery_step1', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('recovery_step1', {
                error: response.body
            });
        }
        res.render('recovery_step2');
    });
})

router.post('/recovery_step1', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/recovery_step1',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('recovery_step1', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('recovery_step1', {
                error: response.body,
                email: req.body.email
            });
        }
        // return to login page with success message
        req.session.success = 'Good '+ response.body.name + '... !! Check your email for the next step on: ' + response.body.email;
        return res.redirect('/login');
    });
});

router.post('/recovery_step2/:token', function (req, res) {
    var data ={
        token: req.params.token,
        password: req.body.password
    }
    request.post({
        url: config.apiUrl + '/users/recovery_step2',
        form: data,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('recovery_step1', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('recovery_step1', { error: 'An error occurred' });
        }

        // return to login page with success message
        req.session.success = 'Password successfully changed';
        return res.redirect('/login');
    });
});

module.exports = router;