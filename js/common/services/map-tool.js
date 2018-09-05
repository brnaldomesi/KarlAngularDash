/**
 * Created by wangyaunzhi on 16/9/2.
 */
angular.module('Common.Services')
    .factory('MapTool', function ($q, LocationService) {
        return {
            getSearchLocations: function (searchString) {
                var defer = $q.defer();
                var placeService = new google.maps.places.PlacesService(document.createElement('div'));
                var autocompleteService = new google.maps.places.AutocompleteService();
                var latlngClass;
                if (LocationService.position) {
                    latlngClass = new google.maps.LatLng({
                        lat: LocationService.position.location.lat,
                        lng: LocationService.position.location.lng
                    });
                } else {
                    latlngClass = new google.maps.LatLng({lat: 34.1017614, lng: -118.3450541});
                    LocationService.getCurrentPosition();
                }

                var requstOption = {
                    input: searchString,
                    location: latlngClass,
                    radius: 10000
                };
                autocompleteService.getPlacePredictions(requstOption, function (predictions, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        console.log("getPlacePredictions出错,代码:" + status);
                        return;
                    }
                    var tempLocations = [];
                    predictions.forEach(function (prediction) {
                        if (prediction.place_id) {
                            placeService.getDetails({placeId: prediction.place_id}, function (location, status) {
                                if (status == google.maps.places.PlacesServiceStatus.OK) {
                                    location.latlng = {
                                        lat: location.geometry.location.lat(),
                                        lng: location.geometry.location.lng()
                                    };
                                    location.isAirport = $.inArray("airport", location.types) != -1;

                                    tempLocations.push(location);

                                    defer.resolve({
                                        data: tempLocations
                                    });
                                }
                            })
                        }
                    });
                });

                return defer.promise.then(function (response) {
                    return response.data.map(function (item) {
                        return item;
                    });
                });
            },

            geocoderAddress: function (lat, lng, successHandle, faultHandle) {
                var geocoder = new google.maps.Geocoder;
                geocoder.geocode({'location': {lat: lat, lng: lng}}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            var isAirport = false;
                            for (var i = 0; i < results.length; i++) {
                                isAirport = $.inArray("airport", results[i].types) != -1;
                                if (isAirport) {
                                    break;
                                }
                            }
                            results[0].isAirport = isAirport;
                            successHandle(results[0]);
                        } else {
                            faultHandle(google.maps.GeocoderStatus);
                        }
                    }
                );
            },

            analysisAddressNumber: function (address) {
                var addressNumber = '';
                if (address && address.address_components && address.address_components.length > 0) {
                    for (var i = 0; i < address.address_components.length; i++) {
                        var find = false;
                        if (address.address_components[i].types && address.address_components[i].types.length > 0) {
                            for (var j = 0; j < address.address_components[i].types.length; j++) {
                                if (address.address_components[i].types[j] == "street_number") {
                                    addressNumber = address.address_components[i].long_name;
                                    find = true;
                                    break;
                                }
                            }
                        }
                        if (find) {
                            break;
                        }
                    }
                }
                return addressNumber;
            },

            analysisAddressCodePostal: function (address) {
                var addressCodePostal = '';
                if (address && address.address_components && address.address_components.length > 0) {
                    for (var i = 0; i < address.address_components.length; i++) {
                        var find = false;
                        if (address.address_components[i].types && address.address_components[i].types.length > 0) {
                            for (var j = 0; j < address.address_components[i].types.length; j++) {
                                if (address.address_components[i].types[j] == "postal_code") {
                                    addressCodePostal = address.address_components[i].long_name;
                                    find = true;
                                    break;
                                }
                            }
                        }
                        if (find) {
                            break;
                        }
                    }
                }
                return addressCodePostal;
            },
            calculateAndDisplayRoute: function (directionsService,
                                                startLatLng, endLatLng,
                                                timestamp, resultFunction) {
                var date = new Date();
                date.setTime(timestamp * 1000)
                directionsService.route({
                    origin: startLatLng,
                    destination: endLatLng,
                    travelMode: google.maps.TravelMode.DRIVING,
                    drivingOptions: {
                        departureTime: date
                    }
                }, function (response, status) {
                    if (resultFunction) {
                        resultFunction(response, status)
                    }
                });
            },

            getMapMatrixDistance: function (originLat, originlng, destinationLat, destinationLng, sucessHandle, faultHandle) {
                var origins = [{lat: originLat, lng: originlng}];
                var destinations = [{lat: destinationLat, lng: destinationLng}];
                var travelMode = "DRIVING";
                var distanceMatrixService = new google.maps.DistanceMatrixService;
                distanceMatrixService.getDistanceMatrix({
                    origins: origins,
                    destinations: destinations,
                    travelMode: google.maps.TravelMode[travelMode],
                    unitSystem: google.maps.UnitSystem.IMPERIAL
                }, function (response, status) {
                    if (status == google.maps.DistanceMatrixStatus.OK) {
                        if (sucessHandle) {
                            sucessHandle(response);
                        }
                    } else {
                        if (faultHandle) {
                            faultHandle(status);
                        }
                    }
                });
            }

        }
    })

    .factory('AirLineTool', function ($q, HttpService) {
        return {
            getFlightsList: function (lat, lng, type, time) {
                var defer = $q.defer();
                HttpService.get(Api.customer.getFlightsList, {
                    lat: lat,
                    lng: lng,
                    type: type,
                    time: time
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            matchingAirlineCompany: function (searchString, data) {
                if (data && searchString) {
                    var tempSearch = [];
                    angular.forEach(data, function (rate) {
                        if (
                            rate.name.toString().toLowerCase().indexOf(searchString.toString().toLowerCase()) > -1 ||
                            rate.fs.toString().toLowerCase().indexOf(searchString.toString().toLowerCase()) > -1
                        ) {
                            tempSearch.push(rate);
                        }
                    });
                    return tempSearch;
                }
            },
            matchingAirlineNumber: function (searchString, data) {
                if (data && searchString) {
                    var tempSearch = [];
                    angular.forEach(data.flights, function (rate) {
                        if (rate.flightNumber.toString().indexOf(searchString.toString()) > -1) {
                            tempSearch.push(rate);
                        }
                    });
                    return tempSearch;
                }
            }
        }
    })

    .service('LocationService', function () {
        var self = this;
        this.position = null;
        if (localStorage.getItem('currentPosition')) {
            this.position = JSON.parse(localStorage.getItem('currentPosition'));
        }
        self.getCurrentPosition = function (successHandle, faultHandle) {
            jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBDzfh3T2Ihm5MBWIKHHoSnLG2XzDK0_TY", function (position) {
                if (successHandle) {
                    successHandle(position);
                }
                self.position = position;
                localStorage.setItem('currentPosition', JSON.stringify(self.position));
                // console.log(self.position);
            }).fail(function (error) {
                console.log("API Geolocation error! \n\n" + JSON.stringify(error));
                if (self.position && successHandle) {
                    successHandle(self.position);
                } else {
                    if (faultHandle) {
                        faultHandle(error);
                    }
                }
            });
        };
    });