(function () {
    'use strict';

    angular
        .module('app')
        .controller('Profile.IndexController', Controller, [['$scope'],'Upload', '$timeout']);

    function Controller($scope, UserService, Upload, $timeout, FlashService) {
        $scope.uploadPhotoProfile = uploadPhotoProfile;
        $scope.uploadPhotos = uploadPhotos;

        $scope.user = null;
        $scope.album = []
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

            UserService.GetPhotoProfile().then(function (photo_profile) {
                $scope.profile = photo_profile.photo_link
            })

            UserService.GetPhotoAlbum().then(function (photos_album) {
                $scope.album = photos_album
            })
           }

        function uploadPhotoProfile(file) {
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
            if (files) {
                Upload.upload({
                    url: '/api/users/uploads/album',
                    method: 'POST',
                    data: {
                        files: files
                    }
                }).then(function (response) {
                    $timeout(function () {
                        if (response.data) {
                            $scope.album = response.data;
                        }
                    })
                    .catch(function(err){
                        console.log(err)
                    })
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                        FlashService.Error(response.data);
                    }
                })
            }
        }
    }

})();