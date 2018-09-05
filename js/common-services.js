'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('Common.Services', []);

/**
 * Created by gaohui on 17-2-21.
 */
angular.module('Common.Services')
    .factory('AddressTool', function ($log, $q, $rootScope) {
        return {
            finalAddress : function (address) {
                var finalAddressDate = [];
                if (address.formatted_address) {
                    //地址是JSON格式
                    var data = address.address_components;

                    //处理第一行
                    //格式:'street_number route premise political'
                    var line_1 = '';
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'street_number') {
                            line_1 += data[i].long_name + '  ';
                            break;
                        }
                    }
                    var hasRoute = false;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'route') {
                            line_1 += data[i].long_name + ' ';
                            hasRoute = true;
                            break;
                        }
                    }

                    if (!hasRoute) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].types[0] == 'street_address') {
                                line_1 += data[i].long_name + ' ';
                                break;
                            }
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'premise') {
                            line_1 += data[i].long_name + ' ';
                            break;
                        }
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'political') {
                            line_1 += data[i].long_name + ' ';
                            break;
                        }
                    }
                    finalAddressDate.push(line_1);

                    //处理第二行
                    //格式:'locality,administrative_area_level_1 postal_code'
                    var line_2 = '';
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'locality') {
                            line_2 += data[i].long_name;
                            break;
                        }
                    }
                    var hasState = false;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'administrative_area_level_1') {
                            line_2 += ',' + data[i].short_name;
                            hasState = true;
                            break;
                        }
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'postal_code') {
                            if (hasState) {
                                line_2 += ' ' + data[i].long_name;
                            } else {
                                line_2 += ',' + data[i].long_name;
                            }
                            break;
                        }
                    }
                    finalAddressDate.push(line_2);
                } else {
                    //地址是字符串
                    finalAddressDate.push(address);
                }

                return finalAddressDate;
            }
        }
    });
/**
 * Created by wangyaunzhi on 16/9/27.
 */
/**
 * Created by wangyaunzhi on 16/9/2.
 */
