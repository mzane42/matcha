var moment = require('moment');

module.exports = {

    isValidEmail: function( email ) {

        var error = []

        if( email.length == 0 || email == "" )
            error.push("Error Empty Email");
        else {
            if( !/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(email) )
                error.push("Email must be something like abc@rst.xyz");
        }
        return ( (error.length > 0 ? error : null) );
    },
    isValidPassword: function( password ) {

        var illegalChars = /\W/;
        var error = [];
        if( password.length < 3 )
            error.push("The password is too short (3 chars min).");
        else if ( password.length > 20 )
            error.push("The password is too long (20 chars max).");
        if ( illegalChars.test(password) )
            error.push("The Password can only contains '-', '_', alpha-num.");
        return ( (error.length > 0 ? error : null) );
    },
    isValidUsername: function( username ) {

        var illegalChars = /\W/;
        var legalChars = /([-]|[_])/g;
        var tmp = username.replace(legalChars, '');
        var error = [];

        if( typeof tmp == "undefined" ) {
            error.push("Incorrect Username")
            return ( (error.length > 0 ? error : null) );
        }
        if( tmp.length < 3 )
            error.push("The Username is too short (3 chars min).");
        else if ( tmp.length > 20 )
            error.push("The Username is too long (20 chars max).");
        if ( illegalChars.test(tmp) )
            error.push("The Username can only contains '-', '_', alpha-num.");
        return ( (error.length > 0 ? error : null) );
    }
}