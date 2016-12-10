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
        .controller('Search.IndexController', Controller);

    function Controller($scope, UserService) {
        $scope.tri = [
            {id: 1, name: 'Aucun', value: 'Aucun'},
            {id: 2, name: 'Age', value: 'birth_date | age'},
            {id: 3, name: 'Ville', value: 'city'},
            {id: 4, name: 'Popularité', value: 'popularity'},
            {id: 5, name: 'Tags', value: 'interests'}
        ];

        $scope.selectedTri = { value: $scope.tri[0] };
        var search = UserService.SearchUsers()
            .then(function (result) {
                $scope.search = result
                return result
            });

        search.then(function (data) {
            $scope.location = []
            $scope.dates = []
            $scope.tags = []
            var ageSlider = []
            var locationCheck = []
            var tagsCheck = []
            var cityIndex = 1;
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
                    if (prop === 'city'){
                        if (locationCheck.indexOf(obj[prop]) == -1) {
                            var city = {}
                            city.id = cityIndex;
                            city.city = obj[prop]
                            $scope.location.push(city)
                            locationCheck.push(city.city)
                            cityIndex++;
                        }
                    }
                    if (prop === 'interests'){
                        var tags = obj[prop].split(',')
                        for (var i = 0; i < tags.length; i++){
                            if (tagsCheck.indexOf(tags[i]) == -1){
                                var tag = {}
                                tag.id = tagIndex;
                                tag.name = tags[i]
                                $scope.tags.push(tag);
                                tagsCheck.push(tag.name);
                                tagIndex++;
                            }
                        }
                     }
                }
            }
            var allCities = {}
            allCities.id = 0;
            allCities.city = 'Tous'
            $scope.location.unshift(allCities);
            $scope.selected = {value: $scope.location[0]}

            var allTags = {}
            allTags.id = 0;
            allTags.name = 'Tous'
            $scope.tags.unshift(allTags)
            $scope.selectedTag = {value: $scope.tags[0]}

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

        $scope.searchQuery = function (row) {
            return (angular.lowercase(row.first_name).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
            angular.lowercase(row.last_name).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.login).indexOf(angular.lowercase($scope.query) || '') !== -1);
        }

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