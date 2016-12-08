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
        .controller('Home.IndexController', Controller);

    function Controller($scope, UserService) {
        $scope.tri = [
            {id: 1, name: 'Aucun', value: 'Aucun'},
            {id: 2, name: 'Age', value: 'birth_date | age'},
            {id: 3, name: 'Ville', value: 'city'},
            {id: 4, name: 'Popularité', value: 'popularity'},
            {id: 5, name: 'Tags', value: 'interests'}
        ];

        $scope.selectedTri = { value: $scope.tri[0] };
        var suggestion = UserService.GetSuggestion()
            .then(function (result) {
                $scope.suggestion = result
                return result
            })
        suggestion.then(function (data) {
            $scope.location = []
            $scope.dates = []
            var ageSlider = []
            var locationCheck = []
            var tags = []
            var i = 1;
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
                }
            }
            var defaultValue = {}
            defaultValue.id = 0;
            defaultValue.city = 'Tous'
            $scope.location.unshift(defaultValue)
            $scope.selected = { value: $scope.location[0] };

            $scope.sliderAge = {
                min: Math.min.apply(null, ageSlider),
                max: Math.max.apply(null, ageSlider),
                options: {
                    floor: Math.min.apply(null, ageSlider),
                    ceil: Math.max.apply(null, ageSlider)
                }
            };

            $scope.sliderPopularity = {
                min: 0,
                max: 500,
                options: {
                    floor: 0,
                    ceil: 1000
                }
            }
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