(function () {
    'use strict';

    angular
        .module('app')
        .controller('Stalkers.IndexController', Controller, [['$scope']]);



    function Controller($scope, UserService) {

        UserService.GetSeen().then(function (result) {
            $scope.history = result
            console.log($scope.history)
            
        })

    }


})();