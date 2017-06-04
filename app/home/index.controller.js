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
        .controller('Home.IndexController', Controller);

    function Controller($scope, UserService, LikeService, FlashService, NotificationService, SocketService) {
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

        $scope.selectedTri = { value: $scope.triSelect[0] };
        var suggestion = UserService.GetSuggestion()
            .then(function (result) {
                $scope.suggestion = result
                return result
            })
        suggestion.then(function (data) {
            $scope.location = []
            $scope.dates = []
            $scope.tags = []
            $scope.popularity = []

            var ageSlider = []
            var popSlider = []
            var locationCheck = []
            var tags = []
            var i = 1;
            var tagIndex  = 1;
            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;
                var obj = data[key];
                for (var prop in obj) {
                    if(!obj.hasOwnProperty(prop)) continue;
                    if (prop === 'birth_date'){
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
                    if (prop === 'city'){
                        if (locationCheck.indexOf(obj[prop]) == -1) {
                            var city = {}
                            city.id = i;
                            city.city = obj[prop]
                            $scope.location.push(city)
                            locationCheck.push(city.city)
                            i++;
                        }
                    }
                    if (prop === 'interests'){
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
            $scope.locationSelect ={}
            var defaultValue = {}
            defaultValue.id = 0;
            defaultValue.city = 'Tous'
            $scope.location.unshift(defaultValue)
            $scope.locationSelect.selected = { value: $scope.location[0] };


            $scope.multipleTag = {}
            $scope.multipleTag.tags = []

            if (ageSlider && ageSlider.length > 0) {
                $scope.sliderAge = {
                    min: Math.min.apply(null, ageSlider),
                    max: Math.max.apply(null, ageSlider),
                    options: {
                        floor: Math.min.apply(null, ageSlider),
                        ceil: Math.max.apply(null, ageSlider)
                    }
                };
            }else {
                $scope.sliderAge = {
                    min: 0,
                    max: 30,
                    options: {
                        floor: 0,
                        ceil: 100
                    }
                };
            }

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
                LikeService.likeUser(id).then(function () {
                    var action = 'matched'
                    FlashService.Success('Vous Avez Flasher '+first_name)
                    context.s.matched = 1;
                    NotificationService.pushNotification(id, action)
                        .then(function (result) {
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                })
                .catch(function (error) {
                    FlashService.Error(error.data.error);
                })
            };
        })

    }

    function getAge(dateString) {
        var format = dateString.split("/")
        var today = new Date();
        var birthDate =  new Date(format[2], format[1] - 1, format[0]);


        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
})();