(function () {
    'use strict',
        
    angular
        .module('app')
        .factory('LocationService', Service)

    function Service($q, $window, $http) {
        var service = {}

        service.getCurrentPosition = getCurrentPosition;
        service.getCurrentPositionWithIp = getCurrentPositionWithIp;

        return service;
            ///AIzaSyCU-c61itcXvY2b4eHVVRz3Zc-XlG_EUW0

        function getCurrentPosition() {
            var deferred = $q.defer();
            var myCoordinates = {};

            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            if (!$window.navigator.geolocation) {
                deferred.reject('Geolocation not supported.');
            } else {
                $window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        myCoordinates.lat = position.coords.latitude
                        myCoordinates.lng = position.coords.longitude
                        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+myCoordinates.lat+","+myCoordinates.lng+"&key=AIzaSyAzwMAa8msR1BYlbtAh16zrfYSJ7UirM4c";
                        delete $http.defaults.headers.common['Authorization']
                        $http({
                            method: 'GET',
                            url: url,
                        }).success(function(address) {
                            myCoordinates.city = null;
                            myCoordinates.zip = null;
                            myCoordinates.country = null;
                            for(var i=0;i<address.results[0].address_components.length;i++)
                            {
                                if(address.results[0].address_components[i].types[0]=="postal_code"){
                                    myCoordinates.zip = address.results[0].address_components[i].long_name
                                }
                                if(address.results[0].address_components[i].types[0]=="locality")
                                {
                                    myCoordinates.city = address.results[0].address_components[i].long_name
                                }
                                if(address.results[0].address_components[i].types[0]=="country"){
                                    myCoordinates.country = address.results[0].address_components[i].long_name
                                }
                                $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
                                deferred.resolve(myCoordinates);
                            }

                        }).error(function(error) {
                            console.log(error)
                        });

                    },
                    function (error) {
                        if (error) {
                            deferred.reject(error.name + ': ' + error.message);
                        }
                    });

            }

            return deferred.promise;
        }

        function getCurrentPositionWithIp() {
            var deferred = $q.defer();
            var myCoordinates = {}
            delete $http.defaults.headers.common['Authorization']
            $http.get('http://ip-api.com/json')
                .success(function (address) {
                    myCoordinates.lat = address.lat;
                    myCoordinates.lng = address.lon;
                    myCoordinates.city = address.city;
                    myCoordinates.country = address.country;
                    myCoordinates.zip = address.zip;
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
                    deferred.resolve(myCoordinates);
                })
                .error(function (error) {
                    deferred.reject(error.name + ': ' + error.message);
                })

            return deferred.promise;

        }


    }

})();