angular.module('Common.Services')
    .factory('EncodeTool', function () {
        var DICTIONARY = {
            "encode": {
                ",": "d",
                "1": "e",
                "2": "f",
                "3": "g",
                "4": "a",
                "5": "x",
                "6": "w",
                "7": "m",
                "8": "n",
                "9": "y",
                "0": "o"
            },
            "decode": {
                "d": ",",
                "e": "1",
                "f": "2",
                "g": "3",
                "a": "4",
                "x": "5",
                "w": "6",
                "m": "7",
                "n": "8",
                "y": "9",
                "o": "0"
            }
        };
        return {
            enCode: function (string) {
                var encode = DICTIONARY["encode"];
                for(var code in encode){
                    string = string.replace(new RegExp(code,'gm'),encode[code]);
                }
                string = string.split("").reverse().join("");
                return string;
            },
            deCode : function (string) {
                string = string.split("").reverse().join("");
                string = string.toLowerCase();
                var decode = DICTIONARY["decode"];
                for(var code in decode){
                    string = string.replace(new RegExp(code,'gm'),decode[code]);
                }
                return string;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('Common.Services')
    .factory('HttpService', function ($state, $log, $http, Upload, MessageBox, UserCacheBS,T) {

        function treatCommonFault(response) {
            var treated = false;
            var errMsg = T.T("ErrorCode." + response.data.code);
            if (errMsg.indexOf('ErrorCode.')===-1) {
                MessageBox.toast(errMsg, 'error');
                treated = true;
            }
            return treated;
            // if (errMsg != null) {
            //     MessageBox.toast(errMsg, 'error');
            //     treated = true;
            // }
            // return treated;
        };

        return {
            post: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });

                    HttpUtils.post($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.POST"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.POST"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.POST"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            get: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        if (!params) {
                            params = {};
                        }
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    HttpUtils.get($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            delete: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        if (!params) {
                            params = {};
                        }
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    HttpUtils.delete($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.DELETE"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.DELETE"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.DELETE"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            patch: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        if (!params) {
                            params = {};
                        }
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    HttpUtils.patch($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.PATCH"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.PATCH"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.PATCH"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            put: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        if (!params) {
                            params = {};
                        }
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    HttpUtils.put($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.PUT"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.PUT"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.PUT"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            upload: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        url = url + '?token=' + result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        url = url + '?token=' + customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    Upload.upload({
                        url: url,
                        data: params
                    }).then(function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.UPLOAD"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.UPLOAD"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    }, function (evt) {
                        //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.UPLOAD"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            uploadParamsAndData: function (url, params, data, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[5]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    var p = [];
                    for (var key in params) {
                        p.push(key + '=' + encodeURIComponent(params[key]));
                    }
                    p = p.join('&');
                    if (!bNoUseToken && result.data) {
                        url = url + '?token=' + result.data.token + '&' + p;
                    }
                    if (bNoUseToken && customizeToken) {
                        url = url + '?token=' + customizeToken + '&' + p;
                    }
                    angular.forEach(data, function (key, value) {
                        if (angular.isObject(value)) {
                            data.key = JSON.stringify(value);
                        }
                    });
                    Upload.upload({
                        url: url,
                        data: data
                    }).then(function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.UPLOAD"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }

                    }, function (error) {
                        if (faultHandler) {
                            faultHandler(error);
                        }
                        MessageBox.toast('Upload', 'error');
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    });
                }, function (error) {
                    $log.info(error);
                    if (faultHandler) {
                        faultHandler(error);
                    }
                });
            }
        }
    });


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
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('Common.Services')
    .factory('MessageBox', function (SweetAlert, cfpLoadingBar,T) {

        var stack_center = {
            "dir1": "down",
            "dir2": "right",
            "firstpos1": 200,
            "firstpos2": ($(window).width() / 2) - (Number(PNotify.prototype.options.width.replace(/\D/g, '')) / 2)
        };
        PNotify.prototype.options.styling = "bootstrap3";
        PNotify.prototype.options.delay = 2000;

        $(window).resize(function () {
            stack_center.firstpos2 = ($(window).width() / 2) - (Number(PNotify.prototype.options.width.replace(/\D/g, '')) / 2);
        });

        return {
            toast: function (message, type) {
                if (type == 'error')
                {
                    new PNotify({
                        title: '',
                        text: message,
                        type: 'error',
                        icon: false,
                        stack: stack_center
                    });
                }
                else if (type == 'success')
                {
                    new PNotify({
                        title: '',
                        text: message,
                        type: 'success',
                        icon: false,
                        stack: stack_center
                    });
                }
                else// if (type == 'info')
                {
                    new PNotify({
                        title: '',
                        text: message,
                        type: 'info',
                        icon: false,
                        stack: stack_center
                    });
                }
            },

            alert: function (title, message) {
                SweetAlert.info(title, message);
            },

            confirm: function (title, message, callback ,comfirmText) {
                if(comfirmText==undefined){
                    comfirmText = T.T('alertTitle.alert_button_yes');
                }
                SweetAlert.swal({
                    title: title,
                    text: message,
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonText:  comfirmText,
                    cancelButtonText: T.T('alertTitle.alert_button_cancel'),
                    closeOnConfirm: true,
                    html: false
                }, function (isConfirm) {
                    if(callback){
                        callback(isConfirm);
                    }
                });
            },

            alertView: function (title, message, callback) {
                SweetAlert.swal({
                    title: title,
                    text: message,
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonText:  'OK',
                    closeOnConfirm: true,
                    html: false
                }, function (isConfirm) {
                    if(callback){
                        callback(isConfirm);
                    }
                });
            },

            successView: function (title, message, callback) {
                SweetAlert.swal({
                    title: title,
                    text: message,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText:  'OK',
                    closeOnConfirm: true,
                    html: false
                }, function (isConfirm) {
                    if(callback){
                        callback(isConfirm);
                    }
                });
            },

            showLoading:function(){
                cfpLoadingBar.start();
            },

            hideLoading:function(){
                cfpLoadingBar.complete();
            }
        }
    });


/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('Common.Services')
    .factory('T',['$translate', function($translate) {
        var T = {
            T:function(key) {
                if(key){
                    return $translate.instant(key);
                }
                return key;
            }
        };
        return T;
    }]);


/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('Common.Services')
    .factory('UserCacheBS', function ($log, $q, $rootScope) {
        return {

            cache: function (user) {
                var defer = $q.defer();
                if (user.avatar_url == "") {
                    user.avatar_url = "img/default-avatar.png";
                }
                localStorage.setItem('loginUser', JSON.stringify(user));
                $rootScope.loginUser = user;
                defer.resolve({data: user});
                return defer.promise;
            },

            loadCache: function () {
                var defer = $q.defer();
                var cache = localStorage.getItem('loginUser');
                var data;
                if (cache) {
                    data = JSON.parse(cache);
                }
                $rootScope.loginUser = data;
                defer.resolve({data: data});
                return defer.promise;
            },

            cleanCache: function () {
                localStorage.setItem('loginUser', null);
            }
        }
    });