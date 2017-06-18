require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var db = require('./lib/db');
var favicon = require('serve-favicon');
var socketioJwt = require('socketio-jwt');
var userService = require('./services/user.service')



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set( "ipaddr", "127.0.0.1" );
app.set( "port", 3000 );
app.use('/content', express.static('content'));
app.use('/assets', express.static('assets'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register', '/api/users/recovery_step1', '/api/users/check_token', '/api/users/recovery_step2'] }));
// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/recovery', require('./controllers/recovery.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/likes', require('./controllers/api/likes.controller'));
app.use('/api/notifications', require('./controllers/api/notifications.controller'));
app.use('/api/chats', require('./controllers/api/chats.controller'));
app.use('/api/reports', require('./controllers/api/reports.controller'));
app.use('/api/blocks', require('./controllers/api/blocks.controller'));
// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});


var io = require('socket.io').listen(server)

io.set('authorization', socketioJwt.authorize({
    secret: config.secret,
    handshake:true
}))

io.on('connection', function (socket) {
    socket.join('user_room_'+socket.client.request.decoded_token.user.id);
    userService.connectedUser(socket.client.request.decoded_token.user.id)
        .then(function () {
        })
    socket.on('disconnect', function(){
        userService.disconnectedUser(socket.client.request.decoded_token.user.id)
            .then(function () {
            })
    });
})

exports.io = {io: io}
