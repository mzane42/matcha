(function () {
    'use strict';

    angular
        .module('app')
        .controller('Profile.IndexController', Controller, [['$scope'],'Upload', '$timeout']);

    function Controller($scope, UserService, Upload, $timeout) {
        $scope.uploadPhotoProfile = uploadPhotoProfile;
        $scope.uploadPhotos = uploadPhotos;

        $scope.user = null;
        $scope.album = []
        console.log($scope.profile);
        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
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
                    console.log($scope.interests)
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
                //console.log($scope.user)
            });

            UserService.GetPhotoProfile().then(function (photo_profile) {
                $scope.profile = photo_profile.photo_link
            })

            UserService.GetPhotoAlbum().then(function (photos_album) {
                //console.log(photos_album);
                $scope.album = photos_album
            })
           }

        function uploadPhotoProfile(file) {
            console.log(file)
            //$scope.profile = file;
            if (file) {
                Upload.upload({
                    url: '/api/users/uploads/profil',
                    method: 'POST',
                    data: {
                        files: [file]
                    }
                }).then(function (response) {
                    $timeout(function () {
                        $scope.profile = response.data.photo_link;
                        console.log($scope.profile)
                        console.log(response.data)
                    });
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                })
            }
        }
        function uploadPhotos(files) {
            $scope.album = files;
            console.log(files);
            if (files) {
                Upload.upload({
                    url: '/api/users/uploads/album',
                    method: 'POST',
                    data: {
                        files: files
                    }
                }).then(function (response) {
                    console.log(response)
                    $timeout(function () {
                        $scope.album = response.data;
                        console.log($scope.album)
                    });
                }, function (response) {
                    console.log(response)
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                        console.log($scope.errorMsg)
                    }
                })
            }
        }
    }

})();