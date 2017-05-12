(function () {
    'use strict';

    angular
        .module('app')
        .controller('Chat.IndexController', Controller)
        .filter('capitalize', function() {
            return function(input) {
                return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
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

    function Controller($scope, recipient, UserService, ChatService, currentUser) {
        var vm = this;
        vm.chat = {};
        vm.messages = {};
        vm.recipient = recipient
        console.log(vm.recipient)
        if (vm.recipient && Object.keys(vm.recipient).length > 0 ) {
            vm.recipient.trigged = true;
        }
        vm.currentUser = currentUser;
        console.log(vm.currentUser);
        ChatService.getMessagesById(vm.recipient.id)
            .then(function (res) {
                console.log(res);
                vm.messages = res
            })
            .catch(function (err) {
                console.log(err)
            })
        vm.chatSubmit = function (recipient) {
            ChatService.SendMessage(recipient, vm.chat.content)
                .then(function (res) {
                    console.log(res)
                })
                .catch(function (err) {
                    console.log(err);
                })
            console.log(vm.chat.content)
        }
    }

})();