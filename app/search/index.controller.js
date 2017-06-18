(function () {
    'use strict';

    angular
        .module('app')
        .filter('age', function () {
            return function (date) {
                var format = date.split("/")
                var today = new Date();
                var birthDate =  new Date(format[2], format[1] - 1, format[0]);


                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            }
        })
        .filter('gender', function () {
            return function (gender) {
                switch (gender) {
                    case 'm':
                        return '../content/images/masculine.png'
                    case 'f':
                        return '../content/images/female.png'
                }
            }
        })
        .filter('capitalize', function() {
            return function(input) {
                return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
            }
        })
        .filter('genderSelected', function () {
            return function (items, gender) {
                var arrayToReturn = [];
                if (items && gender != 'Tous'){
                    for (var i=0; i< items.length; i++){
                        if (items[i].gender == gender)  {
                            arrayToReturn.push(items[i]);
                        }
                    }
                    return arrayToReturn;
                }else {
                    return items
                }
            }
        })
        .filter('orientationSelected', function () {
            return function (items, orientation) {
                var arrayToReturn = [];
                if (items && orientation != 'Tous'){
                    for (var i=0; i< items.length; i++){
                        if (items[i].orientation == orientation)  {
                            arrayToReturn.push(items[i]);
                        }
                    }
                    return arrayToReturn;
                }else {
                    return items
                }
            }
        })
        .filter("citySelected", function () {
            return function (items, city) {
                var arrayToReturn = [];
                if (items && city != 'Tous'){
                    for (var i=0; i< items.length; i++){
                        if (items[i].city == city)  {
                            arrayToReturn.push(items[i]);
                        }
                    }
                    return arrayToReturn;
                }else {
                    return items
                }
            }
        })
        .filter("ageRange", function() {
            return function (items, from, to) {
                var arrayToReturn = [];
                if (items){
                    for (var i=0; i< items.length; i++){
                        var tf = getAge(items[i].birth_date)
                        if (tf >= from && tf <= to)  {
                            arrayToReturn.push(items[i]);
                        }
                    }
                    return arrayToReturn;
                }else {
                    return items
                }
            }
        })
        .filter("popRange", function() {
            return function (items, from, to) {
                var arrayToReturn = [];
                if (items){
                    for (var i=0; i< items.length; i++){
                        var tf = items[i].popularity
                        if (tf >= from && tf <= to)  {
                            arrayToReturn.push(items[i]);
                        }
                    }
                    return arrayToReturn;
                }else {
                    return items
                }
            }
        })
        .filter('tagsSelected', function () {
            return function (items, tags) {
                var arrayToReturn = [];
                if (items && tags.length > 0){
                    for (var i=0; i< items.length; i++){
                        if (items[i].interests.length > 0){
                            var tagsSplit = items[i].interests.split(',')
                            for (var j=0; j < tagsSplit.length; j++){
                                if (tags.indexOf(tagsSplit[j]) != -1) {
                                    arrayToReturn.push(items[i])
                                    break;
                                }
                            }
                        }
                    }
                    return arrayToReturn;
                }else {
                    return items
                }
            }
        })
        .controller('Search.IndexController', Controller);

    function Controller($scope, UserService, LikeService, FlashService, SocketService, NotificationService) {
        $scope.triSelect = {}
        $scope.triSelect = [
            {id: 1, name: 'Aucun', value: 'Aucun'},
            {id: 2, name: 'Age', value: 'birth_date | age'},
            {id: 3, name: 'Ville', value: 'city'},
            {id: 4, name: 'Popularité', value: 'popularity'},
            {id: 5, name: 'Interets commun', value: '-commonInterest'},
            {id: 6, name: 'le plus proche', value: 'distance'},
            {id: 7, name: 'le plus loin', value: '-distance'}
        ];
        $scope.triSelect.selected = { value: $scope.triSelect[0] };
        var search = UserService.SearchUsers()
            .then(function (result) {
                $scope.search = result
                return result
            });

        search.then(function (data) {
            $scope.location = []
            $scope.dates = []
            $scope.tags = []
            $scope.popularity = []

            var ageSlider = []
            var popSlider = []
            var locationCheck = []
            var cityIndex = 1;
            var tagIndex  = 1;
            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;
                var obj = data[key];
                for (var prop in obj) {
                    if(!obj.hasOwnProperty(prop)) continue;
                    if (prop === 'birth_date' && obj[prop]){
                        var dates = {}
                        dates.age = getAge(obj[prop])
                        dates.date = obj[prop]
                        ageSlider.push(dates.age)
                        $scope.dates.push(dates);
                    }
                    if (prop === 'popularity'){
                        var popularity = {}
                        popularity.pop = obj[prop]
                        popSlider.push(popularity.pop)
                        $scope.popularity.push(dates);
                    }
                    if (prop === 'city' && obj[prop]){
                        if (locationCheck.indexOf(obj[prop]) == -1) {
                            var city = {}
                            city.id = cityIndex;
                            city.city = obj[prop]
                            $scope.location.push(city)
                            locationCheck.push(city.city)
                            cityIndex++;
                        }
                    }
                    if (prop === 'interests'&& obj[prop]){
                        var tags = obj[prop].split(',')
                        for (var i = 0; i < tags.length; i++){
                            if ($scope.tags.indexOf(tags[i]) == -1){
                                $scope.tags.push(tags[i]);
                                tagIndex++;
                            }
                        }
                     }
                }
            }

            $scope.genderSelect = []
            $scope.genderSelect = [
                {id: 1, name: 'Tous', value: 'Tous'},
                {id: 2, name: 'homme', value: 'm'},
                {id: 3, name: 'femme', value: 'f'}
            ];
            $scope.genderSelect.selected = {value: $scope.genderSelect[0]}

            $scope.orientationSelect = []
            $scope.orientationSelect = [
                {id: 1, name: 'Tous'},
                {id: 2, name: 'Hetero'},
                {id: 3, name: 'Homo'},
                {id: 4, name: 'Bi'}
            ];
            $scope.orientationSelect.selected = {value: $scope.orientationSelect[0]}
            $scope.locationSelect ={}
            var allCities = {}
            allCities.id = 0;
            allCities.city = 'Tous'

            $scope.location.unshift(allCities);

            $scope.locationSelect.selected = {value: $scope.location[0]}

            $scope.multipleTag = {}
            $scope.multipleTag.tags = []
            $scope.sliderAge = {
                min: Math.min.apply(null, ageSlider),
                max: Math.max.apply(null, ageSlider),
                options: {
                    floor: Math.min.apply(null, ageSlider),
                    ceil: Math.max.apply(null, ageSlider)
                }
            }


            $scope.UnLikeUser = function (context, id, first_name) {
                LikeService.UnLikeUser(id).then(function () {
                    FlashService.Success('Vous Avez retirer votre affinite avec '+first_name);
                    context.s.matched = 0;
                })
                    .catch(function (error) {
                        FlashService.Error(error.data.error);
                    })
            }
            $scope.LikeUser = function(context, id, first_name) {
                LikeService.likeUser(id)
                    .then(function (result) {
                        if (result.hasOwnProperty('error')) {
                            FlashService.Error(result.error);
                        } else {
                            var action = 'matched'
                            FlashService.Success('Vous Avez Flasher '+first_name)
                            context.s.matched = 1;
                            NotificationService.pushNotification(id, action)
                                .then(function (result) {
                                })
                                .catch(function (error) {
                                    console.log(error);
                                })
                        }
                })
                .catch(function (error) {
                    FlashService.Error(error.data.error);
                })
            };

            if (popSlider && popSlider.length > 0) {
                $scope.sliderPopularity = {
                    min: Math.min.apply(null, popSlider),
                    max: Math.max.apply(null, popSlider),
                    options: {
                        floor: Math.min.apply(null, popSlider),
                        ceil: Math.max.apply(null, popSlider)
                    }
                };
            }else {
                $scope.sliderPopularity = {
                    min: 0,
                    max: 500,
                    options: {
                        floor: 0,
                        ceil: 1000
                    }
                };
            }



        })

        $scope.searchQuery = function (row) {
            return (angular.lowercase(row.first_name).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
            angular.lowercase(row.last_name).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.login).indexOf(angular.lowercase($scope.query) || '') !== -1);
        }

    }

    function getAge(dateString) {
        var age = null;
        if (dateString) {
            var format = dateString.split("/")
            var today = new Date();
            var birthDate =  new Date(format[2], format[1] - 1, format[0]);


            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }
        return age;
    }
})();