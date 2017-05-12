(function () {
    'use strict';

    angular
        .module('app')
        .controller('Chat.IndexController', Controller)
        .filter('capitalize', function() {
            return function(input) {
                return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
            }
        });

    function Controller($scope, recipient, UserService, ChatService) {
        var vm = this;
        vm.chat = {};
        vm.recipient = recipient
        console.log(vm.recipient)
        if (vm.recipient && Object.keys(vm.recipient).length > 0 ) {
            vm.recipient.trigged = true;
        }
        ChatService.getMessagesById(vm.recipient.id)
            .then(function (res) {
                console.log(res);
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