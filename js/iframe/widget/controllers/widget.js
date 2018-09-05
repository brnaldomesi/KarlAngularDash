/**
 * Created by wangyaunzhi on 16/11/26.
 */
angular.module('Widget.Controllers')
    .controller('WidgetCtrl', function ($rootScope,$scope, $state, $http, $uibModal, $log, MessageBox, $timeout, WidgetBS, MapTool, AirLineTool,$filter) {
        var book = {};
        $scope.airPort = false;
        $scope.reAirPort = false;
        $scope.airLineMessage = null;
        $scope.airLineMessageNum = null;
        $scope.airLineCompanyFs = null;
        $scope.flightsList = '';
        $scope.reAirLineMessage = null;
        $scope.reAirLineMessageNum = null;
        $scope.reAirLineCompanyFs = null;
        $scope.dropFlightsList = '';
        $scope.haveAirline = false;
        $scope.haveDropAirline = false;
        $scope.dateMessage = $filter('translate')('widget.jsSelect_date');
        $scope.hours = 1;
        $scope.showDatePicker = false;
        $scope.showCompanyApp = false;
        $scope.getOfferError = 0;
        $scope.getSameOfferError = 0;
        $scope.isAirport = false;
        $scope.isDropAirport = false;
        var getOfferErrorMessage = {};
        $scope.errorMessages='';


        $scope.langStyle=localStorage.getItem('lang');
        if($scope.langStyle==='fr'){
            $scope.iosAppImgLink='img/dashboard/iox-FR.png';
            $scope.androidAppImgLink='img/dashboard/google-FR.png'
        }else {
            $scope.iosAppImgLink='img/dashboard/download-on-the-app-store.png';
            $scope.androidAppImgLink='img/dashboard/google-play.png'
        }

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

        // 获取公司信息
        WidgetBS.getCompanyInfor(company_id).then(function (result) {
            $scope.companyInfor = result.data;
            console.log($scope.companyInfor)
        }, function (error) {
        });
        //公司APP
        $scope.getCompanyIosApp = ApiServer.serverUrl + '/app/company/' + company_id + '/ios';
        $scope.getCompanyGoogleApp = ApiServer.serverUrl + '/app/company/' + company_id + '/android';

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
            clearData();
        };

        $scope.onTypeChangedToHourly = function () {
            $scope.bookType = 2;
            clearData();
        };

        var clearData = function () {
            book = {};
            $scope.bookPickUpAddress = null;
            $scope.bookDropOffAddress = null;
            $scope.dateMessage = $filter('translate')('widget.jsSelect_date');
            $scope.pickupdate = null;
            $scope.airPort = false;
            $scope.reAirPort = false;
            $scope.airLineMessage = null;
            $scope.airLineMessageNum = null;
            $scope.airLineCompanyFs = null;
            $scope.flightsList = '';
            $scope.reAirLineMessage = null;
            $scope.reAirLineMessageNum = null;
            $scope.reAirLineCompanyFs = null;
            $scope.dropFlightsList = '';
            $scope.haveAirline = false;
            $scope.haveDropAirline = false;
            $scope.getOfferError = 0;
            $scope.getSameOfferError = 0;
            getOfferErrorMessage.d_lat = undefined;
            getOfferErrorMessage.d_lng = undefined;
            getOfferErrorMessage.a_lat = undefined;
            getOfferErrorMessage.a_lng = undefined;
            getOfferErrorMessage.appointedTime = undefined;
            $scope.isAirport = false;
            $scope.isDropAirport = false
        };

        $scope.flight = function () {
            $scope.airPort = !$scope.airPort;
            if (!$scope.airPort) {
                $scope.airLineMessage = null;
                $scope.airLineMessageNum = null;
                $scope.airLineCompanyFs = null;
            }
        };

        $scope.reflight = function () {
            $scope.reAirPort = !$scope.reAirPort;
            if (!$scope.reAirPort) {
                $scope.reAirLineMessage = null;
                $scope.reAirLineMessageNum = null;
                $scope.reAirLineCompanyFs = null;
            }
        };


        var date = new Date();
        var tomorrow = new Date();
        var sideBySide = false;
        var widget_id = GetQueryString(location.href, "widget_id");
        if (widget_id == 2 || widget_id == 4) {
            sideBySide = true;
        }
        tomorrow.setDate(tomorrow.getDate() + 1);
        $('.datetimepicker').datetimepicker({
            inline: true,
            stepping: 15,
            minDate: date,
            defaultDate: tomorrow,
            sideBySide: sideBySide,
            locale:localStorage.getItem('lang')
        });

        $scope.displayDatePicker = function () {
            $scope.showDatePicker = true;
        };

        $scope.displayCompanyApp = function () {
            $scope.showCompanyApp = !$scope.showCompanyApp
        };

        $scope.closeCompanyApp = function () {
            $scope.showCompanyApp = false;
        };

        $scope.cancelDateButtonClick = function () {
            $scope.showDatePicker = false;
        };

        $scope.saveDateButtonClick = function () {
            $scope.showDatePicker = false;
            $scope.dateMessage = $('.datetimepicker').data("DateTimePicker").date()._d;
            $scope.pickupdate = $('.datetimepicker').data("DateTimePicker").date()._d;
            if($scope.errorMessages === $filter('translate')('widget.jsInput_pickup_date')
                || $scope.errorMessages === $filter('translate')('widget.jsTime_invalid')
                || $scope.errorMessages === $filter('translate')('widget.jsNo_route')){
                $scope.errorMessages = '';
            }
            $timeout(function () {
                if ($scope.isAirport) {
                    $scope.airPort = true;
                    $scope.flightsList = '';
                    $scope.airlineCompanyMessage = '';
                    $scope.airLineMessage = null;
                    $scope.airLineCompanyFs = null;
                    $scope.airLineMessageNum = null;
                    var editDateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
                    $scope.getFlightsList(book.pickup.geometry.location.lat(), book.pickup.geometry.location.lng(), 0, editDateTime);
                }
                if ($scope.isDropAirport) {
                    $scope.reAirPort = true;
                    $scope.dropFlightsList = '';
                    $scope.airDroplineCompanyMessage = '';
                    $scope.reAirLineMessage = null;
                    $scope.reAirLineCompanyFs = null;
                    $scope.reAirLineMessageNum = null;
                    var editDropDateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
                    $scope.getDropFlightsList(book.dropoff.geometry.location.lat(), book.dropoff.geometry.location.lng(), 1, editDropDateTime);
                }
                if ($scope.getOfferError == 3) {
                    $scope.getOfferError = 2;
                }
                if ($scope.getSameOfferError == 3) {
                    $scope.getSameOfferError = 0;
                    getOfferErrorMessage.d_lat = undefined;
                    getOfferErrorMessage.d_lng = undefined;
                    getOfferErrorMessage.a_lat = undefined;
                    getOfferErrorMessage.a_lng = undefined;
                    getOfferErrorMessage.appointedTime = undefined;
                }
            }, 0);
        };


        //init  mapselect
        $scope.getLocation = function (val) {
            if ($scope.errorMessages === $filter('translate')('widget.jsInput_pickup_add')
            ||$scope.errorMessages === $filter('translate')('widget.jsNo_route')){
                $scope.errorMessages = '';
            }
            if ($scope.airPort) {
                $scope.airPort = false;
                $scope.FlightsList = '';
                $scope.airlineCompanyMessage = '';
                $scope.airLineMessage = null;
                $scope.airLineCompanyFs = null;
                $scope.airLineMessageNum = null;
            }
            if ($scope.getOfferError == 3) {
                $scope.getOfferError = 2;
            }
            if ($scope.getSameOfferError == 3) {
                $scope.getSameOfferError = 0;
                getOfferErrorMessage.d_lat = undefined;
                getOfferErrorMessage.d_lng = undefined;
                getOfferErrorMessage.a_lat = undefined;
                getOfferErrorMessage.a_lng = undefined;
                getOfferErrorMessage.appointedTime = undefined;
            }
            return MapTool.getSearchLocations(val);
        };

        $scope.getDropLocation = function (val) {
            if ($scope.errorMessages === $filter('translate')('widget.jsInput_drop_add')
               ||$scope.errorMessages === $filter('translate')('widget.jsNo_route')
            ){
                $scope.errorMessages = '';
            }
            if ($scope.reAirPort) {
                $scope.reAirPort = false;
                $scope.dropFlightsList = '';
                $scope.airDroplineCompanyMessage = '';
                $scope.reAirLineMessage = null;
                $scope.reAirLineCompanyFs = null;
                $scope.reAirLineMessageNum = null;
            }
            if ($scope.getOfferError == 3) {
                $scope.getOfferError = 2;
            }
            if ($scope.getSameOfferError == 3) {
                $scope.getSameOfferError = 0;
                getOfferErrorMessage.d_lat = undefined;
                getOfferErrorMessage.d_lng = undefined;
                getOfferErrorMessage.a_lat = undefined;
                getOfferErrorMessage.a_lng = undefined;
                getOfferErrorMessage.appointedTime = undefined;
            }
            return MapTool.getSearchLocations(val);
        };


        // 航空公司列表
        $scope.getAirlineCompany = function (val) {
            if ($scope.haveAirline) {
                return AirLineTool.matchingAirlineCompany(val, $scope.flightsList);
            } else {
                $scope.airLineMessage = val;
                $scope.airLineCompanyFs = val;
            }
        };

        // 选择航空空公司
        $scope.onAirlineCompanySearchSelect = function ($item) {
            $scope.airlineCompanyMessage = $item;
            $scope.airLineCompanyFs = $item.fs;
            $scope.airLineMessage = $item.name;
        };

        // 通过选择航空公司获取航班列表
        $scope.getAirlineNumber = function (val) {
            if ($scope.haveAirline) {
                return AirLineTool.matchingAirlineNumber(val, $scope.airlineCompanyMessage)
            } else {
                $scope.airLineMessageNum = val;
            }
        };

        // 选择航班
        $scope.onAirlineNumberSearchSelect = function ($item) {
            $scope.airLineMessageNum = $item.flightNumber;
        };


        // 终点航空公司列表
        $scope.getDropAirlineCompany = function (val) {
            if ($scope.haveDropAirline) {
                return AirLineTool.matchingAirlineCompany(val, $scope.dropFlightsList);
            } else {
                $scope.reAirLineMessage = val;
                $scope.reAirLineCompanyFs = val;
            }
        };

        // 选择终点航空空公司
        $scope.onDropAirlineCompanySearchSelect = function ($item) {
            $scope.airDroplineCompanyMessage = $item;
            $scope.reAirLineCompanyFs = $item.fs;
            $scope.reAirLineMessage = $item.name;
        };

        // 通过选择终点航空公司获取终点航班列表
        $scope.getDropAirlineNumber = function (val) {
            if ($scope.haveDropAirline) {
                return AirLineTool.matchingAirlineNumber(val, $scope.airDroplineCompanyMessage)
            } else {
                $scope.reAirLineMessageNum = val;
            }
        };
        // 选择终点航班
        $scope.onDropAirlineNumberSearchSelect = function ($item) {
            $scope.reAirLineMessageNum = $item.flightNumber;
        };


        $scope.onPickUpSearchSelect = function ($item, $model, $label, $event) {
            console.log($item);
            book.pickup = $item;
            book.pickup.geometry.location = {
                lat: book.pickup.geometry.location.lat(),
                lng: book.pickup.geometry.location.lng()
            };
            $scope.airPort = $item.isAirport;
            if($item.isAirport && $scope.pickupdate){
                $scope.isAirport = true;
                var dateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
                $scope.getFlightsList(book.pickup.geometry.location.lat(), book.pickup.geometry.location.lng(), 0, dateTime);
            }else {
                $scope.isAirport = false;
            }
            $scope.bookPickUpAddress = $item.formatted_address;
            // book.pickup = jQuery.extend(true, {}, $item);
            // book.pickup.formatted_address = $item.vicinity + ' ' + $item.name;
            // MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
            //     console.log(result)
            //     console.log(result.geometry.location.lat())
            //     console.log(result.geometry.location.lng())
            //     book.pickup =result;
            //     book.pickup.formatted_address = result.formatted_address;
            //     $timeout(function () {
            //         $scope.airPort = result.isAirport;
            //         if (result.isAirport && $scope.pickupdate) {
            //             $scope.isAirport = true;
            //             var dateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
            //             $scope.getFlightsList(book.pickup.geometry.location.lat(), book.pickup.geometry.location.lng(), 0, dateTime);
            //         } else {
            //             $scope.isAirport = false;
            //         }
            //         $scope.bookPickUpAddress = result.formatted_address;
            //     }, 0);
            // }, function (error) {
            // });
        };

        $scope.onDropOffSearchSelect = function ($item, $model, $label, $event) {
            // book.dropoff = jQuery.extend(true, {}, $item);
            // book.dropoff.formatted_address = $item.vicinity + ' ' + $item.name;
            book.dropoff = $item;
            book.dropoff.geometry.location = {
                lat: book.dropoff.geometry.location.lat(),
                lng: book.dropoff.geometry.location.lng()
            };
            $scope.reAirPort = $item.isAirport;
            if ($item.isAirport && $scope.pickupdate) {
                $scope.isDropAirport = true;
                var dateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
                $scope.getDropFlightsList(book.dropoff.geometry.location.lat(), book.dropoff.geometry.location.lng(), 1, dateTime);
            } else {
                $scope.isDropAirport = false;
            }
            $scope.bookDropOffAddress = $item.formatted_address;
            // MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
            //     book.dropoff=result;
            //     book.dropoff.formatted_address = result.formatted_address;
            //     $timeout(function () {
            //         $scope.reAirPort = result.isAirport;
            //         if (result.isAirport && $scope.pickupdate) {
            //             $scope.isDropAirport = true;
            //             var dateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
            //             $scope.getDropFlightsList(book.dropoff.geometry.location.lat(), book.dropoff.geometry.location.lng(), 1, dateTime);
            //         } else {
            //             $scope.isDropAirport = false;
            //         }
            //         $scope.bookDropOffAddress = result.formatted_address
            //     }, 0)
            // }, function (error) {
            // });
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
                // unitSystem: google.maps.UnitSystem.IMPERIAL
                unitSystem:  $scope.companyInfor.distance_unit==1?google.maps.UnitSystem.IMPERIAL:google.maps.UnitSystem.METRIC
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
           params.lang=$rootScope.lang;
           params.gaKey=$rootScope.trackingId;
           params.fpkey=$rootScope.fasebookPixelId;
            console.log(params);
            var p = [];
            for (var key in params) {
                if (params[key]) {
                    p.push(key + '=' + encodeURIComponent(params[key]));
                }
            }
            if (params.d_is_airport === 0) {
                p.push('d_is_airport=0');
            }
            if (params.a_is_airport === 0) {
                p.push('a_is_airport=0')
            }
            var httpString = ApiServer.flowUrl + "/flow.html#/flow?" + p.join('&');
            var parentWindow = window.parent;
            parentWindow.postMessage('displayFlowIframe:' + httpString, '*');

            // // window.open(httpString);
            // var form = document.createElement('form');
            // form.action = httpString;
            // form.method = 'GET';
            // form.target = 'karl-iframe-flow';
            // form.style.display = 'none';
            //
            // var submit = document.createElement('input');
            // submit.type = 'submit';
            // submit.id = 'submitProject';
            //
            // form.appendChild(submit);
            // document.body.appendChild(form);
            //
            // $('#submitProject').click();
            //
            // document.body.removeChild(form);
        };

        $scope.$watch('hours',function (nv,ov) {
            if(
                (nv && $scope.errorMessages === $filter('translate')('widget.jsInput_hours'))
                || $scope.errorMessages === $filter('translate')('widget.jsNo_route')
            ){
                $scope.errorMessages='';
            }
        });
        $scope.clickNextAction = function ($event) {
            if (!$scope.bookPickUpAddress) {
                // MessageBox.toast($filter('translate')('widget.jsInput_pickup_add'), "error");
                $scope.errorMessages = $filter('translate')('widget.jsInput_pickup_add');
                return;
            }
            if ($scope.bookType == 1 && !$scope.bookDropOffAddress) {
                // MessageBox.toast($filter('translate')('widget.jsInput_drop_add'), "error");
                $scope.errorMessages = $filter('translate')('widget.jsInput_drop_add');
                return;
            }
            if ($scope.bookType == 2 && (!$scope.hours || $scope.hours <= 0)) {
                // MessageBox.toast($filter('translate')('widget.jsInput_hours'), "error");
                $scope.errorMessages = $filter('translate')('widget.jsInput_hours');
                return;
            }
            if (!$scope.pickupdate) {
                // MessageBox.toast($filter('translate')('widget.jsInput_pickup_date'), "error");
                $scope.errorMessages = $filter('translate')('widget.jsInput_pickup_date');
                return;
            }

            var nowTimestamp = new Date().getTime();
            var appointedTimestamp = Date.parse($scope.pickupdate);
            if (appointedTimestamp <= nowTimestamp) {
                // MessageBox.toast($filter('translate')('widget.jsTime_invalid'), "error");
                $scope.errorMessages = $filter('translate')('widget.jsTime_invalid');
                return;
            }

            if ($scope.bookType == 1) {
                console.log("pick up is ", book.pickup);
                console.log("drop off is ", book.dropoff);
                var directionsService = new google.maps.DirectionsService;
                MapTool.calculateAndDisplayRoute(
                    directionsService,
                    {
                        placeId: book.pickup.place_id
                    },
                    {
                        placeId: book.dropoff.place_id
                    },
                    (new Date($scope.pickupdate).valueOf() + "").substr(0, 10),
                    function (response, status) {
                        console.log("response is ", response);
                        if (status === google.maps.DirectionsStatus.OK) {
                            var result = {
                                "distance": response.routes[0].legs[0].distance.value,
                                "duration": response.routes[0].legs[0].duration.value
                            };
                            book.estimate = result;

                            var nextLadda = Ladda.create($event.target);
                            nextLadda.start();
                            WidgetBS.getOffer(company_id,
                                $scope.bookType,
                                book.pickup.geometry.location.lat,
                                book.pickup.geometry.location.lng,
                                book.dropoff.geometry.location.lat,
                                book.dropoff.geometry.location.lng,
                                book.estimate.distance / 1000,
                                book.estimate.duration / 60,
                                $scope.pickupdate,
                                $scope.airPort,
                                $scope.reAirPort,
                                2
                            ).then(function (result) {
                                nextLadda.stop();
                                if (result.data.code == '2100' || result.data.code == '3001') {
                                    //没有可匹配的offer
                                    $scope.getOfferError += 1;
                                    getOfferError();
                                    showAlertModal($filter('translate')('widget.jsNo_booking'));
                                } else if (typeof result.data == "string" || result.data.length < 1) {
                                    //失败
                                    $scope.getOfferError += 1;
                                    getOfferError();
                                    showAlertModal($filter('translate')('widget.jsGet_offer_failed'));
                                } else {
                                    //成功
                                    $scope.getOfferError = 0;
                                    $scope.getSameOfferError = 0;
                                    getOfferErrorMessage.d_lat = undefined;
                                    getOfferErrorMessage.d_lng = undefined;
                                    getOfferErrorMessage.a_lat = undefined;
                                    getOfferErrorMessage.a_lng = undefined;
                                    getOfferErrorMessage.appointedTime = undefined;
                                    $scope.offers = result.data;
                                    var params = {
                                        company_id: company_id,
                                        type: $scope.bookType,
                                        d_lat: book.pickup.geometry.location.lat,
                                        d_lng: book.pickup.geometry.location.lng,
                                        d_id: book.pickup.place_id,
                                        a_lat: book.dropoff.geometry.location.lat,
                                        a_lng: book.dropoff.geometry.location.lng,
                                        a_id: book.dropoff.place_id,
                                        estimate_distance: book.estimate.distance / 1000,
                                        estimate_duration: book.estimate.duration / 60,
                                        appointed_time: (new Date($scope.pickupdate).valueOf() + "").substr(0, 13),
                                        d_air: $scope.airLineMessage,
                                        d_flight: $scope.airLineMessageNum,
                                        d_airFs: $scope.airLineCompanyFs,
                                        a_air: $scope.reAirLineMessage,
                                        a_flight: $scope.reAirLineMessageNum,
                                        a_airFs: $scope.reAirLineCompanyFs,
                                        parentLink: parentLink,
                                        d_is_airport: $scope.airPort ? 1 : 0,
                                        a_is_airport: $scope.reAirPort ? 1 : 0
                                    };
                                    $scope.jumpToFlow(params);
                                    clearData();
                                }
                            }, function (error) {
                                nextLadda.stop();
                                $scope.getOfferError += 1;
                                getOfferError();
                                if (error.treated) {
                                } else {
                                    if (error.response.data.code == "3808") {
                                        showAlertModal($filter('translate')('widget.jsNo_offers'));
                                    } else if (error.response.data.code == "3809") {
                                        showAlertModal($filter('translate')('widget.jsNo_vehicles'));
                                    } else if (error.response.data.code == "3810") {
                                        showAlertModal($filter('translate')('widget.jsNo_drivers'));
                                    } else {
                                        showAlertModal($filter('translate')('widget.jsNo_offers'));
                                    }
                                }
                            });
                        }
                    }
                );
            } else if ($scope.bookType == 2) {
                $scope.estimate_time_show = $scope.hours + " Hours";
                var nextLadda = Ladda.create($event.target);
                nextLadda.start();
                WidgetBS.getOffer(company_id,
                    $scope.bookType,
                    book.pickup.geometry.location.lat,
                    book.pickup.geometry.location.lng,
                    0,
                    0,
                    0,
                    $scope.hours * 60,
                    $scope.pickupdate,
                    $scope.airPort,
                    false,
                    2
                ).then(function (result) {
                    nextLadda.stop();
                    if (result.data.code == '2100' || result.data.code == '3001') {
                        //没有可匹配的offer
                        $scope.getOfferError += 1;
                        getOfferError();
                        showAlertModal($filter('translate')('widget.jsNo_booking'));
                    } else if (typeof result.data == "string" || result.data.length < 1) {
                        //失败
                        $scope.getOfferError += 1;
                        getOfferError();
                        showAlertModal($filter('translate')('widget.jsGet_offer_failed'));
                    } else {
                        //成功
                        $scope.getOfferError = 0;
                        $scope.getSameOfferError = 0;
                        getOfferErrorMessage.d_lat = undefined;
                        getOfferErrorMessage.d_lng = undefined;
                        getOfferErrorMessage.a_lat = undefined;
                        getOfferErrorMessage.a_lng = undefined;
                        getOfferErrorMessage.appointedTime = undefined;
                        $scope.offers = result.data;
                        var params = {
                            company_id: company_id,
                            type: $scope.bookType,
                            d_lat: book.pickup.geometry.location.lat,
                            d_lng: book.pickup.geometry.location.lng,
                            d_id: book.pickup.place_id,
                            a_lat: 0,
                            a_lng: 0,
                            a_id: 0,
                            estimate_distance: 0,
                            estimate_duration: $scope.hours * 60,
                            appointed_time: (new Date($scope.pickupdate).valueOf() + "").substr(0, 13),
                            d_air: $scope.airLineMessage,
                            d_flight: $scope.airLineMessageNum,
                            d_airFs: $scope.airLineCompanyFs,
                            a_air: $scope.reAirLineMessage,
                            a_flight: $scope.reAirLineMessageNum,
                            a_airFs: $scope.reAirLineCompanyFs,
                            parentLink: parentLink,
                            d_is_airport: $scope.airPort ? 1 : 0,
                            a_is_airport: 0
                        };
                        $scope.jumpToFlow(params);
                        clearData();
                    }
                }, function (error) {
                    nextLadda.stop();
                    $scope.getOfferError += 1;
                    getOfferError();
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "3808") {
                            showAlertModal($filter('translate')('widget.jsNo_offers'));
                        } else if (error.response.data.code == "3809") {
                            showAlertModal($filter('translate')('widget.jsNo_vehicles'));
                        } else if (error.response.data.code == "3810") {
                            showAlertModal($filter('translate')('widget.jsNo_drivers'));
                        } else {
                            showAlertModal($filter('translate')('widget.jsNo_offers'));
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


        // 获取航班列表数据
        $scope.getFlightsList = function (lat, lng, type, time) {
            AirLineTool.getFlightsList(lat, lng, type, time).then(function (result) {
                if (result.data.code == '2100') {
                    $scope.haveAirline = false;
                } else {
                    $scope.haveAirline = true;
                    $scope.flightsList = result.data.result;
                }
            }, function (error) {
                console.log(error);
            });
        };

        // 获取返程航班列表数据
        $scope.getDropFlightsList = function (lat, lng, type, time) {
            AirLineTool.getFlightsList(lat, lng, type, time).then(function (result) {
                if (result.data.code == '2100') {
                    $scope.haveDropAirline = false;
                } else {
                    $scope.haveDropAirline = true;
                    $scope.dropFlightsList = result.data.result;
                }
            }, function (error) {
                console.log(error);
            });
        };

        //判断获取offer失败三次时间地址是否改变，若没有改变，search按钮不可点击。若改变则$scope.getSameOfferError重新计数。
        var getOfferError = function () {
            if ($scope.bookType == 1) {
                if (
                    !getOfferErrorMessage.d_lat
                    && !getOfferErrorMessage.d_lng
                    && !getOfferErrorMessage.a_lat
                    && !getOfferErrorMessage.a_lng
                    && !getOfferErrorMessage.appointedTime
                ) {
                    getOfferErrorMessage.d_lat = book.pickup.geometry.location.lat;
                    getOfferErrorMessage.d_lng = book.pickup.geometry.location.lng;
                    getOfferErrorMessage.a_lat = book.dropoff.geometry.location.lat;
                    getOfferErrorMessage.a_lng = book.dropoff.geometry.location.lng;
                    getOfferErrorMessage.appointedTime = (new Date($scope.pickupdate).valueOf() + "").substr(0, 13);
                    $scope.getSameOfferError += 1;
                } else if (
                    getOfferErrorMessage.d_lat == book.pickup.geometry.location.lat
                    && getOfferErrorMessage.d_lng == book.pickup.geometry.location.lng
                    && getOfferErrorMessage.a_lat == book.dropoff.geometry.location.lat
                    && getOfferErrorMessage.a_lng == book.dropoff.geometry.location.lng
                    && getOfferErrorMessage.appointedTime == (new Date($scope.pickupdate).valueOf() + "").substr(0, 13)
                ) {
                    $scope.getSameOfferError += 1;
                } else {
                    getOfferErrorMessage.d_lat = book.pickup.geometry.location.lat;
                    getOfferErrorMessage.d_lng = book.pickup.geometry.location.lng;
                    getOfferErrorMessage.a_lat = book.dropoff.geometry.location.lat;
                    getOfferErrorMessage.a_lng = book.dropoff.geometry.location.lng;
                    getOfferErrorMessage.appointedTime = (new Date($scope.pickupdate).valueOf() + "").substr(0, 13);
                    $scope.getSameOfferError = 1
                }
            } else {
                if (
                    !getOfferErrorMessage.d_lat
                    && !getOfferErrorMessage.d_lng
                    && !getOfferErrorMessage.appointedTime
                ) {
                    getOfferErrorMessage.d_lat = book.pickup.geometry.location.lat;
                    getOfferErrorMessage.d_lng = book.pickup.geometry.location.lng;
                    getOfferErrorMessage.appointedTime = (new Date($scope.pickupdate).valueOf() + "").substr(0, 13);
                    $scope.getSameOfferError += 1;
                } else if (
                    getOfferErrorMessage.d_lat == book.pickup.geometry.location.lat
                    && getOfferErrorMessage.d_lng == book.pickup.geometry.location.lng
                    && getOfferErrorMessage.appointedTime == (new Date($scope.pickupdate).valueOf() + "").substr(0, 13)
                ) {
                    $scope.getSameOfferError += 1;
                } else {
                    getOfferErrorMessage.d_lat = book.pickup.geometry.location.lat;
                    getOfferErrorMessage.d_lng = book.pickup.geometry.location.lng;
                    getOfferErrorMessage.appointedTime = (new Date($scope.pickupdate).valueOf() + "").substr(0, 13);
                    $scope.getSameOfferError = 1
                }
            }
        }
    });