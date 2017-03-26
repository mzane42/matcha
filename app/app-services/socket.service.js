(function () {
    'use strict';

    angular
        .module('app')
        .factory('SocketService', Service);

    function Service($rootScope) {
        var socket = null
        return {
            socket: socket,
            init: function (token) {
                var ioSocket = io.connect('', {
                    query: 'token=' + token
                })
                socket = ioSocket
            },
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }

})();