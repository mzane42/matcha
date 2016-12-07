﻿(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetBylogin = GetBylogin;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetInterest = GetInterest;
        service.GetPhotoProfile = GetPhotoProfile;
        service.GetPhotoAlbum = GetPhotoAlbum;
        service.UpdateLocationUser = UpdateLocationUser;
        service.GetSuggestion = GetSuggestion;

        return service;

        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
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
