var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    port     : '3307',
    database : 'db_matcha'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = {
	connection: connection
};
