(function () {
    'use strict';

    angular
        .module('app')
        .factory('ChatService', Service);

    function Service($http, $q) {
        var service = {};
        service.SendMessage = SendMessage;
        service.getMessagesById = getMessagesById;
        service.lastConversations = lastConversations;

        return service;

        function SendMessage(id, content) {
            return $http.post('/api/chats/SendMessage', {id_receiver: id, content: content}).then(handleSuccess, handleError);
        }

        function getMessagesById(id) {
            return $http.get('/api/chats/getMessagesById', {params: {id_receiver: id}}).then(handleSuccess, handleError)
        }

        function lastConversations() {
            return $http.get('/api/chats/lastConversations').then(handleSuccess, handleError)
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