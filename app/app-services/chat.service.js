(function () {
    'use strict';

    angular
        .module('app')
        .factory('ChatService', Service);

    function Service($http, $q) {
        var service = {};
        service.SendMessage = SendMessage;
        service.getMessagesById = getMessagesById;
        service.lastChatters = lastChatters;

        return service;

        function SendMessage(id, content) {
            return $http.post('/api/chats/SendMessage', {id_receiver: id, content: content}).then(handleSuccess, handleError);
        }

        function getMessagesById(id) {
            return $http.get('/api/chats/getMessagesById', {params: {id_receiver: id}}).then(handleSuccess, handleError)
        }

        function lastChatters() {
            return $http.get('/api/chats/lastChatters').then(handleSuccess, handleError)
        }
        // private functions

        function handleSuccess(res) {
            //console.log(res);
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res);
        }
    }

})();