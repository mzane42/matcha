(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($scope, UserService) {
        console.log($scope.user);
        UserService.GetSuggestion()
            .then(function (result) {
                $scope.suggestion = console.log(result);
            })
    }

})();