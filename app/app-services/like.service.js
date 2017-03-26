(function () {
    'use strict';

    angular
        .module('app')
        .factory('LikeService', Service);

    function Service($http, $q) {
        var service = {};
        service.likeUser = likeUser;
        service.getMatched = getMatched
        service.UnLikeUser = UnLikeUser
        return service;


        function likeUser(_id) {
            return $http.post('/api/likes/likeUser', {id_receiver: _id}).then(handleSuccess, handleError);
        }

        function getMatched(_id) {
            return $http.get('/api/likes/getMatched', {params: {user_id: _id}}).then(handleSuccess, handleError);
        }

        function UnLikeUser(_id) {
            return $http.delete('/api/likes/unLikeUser', {params: {user_id: _id}}).then(handleSuccess, handleError);
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
