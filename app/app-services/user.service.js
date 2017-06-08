(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetBylogin = GetBylogin;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetInterest = GetInterest;
        service.GetPhotoProfile = GetPhotoProfile;
        service.GetPhotoAlbum = GetPhotoAlbum;
        service.UpdateLocationUser = UpdateLocationUser;
        service.GetSuggestion = GetSuggestion;
        service.SearchUsers = SearchUsers;
        service.GetById = GetById;
        service.GetPhotoAlbumById = GetPhotoAlbumById;
        service.HaveSeen = HaveSeen;
        service.GetSeen = GetSeen;
        service.repotedUser = repotedUser;
        service.dereportedUser = dereportedUser;
        service.blockedUser = blockedUser;
        service.isConnectedWithId = isConnectedWithId;
        service.isBlockedWithId = isBlockedWithId;

        return service;

        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/users/user', {params: {user_id: _id}}).then(handleSuccess, handleError);
        }

        function GetPhotoAlbumById(_id) {
            return $http.get('/api/users/user/album', {params: {user_id: _id}}).then(handleSuccess, handleError);
        }

        function Liker(_id) {
            return $http.post('/api/likes/', {params: {id_receiver: _id}}).then(handleSuccess, handleError);
        }
        function GetBylogin(login) {
            return $http.get('/api/users/' + login).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function GetInterest() {
            return $http.get('/api/users/interests').then(handleSuccess,handleError);
        }

        function GetPhotoProfile() {
            return $http.get('/api/users/current/profile').then(handleSuccess, handleError);
        }


        function GetPhotoAlbum() {
            return $http.get('/api/users/current/album').then(handleSuccess, handleError);
        }

        function UpdateLocationUser(coord) {
            return $http.put('/api/users/location/update', coord).then(handleSuccess, handleError);
        }

        function GetSuggestion() {
            return $http.get('/api/users/suggestion').then(handleSuccess, handleError);
        }

        function SearchUsers() {
            return $http.get('/api/users/search').then(handleSuccess, handleError);
        }

        function HaveSeen(id) {
            return $http.post('/api/users/haveSeen', {user_id: id}).then(handleSuccess, handleError);
        }
        function GetSeen() {
            return $http.get('/api/users/GetSeen').then(handleSuccess, handleError);

        }

        function repotedUser(id) {
            return $http.post('/api/reports/reported', {id_receiver: id}).then(handleSuccess, handleError)
        }

        function blockedUser(id) {
            return $http.post('/api/blocks/blocked', {id_receiver: id}).then(handleSuccess, handleError)
        }

        function dereportedUser(id) {
            return $http.post('/api/reports/cancel_reported', {id_receiver: id}).then(handleSuccess, handleError)
        }
        function isConnectedWithId(id) {
            return $http.get('/api/users/is_connected_with_id/'+id).then(handleSuccess, handleError)
        }
        function isBlockedWithId(id) {
            return $http.get('/api/users/is_blocked_with_id/'+id).then(handleSuccess, handleError)
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
