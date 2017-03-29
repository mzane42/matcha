(function () {
    'use strict';

    angular
        .module('app')
        .factory('NotificationService', Service);

    function Service($http, $q) {
        var service = {};
        service.pushNotification = pushNotification;
        service.getNotifications = getNotifications;
        service.updateSeen = updateSeen;

        return service;


        function pushNotification(_id, action) {
            return $http.post('/api/notifications/create', {id_receiver: _id, action: action}).then(handleSuccess, handleError);
        }

        function getNotifications() {
            return $http.get('/api/notifications/getNotifications').then(handleSuccess, handleError);
        }

        function updateSeen() {
            return $http.put('/api/notifications/updateSeen').then(handleSuccess, handleError);
        }
/*
        function getMatched(_id) {
            return $http.get('/api/likes/getMatched', {params: {user_id: _id}}).then(handleSuccess, handleError);
        }

        function UnLikeUser(_id) {
            return $http.delete('/api/likes/unLikeUser', {params: {user_id: _id}}).then(handleSuccess, handleError);
        }
*/
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