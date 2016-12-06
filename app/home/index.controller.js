(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($scope, UserService) {
        /*
        UserService.GetCurrent().then(function (user) {
            $scope.user = user;
            console.log($scope.user)
        })
        UserService.GetPhotoProfile().then(function (photo_profile) {
            $scope.profile = photo_profile.photo_link
        })*/
        $scope.user = []
        UserService.GetCurrent().then
    }

})();