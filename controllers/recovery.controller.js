var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/recovery_step1', function (req, res) {
    res.render('recovery_step1');
});

router.get('/recovery_step2', function (req, res) {
    res.render('recovery_step2')
})

router.post('/recovery_step1', function (req, res) {
    console.log('recovery_step1 POST !!!');
    console.log(req.body);
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
        console.log(response.body);
        req.session.success = 'success !! Check your email for the next step : ' + response.body;
        return res.redirect('/login');
    });
});

router.post('/recovery_step2', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('register', {
                error: response.body,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                login: req.body.login,
                email: req.body.email
            });
        }

        // return to login page with success message
        req.session.success = 'Registration successful';
        return res.redirect('/login');
    });
});

module.exports = router;