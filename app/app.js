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
            'google.places'
        ])
        .config(config)
        .run(run)
        .controller('AppCtrl', Controller, ['$scope', '$http']);

        function Controller($scope, UserService ,LocationService, FlashService, $http ) {
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
                    console.log($scope.user);
                });
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

    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
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