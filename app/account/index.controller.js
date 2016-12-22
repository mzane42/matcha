(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController' ,Controller, ['Upload', '$timeout'] )

    function Controller($window, UserService, FlashService, Upload, $timeout) {
        var vm = this;

        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();
        function initController() {
            // get current user
            UserService.GetCurrent()
                .then(function (user) {
                vm.user = user;
                vm.place = user.city;
                vm.autocompleteOptions = {
                    types: ['(cities)']
                }
                if (user.gender) {
                    if (user.gender == 'm') {
                        vm.genderUser = {gender: 'm', name: 'Un homme'}
                    } else {
                        vm.genderUser = {gender: 'f',  name: 'Une femme'}
                    }
                }
                vm.orientationUser = { name: user.orientation }
                vm.genderSelected = {value: vm.genderUser}
                vm.orientationSelected = {value: vm.orientationUser}
                if (user.birth_date) {
                    var format = user.birth_date.split("/")
                    vm.dt = new Date(format[2], format[1] - 1, format[0]);
                }
                if (user.interests){
                    vm.interest = [];
                    var interests = user.interests.split(',')
                    for(var i = 0; i < interests.length; i++) {
                        vm.interest.push(
                            {
                                text: interests[i]
                            }
                        )
                    }
                }
            })

            vm.gender = [
                {gender: 'm', name: 'Un Homme'},
                {gender: 'f', name: 'Une Femme'}
            ];
            vm.orientation = [
                {name: 'Hetero'},
                {name: 'Homo'},
                {name: 'bi'}
            ]

            vm.clear = function() {
                vm.dt = null;
            };


            vm.open = function() {
                vm.popup.opened = true;
            };

            vm.popup = {
                opened: false
            };
            vm.format = 'dd/MM/yyyy'


        }


        function saveUser() {
            var checkLocation =  UserService.GetCurrent()
                .then(function (user) {
                    return user;
                })
            checkLocation.then(function (user) {
                if (vm.dt) {
                    vm.user.birth_date = convertDate(vm.dt);
                }else {
                    vm.user.birth_date = null
                }
                vm.user.orientation = vm.orientationSelected.value.name;
                vm.user.gender = vm.genderSelected.value.gender;
                if (vm.interest){
                    vm.user.interests = []
                    for(var i = 0; i < vm.interest.length; i++) {
                        vm.user.interests.push(
                            vm.interest[i]['text']
                        )
                    }
                }
                if (vm.files) { //check if from is valid
                    vm.uploadFiles(vm.files, vm.user.login); //call upload function
                }
                if (vm.place !== user.city){
                    if (Object.keys(vm.place).length > 0){
                        for(var i=0;i<vm.place.address_components.length;i++) {
                            if (vm.place.address_components[i].types[0] == "postal_code") {
                                vm.user.zip = vm.place.address_components[i].long_name
                            }
                            if (vm.place.address_components[i].types[0] == "locality") {
                                vm.user.city = vm.place.address_components[i].long_name
                            }
                            if (vm.place.address_components[i].types[0] == "country") {
                                vm.user.country = vm.place.address_components[i].long_name
                            }
                        }
                        vm.user.lat = vm.place.geometry.location.lat();
                        vm.user.lng = vm.place.geometry.location.lng();
                    }
                }
                UserService.Update(vm.user).then(function () {
                    FlashService.Success('information modifiée avec succès');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });

            })
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
        }

    }

})();