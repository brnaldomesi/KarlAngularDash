/**
 * Created by wangyaunzhi on 17/1/19.
 */
angular.module('Widget.Controllers')
    .controller('WidgetTempCtrl', function ($scope, $state, $http, $uibModal, $log, MessageBox, $timeout, WidgetBS, MapTool) {
        var book = {};
        $scope.airPort = false;
        $scope.reAirPort = false;
        $scope.airLineMessage = null;
        $scope.airLineMessageNum = null;
        $scope.reAirLineMessage = null;
        $scope.reAirLineMessageNum = null;
        $scope.dateMessage = 'Select Date';
        $scope.hours = 1;
        $scope.showDatePicker = false;

        function getParentUrl() {
            var url = null;
            if (parent !== window) {
                try {
                    url = parent.location.href;
                } catch (e) {
                    url = document.referrer;
                }
            }
            return url;
        }

        var parentLink = getParentUrl();

        var GetQueryString = function (url, name) {
            var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
            var matcher = pattern.exec(url);
            var items = null;
            if (null != matcher) {
                try {
                    items = decodeURIComponent(decodeURIComponent(matcher[1]));
                } catch (e) {
                    try {
                        items = decodeURIComponent(matcher[1]);
                    } catch (e) {
                        items = matcher[1];
                    }
                }
            }
            return items;
        };
        var company_id = GetQueryString(location.href, "company_id");

        $timeout(function () {
            // /************* 左右滑动tab ************* /
            $(".nav-slider li").click(function (e) {
                var mywhidth = $(this).width();
                $(this).addClass("act-tab");
                $(this).siblings().removeClass("act-tab");

                // make sure we cannot click the slider
                if ($(this).hasClass('slider')) {
                    return;
                }

                /* Add the slider movement */

                // what tab was pressed
                var whatTab = $(this).index();

                // Work out how far the slider needs to go
                var howFar = mywhidth * whatTab;

                $(".slider").css({
                    left: howFar + "px"
                });
            });
            // /************* / 左右滑动tab ************* /
        }, 0);


        $timeout(function () {
            angular.element('#widgetForm2').validator();
        }, 100);

        $scope.bookType = 1;
        $scope.onTypeChangedToP2P = function () {
            $scope.bookType = 1;
            $scope.bookPickUpAddress = null;
            $scope.dateMessage = 'Select Date';
            $scope.pickupdate = null;
            $scope.airPort = false;
            $scope.reAirPort = false;
            $scope.airLineMessage = null;
            $scope.airLineMessageNum = null;
            $scope.reAirLineMessage = null;
            $scope.reAirLineMessageNum = null;
        };

        $scope.onTypeChangedToHourly = function () {
            $scope.bookType = 2;
            $scope.bookPickUpAddress = null;
            $scope.bookDropOffAddress = null;
            $scope.dateMessage = 'Select Date';
            $scope.pickupdate = null;
            $scope.airPort = false;
            $scope.reAirPort = false;
            $scope.airLineMessage = null;
            $scope.airLineMessageNum = null;
            $scope.reAirLineMessage = null;
            $scope.reAirLineMessageNum = null;
        };

        $scope.flight = function () {
            $scope.airPort = !$scope.airPort;
            if (!$scope.airPort) {
                $scope.airLineMessage = null;
                $scope.airLineMessageNum = null;
            }
        };

        $scope.reflight = function () {
            $scope.reAirPort = !$scope.reAirPort;
            if (!$scope.reAirPort) {
                $scope.reAirLineMessage = null;
                $scope.reAirLineMessageNum = null;
            }
        };


        var date = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        $('.datetimepicker').datetimepicker({
            inline: true,
            stepping:15,
            minDate:date,
            defaultDate:tomorrow
        });

        $scope.displayDatePicker = function () {
            $scope.showDatePicker = true;
        };

        $scope.cancelDateButtonClick = function () {
            $scope.showDatePicker = false;
        };

        $scope.saveDateButtonClick = function () {
            $scope.showDatePicker = false;
            $scope.dateMessage = $('.datetimepicker').data("DateTimePicker").date()._d;
            $scope.pickupdate = $('.datetimepicker').data("DateTimePicker").date()._d;
        };


        //init  mapselect
        $scope.getLocation = function (val) {
            return MapTool.getSearchLocations(val);
        };

        $scope.onPickUpSearchSelect = function ($item, $model, $label, $event) {
            book.pickup = jQuery.extend(true, {}, $item);
            book.pickup.formatted_address = $item.vicinity + ' ' + $item.name;
            MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
                book.pickup.formatted_address = result.formatted_address;
                $timeout(function () {
                    $scope.bookPickUpAddress = result.formatted_address;
                }, 0);
            }, function (error) {
            });
        };

        $scope.onDropOffSearchSelect = function ($item, $model, $label, $event) {
            book.dropoff = jQuery.extend(true, {}, $item);
            book.dropoff.formatted_address = $item.vicinity + ' ' + $item.name;
            MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
                book.dropoff.formatted_address = result.formatted_address;
                $timeout(function () {
                    $scope.bookDropOffAddress = result.formatted_address
                }, 0)
            }, function (error) {
            });
        };


        var getMapMatrixDistance = function (originLat, originlng, destinationLat, destinationLng, sucessHandle, faultHandle) {
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
        };


        $scope.jumpToFlow = function (params) {
            var p = [];
            for (var key in params) {
                if(params[key]){
                    p.push(key + '=' + encodeURIComponent(params[key]));
                }
            }
            if(params.d_is_airport === 0){
                p.push('d_is_airport=0');
            }
            if(params.a_is_airport === 0){
                p.push('a_is_airport=0')
            }
            var httpString = ApiServer.flowUrl + "/flow.html#/flow?"+p.join('&');
            window.open(httpString);
        };

        $scope.clickNextAction = function ($event) {
            if (!$scope.bookPickUpAddress) {
                MessageBox.toast("Input 'Pickup Address' please.", "error");
                return;
            }
            if ($scope.bookType == 1 && !$scope.bookDropOffAddress) {
                MessageBox.toast("Input 'Dropoff Address' please.", "error");
                return;
            }
            if ($scope.bookType == 2 && (!$scope.hours || $scope.hours <= 0)) {
                MessageBox.toast("Input 'Number of Hours' please.", "error");
                return;
            }
            if (!$scope.pickupdate) {
                MessageBox.toast("Input 'Pickup Date' please.", "error");
                return;
            }

            var nowTimestamp = new Date().getTime();
            var appointedTimestamp = Date.parse($scope.pickupdate);
            if (appointedTimestamp <= nowTimestamp) {
                MessageBox.toast("The appointed time is invalid.", "error");
                return;
            }

            if ($scope.bookType == 1) {
                getMapMatrixDistance(
                    book.pickup.geometry.location.lat(),
                    book.pickup.geometry.location.lng(),
                    book.dropoff.geometry.location.lat(),
                    book.dropoff.geometry.location.lng(),
                    function (response) {
                        if (response.rows[0].elements[0].status == "ZERO_RESULTS") {
                            MessageBox.toast("No route find", 'error');
                            return;
                        }
                        $scope.estimate_data = response.rows[0].elements[0];
                        $scope.estimate_time_show = $scope.estimate_data.duration.text;
                        var nextLadda = Ladda.create($event.target);
                        nextLadda.start();
                        WidgetBS.getOffer(company_id,
                            $scope.bookType,
                            book.pickup.geometry.location.lat(),
                            book.pickup.geometry.location.lng(),
                            book.dropoff.geometry.location.lat(),
                            book.dropoff.geometry.location.lng(),
                            $scope.estimate_data.distance.value * 0.62 / 1000,
                            $scope.estimate_data.duration.value / 60,
                            $scope.pickupdate,
                            $scope.airPort,
                            $scope.reAirPort).then(function (result) {
                            nextLadda.stop();
                            if (result.data.code == '2100' || result.data.code == '3001') {
                                //没有可匹配的offer
                                showAlertModal('There are no bookings for this time and date.');
                            } else if (typeof result.data == "string" || result.data.length < 1) {
                                //失败
                                showAlertModal('Get offer failed.');
                            } else {
                                //成功
                                $scope.offers = result.data;
                                var params = {
                                    company_id: company_id,
                                    type:$scope.bookType,
                                    d_lat: book.pickup.geometry.location.lat(),
                                    d_lng: book.pickup.geometry.location.lng(),
                                    a_lat: book.dropoff.geometry.location.lat(),
                                    a_lng: book.dropoff.geometry.location.lng(),
                                    estimate_distance: $scope.estimate_data.distance.value * 0.62 / 1000,
                                    estimate_duration: $scope.estimate_data.duration.value / 60,
                                    appointed_time: (new Date($scope.pickupdate).valueOf() + "").substr(0, 13),
                                    d_air: $scope.airLineMessage,
                                    d_flight: $scope.airLineMessageNum,
                                    a_air: $scope.reAirLineMessage,
                                    a_flight: $scope.reAirLineMessageNum,
                                    parentLink: parentLink,
                                    d_is_airport:$scope.airPort?1:0,
                                    a_is_airport:$scope.reAirPort?1:0
                                };
                                $scope.jumpToFlow(params)
                            }
                        }, function (error) {
                            nextLadda.stop();
                            if (error.treated) {
                            } else {
                                if (error.response.data.code == "3808") {
                                    showAlertModal('There are no offers found.');
                                } else if (error.response.data.code == "3809") {
                                    showAlertModal('There are no vehicles available.');
                                } else if (error.response.data.code == "3810") {
                                    showAlertModal('There are no drivers available.');
                                } else {
                                    showAlertModal('There are no offers found.');
                                }
                            }
                        });
                    }, function (error) {
                        MessageBox.toast("No route find", 'error');
                    });
            } else if ($scope.bookType == 2) {
                $scope.estimate_time_show = $scope.hours + " Hours";
                var nextLadda = Ladda.create($event.target);
                nextLadda.start();
                WidgetBS.getOffer(company_id,
                    $scope.bookType,
                    book.pickup.geometry.location.lat(),
                    book.pickup.geometry.location.lng(),
                    0,
                    0,
                    0,
                    $scope.hours * 60,
                    $scope.pickupdate,
                    $scope.airPort,
                    false).then(function (result) {
                    nextLadda.stop();
                    if (result.data.code == '2100' || result.data.code == '3001') {
                        //没有可匹配的offer
                        showAlertModal('There are no bookings for this time and date.');
                    } else if (typeof result.data == "string" || result.data.length < 1) {
                        //失败
                        showAlertModal('Get offer failed.');
                    } else {
                        //成功
                        $scope.offers = result.data;
                        var params = {
                            company_id: company_id,
                            type:$scope.bookType,
                            d_lat: book.pickup.geometry.location.lat(),
                            d_lng: book.pickup.geometry.location.lng(),
                            a_lat: 0,
                            a_lng: 0,
                            estimate_distance: 0,
                            estimate_duration: $scope.hours * 60,
                            appointed_time: (new Date($scope.pickupdate).valueOf() + "").substr(0, 13),
                            d_air: $scope.airLineMessage,
                            d_flight: $scope.airLineMessageNum,
                            a_air: $scope.reAirLineMessage,
                            a_flight: $scope.reAirLineMessageNum,
                            parentLink: parentLink,
                            d_is_airport:$scope.airPort?1:0,
                            a_is_airport:0
                        };
                        $scope.jumpToFlow(params);
                    }
                }, function (error) {
                    nextLadda.stop();
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "3808") {
                            showAlertModal('There are no offers found.');
                        } else if (error.response.data.code == "3809") {
                            showAlertModal('There are no vehicles available.');
                        } else if (error.response.data.code == "3810") {
                            showAlertModal('There are no drivers available.');
                        } else {
                            showAlertModal('There are no offers found.');
                        }
                    }
                });
            }
        };

        var showAlertModal = function (message) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/widget/prompt.html',
                controller: 'promptCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        message: message,
                        event: {
                            ok: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

    });