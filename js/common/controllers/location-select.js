/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('Common.Controllers')
    .controller('LocationSelectCtrl', function ($scope, $state, data, event, $http, $timeout, LocationService, MapTool) {
        $scope.getLocation = function (val) {
            return MapTool.getSearchLocations(val);
        };

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.locData = undefined;
        $scope.onSearchSelect = function ($item, $model, $label, $event) {
            $scope.locData = $item;
            marker.setPosition({lat: $item.geometry.location.lat(), lng: $item.geometry.location.lng()});
            selectLocationMap.setCenter({lat: $item.geometry.location.lat(), lng: $item.geometry.location.lng()});
            var formatted_address = $item.formatted_address;
            $('#asyncSelected').val(formatted_address);
            // var formatted_address = $item.vicinity + ' ' + $item.name;
            // MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
            //     formatted_address = result.formatted_address;
            //     $('#asyncSelected').val(formatted_address);
            // }, function (error) {
            // });
        };


        $scope.onOkButtonClick = function () {
            if (event.okHandler) {
                event.okHandler($scope.locData);
            }
        };

        var marker = new google.maps.Marker();
        var selectLocationMap;
        $scope.initialize = function (pos) {
            selectLocationMap = new google.maps.Map(document.getElementById('selectLocationMap'), {
                zoom: 14,
                center: pos,
                mapTypeControl: false,
                streetViewControl: false
            });
            marker = new google.maps.Marker({
                position: {lat: selectLocationMap.getCenter().lat(), lng: selectLocationMap.getCenter().lng()},
                map: selectLocationMap,
                title: 'Hello World!',
                animation: google.maps.Animation.DROP
            });
            $scope.initMapListener(selectLocationMap, marker);
            $("#asyncSelected").val($scope.locData.formatted_address);
        };

        $scope.initMapListener = function (map, marker) {
            google.maps.event.addListener(map, 'center_changed', function () {
                marker.setPosition({lat: map.getCenter().lat(), lng: map.getCenter().lng()});
            });

            google.maps.event.addListener(map, 'dragstart', function () {
                marker.setPosition({lat: map.getCenter().lat(), lng: map.getCenter().lng()})
            });

            google.maps.event.addListener(map, 'dragend', function () {
                marker.setPosition({lat: map.getCenter().lat(), lng: map.getCenter().lng()})
                $scope.geocodeAddress(map.getCenter().lat(), map.getCenter().lng(), false)
            });
        };

        $scope.geocodeAddress = function (lat, lng, needInit) {
            MapTool.geocoderAddress(lat, lng, function (result) {
                result.latlng = {
                    lng: result.geometry.location.lng(),
                    lat: result.geometry.location.lat()
                };
                $scope.locData = result;
                if (needInit) {
                    $scope.initialize(pos);
                } else {
                    marker.setPosition({lat: result.geometry.location.lat(), lng: result.geometry.location.lng()});
                    selectLocationMap.setCenter({
                        lat: result.geometry.location.lat(),
                        lng: result.geometry.location.lng()
                    });
                    var formatted_address = result.formatted_address;
                    $('#asyncSelected').val(formatted_address);
                }
            }, function () {

            })
        };

        if (data == 0) {
            var pos;
            LocationService.getCurrentPosition(function (position) {
                pos = {
                    lat: position.location.lat,
                    lng: position.location.lng
                };
                $scope.geocodeAddress(pos.lat, pos.lng, true)
            }, function () {

            });
        } else {
            $timeout(function () {
                pos = {
                    lat: data.latlng.lat,
                    lng: data.latlng.lng
                };
                $scope.locData = data;
                $scope.initialize(pos);
            }, 50);

        }
    });
