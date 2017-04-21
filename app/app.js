(function () {
    'use strict';

    angular
        .module('app', [
            'ui.router',
            'ui.select',
            'ngSanitize',
            'ngMessages',
            'ui.bootstrap',
            'ngTagsInput',
            'ngFileUpload',
            'ngGeolocation',
            'rzModule',
            'google.places',
            'angularMoment'
        ])
        .config(config)
        .run(run)
        .controller('AppCtrl', Controller, ['$scope', '$http'])
        .filter('timeAgo', function () {
            return function (date) {
                var delta = Math.round((+new Date - new Date(date)) / 1000);

                var minute = 60,
                    hour = minute * 60,
                    day = hour * 24,
                    week = day * 7;

                var fuzzy;

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

        function Controller($scope, UserService ,LocationService, NotificationService,FlashService, SocketService, $http ) {
            $scope.status = {
                isopen: false,
                seen: false
            };
            $scope.statusStalker = {
                isopen: false,
                seen: false
            };
            $scope.notifications = {};
            $scope.stalkers = {}
            $scope.nbNotifications = 0;
            $scope.nbStalkers = 0;
            UserService.GetCurrent()
                .then(function (user) {
                    LocationService.getCurrentPosition()
                        .then(function (coord) {
                            if(!user.zip || user.zip != coord.zip){
                            UserService.UpdateLocationUser(JSON.stringify(coord))
                                .then(function (result) {
                                    user.lat = coord.lat;
                                    user.lng = coord.lng;
                                    user.zip = coord.zip;
                                    user.city = coord.city;
                                    user.country = coord.country;
                                })
                                .catch(function (error) {
                                    FlashService.Error(error);
                                });
                            }
                        })
                        .catch(function (err) {
                            if (err) {
                                LocationService.getCurrentPositionWithIp()
                                    .then(function (coord) {
                                        if(!user.zip || user.zip != coord.zip) {
                                            UserService.UpdateLocationUser(JSON.stringify(coord))
                                                .then(function () {
                                                    user.lat = coord.lat;
                                                    user.lng = coord.lng;
                                                    user.zip = coord.zip;
                                                    user.city = coord.city;
                                                    user.country = coord.country;
                                                })
                                                .catch(function (error) {
                                                    FlashService.Error(error);
                                                });
                                        }
                                })
                                .catch(function (err) {
                                    console.log(err);
                                })
                            }
                        });
                    $scope.user = user;
                });
            UserService.GetSeen().then(function (result) {
                $scope.stalkers = result;
                $scope.nbStalkers = result.length;
            })

            NotificationService.getNotifications()
                .then(function (result) {
                    console.log(result)
                    $scope.notifications = result;
                    $scope.nbNotifications = result.length;
                })
                .catch(function (err) {
                    console.log(err)
                })
            SocketService.on('notification', function (result) {
                console.log(result)
                result[0].new = true
                $scope.notifications.unshift(result[0]);
                $scope.nbNotifications++;
            })
            SocketService.on('stalker', function (result) {
                console.log(result)
                result[0].new = true
                $scope.stalkers.unshift(result[0])
                $scope.nbStalkers++;
            })
            UserService.GetPhotoProfile()
                .then(function (photo_profile) {
                    if(photo_profile && Object.keys(photo_profile).length > 0){
                        $scope.profile = photo_profile.photo_link
                    }
                    else {
                        $scope.profile = 'content/images/user3.png'
                    }
            })
            .catch(function (err) {
                if (err){
                    $scope.profile = 'content/images/user3.png'
                }
            })
            $scope.toggledStalker = function() {
                if ($scope.statusStalker.isopen == false) {
                    $scope.statusStalker.seen = false;
                    $scope.statusStalker.isopen = true
                } else if ($scope.statusStalker.isopen == true){
                    $scope.statusStalker.isopen = false;
                    $scope.statusStalker.seen = true;
                    console.log('close');
                }
            }
            $scope.toggled = function() {
                if ($scope.status.isopen == false) {
                    $scope.status.seen = false;
                    $scope.status.isopen = true
                    console.log($scope.notifications)

                } else if ($scope.status.isopen == true){
                    $scope.status.isopen = false;
                    $scope.status.seen = true;
                    NotificationService.updateSeen()
                        .then(function (result) {
                            $scope.nbNotifications = 0;
                            for (var key in $scope.notifications) {
                                if (!$scope.notifications.hasOwnProperty(key)) continue;
                                //console.log($scope.notifications[key])
                                console.log($scope.notifications[key])
                                $scope.notifications[key].new = false
/*                                for (var prop in obj) {
                                    if(!obj.hasOwnProperty(prop)) continue;
                                    console.log(obj)
                                    console.log(prop)
                                }*/
                            }
                            console.log('seen');
                        })
                        .catch(function (err) {
                            if (err) {
                                console.log(err)
                            }
                        })
                    console.log('close');
                }
            }

        }


        function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'profile/index.html',
                controller: 'Profile.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'profile' }
            })
            .state('search', {
                url: '/search',
                templateUrl: 'search/index.html',
                controller: 'Search.IndexController',
                controllerAs: 'vm',
                data: {activeTabe: 'search'}
            })
            .state('show', {
                url: '/users/:id_user',
                templateUrl: 'show/index.html',
                controller: 'Show.IndexController',
                controllerAs: 'vm'
            })
            .state('stalkers', {
                url: '/stalkers',
                templateUrl: 'stalkers/index.html',
                controller: 'Stalkers.IndexController',
                controllerAs: 'vm'
            })

    }

    function run($http, $rootScope, $window, SocketService) {
        SocketService.init($window.jwtToken)
        //console.log(socketService)
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.data) {
                $rootScope.activeTab = toState.data.activeTab;
            }
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['app']);
        });
    });
})();