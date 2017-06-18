(function () {
    'use strict';

    angular
        .module('app')
        .controller('Chat.IndexController', Controller)
        .directive('ngEnter', function() {
            return function(scope, element, attrs) {
                element.bind("keydown", function(e) {
                    if(e.which === 13) {
                        e.preventDefault();
                        scope.$apply(function(){
                            scope.$eval(attrs.ngEnter, {'e': e});
                        });
                    }
                });
            };
        })
        .directive('schrollBottom', function () {
            return {
                scope: {
                    schrollBottom: "="
                },
                link: function (scope, element) {
                    scope.$watchCollection('schrollBottom', function (newValue) {
                        if (newValue)
                        {
                            $(element).scrollTop($(element)[0].scrollHeight);
                        }
                    });
                }
            }
        })
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

    function Controller($scope, recipient, NotificationService, ChatService, currentUser, SocketService, lastConversations) {
        var vm = this;
        vm.chat = {};
        vm.messages = {};
        vm.recipient = recipient;
        vm.lastConversations = lastConversations;
        vm.currentUser = currentUser;

        if (vm.recipient && Object.keys(vm.recipient).length > 0 ) {
            vm.recipient.trigged = true;
        } else {
            if (vm.lastConversations && Object.keys(vm.lastConversations).length > 0 ) {
                vm.recipient = vm.lastConversations[0]
                vm.recipient.trigged = true
                // ChatService.getMessagesById(vm.recipient.id)
                //     .then(function (res) {
                //         vm.messages = res;
                //     })
                //     .catch(function (err) {
                //         console.log(err)
                //     })
            }
        }
        ChatService.getMessagesById(vm.recipient.id)
            .then(function (res) {
                vm.messages = res;
            })
            .catch(function (err) {
                console.log(err)
            })

        SocketService.on('upcoming_message', function (result) {
            vm.messages.push(result);
        })
        vm.getMessages = function (recipient) {
            vm.recipient = recipient
            vm.recipient.trigged = true;
            ChatService.getMessagesById(vm.recipient.id)
                .then(function (res) {
                    vm.messages = res;
                    ChatService.lastConversations()
                        .then(function (res) {
                            vm.lastConversations = res
                        })
                })
                .catch(function (err) {
                    console.log(err)
                })
        }
        vm.chatSubmit = function (recipient) {
            if (vm.chat.content.length > 0) {
                ChatService.SendMessage(recipient, vm.chat.content)
                    .then(function (res) {
                        var action = 'message'
                        NotificationService.pushNotification(recipient, action)
                        .then(function (result) {
                        })
                        .catch(function (error) {
                            console.log(error)
                        })
                        vm.messages.push(res)
                        vm.chat.content = ''
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }
        }
    }

})();