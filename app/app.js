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
        ])
        .config(config)
        .run(run)
        .controller('AppCtrl', Controller, ['$scope', '$http']);

        function Controller($scope, UserService, $geolocation,LocationService, $http ) {
                LocationService.getCurrentPosition().then(function (coord) {
                    console.log(coord);
                })
                //})
                UserService.GetCurrent().then(function (user) {
                    $scope.user = user;
                    console.log($scope.user)
                })
                UserService.GetPhotoProfile().then(function (photo_profile) {
                    console.log(photo_profile);
                    $scope.profile = photo_profile.photo_link
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
            .state('header', {
                templateUrl: 'partials/header.html',
                controller: 'Header.HeaderController',
                controllerAs: 'vm',
                data: {activeTabe: 'header'}
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