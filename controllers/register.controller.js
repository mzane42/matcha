var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var vld = require('../lib/userValidator');


router.get('/', function (req, res) {
    res.render('register');
});

router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        var error = [];

        if (vld.isValidUsername(req.body.login) !== null) {
            error.push( vld.isValidUsername(req.body.login) );
        }else if (vld.isValidEmail(req.body.email) !== null) {
            error.push( vld.isValidEmail(req.body.email) )
        }else if (vld.isValidPassword(req.body.password) !== null)
            error.push( vld.isValidPassword(req.body.password) );
        //error.push( vld.isValidBirthdate(user.birthday) );


        if (error && error.length > 0) {
            return res.render('register', {error: error});
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