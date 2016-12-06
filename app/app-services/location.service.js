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
                                    console.log((address.results[0].address_components[i].types[0]));
                                    myCoordinates.zip = address.results[0].address_components[i].long_name
                                }
                                if(address.results[0].address_components[i].types[0]=="locality")
                                {
                                    myCoordinates.city = address.results[0].address_components[i].long_name
                                }
                                if(address.results[0].address_components[i].types[0]=="country"){
                                    myCoordinates.country = address.results[0].address_components[i].long_name
                                }
                            }

                        }).error(function(error) {
                            if (error.code == 1) {
                                    console.log('refuser');
                                    $http.get('http://ip-api.com/json')
                                        .success(function(coordinates) {
                                            myCoordinates.lat = coordinates.lat;
                                            myCoordinates.lng = coordinates.lng;
                                            myCoordinates.city = coordinates.city;
                                        })
                                        .error(function (err) {
                                            deferred.reject(err.name + ': ' + err.message);
                                        });
                                }
                        });

                        deferred.resolve(myCoordinates);
                    })
            }

            return deferred.promise;
        }

        function getCurrentPositionWithIp() {
            var deferred = $q.defer();

            $http.get('http://ip-api.com/json')
                .success(function(coordinates) {
                    var myCoordinates = {};
                    myCoordinates.lat = coordinates.lat;
                    myCoordinates.lng = coordinates.lon;
                    myCoordinates.city = coordinates.city;
                    deferred.resolve(coordinates);
                })
                .error(function (err) {
                    deferred.reject(err.name + ': ' + err.message);
                });

            return deferred.promise;

        }

    }

})();