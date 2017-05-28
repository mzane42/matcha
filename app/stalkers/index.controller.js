(function () {

    'use strict';

    angular
    .module('app')
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
    .controller('Stalkers.IndexController', Controller, [['$scope']]);

    function Controller($scope, UserService) {

        UserService.GetSeen().then(function (result) {
            $scope.history = result;
        })

    }


})();