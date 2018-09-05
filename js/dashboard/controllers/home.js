/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('HomeCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, $filter, MessageBox, UserBS, OrderBS, BookBS, LocationService, CompanyBS,T) {
        if(!$rootScope.loginUser){
            return
        }
        var companyId = $rootScope.loginUser.company_id;
        var map = undefined;
        var markerArray = [];
        var lastOriginalOrderList = [];
        var tempOrderListBeforeSelectOneVehicle = [];
        $scope.timeStateActionIsShow = false;
        $scope.selectedTimeState = 0;
        $scope.showSearchResult = false;
        $scope.isDisplayOneVehicleOnTrip = false;
        $scope.distanceUnit=localStorage.getItem('distanceunit');
        $scope.showLoading=false;
       //todo
       //  var lang='en';
        var lang;
        var initialize = function () {
            if (window.localStorage.lang) {
                lang = window.localStorage.lang;
            } else {
                lang = navigator.language.toLocaleLowerCase();
            }
            if ( lang == 'zh') {
                $scope.disclaimerTranslate = 0
            }else if(lang == 'eur'||lang == 'fr'){
                $scope.disclaimerTranslate = 1
            }else {
                $scope.disclaimerTranslate = 2
            }
        };

        var initMap = function (pos) {
            map = new google.maps.Map(document.getElementById('carMap'), {
                zoom: 12,
                center: pos,
                mapTypeControl: false,
                streetViewControl: false
            });
        };

        var initCompanyAddress = function () {
            CompanyBS.getCurrentCompanies().then(function (result) {
                $scope.company = angular.copy(result.data);
                if (result.data.address.indexOf('address_components') > 0) {
                    $scope.company.address = JSON.parse(result.data.address);
                } else {
                    $scope.company.address = {
                        geometry: {
                            location: {lat: result.data.lat, lng: result.data.lng}
                        }
                    };
                }
                $scope.pos = {
                    lat: $scope.company.address.geometry.location.lat,
                    lng: $scope.company.address.geometry.location.lng
                };
                map.setCenter($scope.pos, 12);
            }, function (error) {

            })
        };


        var getTodayActiveOrders = function () {
            initialize();
            if ($location.$$url != "/home") {
                return;
            }

            OrderBS.getHomeOrders().then(function (data) {
                console.log(data)
                var todayOrders = [];
                if (data.code == 2000 && data.result && data.result.length > 0) {
                    for (var i = 0; i < data.result.length; i++) {
                        data.result[i].driver_data = JSON.parse(data.result[i].driver_data);
                        data.result[i].car_data = JSON.parse(data.result[i].car_data);
                        data.result[i].customer_data = JSON.parse(data.result[i].customer_data);
                        data.result[i].option_data = JSON.parse(data.result[i].option_data);
                        data.result[i].isShowDriverAndVehicle = false;
                        if (data.result[i].type == 1) {
                            if (data.result[i].estimate_distance.toString().indexOf('.') > -1 && data.result[i].estimate_distance.toString().length > data.result[i].estimate_distance.toString().indexOf('.') + 3) {
                                data.result[i].estimate_distance = data.result[i].estimate_distance.toString().substring(0, data.result[i].estimate_distance.toString().indexOf('.') + 3);
                            }
                        }
                        //判断订单是否迟到
                        //time_state
                        //0:on time, 1:action required, 2:late, 3:idle
                        if (data.result[i].trip_state == 0) {
                            if (parseInt((new Date().valueOf() + "").substr(0, 10)) > parseInt(data.result[i].appointed_at)) {
                                //迟到
                                data.result[i].time_state = 2;
                            } else {
                                data.result[i].time_state = 3;
                                data.result[i].timeToPickup = Math.floor((data.result[i].appointed_at - new Date().getTime() / 1000) / 60);
                            }
                        } else if (data.result[i].trip_state == 1) {
                            if (parseInt((new Date().valueOf() + "").substr(0, 10)) > parseInt(data.result[i].appointed_at)) {
                                //迟到
                                data.result[i].time_state = 2;
                                getMapMatrixDistance(data.result[i], data.result[i].last_report_lat, data.result[i].last_report_lng, data.result[i].d_lat, data.result[i].d_lng);
                            } else {
                                getMapMatrixDistance(data.result[i], data.result[i].last_report_lat, data.result[i].last_report_lng, data.result[i].d_lat, data.result[i].d_lng);
                            }
                        } else if (data.result[i].trip_state >= 2) {
                            data.result[i].time_state = 0;
                            if (data.result[i].trip_state == 3) {
                                if (data.result[i].type == 1) {
                                    getMapMatrixDistance(data.result[i], data.result[i].last_report_lat, data.result[i].last_report_lng, data.result[i].a_lat, data.result[i].a_lng);
                                } else {
                                    data.result[i].last = Math.floor((new Date().getTime() / 1000 - data.result[i].start_time) / 60);
                                }
                            }
                        }
                        //还原面板打开状态
                        for (var j = 0; j < lastOriginalOrderList.length; j++) {
                            if (data.result[i].id == lastOriginalOrderList[j].id) {
                                data.result[i].isShowDriverAndVehicle = lastOriginalOrderList[j].isShowDriverAndVehicle;
                                break;
                            }
                        }
                        todayOrders.push(data.result[i]);
                    }
                    lastOriginalOrderList = todayOrders;

                    var tempResult;
                    if (!$scope.showSearchResult) {
                        tempResult = lastOriginalOrderList;
                    } else {
                        tempResult = getSearchOrderResult(lastOriginalOrderList, $scope.input.searchText);
                    }

                    var selectTimeStateOrderList = [];
                    if ($scope.selectedTimeState == 0) {
                        //all
                        selectTimeStateOrderList = tempResult;
                    } else if ($scope.selectedTimeState == 1) {
                        //on time
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 0) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 2) {
                        //action required
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 1) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 3) {
                        //late
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 2) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 4) {
                        //idle
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 3) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    }

                    initVehiclePop(selectTimeStateOrderList);
                    $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);
                } else {
                    for (var i = 0; i < markerArray.length; i++) {
                        markerArray[i].setMap(null);
                    }
                }
                $scope.showLoading=false;
            }, function (error) {
                $scope.showLoading=false;
                for (var i = 0; i < markerArray.length; i++) {
                    markerArray[i].setMap(null);
                }
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("home.jsGet_order_fail"), "error");
                }
            });
            if (map) {
                map.setCenter($scope.pos);
                map.setZoom(12)
            }

        };
        getTodayActiveOrders();

        // 手动刷新
        $scope.refreshClick = function () {
            $scope.isDisplayOneVehicleOnTrip = false;
            $scope.showLoading=true;
            getTodayActiveOrders()
        };

        //定位方法
        // LocationService.getCurrentPosition(function (position) {
        //     $scope.pos = {lat: position.location.lat, lng: position.location.lng};
        //     initMap($scope.pos);
        //     initCompanyAddress();
        // }, function () {
        //     $scope.pos = $rootScope.loginUser.admin.location;
        //     initMap($scope.pos);
        //     initCompanyAddress();
        // });

        $timeout(function () {
            console.log($rootScope.loginUser)
            if ($rootScope.loginUser.admin.location.lat && $rootScope.loginUser.admin.location.lng) {
                $scope.pos = {
                    lat:parseFloat($rootScope.loginUser.admin.location.lat),
                    lng:parseFloat($rootScope.loginUser.admin.location.lng),
                };
                initMap($scope.pos);
            } else {
                LocationService.getCurrentPosition(function (position) {
                    $scope.pos = {lat: position.location.lat, lng: position.location.lng};
                    initMap($scope.pos);
                },function () {

                })
            }
        });


        //按小时为单位,整合一天的booking
        var integrationTodayOrdersByHourly = function (orders) {
            var bookingGroup = [];
            for (var i = 0; i < orders.length; i++) {
                if (companyId == orders[i].own_company_id && companyId != orders[i].exe_company_id) {
                    orders[i].showState = 1;
                    orders[i].driver_data.mobile = orders[i].exe_company_phone1;
                } else if (companyId != orders[i].own_company_id && companyId == orders[i].exe_company_id) {
                    orders[i].showState = 2;
                }
                if (orders[i].reject == 1) {
                    orders[i].showReject = true;
                    if (orders[i].showState == 2) {
                        orders[i].showState = false
                    }
                } else {
                    orders[i].showReject = false
                }
                var hour = $filter('date')(orders[i].appointed_at * 1000, 'h a');
                if (bookingGroup.length == 0) {
                    bookingGroup.push({bookingList: [orders[i]], bookingCount: 1})
                } else {
                    var find = false;
                    for (var j = 0; j < bookingGroup.length; j++) {
                        var header = $filter('date')(bookingGroup[j].bookingList[0].appointed_at * 1000, 'h a');
                        if (hour == header) {
                            find = true;
                            bookingGroup[j].bookingList.push(orders[i]);
                            bookingGroup[j].bookingCount++;
                        }
                    }
                    if (!find) {
                        bookingGroup.push({bookingList: [orders[i]], bookingCount: 1});
                    }
                }
            }
            return bookingGroup;
        };

        //显示地图上的车辆
        var initVehiclePop = function (orders) {
            if (!map) {
                return;
            }

            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < markerArray.length; i++) {
                markerArray[i].setMap(null);
            }

            for (var i = 0; i < orders.length; i++) {
                var order = orders[i];
                if (order.trip_state < 1 || order.trip_state > 4) {
                    continue;
                }
                if (!order.last_report_lat || !order.last_report_lng) {
                    continue;
                }

                var url = "";
                if (order.time_state != undefined) {
                    if (order.time_state == 0) {
                        //on time
                        url = "img/dashboard/car_green.png";
                    } else if (order.time_state == 1) {
                        //action required
                        url = "img/dashboard/car_yellow.png";
                    } else if (order.time_state == 2) {
                        //late
                        url = "img/dashboard/car_red.png";
                    }
                    setAndDisplayMarker(order, url, bounds);
                }
            }
        };


        var setAndDisplayMarker = function (order, markerIcon, bounds) {
            var image = {
                url: markerIcon,
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(39, 41),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 31)
            };

            var latLng = new google.maps.LatLng({
                lat: order.last_report_lat,
                lng: order.last_report_lng
            });
            bounds.extend(latLng);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: image,
                visible: false
            });
            google.maps.event.addListener(marker, "click", function () {
                onVehicleMarkerClick(order);

            });
            markerArray.push(marker);
            marker.setVisible(true);
        };

        var onVehicleMarkerClick = function (order) {
            if (!$scope.isDisplayOneVehicleOnTrip) {
                tempOrderListBeforeSelectOneVehicle = angular.copy($scope.todayBookingGroup);
            }
            var selectTimeStateOrderList = [order];
            $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);
            $scope.isDisplayOneVehicleOnTrip = true;
            $scope.$apply();

            $scope.showHomePanel();
        };


        $scope.onCancelDisplayOneVehicleOnTrip = function () {
            $scope.isDisplayOneVehicleOnTrip = false;
            $scope.todayBookingGroup = angular.copy(tempOrderListBeforeSelectOneVehicle);
        };

        //自动调整高度
        $scope.resizeFix = function () {
            if ($(window).width() > 768) {
                angular.element($("#carMap")).css("height", window.screen.availHeight + "px");
            }
            if ($(window).width() <= 768) {
                angular.element($("#carMap")).css("height", window.screen.availHeight + "px");
            }
        };
        $scope.resizeFix();
        window.onresize = function () {
            $scope.resizeFix()
        };


        $scope.showTimeStateAction = function () {
            $scope.timeStateActionIsShow = !$scope.timeStateActionIsShow;
        };

        $scope.onChangeTimeState = function (index) {
            $scope.isDisplayOneVehicleOnTrip = false;
            $scope.timeStateActionIsShow = false;
            if ($scope.selectedTimeState == index) {
                return;
            }
            $scope.selectedTimeState = index;

            var tempResult;
            if (!$scope.showSearchResult) {
                tempResult = lastOriginalOrderList;
            } else {
                tempResult = getSearchOrderResult(lastOriginalOrderList, $scope.input.searchText);
            }

            var selectTimeStateOrderList = [];
            if ($scope.selectedTimeState == 0) {
                //all
                selectTimeStateOrderList = tempResult;
            } else if ($scope.selectedTimeState == 1) {
                //on time
                angular.forEach(tempResult, function (order) {
                    if (order.time_state == 0) {
                        selectTimeStateOrderList.push(order);
                    }
                });
            } else if ($scope.selectedTimeState == 2) {
                //action required
                angular.forEach(tempResult, function (order) {
                    if (order.time_state == 1) {
                        selectTimeStateOrderList.push(order);
                    }
                });
            } else if ($scope.selectedTimeState == 3) {
                //late
                angular.forEach(tempResult, function (order) {
                    if (order.time_state == 2) {
                        selectTimeStateOrderList.push(order);
                    }
                });
            } else if ($scope.selectedTimeState == 4) {
                //idle
                angular.forEach(tempResult, function (order) {
                    if (order.time_state == 3) {
                        selectTimeStateOrderList.push(order);
                    }
                });
            }
            initVehiclePop(selectTimeStateOrderList);
            $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);
        };

        $scope.showHomePanel = function () {
            $('.home-panel').show();
            $('.home-today').hide();
        };

        $scope.showDriverAndVehicle = function (orderId) {
            var find = false;
            for (var i = 0; i < $scope.todayBookingGroup.length; i++) {
                for (var j = 0; j < $scope.todayBookingGroup[i].bookingList.length; j++) {
                    if ($scope.todayBookingGroup[i].bookingList[j].id == orderId) {
                        $scope.todayBookingGroup[i].bookingList[j].isShowDriverAndVehicle = !$scope.todayBookingGroup[i].bookingList[j].isShowDriverAndVehicle;
                        find = true;
                        break;
                    }
                }
                if (find) {
                    break;
                }
            }
        };

        //获取两点距离和预计开车时长
        var getMapMatrixDistance = function (order, originLat, originlng, destinationLat, destinationLng) {
            var origins = [{lat: originLat, lng: originlng}];
            var destinations = [{lat: destinationLat, lng: destinationLng}];
            var travelMode = "DRIVING";
            var distanceMatrixService = new google.maps.DistanceMatrixService;
            distanceMatrixService.getDistanceMatrix({
                origins: origins,
                destinations: destinations,
                travelMode: google.maps.TravelMode[travelMode],
                // unitSystem: google.maps.UnitSystem.IMPERIAL
                unitSystem:  $scope.distanceUnit==1?google.maps.UnitSystem.IMPERIAL:google.maps.UnitSystem.METRIC
            }, function (response, status) {
                $timeout(function () {
                    if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                        if (order.trip_state == 1) {
                            if (parseInt((new Date().valueOf() + "").substr(0, 10)) > parseInt(order.appointed_at)) {
                                //迟到
                                order.time_state = 2;
                                if($scope.distanceUnit==1){
                                    order.distanceToClient = Math.floor(response.rows[0].elements[0].distance.value * 0.62 / 1000);
                                }else {
                                    order.distanceToClient = Math.floor(response.rows[0].elements[0].distance.value / 1000);
                                }
                                order.timeToClient = Math.floor(response.rows[0].elements[0].duration.value / 60);
                            } else {
                                if($scope.distanceUnit==1){
                                    order.distanceToClient = Math.floor(response.rows[0].elements[0].distance.value * 0.62 / 1000);
                                }else {
                                    order.distanceToClient = Math.floor(response.rows[0].elements[0].distance.value / 1000);
                                }
                                var duration = response.rows[0].elements[0].duration.value;
                                order.timeToClient = Math.floor(duration / 60);
                                if (parseInt((new Date().valueOf() + "").substr(0, 10)) + duration > parseInt(order.appointed_at)) {
                                    order.time_state = 1;
                                } else {
                                    order.time_state = 0;
                                }
                            }
                        } else if (order.trip_state == 3) {
                            if (order.type == 1) {
                                if($scope.distanceUnit==1){
                                    order.distanceToDes = Math.floor(response.rows[0].elements[0].distance.value * 0.62 / 1000);
                                }else {
                                    order.distanceToDes = Math.floor(response.rows[0].elements[0].distance.value / 1000);
                                }

                                order.timeToDes = Math.floor(response.rows[0].elements[0].duration.value / 60);
                            }
                        }
                    } else {
                        if (order.trip_state == 1) {
                            order.time_state = 0;
                            order.distanceToClient = '';
                            order.timeToClient = '';
                        } else if (order.trip_state == 3) {
                            if (order.type == 1) {
                                order.distanceToDes = '';
                                order.timeToDes = '';
                            }
                        }
                    }

                    var tempResult;
                    if (!$scope.showSearchResult) {
                        tempResult = lastOriginalOrderList;
                    } else {
                        tempResult = getSearchOrderResult(lastOriginalOrderList, $scope.input.searchText);
                    }

                    var selectTimeStateOrderList = [];
                    if ($scope.selectedTimeState == 0) {
                        //all
                        selectTimeStateOrderList = tempResult;
                    } else if ($scope.selectedTimeState == 1) {
                        //on time
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 0) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 2) {
                        //action required
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 1) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 3) {
                        //late
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 2) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 4) {
                        //idle
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 3) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    }

                    initVehiclePop(selectTimeStateOrderList);
                    $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);

                    $scope.$apply();
                }, 0);
            });
        };

        $scope.onSearchButtonClick = function () {
            $timeout(function () {
                $scope.isDisplayOneVehicleOnTrip = false;
                var tempResult;
                if (!$scope.input.searchText || $scope.input.searchText.length == 0) {
                    tempResult = lastOriginalOrderList;
                    $scope.showSearchResult = false;
                } else {
                    tempResult = getSearchOrderResult(lastOriginalOrderList, $scope.input.searchText);
                    $scope.showSearchResult = true;
                }

                var selectTimeStateOrderList = [];
                if ($scope.selectedTimeState == 0) {
                    //all
                    selectTimeStateOrderList = tempResult;
                } else if ($scope.selectedTimeState == 1) {
                    //on time
                    angular.forEach(tempResult, function (order) {
                        if (order.time_state == 0) {
                            selectTimeStateOrderList.push(order);
                        }
                    });
                } else if ($scope.selectedTimeState == 2) {
                    //action required
                    angular.forEach(tempResult, function (order) {
                        if (order.time_state == 1) {
                            selectTimeStateOrderList.push(order);
                        }
                    });
                } else if ($scope.selectedTimeState == 3) {
                    //late
                    angular.forEach(tempResult, function (order) {
                        if (order.time_state == 2) {
                            selectTimeStateOrderList.push(order);
                        }
                    });
                } else if ($scope.selectedTimeState == 4) {
                    //idle
                    angular.forEach(tempResult, function (order) {
                        if (order.time_state == 3) {
                            selectTimeStateOrderList.push(order);
                        }
                    });
                }

                initVehiclePop(selectTimeStateOrderList);
                $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);
                $scope.$apply();
            }, 10);
        };

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
            $scope.onSearchButtonClick();
        };

        var getSearchOrderResult = function (originalOrders, searchText) {
            var tempSearch = [];
            angular.forEach(originalOrders, function (order) {
                if (order.c_email.toString().indexOf(searchText.toString()) > -1
                    || order.customer_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || order.customer_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || order.driver_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || order.driver_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || order.car_data.brand.toString().indexOf(searchText.toString()) > -1
                    || order.car_data.license_plate.toString().indexOf(searchText.toString()) > -1
                    || order.car_data.model.toString().indexOf(searchText.toString()) > -1) {
                    tempSearch.push(order);
                }
            });
            return tempSearch;
        };
    });
