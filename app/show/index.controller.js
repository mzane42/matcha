(function () {
    'use strict';

    angular
        .module('app')
        .controller('Profile.IndexController', Controller, [['$scope']]);

    function Controller($scope, UserService) {
        $scope.user = null;
        $scope.album = []

        UserService.GetById().then(function (user) {
            $scope.user = user;
            if ($scope.user.gender && $scope.user.gender.length > 0){
                if ($scope.user.gender == 'm'){
                    $scope.gender = 'Homme'
                }else {
                    $scope.gender = 'Femme'
                }
            }
            if ($scope.user.birth_date){
                $scope.age = getAge($scope.user.birth_date);
            }
            if ($scope.user.interests){
                $scope.interests = $scope.user.interests.split(',');
            }
            function getAge(dateString) {
                var format = dateString.split("/")
                var today = new Date();
                var birthDate =  new Date(format[2], format[1] - 1, format[0]);


                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            }
        });

        UserService.GetPhotoProfilById().then(function (photo_profile) {
            $scope.profile = photo_profile.photo_link
        })

        UserService.GetPhotoAlbumById().then(function (photos_album) {
            //console.log(photos_album);
            $scope.album = photos_album
        })
    }

})();