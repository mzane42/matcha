(function () {
    'use strict';

    angular
        .module('app')
        .filter('genderImageFilter', function () {
            return function (gender) {
                switch (gender) {
                    case 'm':
                        return '../content/images/masculine.png'
                    case 'f':
                        return '../content/images/female.png'
                }
            }
        })
        .filter('genderFilter', function () {
            return function (gender) {
                switch (gender) {
                    case 'm':
                        return 'Homme';
                    case 'f':
                        return 'Femme';
                }
            }
        })
        .filter('ageFilter', function () {
            return function (date) {
                if (date) {
                    var format = date.split("/")
                    var today = new Date();
                    var birthDate =  new Date(format[2], format[1] - 1, format[0]);


                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                }
                return age;
            }
        })
        .filter('orientationFilter', function () {
            return function (o) {
                switch (o) {
                    case 'Hetero':
                        return '../content/images/gender.png'
                    case 'Homo':
                        return '../content/images/lesbian.png'
                    case 'Bi':
                        return '../content/images/bisexual.png'
                }
            }
        })
        .filter('timeAgo', function () {
            return function (date) {
                var delta = Math.round((+new Date - new Date(date)) / 1000);

                var minute = 60,
                    hour = minute * 60,
                    day = hour * 24,
                    week = day * 7;

                var fuzzy;

                console.log(date)
                if (delta < 30) {
                    fuzzy = 'maintenant';
                } else if (delta < minute) {
                    fuzzy = "il y'a quelques secondes.";
                } else if (delta < 2 * minute) {
                    fuzzy = 'il y a une minute.'
                } else if (delta < hour) {
                    fuzzy = "il y'a " + Math.floor(delta / minute) + ' minutes ';
                } else if (Math.floor(delta / hour) == 1) {
                    fuzzy = 'il y a une heure.'
                } else if (delta < day) {
                    fuzzy = "il y'a "+ Math.floor(delta / hour) + ' heures';
                } else if (delta < day * 2) {
                    fuzzy = 'Hier';
                }
                return fuzzy
            }
        })
        .controller('Show.IndexController', Controller, [['$scope', '$stateParams']]);



    function Controller($scope, UserService, $stateParams, LikeService, FlashService, NotificationService, SocketService) {
        var user_id = $stateParams.id_user
        $scope.user = null;
        $scope.album = []
        $scope.interests = []
        $scope.empty = 0;
        $scope.doTheBack = function() {
            window.history.back();
        };
        var user = UserService.GetById(user_id).then(function (user) {
            $scope.user = user;
            console.log(user);
            var haveSeen = UserService.HaveSeen(user_id).then(function (user) {
                return user
            });
            haveSeen.then(function (data) {
                UserService.GetSeen().then(function (result) {
                })
            });
            return user;
        });

        user.then(function (data) {
            if (data && Object.keys(data).length > 0) {
                if ($scope.user.interests) {
                    $scope.interests = $scope.user.interests.split(',');
                }
                UserService.GetPhotoAlbumById(user_id).then(function (album) {
                    $scope.album = album
                })
            }else {
                $scope.empty = 1
            }


        });

        $scope.UnLikeUser = function (context, id, first_name) {
            LikeService.UnLikeUser(id).then(function () {
                FlashService.Success('Vous Avez retirer votre affinite avec '+first_name);
                context.user.matched = 0;
            })
            .catch(function (error) {
                console.log(error);
                FlashService.Error(error);
            })
        };
        $scope.LikeUser = function(context, id, first_name) {
            LikeService.likeUser(id).then(function () {
                var action = 'matched'
                FlashService.Success('Vous Avez Flasher '+first_name)
                context.user.matched = 1;
                NotificationService.pushNotification(id, action)
                    .then(function (result) {
                })
                .catch(function (error) {
                    console.log(error);
                })
            })
            .catch(function (error) {
                FlashService.Error(error);
            })
        };
        
        $scope.ReportedUser = function (context, id) {
            UserService.repotedUser(id).then(function () {
                FlashService.Success("Vous avez reporter cet utilisateur comme étant un “faux compte”. Souhaiteriez vous le bloquer, l'utilisateur ne sera plus visible pour vous")
                context.user.reported = 1
            })
            .catch(function (error) {
                FlashService.Error(error);
            })
        }
    }


})();