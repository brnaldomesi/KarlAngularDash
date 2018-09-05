'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('Flow.Controllers', []);
/**
 * Created by wangyaunzhi on 16/12/8.
 */
angular.module('Flow.Controllers')
    .controller('BookDatetimeEditCtrl', function ($scope, $state, $stateParams, $uibModal, $log, MessageBox, $timeout, FlowBS, MapTool, AirLineTool,$filter) {
        var book = {};
        var company_id;
        console.log($stateParams);
        var initData = function () {
            var params = angular.copy($stateParams.data);
            $scope.isReturnSerivce = params.isReturnSerivce;
            company_id = params.company_id;
            $scope.bookType = params.bookType;
            $scope.bookPickUpAddress = params.pickupLocation.formatted_address;
            book.pickup = params.pickupLocation;
            $scope.airLineMessage = params.dair;
            $scope.airLineMessageNum = params.dflight;
            $scope.airLineFs = params.dAirFs;

            if (params.d_is_airport == 1) {
                $scope.airPort = true;
                $scope.isAirport = true;
            } else {
                $scope.airPort = false;
                $scope.isAirport = false;
            }
            $scope.pickupdate = new Date(params.appointed_time);

            if (params.bookType == 1) {
                //p2p
                $scope.bookDropOffAddress = params.dropoffLocation.formatted_address;
                book.dropoff = params.dropoffLocation;
                $scope.reAirLineMessage = params.aair;
                $scope.reAirLineMessageNum = params.aflight;
                $scope.reAirLineFs = params.aAirFs;
                if (params.a_is_airport == 1) {
                    $scope.reAirPort = true;
                    $scope.isDropAirport = true;
                } else {
                    $scope.reAirPort = false;
                    $scope.isDropAirport = false;
                }
                $scope.hours = 1;
            } else {
                //hourly
                $scope.hours = params.hours;
                $scope.reAirPort = false;
            }
        };

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

            initData();

            $scope.showDatePicker = false;

            var date = new Date();
            $('.datetimepicker').datetimepicker({
                inline: true,
                stepping: 15,
                minDate: date,
                defaultDate: $scope.pickupdate,
                sideBySide: false,
                locale:$filter('translate')('fullCalendar_lang')
            });
        }, 0);

        $timeout(function () {
            angular.element('#widgetForm2').validator();
        }, 100);

        $scope.onTypeChangedToP2P = function () {
            $scope.bookType = 1;
        };

        $scope.onTypeChangedToHourly = function () {
            $scope.bookType = 2;
        };

        $scope.flight = function () {
            $scope.airPort = !$scope.airPort;
            if (!$scope.airPort) {
                $scope.airLineMessage = null;
                $scope.airLineMessageNum = null;
                $scope.airLineFs = null
            }
        };

        $scope.reflight = function () {
            $scope.reAirPort = !$scope.reAirPort;
            if (!$scope.reAirPort) {
                $scope.reAirLineMessage = null;
                $scope.reAirLineMessageNum = null;
                $scope.reAirLineFs = null
            }
        };

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.displayDatePicker = function () {
            $scope.showDatePicker = true;
        };

        $scope.cancelDateButtonClick = function () {
            $scope.showDatePicker = false;
        };

        $scope.saveDateButtonClick = function () {
            $scope.showDatePicker = false;
            $scope.pickupdate = $('.datetimepicker').data("DateTimePicker").date()._d;
            $timeout(function () {
                var params = angular.copy($stateParams.data);
                $scope.isReturnSerivce = params.isReturnSerivce;

                if ($scope.bookType == 1) {
                    //p2p
                    if ($scope.isAirport) {
                        $scope.airPort = true;
                        $scope.FlightsList = '';
                        $scope.airlineCompanyMessage = '';
                        $scope.airLineMessage = null;
                        $scope.airLineFs = null;
                        $scope.airLineMessageNum = null;
                        var editDateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
                        $scope.getFlightsList(book.pickup.geometry.location.lat(), book.pickup.geometry.location.lng(), 0, editDateTime);
                    }
                    if ($scope.isDropAirport) {
                        $scope.reAirPort = true;
                        $scope.dropFlightsList = '';
                        $scope.airDroplineCompanyMessage = '';
                        $scope.reAirLineMessage = null;
                        $scope.reAirLineFs = null;
                        $scope.reAirLineMessageNum = null;
                        var editDropDateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
                        $scope.getDropFlightsList(book.dropoff.geometry.location.lat(), book.dropoff.geometry.location.lng(), 1, editDropDateTime);
                    }
                } else {
                    //hourly
                    if ($scope.isAirport) {
                        $scope.airPort = true;
                        $scope.FlightsList = '';
                        $scope.airlineCompanyMessage = '';
                        $scope.airLineMessage = null;
                        $scope.airLineFs = null;
                        $scope.airLineMessageNum = null;
                        var editDateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
                        $scope.getFlightsList(book.pickup.geometry.location.lat(), book.pickup.geometry.location.lng(), 0, editDateTime);
                    }

                }
            })
        };

        //init  mapselect
        $scope.getLocation = function (val) {
            if ($scope.airPort) {
                $scope.airPort = false;
                $scope.FlightsList = '';
                $scope.airlineCompanyMessage = '';
                $scope.airLineMessage = null;
                $scope.airLineFs = null;
                $scope.airLineMessageNum = null;
            }
            return MapTool.getSearchLocations(val);
        };

        $scope.getDropLocation = function (val) {
            if ($scope.reAirPort) {
                $scope.reAirPort = false;
                $scope.dropFlightsList = '';
                $scope.airDroplineCompanyMessage = '';
                $scope.reAirLineMessage = null;
                $scope.reAirLineFs = null;
                $scope.reAirLineMessageNum = null;
            }
            return MapTool.getSearchLocations(val);
        };


        // 航空公司列表
        $scope.getAirlineCompany = function (val) {
            if ($scope.haveAirline) {
                return AirLineTool.matchingAirlineCompany(val, $scope.flightsList);
            } else {
                $scope.airLineMessage = val;
                $scope.airLineFs = val;
            }
        };

        // 选择航空空公司
        $scope.onAirlineCompanySearchSelect = function ($item) {
            $scope.airlineCompanyMessage = $item;
            $scope.airLineFs = $item.fs;
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
                $scope.reAirLineFs = val;
            }
        };

        // 选择终点航空空公司
        $scope.onDropAirlineCompanySearchSelect = function ($item) {
            $scope.airDroplineCompanyMessage = $item;
            $scope.reAirLineFs = $item.fs;
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
            book.pickup = $item;
            // book.pickup.geometry.location = {
            //     lat: book.pickup.geometry.location.lat(),
            //     lng: book.pickup.geometry.location.lng()
            // };
            $scope.airPort = $item.isAirport;
            if($item.isAirport && $scope.pickupdate){
                $scope.isAirport = true;
                var dateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
                $scope.getFlightsList(book.pickup.geometry.location.lat(), book.pickup.geometry.location.lng(), 0, dateTime);
            }else {
                $scope.isAirport = false;
            }
            $scope.bookPickUpAddress = $item.formatted_address;
            // MapTool.geocoderAddress(book.pickup.geometry.location.lat(), book.pickup.geometry.location.lng(), function (result) {
            //     $timeout(function () {
            //         book.pickup = result;
            //         $scope.airPort = result.isAirport;
            //         if (result.isAirport) {
            //             $scope.isAirport = true;
            //             var dateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
            //             $scope.getFlightsList(book.pickup.geometry.location.lat(), book.pickup.geometry.location.lng(), 0, dateTime);
            //         }
            //         $scope.bookPickUpAddress = result.formatted_address;
            //     }, 0);
            // }, function (error) {
            // });
        };

        $scope.onDropOffSearchSelect = function ($item, $model, $label, $event) {
            book.dropoff = $item;
            // book.dropoff.geometry.location = {
            //     lat: book.dropoff.geometry.location.lat(),
            //     lng: book.dropoff.geometry.location.lng()
            // };
            $scope.reAirPort = $item.isAirport;
            if ($item.isAirport && $scope.pickupdate) {
                $scope.isDropAirport = true;
                var dateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
                $scope.getDropFlightsList(book.dropoff.geometry.location.lat(), book.dropoff.geometry.location.lng(), 1, dateTime);
            } else {
                $scope.isDropAirport = false;
            }
            $scope.bookDropOffAddress = $item.formatted_address
            // MapTool.geocoderAddress(book.dropoff.geometry.location.lat(), book.dropoff.geometry.location.lng(), function (result) {
            //     $timeout(function () {
            //         book.dropoff = result;
            //         $scope.reAirPort = result.isAirport;
            //         if (result.isAirport) {
            //             $scope.isDropAirport = true;
            //             var dateTime = parseInt((new Date($scope.pickupdate).valueOf() + "").substr(0, 10));
            //             $scope.getDropFlightsList(book.dropoff.geometry.location.lat(), book.dropoff.geometry.location.lng(), 1, dateTime);
            //         }
            //         $scope.bookDropOffAddress = result.formatted_address
            //     }, 0)
            // }, function (error) {
            // });
        };


        // var getMapMatrixDistance = function (originLat, originlng, destinationLat, destinationLng, sucessHandle, faultHandle) {
        //     var origins = [{lat: originLat, lng: originlng}];
        //     var destinations = [{lat: destinationLat, lng: destinationLng}];
        //     var travelMode = "DRIVING";
        //     var distanceMatrixService = new google.maps.DistanceMatrixService;
        //     distanceMatrixService.getDistanceMatrix({
        //         origins: origins,
        //         destinations: destinations,
        //         travelMode: google.maps.TravelMode[travelMode],
        //         unitSystem: $stateParams.data.companyInfo.distance_unit==1?google.maps.UnitSystem.IMPERIAL:google.maps.UnitSystem.METRIC
        //     }, function (response, status) {
        //         if (status == google.maps.DistanceMatrixStatus.OK) {
        //             if (sucessHandle) {
        //                 sucessHandle(response);
        //             }
        //         } else {
        //             if (faultHandle) {
        //                 faultHandle(status);
        //             }
        //         }
        //     });
        // };

        $scope.onBookButtonClick = function ($event) {
            if (!$scope.bookPickUpAddress) {
                MessageBox.toast($filter('translate')('datetime_edit.jsInput_pickup_add'), "error");
                return;
            }
            if ($scope.bookType == 1 && !$scope.bookDropOffAddress) {
                MessageBox.toast($filter('translate')('datetime_edit.jsInput_drop_add'), "error");
                return;
            }
            if ($scope.bookType == 2 && (!$scope.hours || $scope.hours <= 0)) {
                MessageBox.toast($filter('translate')('datetime_edit.jsInput_hours'), "error");
                return;
            }
            if (!$scope.pickupdate) {
                MessageBox.toast($filter('translate')('datetime_edit.jsInput_pickup_date'), "error");
                return;
            }

            var nowTimestamp = new Date().getTime();
            var appointedTimestamp = Date.parse($scope.pickupdate);
            if (appointedTimestamp <= nowTimestamp) {
                MessageBox.toast($filter('translate')('datetime_edit.jsTime_invalid'), "error");
                return;
            }

            if ($scope.bookType == 1) {
                var directionsService = new google.maps.DirectionsService;
                MapTool.calculateAndDisplayRoute(
                    directionsService,
                    {placeId: book.pickup.place_id},
                    {placeId: book.dropoff.place_id},
                    (new Date($scope.pickupdate).valueOf() + "").substr(0, 10),
                    function (response, status) {
                        console.log("response is ", response);
                      if(status === google.maps.DirectionsStatus.OK){
                          $scope.estimate_data = response.routes[0].legs[0];
                          var estimateDistance= $scope.estimate_data.distance.value / 1000;
                          var nextLadda = Ladda.create($event.target);
                          nextLadda.start();
                          FlowBS.getOffer(company_id,
                              $scope.bookType,
                              book.pickup.geometry.location.lat(),
                              book.pickup.geometry.location.lng(),
                              book.dropoff.geometry.location.lat(),
                              book.dropoff.geometry.location.lng(),
                              estimateDistance,
                              $scope.estimate_data.duration.value / 60,
                              $scope.pickupdate,
                              $scope.airPort ? 1 : 0,
                              $scope.reAirPort ? 1 : 0,
                              2
                          ).then(function (result) {
                              nextLadda.stop();
                              if (result.data.code == '2100' || result.data.code == '3001') {
                                  //没有可匹配的offer
                                  showAlertModal($filter('translate')('datetime_edit.jsNo_booking'));
                              } else if (typeof result.data == "string" || result.data.length < 1) {
                                  //失败
                                  showAlertModal($filter('translate')('datetime_edit.jsGet_offer_failed'));
                              } else {
                                  if (!$scope.isReturnSerivce) {
                                      $stateParams.event.resetCouponCode();
                                  }
                                  //成功
                                  if ($stateParams.event.bookSuccess) {
                                      var params = {};
                                      params.bookType = $scope.bookType;
                                      params.pickupLocation = book.pickup;
                                      params.dropoffLocation = book.dropoff;
                                      params.dair = $scope.airLineMessage;
                                      params.dflight = $scope.airLineMessageNum;
                                      params.dAirFs = $scope.airLineFs;
                                      params.aair = $scope.reAirLineMessage;
                                      params.aflight = $scope.reAirLineMessageNum;
                                      params.aAirFs = $scope.reAirLineFs;
                                      params.estimate_data = $scope.estimate_data;
                                      params.appointed_time = $scope.pickupdate.getTime();
                                      params.offers = result.data;
                                      params.d_is_airport = $scope.airPort ? 1 : 0;
                                      params.a_is_airport = $scope.reAirPort ? 1 : 0;
                                      $stateParams.event.bookSuccess(params);
                                  }
                              }
                          }, function (error) {
                              nextLadda.stop();
                              if (error.treated) {
                              } else {
                                  if (error.response.data.code == "3808") {
                                      showAlertModal($filter('translate')('datetime_edit.jsNo_offers'));
                                  } else if (error.response.data.code == "3809") {
                                      showAlertModal($filter('translate')('datetime_edit.jsNo_vehicles'));
                                  } else if (error.response.data.code == "3810") {
                                      showAlertModal($filter('translate')('datetime_edit.jsNo_drivers'));
                                  } else {
                                      showAlertModal($filter('translate')('datetime_edit.jsNo_offers'));
                                  }
                              }
                          });
                      }
                    });
            } else if ($scope.bookType == 2) {
                var nextLadda = Ladda.create($event.target);
                nextLadda.start();
                FlowBS.getOffer(company_id,
                    $scope.bookType,
                    book.pickup.geometry.location.lat(),
                    book.pickup.geometry.location.lng(),
                    0,
                    0,
                    0,
                    $scope.hours * 60,
                    $scope.pickupdate,
                    $scope.airPort ? 1 : 0,
                    0,
                    2
                ).then(function (result) {
                    nextLadda.stop();
                    if (result.data.code == '2100' || result.data.code == '3001') {
                        //没有可匹配的offer
                        showAlertModal($filter('translate')('datetime_edit.jsNo_booking'));
                    } else if (typeof result.data == "string" || result.data.length < 1) {
                        //失败
                        showAlertModal($filter('translate')('datetime_edit.jsGet_offer_failed'));
                    } else {
                        //成功
                        $stateParams.event.resetCouponCode();
                        if ($stateParams.event.bookSuccess) {
                            var params = {};
                            params.bookType = $scope.bookType;
                            params.pickupLocation = book.pickup;
                            params.dair = $scope.airLineMessage;
                            params.dflight = $scope.airLineMessageNum;
                            params.dAirFs = $scope.airLineFs;
                            params.hours = $scope.hours;
                            params.appointed_time = $scope.pickupdate.getTime();
                            params.offers = result.data;
                            params.d_is_airport = $scope.airPort ? 1 : 0;
                            params.a_is_airport = 0;
                            $stateParams.event.bookSuccess(params);
                        }
                    }
                }, function (error) {
                    nextLadda.stop();
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "3808") {
                            showAlertModal($filter('translate')('datetime_edit.jsNo_offers'));
                        } else if (error.response.data.code == "3809") {
                            showAlertModal($filter('translate')('datetime_edit.jsNo_vehicles'));
                        } else if (error.response.data.code == "3810") {
                            showAlertModal($filter('translate')('datetime_edit.jsNo_drivers'));
                        } else {
                            showAlertModal($filter('translate')('datetime_edit.jsNo_offers'));
                        }
                    }
                });
            }
        };

        var showAlertModal = function (message) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/flow/book-prompt.html',
                controller: 'BookPromptCtrl',
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
    });
/**
 * Created by wangyaunzhi on 16/12/9.
 */
angular.module('Flow.Controllers')
    .controller('BookPromptCtrl', function ($log, $scope, $stateParams) {

        $scope.message = $stateParams.message;
        $scope.onCancelButtonClick = function () {
            $stateParams.event.ok();
        };
    });
/**
 * Created by wangyaunzhi on 16/12/10.
 */
angular.module('Flow.Controllers')
    .controller('BookVehicleEditCtrl', function ($scope, $rootScope, $state, $stateParams, $uibModal, $log, MessageBox, $timeout, FlowBS,$filter) {
        var params = angular.copy($stateParams.data);
        console.log(params);
        var company_id;
        var pickupLocation;
        var dropoffLocation;
        var rsAppointed_time;
        var rsEstimate_data;
        var rsDair;
        var rsDflight;
        var rsDairFs;
        var rsAair;
        var rsAflight;
        var rsAairFs;
        var rs_d_is_airport;
        var rs_a_is_airport;
        var d_is_airport = params.d_is_airport;
        var a_is_airport = params.a_is_airport;

        $scope.showCoupon = false;
        $scope.amountRsOff = 0;
        $scope.percentRsOff = 0;

        $scope.onChangePassengerCount = function (isReturn) {
            if (isReturn) {
                $scope.rsPassengers = [];
                var count = 0;
                if ($scope.rsSelectedMaxPassengers == $scope.rsMaxPassengers[0]) {
                    count = 0;
                } else {
                    if ($scope.rsMaxPassengers.length > 6) {
                        if ($scope.rsSelectedMaxPassengers < $scope.rsMaxPassengers[6]) {
                            count = $scope.rsSelectedMaxPassengers;
                        } else {
                            count = 6;
                        }
                    } else {
                        count = $scope.rsSelectedMaxPassengers;
                    }
                }
                for (var i = 0; i < count; i++) {
                    $scope.rsPassengers.push({name: ''});
                }
            } else {
                $scope.passengers = [];
                var count = 0;
                if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                    count = 0;
                } else {
                    if ($scope.maxPassengers.length > 6) {
                        if ($scope.selectedMaxPassengers < $scope.maxPassengers[6]) {
                            count = $scope.selectedMaxPassengers;
                        } else {
                            count = 6;
                        }
                    } else {
                        count = $scope.selectedMaxPassengers;
                    }
                }
                for (var i = 0; i < count; i++) {
                    $scope.passengers.push({name: ''});
                }
            }
        };

        $scope.initBagCountAndPassengerCount = function (selectCar, isReturn) {
            if (isReturn) {
                $scope.rsMaxBags = ['N/A'];
                for (var i = 1; i < selectCar.bags_max + 1; i++) {
                    $scope.rsMaxBags.push(i);
                }
                $scope.rsSelectedMaxBags = 'N/A';

                $scope.rsMaxPassengers = ['N/A'];
                for (var i = 1; i < selectCar.seats_max + 1; i++) {
                    $scope.rsMaxPassengers.push(i);
                }
                $scope.rsSelectedMaxPassengers = 'N/A';

                $scope.rsPassengers = [];
            } else {
                $scope.maxBags = ['N/A'];
                for (var i = 1; i < selectCar.bags_max + 1; i++) {
                    $scope.maxBags.push(i);
                }
                $scope.selectedMaxBags = 'N/A';

                $scope.maxPassengers = ['N/A'];
                for (var i = 1; i < selectCar.seats_max + 1; i++) {
                    $scope.maxPassengers.push(i);
                }
                $scope.selectedMaxPassengers = 'N/A';

                $scope.passengers = [];
            }
        };

        var initOptions = function (options) {
            var formatOptions = {number: [], checkBox: [], radioGroup: [], checkBoxGroup: [], numberGroup: []};
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option.type == "NUMBER") {
                    option.count = 0;
                    if (option.add_max > 1) {
                        formatOptions.number.push(option);
                    } else {
                        formatOptions.checkBox.push(option);
                    }
                } else if (option.type == "CHECKBOX") {
                    option.count = 0;
                    formatOptions.checkBox.push(option);
                } else if (option.type == "GROUP") {
                    if (option.group == undefined || option.group.length == 0) {
                        continue;
                    }
                    for (var j = 0; j < option.group.length; j++) {
                        option.group[j].count = 0;
                    }
                    if (option.group[0].type == "NUMBER") {
                        formatOptions.numberGroup.push(option);
                    } else if (option.group[0].type == "RADIO") {
                        option.group.selectId = -1;
                        option.group.price = 0;
                        option.group.msg = "-";
                        formatOptions.radioGroup.push(option);
                    } else if (option.group[0].type == "CHECKBOX") {
                        formatOptions.checkBoxGroup.push(option);
                    }
                }
            }
            return formatOptions;
        };

        var initCarList = function (data) {
            var cars = [];
            //循环遍历offer
            for (var i = 0; i < data.length; i++) {
                //循环遍历offer 中的car_categories
                for (var k = 0; k < data[i].car_categories.length; k++) {
                    for (var j = 0; j < data[i].car_categories[k].cars.length; j++) {
                        data[i].car_categories[k].cars[j].isSelect = false;
                        var option = initOptions(data[i].options);
                        data[i].car_categories[k].cars[j].options = jQuery.extend(true, {}, option);
                        data[i].car_categories[k].cars[j].offer = data[i];

                        cars.push(data[i].car_categories[k].cars[j]);
                    }
                }
            }
            return cars;
        };

        var swiper;
        var initVehicles = function () {
            if (swiper) {
                swiper.destroy(false, true);
                swiper.init();
            }
            $timeout(function () {
                swiper = new Swiper('#swiperEdit', {
                    pagination: '.swiper-pagination',
                    observer: true,
                    observeParents: true,
                    slidesPerView: 2,
                    paginationClickable: true,
                    spaceBetween: 20,
                    prevButton: '.swiper-button-prev',
                    nextButton: '.swiper-button-next'
                });
                swiper.slideTo($scope.selectedCar);
                $scope.$apply();
            }, 100);
        };


        var rsSwiper;
        var initRsVehicles = function (data) {
            if (rsSwiper) {
                rsSwiper.destroy(false, true);
                rsSwiper.init();
            }
            $timeout(function () {
                rsSwiper = new Swiper('#rsSwiperEdit', {
                    pagination: '.swiper-pagination',
                    observer: true,
                    observeParents: true,
                    slidesPerView: 2,
                    paginationClickable: true,
                    spaceBetween: 20,
                    prevButton: '.swiper-button-prev',
                    nextButton: '.swiper-button-next'
                });
                rsSwiper.slideTo($scope.rsselectedCar);
                $scope.$apply();
            }, 100);

            if (data) {
                $scope.rscategories = initCarList(data);
                //优先匹配去程车辆
                //再匹配去程车系
                //再匹配去程车make
                //以上3者匹配不上,则匹配第1辆车
                var carIndex = 0;
                var findCar = false;
                var findModel = false;
                var findBrand = false;
                for (var i = 0; i < $scope.rscategories.length; i++) {
                    var car = $scope.rscategories[i];
                    if (car.car_id == $scope.cars[$scope.selectedCar].car_id) {
                        findCar = true;
                        carIndex = i;
                        break;
                    }
                    if (car.model == $scope.cars[$scope.selectedCar].model) {
                        if (findModel) {
                            continue;
                        } else {
                            findModel = true;
                            carIndex = i;
                        }
                    }
                    if (car.brand == $scope.cars[$scope.selectedCar].brand) {
                        if (findBrand) {
                            continue;
                        } else {
                            findBrand = true;
                            carIndex = i;
                        }
                    }
                    if (findCar) {
                        break;
                    }
                }

                $scope.rscars = $scope.rscategories;
                $scope.rsselectedCar = carIndex;
                if (findCar) {
                    $scope.rsMaxBags = $scope.maxBags;
                    $scope.rsSelectedMaxBags = $scope.selectedMaxBags;
                    $scope.rsMaxPassengers = $scope.maxPassengers;
                    $scope.rsSelectedMaxPassengers = $scope.selectedMaxPassengers;
                    $scope.rsPassengers = $scope.passengers;
                } else {
                    $scope.initBagCountAndPassengerCount($scope.rscars[$scope.rsselectedCar], true);
                }
                $scope.rscars[$scope.rsselectedCar].isSelect = true;
                $scope.initRsRideOptions();
            }
        };

        $scope.goGetCar = function (index) {
            if ($scope.selectedCar == index) {
                return;
            }
            for (var i = 0; i < $scope.cars.length; i++) {
                if (index === i) {
                    $scope.cars[i].isSelect = true;
                    $scope.selectedCar = index;
                    $scope.showCoupon = company_id == $scope.cars[i].company_id;
                } else {
                    $scope.cars[i].isSelect = false
                }
            }
            $scope.initBagCountAndPassengerCount($scope.cars[$scope.selectedCar], false);
            $scope.initRideOptions();
        };

        $scope.goGetReCar = function (index) {
            if ($scope.rsselectedCar == index) {
                return;
            }
            for (var i = 0; i < $scope.rscars.length; i++) {
                if (index === i) {
                    $scope.rscars[i].isSelect = true;
                    $scope.rsselectedCar = index;
                } else {
                    $scope.rscars[i].isSelect = false
                }
            }
            $scope.initBagCountAndPassengerCount($scope.rscars[$scope.rsselectedCar], true);
            $scope.initRsRideOptions()
        };

        $scope.initRideOptions = function () {
            var car = $scope.cars[$scope.selectedCar];
            $scope.options = car.options;
            $scope.offer = car.offer;
            $scope.calcPrice();
            $scope.carsMessages = $scope.cars[$scope.selectedCar];
        };


        $scope.initRsRideOptions = function () {
            var car = $scope.rscars[$scope.rsselectedCar];
            $scope.rsoptions = car.options;
            $scope.rsoffer = car.offer;
            $scope.rscalcPrice();
            $scope.rscarsMessages = $scope.rscars[$scope.rsselectedCar];
        };

        $scope.calcPrice = function () {
            if ($scope.options.length == 0) {
                $scope.totalPrice = $scope.offer.basic_cost * (1 + $scope.offer.tva / 100);
                if ($scope.totalPrice < 1) {
                    $scope.totalPrice = 1.00;
                }
                return;
            }
            $scope.options.selectOption = [];

            if ($scope.offer.company_id == $rootScope.company_id) {
                $scope.showCoupon = true;
            }else {
                $scope.showCoupon = false;
            }
            // 解析checkBox价格
            var checkBoxPrice = 0;
            for (var i = 0; i < $scope.options.checkBox.length; i++) {
                var optionItem = $scope.options.checkBox[i];
                if (optionItem.count == 1) {
                    checkBoxPrice = checkBoxPrice + optionItem.price;
                    $scope.options.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            // 解析number价格
            var numberPrice = 0;
            for (var i = 0; i < $scope.options.number.length; i++) {
                var optionItem = $scope.options.number[i];
                numberPrice = numberPrice + (optionItem.price * optionItem.count);
                if (optionItem.count > 0) {
                    $scope.options.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            //解析raidoGroup价格
            var raidoGroupPrice = 0;
            for (var i = 0; i < $scope.options.radioGroup.length; i++) {
                var optionItem = $scope.options.radioGroup[i];
                raidoGroupPrice = raidoGroupPrice + parseFloat(optionItem.price);
                if (optionItem.selectId != undefined) {
                    $scope.options.selectOption.push({
                        option_id: optionItem.selectId,
                        count: 1
                    });
                }
            }

            //解析checkBoxGroup价格
            var checkBoxGroupPrice = 0;
            for (var i = 0; i < $scope.options.checkBoxGroup.length; i++) {
                for (var j = 0; j < $scope.options.checkBoxGroup[i].group.length; j++) {
                    var optionItem = $scope.options.checkBoxGroup[i].group[j];
                    if (optionItem.count == 1) {
                        checkBoxGroupPrice = checkBoxGroupPrice + optionItem.price;
                        $scope.options.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            //解析numberGrou价格
            var numberGroupPrice = 0;
            for (var i = 0; i < $scope.options.numberGroup.length; i++) {
                for (var j = 0; j < $scope.options.numberGroup[i].group.length; j++) {
                    var optionItem = $scope.options.numberGroup[i].group[j];
                    numberGroupPrice = numberGroupPrice + (optionItem.price * optionItem.count);
                    if (optionItem.count > 0) {
                        $scope.options.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            console.log(d_is_airport);
            if (d_is_airport == 1) {
                if (a_is_airport == 1) {
                    $scope.totalPrice = ($scope.offer.basic_cost + $scope.offer.d_port_price + $scope.offer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                } else {
                    $scope.totalPrice = ($scope.offer.basic_cost + $scope.offer.d_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                }
            } else {
                if (a_is_airport == 1) {
                    $scope.totalPrice = ($scope.offer.basic_cost + $scope.offer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                } else {
                    $scope.totalPrice = ($scope.offer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                }
            }

            $scope.optionsPrice = checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
            // $scope.totalPrice = ($scope.offer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
            if ($scope.totalPrice > 0 && $scope.totalPrice < 1) {
                $scope.totalPrice = 1.00;
            }
            if($scope.showCoupon){
                $scope.showTotalPrice = $scope.totalPrice-$scope.amountOff-$scope.percentOff/100*($scope.totalPrice-$scope.amountOff);
            }else{
                $scope.showTotalPrice = $scope.totalPrice;
            }

            if ($scope.showTotalPrice > 0 && $scope.showTotalPrice < 1) {
                $scope.showTotalPrice = 1.00;
            }
            if ($scope.showTotalPrice < 0) {
                $scope.showTotalPrice = 0;
            }
        };


        $scope.rscalcPrice = function () {
            if ($scope.rsoptions.length == 0) {
                $scope.rstotalPrice = $scope.rsoffer.basic_cost * (1 + $scope.rsoffer.tva / 100);
                if ($scope.rstotalPrice < 1) {
                    $scope.rstotalPrice = 1.00;
                }
                return;
            }
            $scope.rsoptions.selectOption = [];
            // 解析checkBox价格
            var checkBoxPrice = 0;
            for (var i = 0; i < $scope.rsoptions.checkBox.length; i++) {
                var optionItem = $scope.rsoptions.checkBox[i];
                if (optionItem.count == 1) {
                    checkBoxPrice = checkBoxPrice + optionItem.price;
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            // 解析number价格
            var numberPrice = 0;
            for (var i = 0; i < $scope.rsoptions.number.length; i++) {
                var optionItem = $scope.rsoptions.number[i];
                numberPrice = numberPrice + (optionItem.price * optionItem.count);
                if (optionItem.count > 0) {
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            //解析raidoGroup价格
            var raidoGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.radioGroup.length; i++) {
                var optionItem = $scope.rsoptions.radioGroup[i];
                raidoGroupPrice = raidoGroupPrice + parseFloat(optionItem.price);
                if (optionItem.selectId != undefined) {
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.selectId,
                        count: 1
                    });
                }
            }

            //解析checkBoxGroup价格
            var checkBoxGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.checkBoxGroup.length; i++) {
                for (var j = 0; j < $scope.rsoptions.checkBoxGroup[i].group.length; j++) {
                    var optionItem = $scope.rsoptions.checkBoxGroup[i].group[j];
                    if (optionItem.count == 1) {
                        checkBoxGroupPrice = checkBoxGroupPrice + optionItem.price;
                        $scope.rsoptions.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            //解析numberGrou价格
            var numberGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.numberGroup.length; i++) {
                for (var j = 0; j < $scope.rsoptions.numberGroup[i].group.length; j++) {
                    var optionItem = $scope.rsoptions.numberGroup[i].group[j];
                    numberGroupPrice = numberGroupPrice + (optionItem.price * optionItem.count);
                    if (optionItem.count > 0) {
                        $scope.rsoptions.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            if (rs_d_is_airport == 1) {
                if (rs_a_is_airport == 1) {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + $scope.rsoffer.d_port_price + $scope.rsoffer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                } else {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + $scope.rsoffer.d_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                }
            } else {
                if (rs_a_is_airport == 1) {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + $scope.rsoffer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                } else {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                }
            }
            $scope.rsOptionsPrice = checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
            // $scope.rstotalPrice = ($scope.rsoffer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
            if ($scope.rstotalPrice > 0 && $scope.rstotalPrice < 1) {
                $scope.rstotalPrice = 1.00;
            }
            $scope.showRsTotalPrice = $scope.rstotalPrice-$scope.amountRsOff-$scope.percentRsOff/100*($scope.rstotalPrice-$scope.amountRsOff);
            if ($scope.showRsTotalPrice > 0 && $scope.showRsTotalPrice < 1) {
                $scope.showRsTotalPrice = 1.00;
            }
            if ($scope.showRsTotalPrice < 0) {
                $scope.showRsTotalPrice = 0;
            }
            console.log($scope.showRsTotalPrice)
        };

        $scope.onEnableOption = function (option) {
            if (option.enable) {
                option.count = 1;
            } else {
                option.count = 0;
            }
            $scope.calcPrice();
        };

        $scope.onChangeOptionCount = function (option, isAdd) {
            if (isAdd) {
                if (option.count >= option.add_max) {
                    return;
                }
                option.count++;
            } else {
                if (option.count <= 1) {
                    return;
                }
                option.count--;
            }
            $scope.calcPrice();
        };

        $scope.onReEnableOption = function (option) {
            if (option.enable) {
                option.count = 1;
            } else {
                option.count = 0;
            }
            $scope.rscalcPrice();
        };

        $scope.onReChangeOptionCount = function (option, isAdd) {
            if (isAdd) {
                if (option.count >= option.add_max) {
                    return;
                }
                option.count++;
            } else {
                if (option.count <= 1) {
                    return;
                }
                option.count--;
            }
            $scope.rscalcPrice();
        };

        var init = function () {
            $scope.bookType = params.bookType;

            if ($scope.bookType == 1) {
                company_id = params.company_id;
                pickupLocation = params.pickupLocation;
                dropoffLocation = params.dropoffLocation;
                rsAppointed_time = params.rsAppointed_time;
                rsDair = params.rsDair;
                rsDflight = params.rsDflight;
                rsDairFs = params.rsDairFs;
                rsAair = params.rsAair;
                rsAflight = params.rsAflight;
                rsAairFs = params.rsAairFs;
                rsEstimate_data = params.rsEstimate_data;
                rs_d_is_airport = params.rs_d_is_airport;
                rs_a_is_airport = params.rs_a_is_airport
            }

            $scope.cars = params.cars;
            $scope.selectedCar = params.selectedCar;
            $scope.options = params.options;
            $scope.offer = params.offer;
            $scope.maxBags = params.maxBags;
            $scope.selectedMaxBags = params.selectedMaxBags;
            $scope.maxPassengers = params.maxPassengers;
            $scope.selectedMaxPassengers = params.selectedMaxPassengers;
            $scope.passengers = params.passengers;
            $scope.promo_code_shown = params.promo_code_shown;
            $scope.checkingCode = params.checkingCode;
            $scope.showCoupon = params.showCoupon;
            $scope.couponCode = params.couponCode;
            $scope.amountOff = params.amountOff;
            $scope.percentOff = params.percentOff;
            $scope.haveVerifyCode = params.haveVerifyCode;
            $scope.showTotalPrice = params.showTotalPrice;
            initVehicles();
            $scope.calcPrice();

            $scope.showReturnService = params.showReturnService;
            if ($scope.showReturnService) {
                $scope.rscars = params.rscars;
                $scope.rsselectedCar = params.rsselectedCar;
                $scope.rsoptions = params.rsoptions;
                $scope.rsoffer = params.rsoffer;
                $scope.rsMaxBags = params.rsMaxBags;
                $scope.rsSelectedMaxBags = params.rsSelectedMaxBags;
                $scope.rsMaxPassengers = params.rsMaxPassengers;
                $scope.rsSelectedMaxPassengers = params.rsSelectedMaxPassengers;
                $scope.rsPassengers = params.rsPassengers;
                $scope.rs_promo_code_shown = params.rs_promo_code_shown;
                $scope.rs_checkingCode = params.rs_checkingCode;
                $scope.couponRsCode = params.couponRsCode;
                $scope.amountRsOff = params.amountRsOff;
                $scope.percentRsOff = params.percentRsOff;
                $scope.rs_haveVerifyCode = params.rs_haveVerifyCode;
                $scope.showRsTotalPrice = params.showRsTotalPrice;
                initRsVehicles();
                $scope.rscalcPrice();
            }

            $scope.$apply();

            //初始化开关控件
            $("[name='rsSwitchEdit']").bootstrapSwitch();
            $("[name='rsSwitchEdit']").on('switchChange.bootstrapSwitch', function (event, state) {
                $timeout(function () {
                    if (state) {
                        $scope.addReturnService();
                    } else {
                        $scope.showReturnService = false;
                    }
                }, 0);
            });
        };

        $timeout(function () {
            init();
        }, 0);


        //添加返程booking
        $scope.addReturnService = function () {
            var rsparams = {};
            rsparams.company_id = company_id;
            rsparams.bookType = 1;
            rsparams.isReturnSerivce = true;
            rsparams.pickupLocation = dropoffLocation;
            rsparams.dropoffLocation = pickupLocation;
            rsparams.dair = rsDair;
            rsparams.dflight = rsDflight;
            rsparams.dAirFs = rsDairFs;
            rsparams.aair = rsAair;
            rsparams.aflight = rsAflight;
            rsparams.aAirFs = rsAairFs;
            rsparams.appointed_time = rsAppointed_time;
            rsparams.d_is_airport = rs_d_is_airport;
            rsparams.a_is_airport = rs_a_is_airport;
            rsparams.companyInfo= $stateParams.data.companyInfo;

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/flow/book-datetime-edit.html',
                controller: 'BookDatetimeEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: rsparams,
                        event: {
                            bookSuccess: function (reParams) {
                                modalInstance.dismiss();
                                $scope.rsMaxBags = ['N/A'];
                                $scope.rsSelectedMaxBags = 'N/A';
                                $scope.rsMaxPassengers = ['N/A'];
                                $scope.rsSelectedMaxPassengers = 'N/A';
                                $scope.rsPassengers = [];

                                rsEstimate_data = reParams.estimate_data;
                                rsDair = reParams.dair;
                                rsDflight = reParams.dflight;
                                rsDairFs = reParams.dAirFs;
                                rsAair = reParams.aair;
                                rsAflight = reParams.aflight;
                                rsAairFs = reParams.aAirFs;
                                rsAppointed_time = reParams.appointed_time;
                                rs_d_is_airport = reParams.d_is_airport;
                                rs_a_is_airport = reParams.a_is_airport;

                                initRsVehicles(reParams.offers);
                                $scope.showReturnService = true;
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                                $("[name='rsSwitchEdit']").bootstrapSwitch('toggleState');
                            }
                        }
                    }
                }
            });
        };

        $scope.onContinueButtonClick = function () {
            if ($stateParams.event.editSuccess) {
                var params = {};
                params.cars = $scope.cars;
                params.selectedCar = $scope.selectedCar;
                params.options = $scope.options;
                params.offer = $scope.offer;
                params.totalPrice = $scope.totalPrice;

                params.maxBags = $scope.maxBags;
                params.selectedMaxBags = $scope.selectedMaxBags;
                params.maxPassengers = $scope.maxPassengers;
                params.selectedMaxPassengers = $scope.selectedMaxPassengers;
                params.passengers = $scope.passengers;
                params.promo_code_shown = $scope.promo_code_shown;
                params.couponCode = $scope.couponCode;
                params.showCoupon = $scope.showCoupon;
                params.checkingCode = $scope.checkingCode;
                params.amountOff = $scope.amountOff;
                params.percentOff = $scope.percentOff;
                params.haveVerifyCode = $scope.haveVerifyCode;
                params.showTotalPrice = $scope.showTotalPrice;

                params.showReturnService = $scope.showReturnService;
                if (params.showReturnService) {
                    params.rscars = $scope.rscars;
                    params.rsselectedCar = $scope.rsselectedCar;
                    params.rsoptions = $scope.rsoptions;
                    params.rsoffer = $scope.rsoffer;
                    params.rstotalPrice = $scope.rstotalPrice;

                    params.rsMaxBags = $scope.rsMaxBags;
                    params.rsSelectedMaxBags = $scope.rsSelectedMaxBags;
                    params.rsMaxPassengers = $scope.rsMaxPassengers;
                    params.rsSelectedMaxPassengers = $scope.rsSelectedMaxPassengers;
                    params.rsPassengers = $scope.rsPassengers;

                    params.rs_promo_code_shown = $scope.rs_promo_code_shown;
                    params.rs_checkingCode = $scope.rs_checkingCode;
                    params.couponRsCode = $scope.couponRsCode;
                    params.amountRsOff = $scope.amountRsOff;
                    params.percentRsOff = $scope.percentRsOff;
                    params.rs_haveVerifyCode = $scope.rs_haveVerifyCode;
                    params.showRsTotalPrice = $scope.showRsTotalPrice;

                    params.rsDair = rsDair;
                    params.rsDflight = rsDflight;
                    params.rsDairFs = rsDairFs;
                    params.rsAair = rsAair;
                    params.rsAflight = rsAflight;
                    params.rsAairFs = rsAairFs;
                    params.rsAppointed_time = rsAppointed_time;
                    params.rsEstimate_data = rsEstimate_data;
                    params.rs_d_is_airport = rs_d_is_airport;
                    params.rs_a_is_airport = rs_a_is_airport;
                }

                $stateParams.event.editSuccess(params);
            }
        };

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.showPromoCodeLine = function () {
            $scope.promo_code_shown = true;
            $scope.checkingCode = false;
        };

        $scope.dismissPromoCodeLine = function () {
            if ($scope.checkingCode) {
                return;
            }
            $scope.promo_code_shown = false;
            $scope.checkingCode = true;
        };

        $scope.getCouponCode = function ($event) {
            if ($scope.checkingCode) {
                return;
            }
            $scope.checkingCode = true;

            if ($scope.couponCode == null || $scope.couponCode == undefined || $scope.couponCode.trim(' ') == '') {
                $scope.checkingCode = false;
                MessageBox.toast($filter('translate')('vehicle_edit.jsCode_not_null'), 'error');
                return;
            }

            var ladda = Ladda.create($event.target);
            ladda.start();
            FlowBS.verifyCoupon($rootScope.company_id, $scope.couponCode).then(
                function (result) {
                    console.log(result);
                    if (!result.data.valid) {
                        MessageBox.toast($filter('translate')('vehicle_edit.jsCode_used'), 'error');
                    } else {
                        if (result.data.percent_off == null) {
                            $scope.percentOff = 0;
                        } else {
                            $scope.percentOff = result.data.percent_off;
                        }
                        $scope.amountOff = result.data.amount_off;
                        $scope.haveVerifyCode = true;
                    }
                    $scope.checkingCode = false;
                    $scope.calcPrice();
                    ladda.stop();
                }, function (error) {
                    $scope.checkingCode = false;
                    ladda.stop();
                    MessageBox.toast($filter('translate')('vehicle_edit.jsCode_not_valid'), 'error');
                }
            );
        };
    });
/**
 * Created by jian on 16-10-28.
 */
angular.module('Flow.Controllers')
    .controller('bookedCtrl', function ($log, $scope, $stateParams, $rootScope) {
        if (!$rootScope.company_id) {
            window.location.href = localStorage.getItem('a4c_iframe_widget_parent_link');
            return;
        }
        $scope.langStyle=localStorage.getItem('lang');
        if($scope.langStyle==='fr'){
            $scope.iosAppImgLink='img/dashboard/iox-FR.png';
            $scope.androidAppImgLink='img/dashboard/google-FR.png'
        }else {
            $scope.iosAppImgLink='img/dashboard/download-on-the-app-store.png';
            $scope.androidAppImgLink='img/dashboard/google-play.png'
        }
        $scope.allData = angular.copy($stateParams.data);
        console.log("", $scope.allData);
        $scope.companyInfor = $stateParams.data.company_infor;
        $scope.offer=$scope.allData.params.car.offer;
        if (!$scope.allData.reParams) {
            $scope.amountRsOff = 0;
            $scope.percentRsOff = 0;
            $scope.showRsTotalPrice = 0;
        } else {
            $scope.rsoffer=$scope.allData.reParams.car.offer;
            $scope.amountRsOff = $scope.allData.reParams.amountOff;
            $scope.percentRsOff = $scope.allData.reParams.percentOff;
            $scope.showRsTotalPrice = $scope.allData.reParams.showTotalPrice;
        }
        //公司APP
        $scope.getCompanyIosApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/ios';
        $scope.getCompanyGoogleApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/android';
        $scope.preCost = $scope.allData.params.cost;
        $scope.cost = ($scope.allData.params.cost - $scope.allData.params.amountOff) * (1 - $scope.allData.params.percentOff / 100);
        if ($scope.cost < 0) {
            $scope.cost = 0;
        } else if ($scope.cost > 0 && $scope.cost < 1) {
            $scope.cost = 1;
        }
        console.log($scope.cost)
        $scope.reCost = 0;
        if ($scope.allData.reParams) {
            $scope.rePreCost=$scope.allData.reParams.cost;
            $scope.reCost = ($scope.allData.reParams.cost - $scope.allData.reParams.amountOff) * (1 - $scope.allData.reParams.percentOff / 100);
        }
        if($scope.reCost <0){
            $scope.reCost = 0;
        }else if($scope.reCost > 0&&$scope.reCost<1){
            $scope.reCost=1;
        }
        console.log($scope.reCost)
        // $scope.cost = $scope.cost + $scope.reCost;

        $scope.firstName = $scope.allData.loginUser.first_name;
        $scope.lastName = $scope.allData.loginUser.last_name;
        $scope.email = $scope.allData.loginUser.email;
        $scope.mobile = $scope.allData.loginUser.mobile;

        $scope.goButtonClick = function () {
            window.parent.postMessage("hideFlowIframe", "*");
        }
    });


/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('Flow.Controllers')
    .controller('CustomerRegisterCtrl', function ($timeout, $log, $scope, $stateParams, $rootScope, MapTool, $state, MessageBox, FlowBS,$filter) {
        console.log($stateParams);
        $scope.companyImg = ApiServer.serverUrl + ApiServer.version + '/companies/logo/' + $rootScope.company_id;
        $scope.companyInfor = $stateParams.data.company_infor;
        //公司APP
        $scope.langStyle=localStorage.getItem('lang');
        if($scope.langStyle==='fr'){
            $scope.iosAppImgLink='img/dashboard/iox-FR.png';
            $scope.androidAppImgLink='img/dashboard/google-FR.png'
        }else {
            $scope.iosAppImgLink='img/dashboard/download-on-the-app-store.png';
            $scope.androidAppImgLink='img/dashboard/google-play.png'
        }
        $scope.getCompanyIosApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/ios';
        $scope.getCompanyGoogleApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/android';
        if (!$rootScope.company_id) {
            history.go(-1);
            return;
        }
        $scope.allData = angular.copy($stateParams.data);
        $scope.allDataAddress = angular.copy($stateParams.data);
        $scope.offer = $scope.allData.params.edit_vehicle_params.offer;
        if(!$scope.allData.reParams){
            $scope.amountRsOff = 0;
            $scope.percentRsOff = 0;
            $scope.showRsTotalPrice = 0;
        }else {
            $scope.amountRsOff = $scope.allData.reParams.amountOff;
            $scope.percentRsOff = $scope.allData.reParams.percentOff;
            $scope.showRsTotalPrice = $scope.allData.reParams.showTotalPrice;
        }

        if ($scope.allData.reParams) {
            // $scope.cost = $scope.allData.params.cost + $scope.allData.reParams.cost;
            $scope.cost = $scope.allData.params.cost;
            $scope.reCost = $scope.allData.reParams.cost;
            $scope.rsOffer = $scope.allData.reParams.edit_vehicle_params.offer;
        } else {
            $scope.cost = $scope.allData.params.cost;
        }

        $scope.isLogining = false;
        $scope.isreLoginForm = false;
        $scope.displayLogin = function () {
            $scope.isreLoginForm = !$scope.isreLoginForm;
        };
        // $scope.Register = function () {
        //     $scope.isreLoginForm = false
        // };

        $scope.cardTypes = [
            {
                name: 'VISA',
                value: 1
            },
            {
                name: 'MaserCard',
                value: 2
            },
            {
                name: 'AmericanExpress',
                value: 3
            },
            {
                name: 'Discover',
                value: 4
            }
        ];

        $timeout(function () {
            angular.element('#registerForm').validator();
        }, 0);
        $timeout(function () {
            angular.element('#reLoginForm').validator();
        }, 0);
        // $scope.getLocation = function (val) {
        //     return MapTool.getSearchLocations(val);
        // };
        // $scope.onAddressSelect = function ($item, $model, $label, $event) {
        //     MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
        //         $timeout(function () {
        //             $scope.address = result;
        //         }, 0);
        //     }, function (error) {
        //     });
        //     $scope.address = angular.copy($item);
        // };

        $scope.charge = {
            card_type: 1
        };

        var company_id = $rootScope.company_id;

        $scope.resizeFix = function () {
            angular.element($("#bg")).css("height", window.screen.availHeight - 0 + "px");
        };

        $scope.resizeFix();

        window.onresize = function () {
            $scope.resizeFix();
        };


        $scope.onRegisterButtonClick = function ($valid, $event) {
            if (!$valid) {
                return;
            }
            if ($scope.password != $scope.retypePassword) {
                MessageBox.toast($filter('translate')('customer_register.jsPassword_same'), "error");
                return;
            }
            var cardNumberReg;
            var cvv2Reg;
            if ($scope.charge.card_type == 1) {
                //VISA
                cardNumberReg = /^4\d{12}(?:\d{3})?$/g;
                cvv2Reg = /^[0-9]{3}$/g;
            } else if ($scope.charge.card_type == 2) {
                //MasterCard
                cardNumberReg = /^5[1-5][0-9]{14}/g;
                cvv2Reg = /^[0-9]{3}$/g;
            } else if ($scope.charge.card_type == 3) {
                //AmericanExpress
                cardNumberReg = /^3[47][0-9]{13}$/g;
                cvv2Reg = /^[0-9]{4}$/g;
            } else {
                //DISCOVER
                cardNumberReg = /^6(?:011|5[0-9]{2})[0-9]{12}$/g;
                cvv2Reg = /^[0-9]{3}$/g;
            }
            // if ($scope.address == undefined || $scope.address == '' ||
            //     $scope.address.formatted_address == undefined
            // ) {
            //     MessageBox.toast($filter('translate')('customer_register.jsFill_address'), "error");
            //     return
            // }
            var number = "" + $scope.charge.card_number;
            var numberResultArray = number.match(cardNumberReg);
            if (!numberResultArray || numberResultArray != number) {
                MessageBox.toast($filter('translate')('customer_register.jsFill_card_num'), "error");
                return;
            }
            // $scope.charge.address = JSON.stringify($scope.address);
            var ladda = Ladda.create($event.target);
            ladda.start();
            register(ladda);
        };

        $scope.onLoginButtonClick = function ($valid, $event) {
            if (!$valid) {
                return;
            }
            var ladda = Ladda.create($event.target);
            login(ladda);
        };

        var customerLang=$scope.langStyle;

        var register = function (ladda) {
            FlowBS.register(company_id, $scope.password, $scope.firstName, $scope.lastName, $scope.mobile, $scope.email,customerLang).then(function (result) {
                //注册成功登陆
                login(ladda);
            }, function (error) {
                ladda.stop();
                if (error.treated) {
                } else {
                    MessageBox.toast($filter('translate')('customer_register.jsReg_failed'), "error");
                }
            });
        };

        var login = function (ladda) {
            FlowBS.login(company_id, $scope.email, $scope.password).then(function (result) {
                $scope.allData.loginUser = result.data;
                //登陆成功添加信用卡
                addCard(ladda);
            }, function () {
                ladda.stop();
                if (error.treated) {
                }
                else {
                    MessageBox.toast($filter('translate')('customer_register.jsLogin_failed'), "error");
                }

                $timeout(function () {
                    angular.element('#loginForm').validator();
                    $scope.isLogining = true;
                }, 0);
            });
        };

        var addCard = function (ladda) {

            FlowBS.addCard($scope.allData.loginUser.token, $scope.charge).then(function (result) {
                getCard(ladda);
            }, function (error) {
                ladda.stop();
                MessageBox.toast($filter('translate')('customer_register.jsCreate_card_failed'), "error");

                $scope.allData.cards = [];
                $state.go('select-payment', {data: $scope.allData});
            });
        };

        var getCard = function (ladda) {
            FlowBS.getCards($scope.allData.loginUser.token).then(function (result) {
                ladda.stop();
                MessageBox.toast($filter('translate')('customer_register.jsReg_success'), "Success");

                $scope.allData.cards = result.data;
                $state.go('select-payment', {data: $scope.allData});
            }, function (error) {
                ladda.stop();
                MessageBox.toast($filter('translate')('customer_register.jsGet_card_failed'), "error");

                $state.go('select-payment', {data: $scope.allData});
            });
        };

        $scope.reLoginFormClick=function ($valid, $event) {
            if (!$valid) {
                return;
            }
            var nextLadda = Ladda.create($event.target);
            nextLadda.start();
            FlowBS.login(company_id, $scope.email, $scope.password).then(function (result) {
                $scope.allData.loginUser = result.data;
                FlowBS.getCards($scope.allData.loginUser.token).then(function (result) {
                    nextLadda.stop();
                    $scope.allData.cards = result.data;
                    MessageBox.toast($filter('translate')('customer_register.jsLogin_success'), "Success");
                    $state.go('select-payment', {data: $scope.allData});
                },function (error) {
                    nextLadda.stop();
                    MessageBox.toast($filter('translate')('customer_register.jsLogin_get_card_failed'), "error");
                    $state.go('select-payment', {data: $scope.allData});
                })
            },function (error) {
                nextLadda.stop();
                if (error.treated) {
                }
                else {
                    MessageBox.toast($filter('translate')('customer_register.jsLogin_failed'), "error");
                }
            })
        };

        $scope.goToLast = function () {
            // window.history.go(-1)
            // $stateParams.event.cancel()
            $state.go('flow',
                {
                    data: {
                        step: 3,
                        params: $stateParams.data
                        // company_infor: $scope.allData.company_infor,
                        // login_user: $scope.allData.loginUser,
                        // cards: $scope.allData.cards
                    }
                }
            );
        }
    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('Flow.Controllers')
    .controller('FlowStep1Ctrl', function ($scope, $rootScope, $state, $stateParams, $http, $uibModal, $log, MessageBox, $timeout, FlowBS, MapTool, AddressTool, AirLineTool,$filter) {
        /**
         * init
         */
        var parentWindow = window.parent;
        parentWindow.postMessage('showPopWindows', '*');
        $scope.langStyle=localStorage.getItem('lang');
        if($scope.langStyle==='fr'){
            $scope.iosAppImgLink='img/dashboard/iox-FR.png';
            $scope.androidAppImgLink='img/dashboard/google-FR.png'
        }else {
            $scope.iosAppImgLink='img/dashboard/download-on-the-app-store.png';
            $scope.androidAppImgLink='img/dashboard/google-play.png'
        }

        {
            var book = {};
            book.drivers = undefined;
            book.type = 1;
            //预定1.transfer  2.hourly
            $scope.bookType = 1;
            //乘客选用卡
            $scope.selectedCard = undefined;
            //
            $scope.appointedTime = undefined;
            $scope.isGetOffer = false;
            $scope.hourlyDate = 2;
            $scope.maxBags = ['N/A'];
            $scope.selectedMaxBags = 'N/A';
            $scope.maxPassengers = ['N/A'];
            $scope.selectedMaxPassengers = 'N/A';
            $scope.passengers = [];
            $scope.bookTime = {};
            $scope.bookAddress = {};
            $scope.creditCardType = angular.copy(CreditCardType);
            $scope.airPort = false;
            $scope.reAirPort = false;
            $scope.airLineMessage = null;
            $scope.airLineCompanyFs = null;
            $scope.airLineMessageNum = null;
            $scope.reAirLineMessage = null;
            $scope.reAirLineCompanyFs = null;
            $scope.reAirLineMessageNum = null;
            $scope.bookingMsg = {msg: ""};
            $scope.optionsPrice = 0;
            $scope.haveAirline = false;
            $scope.haveDropAirline = false;
            $scope.isAirport = false;
            $scope.isDropAirport = false;
            $scope.getOfferError = 0;
            $scope.getSameOfferError = 0;
            var getOfferErrorMessage = {};


            var getQueryString = function (url, name) {
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
            //限制notes字数为999
            $("#easybook-notes-textarea").on("input propertychange", function () {
                var $this = $(this),
                    _val = $this.val();
                if (_val.length > 999) {
                    $this.val(_val.substring(0, 999));
                }
            });

        }

        /**
         *  step one
         */
        {
            var companyId = getQueryString(location.href, "company_id");
            FlowBS.getCompanyInfor(companyId).then(function (result) {
                $scope.companyInfor = result.data;
            }, function (error) {
            });
            //公司LOGO
            $scope.companyImg = ApiServer.serverUrl + ApiServer.version + '/companies/logo/' + companyId;
            //公司APP
            $scope.getCompanyIosApp = ApiServer.serverUrl + '/app/company/' + companyId + '/ios';
            $scope.getCompanyGoogleApp = ApiServer.serverUrl + '/app/company/' + companyId + '/android';
            var date = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            book.bookApTime = new Date((tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear() + ' ' + "12:00 PM");
            $('.bookApTime').datetimepicker({
                inline: true,
                stepping: 15,
                minDate: date,
                defaultDate: book.bookApTime,
                sideBySide: true,
                locale:$filter('translate')('fullCalendar_lang')
            });

            $scope.clickOneWay = function () {
                book = {};
                $scope.bookType = 1;
                $scope.bookPickUpAddress = '';
                $scope.bookDropOffAddress = '';
                $scope.airPort = false;
                $scope.reAirPort = false;
                $scope.FlightsList = '';
                $scope.airlineCompanyMessage = '';
                $scope.airLineMessage = null;
                $scope.airLineCompanyFs = null;
                $scope.airLineMessageNum = null;
                $scope.reAirLineMessage = null;
                $scope.reAirLineCompanyFs = null;
                $scope.reAirLineMessageNum = null;
                $scope.dropFlightsList = '';
                $scope.haveAirline = false;
                $scope.haveDropAirline = false;
                $scope.isAirport = false;
                $scope.isDropAirport = false;
                $scope.getOfferError = 0;
                $scope.getSameOfferError = 0;
                getOfferErrorMessage.d_lat = undefined;
                getOfferErrorMessage.d_lng = undefined;
                getOfferErrorMessage.a_lat = undefined;
                getOfferErrorMessage.a_lng = undefined;
                getOfferErrorMessage.appointedTime = undefined;
            };
            $scope.clickHourly = function () {
                book = {};
                $scope.bookType = 2;
                $scope.bookPickUpAddress = '';
                $scope.bookDropOffAddress = '';
                $scope.airPort = false;
                $scope.reAirPort = false;
                $scope.FlightsList = '';
                $scope.airlineCompanyMessage = '';
                $scope.airLineMessage = null;
                $scope.airLineCompanyFs = null;
                $scope.airLineMessageNum = null;
                $scope.reAirLineMessage = null;
                $scope.reAirLineCompanyFs = null;
                $scope.reAirLineMessageNum = null;
                $scope.dropFlightsList = '';
                $scope.haveAirline = false;
                $scope.haveDropAirline = false;
                $scope.isAirport = false;
                $scope.isDropAirport = false;
                $scope.getOfferError = 0;
                $scope.getSameOfferError = 0;
                getOfferErrorMessage.d_lat = undefined;
                getOfferErrorMessage.d_lng = undefined;
                getOfferErrorMessage.a_lat = undefined;
                getOfferErrorMessage.a_lng = undefined;
                getOfferErrorMessage.appointedTime = undefined;
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

            var getPickUpFlightsList = function (lat, lng, type, time) {
                AirLineTool.getFlightsList(lat, lng, type, time).then(function (result) {
                    if (result.code == '2100') {
                        $scope.haveAirline = false;
                    } else {
                        $scope.haveAirline = true;
                        $scope.FlightsList = result.data.result;
                    }
                }, function (error) {
                    console.log(error);
                });
            };

            var getDropOffFlightsList = function (lat, lng, type, time) {
                AirLineTool.getFlightsList(lat, lng, type, time).then(function (result) {
                    if (result.code == '2100') {
                        $scope.haveDropAirline = false;
                    } else {
                        $scope.haveDropAirline = true;
                        $scope.dropFlightsList = result.data.result;
                    }
                }, function (error) {
                    console.log(error);
                });
            };
            $scope.getPickUpAirlineCompany = function (val) {
                if ($scope.haveAirline) {
                    return AirLineTool.matchingAirlineCompany(val, $scope.FlightsList);
                } else {
                    $scope.airLineMessage = val;
                    $scope.airLineCompanyFs = val;
                }
            };
            $scope.getDropOffAirlineCompany = function (val) {
                if ($scope.haveDropAirline) {
                    return AirLineTool.matchingAirlineCompany(val, $scope.dropFlightsList);
                } else {
                    $scope.reAirLineMessage = val;
                    $scope.reAirLineCompanyFs = val;
                }
            };

            $scope.onAirlineCompanySearchSelect = function ($item) {
                $scope.airlineCompanyMessage = $item;
                $scope.airLineCompanyFs = $item.fs;
                $scope.airLineMessage = $item.name;
            };

            $scope.onDropAirlineCompanySearchSelect = function ($item) {
                $scope.airDroplineCompanyMessage = $item;
                $scope.reAirLineCompanyFs = $item.fs;
                $scope.reAirLineMessage = $item.name;
            };

            $scope.getPickUpAirlineNumber = function (val) {
                if ($scope.haveAirline) {
                    return AirLineTool.matchingAirlineNumber(val, $scope.airlineCompanyMessage)
                } else {
                    $scope.airLineMessageNum = val;
                }
            };

            $scope.getDropOffAirlineNumber = function (val) {
                if ($scope.haveDropAirline) {
                    return AirLineTool.matchingAirlineNumber(val, $scope.airDroplineCompanyMessage)
                } else {
                    $scope.reAirLineMessageNum = val;
                }
            };

            $scope.onAirlineNumberSearchSelect = function ($item) {
                $scope.airLineMessageNum = $item.flightNumber;
            };

            $scope.onDropAirlineNumberSearchSelect = function ($item) {
                $scope.reAirLineMessageNum = $item.flightNumber;
            };

            $scope.getPickUpLocation = function (val) {
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
            $scope.getDropOffLocation = function (val) {
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


            $scope.onPickUpSearchSelect = function ($item, $model, $label, $event) {
                book.pickup = $item;
                // book.pickup.geometry.location = {
                //     lat: book.pickup.geometry.location.lat(),
                //     lng: book.pickup.geometry.location.lng()
                // };
                $scope.airPort = $item.isAirport;
                if($item.isAirport){
                    $scope.isAirport = true;
                    book.p2pDatetime = $('.bookApTime').data("DateTimePicker").date()._d;
                    var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                    getPickUpFlightsList(book.pickup.geometry.location.lat, book.pickup.geometry.location.lng, 0, p2pDatetime);
                }else {
                    $scope.isAirport = false;
                }
                $scope.bookPickUpAddress = $item.formatted_address;
                // MapTool.geocoderAddress(book.pickup.geometry.location.lat, book.pickup.geometry.location.lng, function (result) {
                //     $timeout(function () {
                //         $scope.airPort = result.isAirport;
                //         if (result.isAirport) {
                //             $scope.isAirport = true;
                //             var pickUpLocation = result.geometry.location;
                //             book.p2pDatetime = $('.bookApTime').data("DateTimePicker").date()._d;
                //             var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                //             getPickUpFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 0, p2pDatetime);
                //         } else {
                //             $scope.isAirport = false;
                //         }
                //         book.pickup = result;
                //         book.pickup.d_final_address = AddressTool.finalAddress(book.pickup);
                //         book.pickup.geometry.location = {
                //             lat: book.pickup.geometry.location.lat(),
                //             lng: book.pickup.geometry.location.lng()
                //         };
                //         $scope.bookPickUpAddress = result.formatted_address;
                //         $scope.PickUpAddress = result.formatted_address;
                //     }, 0);
                // }, function (error) {
                // });
            };

            $scope.onDropOffSearchSelect = function ($item, $model, $label, $event) {
                book.dropoff = $item;
                // book.dropoff.geometry.location = {
                //     lat: book.dropoff.geometry.location.lat(),
                //     lng: book.dropoff.geometry.location.lng()
                // };
                $scope.reAirPort = $item.isAirport;
                if($item.isAirport){
                    $scope.isDropAirport = true;
                     book.p2pDatetime = $('.bookApTime').data("DateTimePicker").date()._d;
                     var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                     getDropOffFlightsList(book.dropoff.geometry.location.lat, book.dropoff.geometry.location.lng, 1, p2pDatetime);
                }else {
                    $scope.isDropAirport = false;
                }
                $scope.bookDropOffAddress = $item.formatted_address;

                // MapTool.geocoderAddress(book.dropoff.geometry.location.lat, book.dropoff.geometry.location.lng, function (result) {
                //     $timeout(function () {
                //         $scope.reAirPort = result.isAirport;
                //         if (result.isAirport) {
                //             $scope.isDropAirport = true;
                //             var pickUpLocation = result.geometry.location;
                //             book.p2pDatetime = $('.bookApTime').data("DateTimePicker").date()._d;
                //             var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                //             getDropOffFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 1, p2pDatetime);
                //         } else {
                //             $scope.isDropAirport = false;
                //         }
                //         book.dropoff = result;
                //         book.dropoff.a_final_address =  AddressTool.finalAddress(book.dropoff);
                //         book.dropoff.geometry.location = {
                //             lat: book.dropoff.geometry.location.lat(),
                //             lng: book.dropoff.geometry.location.lng()
                //         };
                //         $scope.bookDropOffAddress = result.formatted_address;
                //         // $(".bookApTime").on('dp.change', function () {
                //         //     $timeout(function () {
                //         //         $scope.airPort = false;
                //         //         $scope.reAirPort = false;
                //         //         $scope.bookPickUpAddress = '';
                //         //         $scope.bookDropOffAddress = '';
                //         //         $scope.FlightsList = '';
                //         //         $scope.dropFlightsList = '';
                //         //         $scope.airlineCompanyMessage = '';
                //         //         $scope.airLineMessage = null;
                //         //         $scope.airLineCompanyFs = null;
                //         //         $scope.airLineMessageNum = null;
                //         //         $scope.reAirLineMessage = null;
                //         //         $scope.reAirLineCompanyFs = null;
                //         //         $scope.reAirLineMessageNum = null;
                //         //     }, 0);
                //         // });
                //     }, 0)
                // }, function (error) {
                // });
            };


            $(".bookApTime").on('dp.change', function () {
                $timeout(function () {
                    if ($scope.isAirport) {
                        $scope.airPort = true;
                        $scope.FlightsList = '';
                        $scope.airlineCompanyMessage = '';
                        $scope.airLineMessage = null;
                        $scope.airLineCompanyFs = null;
                        $scope.airLineMessageNum = null;
                        book.p2pDatetime =$('.bookApTime').data("DateTimePicker").date()._d;
                        var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                        getPickUpFlightsList(book.pickup.geometry.location.lat, book.pickup.geometry.location.lng, 0, p2pDatetime);
                    }
                    if ($scope.isDropAirport) {
                        $scope.reAirPort = true;
                        $scope.dropFlightsList = '';
                        $scope.airDroplineCompanyMessage = '';
                        $scope.reAirLineMessage = null;
                        $scope.reAirLineCompanyFs = null;
                        $scope.reAirLineMessageNum = null;
                        book.p2pDatetime = $('.bookApTime').data("DateTimePicker").date()._d;
                        var p2pDropDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                        getDropOffFlightsList(book.dropoff.geometry.location.lat, book.dropoff.geometry.location.lng, 1, p2pDropDatetime);
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
                },0);

                // $timeout(function () {
                //     $scope.airPort = false;
                //     $scope.reAirPort = false;
                //     $scope.bookPickUpAddress = '';
                //     $scope.bookDropOffAddress = '';
                //     $scope.FlightsList = '';
                //     $scope.dropFlightsList = '';
                //     $scope.airlineCompanyMessage = '';
                //     $scope.airLineMessage = null;
                //     $scope.airLineCompanyFs = null;
                //     $scope.airLineMessageNum = null;
                //     $scope.reAirLineMessage = null;
                //     $scope.reAirLineCompanyFs = null;
                //     $scope.reAirLineMessageNum = null;
                // }, 0);
            });

            $scope.selectLocationOnMap = function (type) {
                var locationData = 0;
                if (type == 1) {
                    if (book.pickup) {
                        locationData = angular.copy(book.pickup);
                    }
                } else if (type == 2) {
                    if (book.dropoff) {
                        locationData = angular.copy(book.dropoff);
                    }
                }
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/common/location-select.html',
                    controller: 'LocationSelectCtrl',
                    size: 'md',
                    resolve: {
                        data: function () {
                            return locationData;
                        },
                        event: {
                            okHandler: function (data) {
                                if (data != undefined) {
                                    if (type == 1) {
                                        book.pickup = angular.copy(data);
                                        // book.pickup.geometry.location = {
                                        //     lat: book.pickup.geometry.location.lat(),
                                        //     lng: book.pickup.geometry.location.lng()
                                        // };
                                        $scope.bookPickUpAddress = book.pickup.formatted_address;
                                        $scope.airPort = data.isAirport;
                                        if(data.isAirport){
                                            $scope.isAirport = true;
                                            book.p2pDatetime = $('.bookApTime').data("DateTimePicker").date()._d;
                                            var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                                            getPickUpFlightsList(book.pickup.geometry.location.lat(), book.pickup.geometry.location.lng(), 0, p2pDatetime);
                                        }else {
                                            $scope.isAirport = false;
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
                                        // MapTool.geocoderAddress(data.geometry.location.lat(), data.geometry.location.lng(), function (result) {
                                        //     console.log('geocoder data is',result)
                                        //     $timeout(function () {
                                        //         book.pickup = result;
                                        //         book.pickup.geometry.location = {
                                        //             lat: book.pickup.geometry.location.lat(),
                                        //             lng: book.pickup.geometry.location.lng()
                                        //         };
                                        //         $scope.bookPickUpAddress = result.formatted_address;
                                        //     }, 0);
                                        // }, function (error) {
                                        // });
                                    } else if (type == 2) {
                                        book.dropoff = angular.copy(data);
                                        // book.dropoff.geometry.location = {
                                        //     lat: book.dropoff.geometry.location.lat(),
                                        //     lng: book.dropoff.geometry.location.lng()
                                        // };
                                        $scope.bookDropOffAddress = book.dropoff.formatted_address;
                                        $scope.reAirPort = data.isAirport;
                                        if(data.isAirport){
                                            $scope.isDropAirport = true;
                                            book.p2pDatetime = $('.bookApTime').data("DateTimePicker").date()._d;
                                            var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                                            getDropOffFlightsList(book.dropoff.geometry.location.lat(), book.dropoff.geometry.location.lng(), 1, p2pDatetime);
                                        }else {
                                            $scope.isDropAirport = false;
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
                                        // MapTool.geocoderAddress(data.geometry.location.lat(), data.geometry.location.lng(), function (result) {
                                        //     $timeout(function () {
                                        //         book.dropoff = result;
                                        //         book.dropoff.geometry.location = {
                                        //             lat: book.dropoff.geometry.location.lat(),
                                        //             lng: book.dropoff.geometry.location.lng()
                                        //         };
                                        //         $scope.bookDropOffAddress = result.formatted_address
                                        //     }, 0)
                                        // }, function (error) {
                                        // });
                                    } else {
                                        book.hourlyPickup = angular.copy(data);
                                        book.hourlyPickup.geometry.location = {
                                            lat: book.hourlyPickup.geometry.location.lat(),
                                            lng: book.hourlyPickup.geometry.location.lng()
                                        };
                                        MapTool.geocoderAddress(data.geometry.location.lat(), data.geometry.location.lng(), function (result) {
                                            $timeout(function () {
                                                book.hourlyPickup = result;
                                                book.hourlyPickup.geometry.location = {
                                                    lat: book.hourlyPickup.geometry.location.lat(),
                                                    lng: book.hourlyPickup.geometry.location.lng()
                                                };
                                                if (book.type == 2) {
                                                    $scope.bookHourlyAddress = result.formatted_address;
                                                } else {
                                                    $scope.bookCustomAddress = result.formatted_address;
                                                }
                                            }, 0);
                                        }, function (error) {
                                        });
                                    }
                                }
                                modalInstance.dismiss();
                            }
                        }
                    }
                });
            };

            var finishGetOffer = function (result) {
                $scope.getOfferError = 0;
                $scope.getSameOfferError = 0;
                getOfferErrorMessage.d_lat = undefined;
                getOfferErrorMessage.d_lng = undefined;
                getOfferErrorMessage.a_lat = undefined;
                getOfferErrorMessage.a_lng = undefined;
                getOfferErrorMessage.appointedTime = undefined;
                book.d_air = $scope.airLineMessage;
                book.d_flight = $scope.airLineMessageNum;
                book.d_airFs = $scope.airLineCompanyFs;
                book.a_air = $scope.reAirLineMessage;
                book.a_flight = $scope.reAirLineMessageNum;
                book.a_airFs = $scope.reAirLineCompanyFs;
                book.d_is_airport= $scope.airPort ? 1 : 0;
                book.a_is_airport= $scope.reAirPort ? 1 : 0;
                book.type=$scope.bookType;
                if($scope.bookType==1){
                    book.appointed_time= (new Date(book.p2pDatetime).valueOf() + "").substr(0, 13);
                    book.estimate_duration=book.estimate_data.duration.value / 60
                }else {
                    book.appointed_time= (new Date(book.hourlyDatetime).valueOf() + "").substr(0, 13);
                    book.estimate_duration= $scope.hourlyDate * 60
                }

                if (result.data.code == '2100' || result.data.code == '3001') {
                    MessageBox.toast($filter('translate')('flow_step1.jsNo_Matched_Offer'), "info");
                } else if (typeof result.data == "string" || result.data.length < 1) {
                    MessageBox.toast($filter('translate')('flow_step1.jsNo_Matched_Offer'), "info");
                } else {
                    // gotoFlow(result.data.result);
                    $state.go('flow',
                        {
                            data: {
                                params: book,
                                offerData:result.data
                                // company_infor: $scope.allData.company_infor,
                                // login_user: $scope.allData.loginUser,
                                // cards: $scope.allData.cards
                            }
                        }
                    );
                }
            };

            var errorGetOffer = function (error) {
                $scope.getOfferError += 1;
                getOfferError();
                if (error.treated) {
                } else {
                    if (error.response.data.code == "3808") {
                        MessageBox.toast($filter('translate')('flow_step1.jsNo_Offers_found'), 'error');
                    } else if (error.response.data.code == "3809") {
                        MessageBox.toast($filter('translate')('flow_step1.jsNo_available_vehicles_found'), 'error');
                    } else if (error.response.data.code == "3810") {
                        MessageBox.toast($filter('translate')('flow_step1.jsNo_available_drivers_found'), 'error');
                    } else {
                        MessageBox.toast($filter('translate')('flow_step1.jsNo_Offers_found'), "error");
                    }

                }
            };

            var goToFlow = function (result) {

            };


            var getMapMatrixDistance = function (originLat, originlng, destinationLat, destinationLng, sucessHandle, faultHandle) {
                console.log($scope.companyInfor)
                var origins = [{lat: originLat, lng: originlng}];
                var destinations = [{lat: destinationLat, lng: destinationLng}];
                var travelMode = "DRIVING";
                var distanceMatrixService = new google.maps.DistanceMatrixService;
                distanceMatrixService.getDistanceMatrix({
                    origins: origins,
                    destinations: destinations,
                    travelMode: google.maps.TravelMode[travelMode],
                    // unitSystem: google.maps.UnitSystem.IMPERIAL
                    unitSystem: $scope.companyInfor.distance_unit==1?google.maps.UnitSystem.IMPERIAL:google.maps.UnitSystem.METRIC
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

            var getOffersByRemote = function ($event) {
                var hourlyLadda = Ladda.create($event.target);
                hourlyLadda.start();
                book.p2pDatetime = $('.bookApTime').data("DateTimePicker").date()._d;
                console.log(book.pickup)
                console.log(book.pickup.geometry.location.lat)
                console.log(book.dropoff)
                FlowBS.getOffer(
                    companyId,
                    $scope.bookType,
                    book.pickup.geometry.location.lat(),
                    book.pickup.geometry.location.lng(),
                    book.dropoff.geometry.location.lat(),
                    book.dropoff.geometry.location.lng(),
                    book.estimate.distance / 1000,
                    book.estimate.duration / 60,
                    book.p2pDatetime,
                    $scope.airPort ? 1 : 0,
                    $scope.reAirPort ? 1 : 0,
                    2
                ).then(function (result) {
                    hourlyLadda.stop();
                    finishGetOffer(result);
                }, function (error) {
                    hourlyLadda.stop();
                    errorGetOffer(error);
                });
            };

            var onCheckP2pOffers = function ($event) {
                if (!$scope.bookPickUpAddress) {
                    MessageBox.toast($filter('translate')('flow_step1.jsInput_pickup_address'), "error");
                    return;
                }
                if (!book.pickup) {
                    MessageBox.toast($filter('translate')('flow_step1.jsValid_pickup_address'), "error");
                    return;
                }
                if (!$scope.bookDropOffAddress) {
                    MessageBox.toast($filter('translate')('flow_step1.jsInput_dropoff_address'), "error");
                    return;
                }
                if (!book.dropoff) {
                    MessageBox.toast($filter('translate')('flow_step1.jsValid_dropoff_address'), "error");
                    return;
                }

                var directionsService = new google.maps.DirectionsService;
                MapTool.calculateAndDisplayRoute(
                    directionsService,
                    {placeId: book.pickup.place_id},
                    {placeId: book.dropoff.place_id},
                    (new Date(book.p2pDatetime).valueOf() + "").substr(0, 10),
                    function (response, status) {
                        if(status === google.maps.DirectionsStatus.OK){
                            book.estimate_data = response.routes[0].legs[0];
                            book.estimate = {
                                  "distance": response.routes[0].legs[0].distance.value,
                                  "duration": response.routes[0].legs[0].duration.value
                              };
                            getOffersByRemote($event);
                        }
                    }
                );

                // getMapMatrixDistance(book.pickup.geometry.location.lat, book.pickup.geometry.location.lng, book.dropoff.geometry.location.lat, book.dropoff.geometry.location.lng, function (response) {
                //     if (response.rows[0].elements[0].status == "ZERO_RESULTS") {
                //         MessageBox.toast($filter('translate')('flow_step1.jsDon_not_have_offers'), 'error');
                //         return;
                //     }
                //         book.estimate_data = response.rows[0].elements[0];
                //         book.estimate = {
                //             "distance": $scope.companyInfor.distance_unit==1?response.rows[0].elements[0].distance.value * 0.62:response.rows[0].elements[0].distance.value,
                //             "duration": response.rows[0].elements[0].duration.value
                //         };
                //         $scope.matrixDistance = response.rows[0].elements[0];
                //         getOffersByRemote($event);
                // }, function (error) {
                //     MessageBox.toast($filter('translate')('flow_step1.jsNo_route'), 'error');
                // });
            };

            var onCheckHourlyOffers = function ($event) {
                if (!$scope.bookPickUpAddress) {
                    MessageBox.toast($filter('translate')('flow_step1.jsInput_pickup_address'), "error");
                    return;
                }
                if (!book.pickup) {
                    MessageBox.toast($filter('translate')('flow_step1.jsValid_pickup_address'), "error");
                    return;
                }

                if (!$scope.hourlyDate) {
                    MessageBox.toast($filter('translate')('flow_step1.jsInput_hours'), "error");
                    return;
                }

                var hourlyLadda = Ladda.create($event.target);
                hourlyLadda.start();
                book.hourlyDatetime = $('.bookApTime').data("DateTimePicker").date()._d;
                FlowBS.getOffer(
                    companyId,
                    $scope.bookType,
                    book.pickup.geometry.location.lat(),
                    book.pickup.geometry.location.lng(),
                    0,
                    0,
                    0,
                    $scope.hourlyDate * 60,
                    book.hourlyDatetime,
                    $scope.airPort ? 1 : 0,
                    0,
                    2
                ).then(function (result) {
                    hourlyLadda.stop();
                    finishGetOffer(result);
                }, function (error) {
                    hourlyLadda.stop();
                    errorGetOffer(error);
                });
            };

            $scope.onCheckOffer = function ($event) {
                if ($scope.bookType == 1) {
                    onCheckP2pOffers($event);
                }
                if ($scope.bookType == 2) {
                    onCheckHourlyOffers($event);
                }
            };
        }


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
                    getOfferErrorMessage.appointedTime = (new Date($('.bookApTime').data("DateTimePicker").date()._d).valueOf() + "").substr(0, 13);
                    $scope.getSameOfferError += 1;
                } else if (
                    getOfferErrorMessage.d_lat == book.pickup.geometry.location.lat
                    && getOfferErrorMessage.d_lng == book.pickup.geometry.location.lng
                    && getOfferErrorMessage.a_lat == book.dropoff.geometry.location.lat
                    && getOfferErrorMessage.a_lng == book.dropoff.geometry.location.lng
                    && getOfferErrorMessage.appointedTime == (new Date($('.bookApTime').data("DateTimePicker").date()._d).valueOf() + "").substr(0, 13)
                ) {
                    $scope.getSameOfferError += 1;
                } else {
                    getOfferErrorMessage.d_lat = book.pickup.geometry.location.lat;
                    getOfferErrorMessage.d_lng = book.pickup.geometry.location.lng;
                    getOfferErrorMessage.a_lat = book.dropoff.geometry.location.lat;
                    getOfferErrorMessage.a_lng = book.dropoff.geometry.location.lng;
                    getOfferErrorMessage.appointedTime = (new Date($('.bookApTime').data("DateTimePicker").date()._d).valueOf() + "").substr(0, 13);
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
                    getOfferErrorMessage.appointedTime = (new Date($('.bookApTime').data("DateTimePicker").date()._d).valueOf() + "").substr(0, 13);
                    $scope.getSameOfferError += 1;
                } else if (
                    getOfferErrorMessage.d_lat == book.pickup.geometry.location.lat
                    && getOfferErrorMessage.d_lng == book.pickup.geometry.location.lng
                    && getOfferErrorMessage.appointedTime == (new Date($('.bookApTime').data("DateTimePicker").date()._d).valueOf() + "").substr(0, 13)
                ) {
                    $scope.getSameOfferError += 1;
                } else {
                    getOfferErrorMessage.d_lat = book.pickup.geometry.location.lat;
                    getOfferErrorMessage.d_lng = book.pickup.geometry.location.lng;
                    getOfferErrorMessage.appointedTime = (new Date($('.bookApTime').data("DateTimePicker").date()._d).valueOf() + "").substr(0, 13);
                    $scope.getSameOfferError = 1
                }
            }
            if($scope.getOfferError>=3){
                MessageBox.alertView($filter('translate')('flow_step1.jsWarning'),$filter('translate')('flow_step1.jsNot_find_booking',{companyName:$scope.companyInfor.name,companyEmail:$scope.companyInfor.email,companyPhone:$scope.companyInfor.phone1?$scope.companyInfor.phone1:$scope.companyInfor.phone2}),function () {

                })
            }
        }

    })
;
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('Flow.Controllers')
    .controller('FlowCtrl', function ($scope, $rootScope, $state, $stateParams, $http, $uibModal, $log, MessageBox, $timeout, FlowBS, MapTool, AddressTool,$filter) {
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

        //限制notes字数为999
        $("#easybook-notes-textarea").on("input propertychange", function () {
            var $this = $(this),
                _val = $this.val();
            if (_val.length > 999) {
                $this.val(_val.substring(0, 999));
            }
        });

        $scope.bookType = undefined;
        $scope.pickupTime = undefined;
        $scope.optionsPrice = 0;
        $scope.rsOptionsPrice = 0;
        $scope.amountOff = 0;
        $scope.percentOff = 0;
        $scope.showCoupon = false;

        $scope.langStyle=localStorage.getItem('lang');
        if($scope.langStyle==='fr'){
            $scope.iosAppImgLink='img/dashboard/iox-FR.png';
            $scope.androidAppImgLink='img/dashboard/google-FR.png'
        }else {
            $scope.iosAppImgLink='img/dashboard/download-on-the-app-store.png';
            $scope.androidAppImgLink='img/dashboard/google-play.png'
        }
        console.log($scope.langStyle);
        var cards;
        var loginUser;
        var company_id;
        var d_lat;
        var d_lng;
        var d_id;
        var a_lat;
        var a_lng;
        var a_id;
        var estimate_distance;
        var estimate_duration;
        var dair;
        var dflight;
        var dAirFs;
        var aair;
        var aflight;
        var aAirFs;
        var d_is_airport;
        var a_is_airport;
        if ($stateParams.data.params && !$stateParams.data.company_infor) {
            company_id = GetQueryString(location.href, "company_id");
            if (!company_id) {
                angular.element($("#stepTwo")).addClass("hidden");
                angular.element($("#stepThree")).addClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleTwo")).removeClass("active");
                angular.element($("#titleThree")).removeClass("active");
                return;
            }
            console.log($stateParams)
            $scope.bookType = $stateParams.data.params.type;
            $scope.pickupTime = new Date(parseInt($stateParams.data.params.appointed_time));
            $scope.pickupLocation = $stateParams.data.params.pickup;
            $scope.dropoffLocation = $stateParams.data.params.dropoff;
            $scope.estimate_time_show = $stateParams.data.params.estimate_duration;
            $scope.estimate_data = $stateParams.data.params.estimate_data;
            $scope.offers = $stateParams.data.offerData;
            $scope.dair = $stateParams.data.params.d_air;
            $scope.dflight = $stateParams.data.params.d_flight;
            dAirFs = $stateParams.data.params.d_airFs;
            d_is_airport = $stateParams.data.params.d_is_airport;
            $scope.aair = $stateParams.data.params.a_air;
            $scope.aflight = $stateParams.data.params.a_flight;
            aAirFs = $stateParams.data.params.a_flight;
            a_is_airport = $stateParams.data.params.a_is_airport;
            estimate_duration = $stateParams.data.params.estimate_duration;
            //存储widget父窗口的链接
            // localStorage.setItem('a4c_iframe_widget_parent_link', GetQueryString(location.href, "parentLink"));
            // $scope.companyInfor = {id: company_id, name: '', phone1: '', phone2: '', email: ''};
            //
            //公司信息
            // FlowBS.getCompanyInfor(company_id).then(function (result) {
            //     $scope.companyInfor = result.data;
            // }, function (error) {
            // });

        } else if ($stateParams.data && $stateParams.data.company_infor) {
            company_id = $stateParams.data.company_infor.id;
            if (!company_id) {
                angular.element($("#stepTwo")).addClass("hidden");
                angular.element($("#stepThree")).addClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleTwo")).removeClass("active");
                angular.element($("#titleThree")).removeClass("active");
                return;
            }
            $scope.bookType = $stateParams.data.params.bookType;
            $scope.pickupTime = new Date(parseInt($stateParams.data.params.appointed_time));
            cards = $stateParams.data.cards;
            loginUser = $stateParams.data.login_user;
            d_lat = $stateParams.data.params.pickupLocation.geometry.location.lat();
            d_lng = $stateParams.data.params.pickupLocation.geometry.location.lng();
            d_id = $stateParams.data.params.pickupLocation.place_id;
            $scope.dair = $stateParams.data.params.dair;
            $scope.dflight = $stateParams.data.params.dflight;
            d_is_airport = $stateParams.data.params.d_is_airport;
            if ($scope.bookType == 1) {
                //p2p
                a_lat = $stateParams.data.params.dropoffLocation.geometry.location.lat();
                a_lng = $stateParams.data.params.dropoffLocation.geometry.location.lng();
                a_id = $stateParams.data.params.dropoffLocation.place_id;
                $scope.aair = $stateParams.data.params.aair;
                $scope.aflight = $stateParams.data.params.aflight;
                estimate_distance = $stateParams.data.params.estimate_data.distance.value * 0.62 / 1000;
                estimate_duration = $stateParams.data.params.estimate_data.duration.value / 60;
                a_is_airport = $stateParams.data.params.a_is_airport;
            } else {
                //hourly
                estimate_duration = $stateParams.data.params.hours * 60;
                a_is_airport = 0;
            }

            //公司信息
            $scope.companyInfor = $stateParams.data.company_infor;
        } else {

            company_id = GetQueryString(location.href, "company_id");
            if (!company_id) {
                angular.element($("#stepTwo")).addClass("hidden");
                angular.element($("#stepThree")).addClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleTwo")).removeClass("active");
                angular.element($("#titleThree")).removeClass("active");
                return;
            }
            $scope.bookType = GetQueryString(location.href, "type");
            $scope.pickupTime = new Date(parseInt(GetQueryString(location.href, "appointed_time")));
            d_lat = GetQueryString(location.href, "d_lat");
            d_lng = GetQueryString(location.href, "d_lng");
            d_id = GetQueryString(location.href, "d_id");

            a_lat = GetQueryString(location.href, "a_lat");
            a_lng = GetQueryString(location.href, "a_lng");
            a_id = GetQueryString(location.href, "a_id");

            estimate_distance = GetQueryString(location.href, "estimate_distance");
            estimate_duration = GetQueryString(location.href, "estimate_duration");
            $scope.dair = GetQueryString(location.href, "d_air");
            $scope.dflight = GetQueryString(location.href, "d_flight");
            dAirFs = GetQueryString(location.href, "d_airFs");
            $scope.aair = GetQueryString(location.href, "a_air");
            $scope.aflight = GetQueryString(location.href, "a_flight");
            aAirFs = GetQueryString(location.href, "a_airFs");
            d_is_airport = GetQueryString(location.href, "d_is_airport");
            a_is_airport = GetQueryString(location.href, "a_is_airport");
            //存储widget父窗口的链接
            localStorage.setItem('a4c_iframe_widget_parent_link', GetQueryString(location.href, "parentLink"));

            $scope.companyInfor = {id: company_id, name: '', phone1: '', phone2: '', email: ''};

            //公司信息
            // FlowBS.getCompanyInfor(company_id).then(function (result) {
            //     $scope.companyInfor = result.data;
            // }, function (error) {
            // });
        }

        $rootScope.company_id = company_id;
        //公司LOGO
        $scope.companyImg = ApiServer.serverUrl + ApiServer.version + '/companies/logo/' + company_id;
        //公司APP
        $scope.getCompanyIosApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/ios';
        $scope.getCompanyGoogleApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/android';

        $scope.step = 2;

        $scope.maxBags = $scope.rsMaxBags = ['N/A'];
        $scope.selectedMaxBags = $scope.rsSelectedMaxBags = 'N/A';
        $scope.maxPassengers = $scope.rsMaxPassengers = ['N/A'];
        $scope.selectedMaxPassengers = $scope.rsSelectedMaxPassengers = 'N/A';
        $scope.passengers = $scope.rsPassengers = [];

        $scope.mouseoverover = function (cate) {
            if (!cate.isSelect) {
                cate.showSelect = true
            }
        };
        $scope.mouseleaveleave = function (cate) {
            if (cate.showSelect) {
                cate.showSelect = false
            }
        };

        $scope.onChangePassengerCount = function (isReturn) {
            if (isReturn) {
                $scope.rsPassengers = [];
                var count = 0;
                if ($scope.rsSelectedMaxPassengers == $scope.rsMaxPassengers[0]) {
                    count = 0;
                } else {
                    if ($scope.rsMaxPassengers.length > 6) {
                        if ($scope.rsSelectedMaxPassengers < $scope.rsMaxPassengers[6]) {
                            count = $scope.rsSelectedMaxPassengers;
                        } else {
                            count = 6;
                        }
                    } else {
                        count = $scope.rsSelectedMaxPassengers;
                    }
                }
                for (var i = 0; i < count; i++) {
                    $scope.rsPassengers.push({name: ''});
                }
            } else {
                $scope.passengers = [];
                var count = 0;
                if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                    count = 0;
                } else {
                    if ($scope.maxPassengers.length > 6) {
                        if ($scope.selectedMaxPassengers < $scope.maxPassengers[6]) {
                            count = $scope.selectedMaxPassengers;
                        } else {
                            count = 6;
                        }
                    } else {
                        count = $scope.selectedMaxPassengers;
                    }
                }
                for (var i = 0; i < count; i++) {
                    $scope.passengers.push({name: ''});
                }
            }
        };

        $scope.initBagCountAndPassengerCount = function (selectCar, isReturn) {
            if (isReturn) {
                $scope.rsMaxBags = ['N/A'];
                for (var i = 1; i < selectCar.bags_max + 1; i++) {
                    $scope.rsMaxBags.push(i);
                }
                $scope.rsSelectedMaxBags = 'N/A';

                $scope.rsMaxPassengers = ['N/A'];
                for (var i = 1; i < selectCar.seats_max + 1; i++) {
                    $scope.rsMaxPassengers.push(i);
                }
                $scope.rsSelectedMaxPassengers = 'N/A';

                $scope.rsPassengers = [];
            } else {
                $scope.maxBags = ['N/A'];
                for (var i = 1; i < selectCar.bags_max + 1; i++) {
                    $scope.maxBags.push(i);
                }
                $scope.selectedMaxBags = 'N/A';

                $scope.maxPassengers = ['N/A'];
                for (var i = 1; i < selectCar.seats_max + 1; i++) {
                    $scope.maxPassengers.push(i);
                }
                $scope.selectedMaxPassengers = 'N/A';

                $scope.passengers = [];
            }
        };

        var getMapMatrixDistance = function (originLat, originlng, destinationLat, destinationLng, sucessHandle, faultHandle) {
           console.log($scope.companyInfor);
            var origins = [{lat: originLat, lng: originlng}];
            var destinations = [{lat: destinationLat, lng: destinationLng}];
            var travelMode = "DRIVING";
            var distanceMatrixService = new google.maps.DistanceMatrixService;
            distanceMatrixService.getDistanceMatrix({
                origins: origins,
                destinations: destinations,
                travelMode: google.maps.TravelMode[travelMode],
                unitSystem: $scope.companyInfor.distance_unit==1?google.maps.UnitSystem.IMPERIAL:google.maps.UnitSystem.METRIC
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

        var initOptions = function (options) {
            var formatOptions = {number: [], checkBox: [], radioGroup: [], checkBoxGroup: [], numberGroup: []};
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option.type == "NUMBER") {
                    option.count = 0;
                    if (option.add_max > 1) {
                        formatOptions.number.push(option);
                    } else {
                        formatOptions.checkBox.push(option);
                    }
                } else if (option.type == "CHECKBOX") {
                    option.count = 0;
                    formatOptions.checkBox.push(option);
                } else if (option.type == "GROUP") {
                    if (option.group == undefined || option.group.length == 0) {
                        continue;
                    }
                    for (var j = 0; j < option.group.length; j++) {
                        option.group[j].count = 0;
                    }
                    if (option.group[0].type == "NUMBER") {
                        formatOptions.numberGroup.push(option);
                    } else if (option.group[0].type == "RADIO") {
                        option.group.selectId = -1;
                        option.group.price = 0;
                        option.group.msg = "-";
                        formatOptions.radioGroup.push(option);
                    } else if (option.group[0].type == "CHECKBOX") {
                        formatOptions.checkBoxGroup.push(option);
                    }
                }
            }
            return formatOptions;
        };

        var initCarList = function (data) {
            var cars = [];
            //循环遍历offer
            for (var i = 0; i < data.length; i++) {
                //循环遍历offer 中的car_categories
                for (var k = 0; k < data[i].car_categories.length; k++) {
                    for (var j = 0; j < data[i].car_categories[k].cars.length; j++) {
                        data[i].car_categories[k].cars[j].isSelect = false;
                        var option = initOptions(data[i].options);
                        data[i].car_categories[k].cars[j].options = jQuery.extend(true, {}, option);
                        data[i].car_categories[k].cars[j].offer = data[i];

                        cars.push(data[i].car_categories[k].cars[j]);
                    }
                }
            }
            return cars;
        };

        var initVehicles = function (data) {
            $scope.cars = initCarList(data);
            // console.log($scope.cars);
            // for(var i=0;i<$scope.cars.length;i++){
            //     $scope.cars[i].showSelect=false
            // }
            $scope.selectedCar = 0;
            $scope.initBagCountAndPassengerCount($scope.cars[$scope.selectedCar], false);
            $scope.cars[0].isSelect = true;
            $scope.initRideOptions();
        };

        var initRsVehicles = function (data) {
            $scope.rscategories = initCarList(data);
            //优先匹配去程车辆
            //再匹配去程车系
            //再匹配去程车make
            //以上3者匹配不上,则匹配第1辆车
            var carIndex = 0;
            var findCar = false;
            var findModel = false;
            var findBrand = false;
            for (var i = 0; i < $scope.rscategories.length; i++) {
                var car = $scope.rscategories[i];
                if (car.car_id == $scope.cars[$scope.selectedCar].car_id) {
                    findCar = true;
                    carIndex = i;
                    break;
                }
                if (car.model == $scope.cars[$scope.selectedCar].model) {
                    if (findModel) {
                        continue;
                    } else {
                        findModel = true;
                        carIndex = i;
                    }
                }
                if (car.brand == $scope.cars[$scope.selectedCar].brand) {
                    if (findBrand) {
                        continue;
                    } else {
                        findBrand = true;
                        carIndex = i;
                    }
                }
                if (findCar) {
                    break;
                }
            }

            $scope.rscars = $scope.rscategories;
            $scope.rsselectedCar = carIndex;
            if (findCar) {
                $scope.rsMaxBags = $scope.maxBags;
                $scope.rsSelectedMaxBags = $scope.selectedMaxBags;
                $scope.rsMaxPassengers = $scope.maxPassengers;
                $scope.rsSelectedMaxPassengers = $scope.selectedMaxPassengers;
                $scope.rsPassengers = $scope.passengers;
            } else {
                $scope.initBagCountAndPassengerCount($scope.rscars[$scope.rsselectedCar], true);
            }
            $scope.rscars[$scope.rsselectedCar].isSelect = true;
            $scope.initRsRideOptions();

            if (document.body.clientWidth <= 768 && document.body.clientWidth > 414) {

                if ($scope.rscars.length > 2) {
                    $scope.reCarsPoint = true
                } else {
                    $scope.reCarsPoint = false
                }
            } else if (document.body.clientWidth > 768) {

                if ($scope.rscars.length > 3) {
                    $scope.reCarsPoint = true
                } else {
                    $scope.reCarsPoint = false
                }
            }

        };

        var rsDair;
        var rsDflight;
        var rsDairFs;
        var rsAair;
        var rsAflight;
        var rsAairFs;
        var rs_d_is_airport;
        var rs_a_is_airport;
        var initReturnService = function () {
            rsDair = $scope.aair;
            rsDflight = $scope.aflight;
            rsDairFs = aAirFs;
            rsAair = $scope.dair;
            rsAflight = $scope.dflight;
            rsAairFs = dAirFs;
            rs_d_is_airport = a_is_airport;
            rs_a_is_airport = d_is_airport;
            var time = new Date(Date.parse($scope.pickupTime) + 3 * 60 * 60 * 1000);
            $scope.rspickupTime = new Date(time);
        };

        $scope.goGetCar = function (index, cate) {
            cate.showSelect = false;
            if ($scope.selectedCar == index) {
                return;
            }
            for (var i = 0; i < $scope.cars.length; i++) {
                if (index === i) {
                    $scope.cars[i].isSelect = true;
                    $scope.selectedCar = index;
                    $scope.showCoupon = $scope.cars[i].company_id == company_id;
                } else {
                    $scope.cars[i].isSelect = false
                }
            }
            $scope.initBagCountAndPassengerCount($scope.cars[$scope.selectedCar], false);
            $scope.initRideOptions();
        };

        $scope.goGetReCar = function (index, cate) {
            cate.showSelect = false;
            if ($scope.rsselectedCar == index) {
                return;
            }
            for (var i = 0; i < $scope.rscars.length; i++) {
                if (index === i) {
                    $scope.rscars[i].isSelect = true;
                    $scope.rsselectedCar = index;
                } else {
                    $scope.rscars[i].isSelect = false
                }
            }
            $scope.initBagCountAndPassengerCount($scope.rscars[$scope.rsselectedCar], true);
            $scope.initRsRideOptions()
        };

        $scope.initRideOptions = function () {
            var car = $scope.cars[$scope.selectedCar];
            $scope.options = car.options;
            $scope.offer = car.offer;
            $scope.calcPrice();
            if ($scope.offer.company_id == $rootScope.company_id) {
                $scope.showCoupon = true;
            }
            console.log($scope.showCoupon);
        };

        $scope.initRsRideOptions = function () {
            var car = $scope.rscars[$scope.rsselectedCar];
            $scope.rsoptions = car.options;
            $scope.rsoffer = car.offer;
            console.log($scope.rsoffer);
            $scope.rscalcPrice();
        };

        // var onPickUpSearchSelect = function (lat, lng) {
        //     MapTool.geocoderAddress(lat, lng, function (result) {
        //         $timeout(function () {
        //             $scope.pickupLocation = result;
        //             $scope.pickupLocation.d_final_address = AddressTool.finalAddress($scope.pickupLocation);
        //         }, 0);
        //     }, function (error) {
        //     });
        // };
        //
        // var onDropOffSearchSelect = function (lat, lng) {
        //     MapTool.geocoderAddress(lat, lng, function (result) {
        //         $timeout(function () {
        //             $scope.dropoffLocation = result;
        //             $scope.dropoffLocation.a_final_address = AddressTool.finalAddress($scope.dropoffLocation);
        //         }, 0);
        //     }, function (error) {
        //     });
        // };


        var onPickUpSearchSelect = function (placeId) {
            var placeService = new google.maps.places.PlacesService(document.createElement('div'));
            placeService.getDetails({
                placeId: placeId
            }, function (result, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(result);
                    $timeout(function () {
                        $scope.pickupLocation = result;
                        $scope.pickupLocation.d_final_address = AddressTool.finalAddress($scope.pickupLocation);
                    }, 0);
                }
            });
        };

        var onDropOffSearchSelect = function (placeId) {
            var placeService = new google.maps.places.PlacesService(document.createElement('div'));
            placeService.getDetails({
                placeId: placeId
            }, function (result, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(result);
                    $timeout(function () {
                        $scope.dropoffLocation = result;
                        $scope.dropoffLocation.a_final_address = AddressTool.finalAddress($scope.dropoffLocation);
                    }, 0);
                }
            });
        };

        $scope.init = function () {
            localStorage.setItem('distanceunit',$scope.companyInfor.distance_unit);
            if ($stateParams.data.params && !$stateParams.data.company_infor) {
                initVehicles($scope.offers);
                onPickUpSearchSelect($scope.pickupLocation.place_id);
                if ($scope.bookType == 1) {
                    initReturnService();
                    onDropOffSearchSelect($scope.dropoffLocation.place_id);
                }
            } else {
                if ($scope.bookType == 1) {
                    onPickUpSearchSelect(d_id);
                    onDropOffSearchSelect(a_id);

                    var directionsService = new google.maps.DirectionsService;
                    MapTool.calculateAndDisplayRoute(
                        directionsService,
                        {placeId: d_id},
                        {placeId: a_id},
                        (new Date($scope.pickupTime).valueOf() + "").substr(0, 10),
                        function (response, status) {
                            console.log("response is ", response);
                            if (status === google.maps.DirectionsStatus.OK) {
                                    $scope.estimate_data = response.routes[0].legs[0];
                                    $scope.estimate_time_show = estimate_duration;

                                MessageBox.showLoading();
                                FlowBS.getOffer(company_id,
                                    $scope.bookType,
                                    d_lat,
                                    d_lng,
                                    a_lat,
                                    a_lng,
                                    estimate_distance,
                                    estimate_duration,
                                    $scope.pickupTime,
                                    d_is_airport,
                                    a_is_airport,
                                    2
                                ).then(function (result) {
                                    $scope.offers = result.data;
                                    initVehicles($scope.offers);
                                    initReturnService();
                                    MessageBox.hideLoading();
                                }, function (error) {
                                    MessageBox.hideLoading();
                                    if (error.treated) {
                                    } else {
                                        if (error.response.data.code == "3808") {
                                            MessageBox.toast($filter('translate')('flow.jsNo_offers'), 'error');
                                        } else if (error.response.data.code == "3809") {
                                            MessageBox.toast($filter('translate')('flow.jsNo_vehicles'), 'error');
                                        } else if (error.response.data.code == "3810") {
                                            MessageBox.toast($filter('translate')('flow.jsNo_drivers'), 'error');
                                        } else {
                                            MessageBox.toast($filter('translate')('flow.jsNo_offers'), 'error');
                                        }
                                    }
                                });

                            }
                        }
                    );
                } else if ($scope.bookType == 2) {
                    onPickUpSearchSelect(d_id);
                    $scope.estimate_time_show = estimate_duration;
                    MessageBox.showLoading();
                    FlowBS.getOffer(
                        company_id,
                        $scope.bookType,
                        d_lat,
                        d_lng,
                        a_lat,
                        a_lng,
                        estimate_distance,
                        estimate_duration,
                        $scope.pickupTime,
                        d_is_airport,
                        0,
                        2
                    ).then(function (result) {
                        $scope.offers = result.data;
                        initVehicles($scope.offers);
                        MessageBox.hideLoading();
                    }, function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                        } else {
                            if (error.response.data.code == "3808") {
                                MessageBox.toast($filter('translate')('flow.jsNo_offers'), 'error');
                            } else if (error.response.data.code == "3809") {
                                MessageBox.toast($filter('translate')('flow.jsNo_vehicles'), 'error');
                            } else if (error.response.data.code == "3810") {
                                MessageBox.toast($filter('translate')('flow.jsNo_drivers'), 'error');
                            } else {
                                MessageBox.toast($filter('translate')('flow.jsNo_offers'), 'error');
                            }
                        }
                    });
                }
            }

            //初始化开关控件
            $scope.showReturnService = false;
            $timeout(function () {
                $("[name='rsSwitch']").bootstrapSwitch();
                $("[name='rsSwitch']").on('switchChange.bootstrapSwitch', function (event, state) {
                    $timeout(function () {
                        if (state) {
                            $scope.editDatetime(2);
                        } else {
                            $scope.showReturnService = false;
                        }
                    }, 0);
                });
            }, 20);
        };

        $scope.setViewState = function () {
            if ($scope.step == 2) {
                angular.element($("#stepTwo")).removeClass("hidden");
                angular.element($("#stepThree")).addClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleOne a")).addClass("iframe-nav1");
                angular.element($("#titleTwo")).addClass("active");
                angular.element($("#titleTwo a")).addClass("iframe-nav2");
                angular.element($("#titleThree")).removeClass("active");
                angular.element($("#titleThree a")).addClass("iframe-nav1");
            } else if ($scope.step == 3) {
                angular.element($("#stepTwo")).addClass("hidden");
                angular.element($("#stepThree")).removeClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleOne a")).addClass("iframe-nav1");
                angular.element($("#titleTwo")).removeClass("active");
                angular.element($("#titleTwo a")).removeClass("iframe-nav2");
                angular.element($("#titleTwo a")).addClass("iframe-nav1");
                angular.element($("#titleThree")).addClass("active");
                angular.element($("#titleThree a")).removeClass("iframe-nav1");
                angular.element($("#titleThree a")).addClass("iframe-nav2");
            } else {
            }
        };

        $scope.calcPrice = function () {
            if ($scope.options.length == 0) {
                $scope.totalPrice = $scope.offer.basic_cost * (1 + $scope.offer.tva / 100);
                if ($scope.totalPrice > 0 && $scope.totalPrice < 1) {
                    $scope.totalPrice = 1.00;
                }
                return;
            }
            $scope.options.selectOption = [];
            // 解析checkBox价格
            var checkBoxPrice = 0;
            for (var i = 0; i < $scope.options.checkBox.length; i++) {
                var optionItem = $scope.options.checkBox[i];
                if (optionItem.count == 1) {
                    checkBoxPrice = checkBoxPrice + optionItem.price;
                    $scope.options.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            // 解析number价格
            var numberPrice = 0;
            for (var i = 0; i < $scope.options.number.length; i++) {
                var optionItem = $scope.options.number[i];
                numberPrice = numberPrice + (optionItem.price * optionItem.count);
                if (optionItem.count > 0) {
                    $scope.options.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            //解析raidoGroup价格
            var raidoGroupPrice = 0;
            for (var i = 0; i < $scope.options.radioGroup.length; i++) {
                var optionItem = $scope.options.radioGroup[i];
                raidoGroupPrice = raidoGroupPrice + parseFloat(optionItem.price);
                if (optionItem.selectId != undefined) {
                    $scope.options.selectOption.push({
                        option_id: optionItem.selectId,
                        count: 1
                    });
                }
            }

            //解析checkBoxGroup价格
            var checkBoxGroupPrice = 0;
            for (var i = 0; i < $scope.options.checkBoxGroup.length; i++) {
                for (var j = 0; j < $scope.options.checkBoxGroup[i].group.length; j++) {
                    var optionItem = $scope.options.checkBoxGroup[i].group[j];
                    if (optionItem.count == 1) {
                        checkBoxGroupPrice = checkBoxGroupPrice + optionItem.price;
                        $scope.options.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            //解析numberGrou价格
            var numberGroupPrice = 0;
            for (var i = 0; i < $scope.options.numberGroup.length; i++) {
                for (var j = 0; j < $scope.options.numberGroup[i].group.length; j++) {
                    var optionItem = $scope.options.numberGroup[i].group[j];
                    numberGroupPrice = numberGroupPrice + (optionItem.price * optionItem.count);
                    if (optionItem.count > 0) {
                        $scope.options.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            if (d_is_airport == 1) {
                if (a_is_airport == 1) {
                    $scope.totalPrice = ($scope.offer.basic_cost + $scope.offer.d_port_price + $scope.offer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                } else {
                    $scope.totalPrice = ($scope.offer.basic_cost + $scope.offer.d_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                }
            } else {
                if (a_is_airport == 1) {
                    $scope.totalPrice = ($scope.offer.basic_cost + $scope.offer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                } else {
                    $scope.totalPrice = ($scope.offer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                }
            }
            $scope.optionsPrice = checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
            if ($scope.totalPrice > 0 && $scope.totalPrice < 1) {
                $scope.totalPrice = 1.00;
            }
            // console.log($scope.totalPrice)
            if($scope.showCoupon){
                $scope.showTotalPrice = $scope.totalPrice - $scope.amountOff - $scope.percentOff / 100 * ($scope.totalPrice - $scope.amountOff);
            }else{
                $scope.showTotalPrice = $scope.totalPrice;
            }
            if ($scope.showTotalPrice > 0 && $scope.showTotalPrice < 1) {
                $scope.showTotalPrice = 1.00;
            }
            if ($scope.showTotalPrice < 0) {
                $scope.showTotalPrice = 0;
            }
            // console.log($scope.showTotalPrice)
        };


        $scope.rscalcPrice = function () {
            if ($scope.rsoptions.length == 0) {
                $scope.rstotalPrice = $scope.rsoffer.basic_cost * (1 + $scope.rsoffer.tva / 100);
                if ($scope.rstotalPrice > 0 && $scope.rstotalPrice < 1) {
                    $scope.rstotalPrice = 1.00;
                }
                return;
            }
            $scope.rsoptions.selectOption = [];
            // 解析checkBox价格
            var checkBoxPrice = 0;
            for (var i = 0; i < $scope.rsoptions.checkBox.length; i++) {
                var optionItem = $scope.rsoptions.checkBox[i];
                if (optionItem.count == 1) {
                    checkBoxPrice = checkBoxPrice + optionItem.price;
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            // 解析number价格
            var numberPrice = 0;
            for (var i = 0; i < $scope.rsoptions.number.length; i++) {
                var optionItem = $scope.rsoptions.number[i];
                numberPrice = numberPrice + (optionItem.price * optionItem.count);
                if (optionItem.count > 0) {
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            //解析raidoGroup价格
            var raidoGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.radioGroup.length; i++) {
                var optionItem = $scope.rsoptions.radioGroup[i];
                raidoGroupPrice = raidoGroupPrice + parseFloat(optionItem.price);
                if (optionItem.selectId != undefined) {
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.selectId,
                        count: 1
                    });
                }
            }

            //解析checkBoxGroup价格
            var checkBoxGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.checkBoxGroup.length; i++) {
                for (var j = 0; j < $scope.rsoptions.checkBoxGroup[i].group.length; j++) {
                    var optionItem = $scope.rsoptions.checkBoxGroup[i].group[j];
                    if (optionItem.count == 1) {
                        checkBoxGroupPrice = checkBoxGroupPrice + optionItem.price;
                        $scope.rsoptions.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            //解析numberGrou价格
            var numberGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.numberGroup.length; i++) {
                for (var j = 0; j < $scope.rsoptions.numberGroup[i].group.length; j++) {
                    var optionItem = $scope.rsoptions.numberGroup[i].group[j];
                    numberGroupPrice = numberGroupPrice + (optionItem.price * optionItem.count);
                    if (optionItem.count > 0) {
                        $scope.rsoptions.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            if (rs_d_is_airport == 1) {
                if (rs_a_is_airport == 1) {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + $scope.rsoffer.d_port_price + $scope.rsoffer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                } else {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + $scope.rsoffer.d_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                }
            } else {
                if (rs_a_is_airport == 1) {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + $scope.rsoffer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                } else {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                }
            }
            // console.log($scope.rstotalPrice)
            $scope.rsOptionsPrice = checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
            if ($scope.rstotalPrice > 0 && $scope.rstotalPrice < 1) {
                $scope.rstotalPrice = 1.00;
            }
            $scope.showRsTotalPrice = $scope.rstotalPrice - $scope.amountRsOff - $scope.percentRsOff / 100 * ($scope.rstotalPrice - $scope.amountRsOff);
            if ($scope.showRsTotalPrice > 0 && $scope.showRsTotalPrice < 1) {
                $scope.showRsTotalPrice = 1.00;
            }
            if ($scope.showRsTotalPrice < 0) {
                $scope.showRsTotalPrice = 0;
            }
            console.log($scope.showRsTotalPrice)
        };

        $scope.onEnableOption = function (option) {
            if (option.enable) {
                option.count = 1;
            } else {
                option.count = 0;
            }
            $scope.calcPrice();
        };

        $scope.onChangeOptionCount = function (option, isAdd) {
            if (isAdd) {
                if (option.count >= option.add_max) {
                    return;
                }
                option.count++;
            } else {
                if (option.count <= 1) {
                    return;
                }
                option.count--;
            }
            $scope.calcPrice();
        };

        $scope.onReEnableOption = function (option) {
            if (option.enable) {
                option.count = 1;
            } else {
                option.count = 0;
            }
            $scope.rscalcPrice();
        };

        $scope.onReChangeOptionCount = function (option, isAdd) {
            if (isAdd) {
                if (option.count >= option.add_max) {
                    return;
                }
                option.count++;
            } else {
                if (option.count <= 1) {
                    return;
                }
                option.count--;
            }
            $scope.rscalcPrice();
        };


        //下一步
        $scope.clickNextAction = function ($event) {
            if ($scope.step == 2) {
                if ($stateParams.data && $stateParams.data.company_infor) {
                    //由第2步直接进入支付页面
                    enterSelectPaymentStep(false);
                } else {
                    //由第2步进入第3步
                    $scope.step = 3;
                    $scope.setViewState();
                }
            } else if ($scope.step == 3) {
                //由第3步进入支付页面
                enterSelectPaymentStep(true, $event);
            }
        };

        var enterSelectPaymentStep = function (withLogin, $event) {
            var passengerNames = [];
            angular.forEach($scope.passengers, function (passenger) {
                passengerNames.push(passenger.name);
            });
            var passengerCount = 0;
            if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                passengerCount = 0;
            } else {
                passengerCount = $scope.selectedMaxPassengers;
            }

            var bagCount = 0;
            if ($scope.selectedMaxBags == $scope.maxBags[0]) {
                bagCount = 0;
            } else {
                bagCount = $scope.selectedMaxBags;
            }

            var params = {
                type: $scope.bookType,
                appointed_time: (new Date($scope.pickupTime).valueOf() + "").substr(0, 10),
                d_lat: $scope.pickupLocation.geometry.location.lat(),
                d_lng: $scope.pickupLocation.geometry.location.lng(),
                d_address: $scope.pickupLocation,
                estimate_duration: estimate_duration,
                car_id: $scope.cars[$scope.selectedCar].car_id,
                offer_id: $scope.cars[$scope.selectedCar].offer.offer_id,
                options: $scope.options.selectOption,
                cost: $scope.totalPrice,
                amountOff: $scope.amountOff,
                percentOff: $scope.percentOff,
                couponCode: $scope.couponCode,
                showCoupon: $scope.showCoupon,
                promo_code_shown: $scope.promo_code_shown,
                checkingCode: $scope.checkingCode,
                haveVerifyCode: $scope.haveVerifyCode,
                showTotalPrice: $scope.showTotalPrice,
                note: $scope.bookNote,
                passenger_names: passengerNames.join(','),
                passenger_count: passengerCount,
                bag_count: bagCount,
                d_airline: $scope.dair,
                d_flight: $scope.dflight,
                d_is_airport: d_is_airport,
                d_air_fs: dAirFs,
                car: $scope.cars[$scope.selectedCar],
                edit_vehicle_params: {
                    cars: $scope.cars,
                    selectedCar: $scope.selectedCar,
                    options: $scope.options,
                    offer: $scope.offer,
                    maxBags: $scope.maxBags,
                    selectedMaxBags: $scope.selectedMaxBags,
                    maxPassengers: $scope.maxPassengers,
                    selectedMaxPassengers: $scope.selectedMaxPassengers,
                    passengers: $scope.passengers
                }
            };

            var reParams = undefined;

            if ($scope.bookType == 1) {
                params.a_lat = $scope.dropoffLocation.geometry.location.lat();
                params.a_lng = $scope.dropoffLocation.geometry.location.lng();
                params.a_address = $scope.dropoffLocation;
                params.estimate_distance = $scope.estimate_data.distance.value / 1000;
                params.a_airline = $scope.aair;
                params.a_flight = $scope.aflight;
                params.a_is_airport = a_is_airport;
                params.a_air_fs = aAirFs;
                if ($scope.showReturnService) {
                    var rsPassengerNames = [];
                    angular.forEach($scope.rsPassengers, function (passenger) {
                        rsPassengerNames.push(passenger.name);
                    });
                    var rsPassengerCount = 0;
                    if ($scope.rsSelectedMaxPassengers == $scope.rsMaxPassengers[0]) {
                        rsPassengerCount = 0;
                    } else {
                        rsPassengerCount = $scope.rsSelectedMaxPassengers;
                    }

                    var rsBagCount = 0;
                    if ($scope.rsSelectedMaxBags == $scope.rsMaxBags[0]) {
                        rsBagCount = 0;
                    } else {
                        rsBagCount = $scope.rsSelectedMaxBags;
                    }

                    reParams = {
                        type: $scope.bookType,
                        appointed_time: (new Date($scope.rspickupTime).valueOf() + "").substr(0, 10),
                        d_lat: $scope.dropoffLocation.geometry.location.lat(),
                        d_lng: $scope.dropoffLocation.geometry.location.lng(),
                        d_address: $scope.dropoffLocation,
                        a_lat: $scope.pickupLocation.geometry.location.lat(),
                        a_lng: $scope.pickupLocation.geometry.location.lng(),
                        a_address: $scope.pickupLocation,
                        estimate_duration: $scope.rsestimate_data.duration.value / 60,
                        estimate_distance:$scope.rsestimate_data.distance.value / 1000,
                        car_id: $scope.rscars[$scope.rsselectedCar].car_id,
                        offer_id: $scope.rscars[$scope.rsselectedCar].offer.offer_id,
                        options: $scope.rsoptions.selectOption,
                        cost: $scope.rstotalPrice,
                        amountOff: $scope.amountRsOff,
                        percentOff: $scope.percentRsOff,
                        coupon: $scope.couponRsCode,
                        promo_code_shown: $scope.rs_promo_code_shown,
                        checkingCode: $scope.rs_checkingCode,
                        haveVerifyCode: $scope.rs_haveVerifyCode,
                        showTotalPrice: $scope.showRsTotalPrice,
                        note: $scope.bookNote,
                        passenger_names: rsPassengerNames.join(','),
                        passenger_count: rsPassengerCount,
                        bag_count: rsBagCount,
                        d_airline: rsDair,
                        d_flight: rsDflight,
                        d_air_fs: rsDairFs,
                        a_airline: rsAair,
                        a_flight: rsAflight,
                        a_air_fs: rsAairFs,
                        d_is_airport: rs_d_is_airport,
                        a_is_airport: rs_a_is_airport,
                        car: $scope.rscars[$scope.rsselectedCar],
                        edit_vehicle_params: {
                            cars: $scope.rscars,
                            selectedCar: $scope.rsselectedCar,
                            options: $scope.rsoptions,
                            offer: $scope.rsoffer,
                            maxBags: $scope.rsMaxBags,
                            selectedMaxBags: $scope.rsSelectedMaxBags,
                            maxPassengers: $scope.rsMaxPassengers,
                            selectedMaxPassengers: $scope.rsSelectedMaxPassengers,
                            passengers: $scope.rsPassengers
                        }
                    };
                }
            } else {
                params.a_is_airport = 0;
            }

            if (withLogin) {
                if (!$scope.userName) {
                    MessageBox.toast($filter('translate')('flow.jsInput_email'), "error");
                    return;
                }
                if (!$scope.password) {
                    MessageBox.toast($filter('translate')('flow.jsInput_password'), "error");
                    return;
                }
                var nextLadda = Ladda.create($event.target);
                nextLadda.start();
                FlowBS.login(company_id, $scope.userName, $scope.password).then(function (result) {
                    if (!result.data.customer) {
                        nextLadda.stop();
                        MessageBox.toast($filter('translate')('flow.jsLogin_failed'), "error");
                        return;
                    }
                    loginUser = result.data;

                    $rootScope.login_id = loginUser.id;

                    FlowBS.getCards(loginUser.token).then(function (result) {
                        nextLadda.stop();
                        MessageBox.toast($filter('translate')('flow.jsLogin_success'), "Success");
                        cards = result.data;
                        $state.go('select-payment',
                            {
                                data: {
                                    cards: cards,
                                    bookType: $scope.bookType,
                                    params: params,
                                    reParams: reParams,
                                    loginUser: loginUser,
                                    company_infor: $scope.companyInfor
                                }
                            }
                        );
                    }, function (error) {
                        nextLadda.stop();
                        MessageBox.toast($filter('translate')('flow.jsLogin_get_card_failed'), "error");

                        $state.go('select-payment',
                            {
                                data: {
                                    bookType: $scope.bookType,
                                    params: params,
                                    reParams: reParams,
                                    loginUser: loginUser,
                                    company_infor: $scope.companyInfor
                                }
                            }
                        );
                    });
                }, function (error) {
                    nextLadda.stop();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast($filter('translate')('flow.jsLogin_failed'), "error");
                    }
                });
            } else {
                $state.go('select-payment',
                    {
                        data: {
                            cards: cards,
                            bookType: $scope.bookType,
                            params: params,
                            reParams: reParams,
                            loginUser: loginUser,
                            company_infor: $scope.companyInfor
                        }
                    }
                );
            }
        };

        //注册
        $scope.onRegisterButtonClick = function () {
            var passengerNames = [];
            angular.forEach($scope.passengers, function (passenger) {
                passengerNames.push(passenger.name);
            });
            var passengerCount = 0;
            if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                passengerCount = 0;
            } else {
                passengerCount = $scope.selectedMaxPassengers;
            }

            var bagCount = 0;
            if ($scope.selectedMaxBags == $scope.maxBags[0]) {
                bagCount = 0;
            } else {
                bagCount = $scope.selectedMaxBags;
            }

            var params = {
                type: $scope.bookType,
                appointed_time: (new Date($scope.pickupTime).valueOf() + "").substr(0, 10),
                d_lat: $scope.pickupLocation.geometry.location.lat(),
                d_lng: $scope.pickupLocation.geometry.location.lng(),
                d_address: $scope.pickupLocation,
                estimate_duration: estimate_duration,
                car_id: $scope.cars[$scope.selectedCar].car_id,
                offer_id: $scope.cars[$scope.selectedCar].offer.offer_id,
                options: $scope.options.selectOption,
                cost: $scope.totalPrice,
                amountOff: $scope.amountOff,
                percentOff: $scope.percentOff,
                couponCode: $scope.couponCode,
                showCoupon: $scope.showCoupon,
                promo_code_shown: $scope.promo_code_shown,
                checkingCode: $scope.checkingCode,
                haveVerifyCode: $scope.haveVerifyCode,
                showTotalPrice: $scope.showTotalPrice,
                note: $scope.bookNote,
                passenger_names: passengerNames.join(','),
                passenger_count: passengerCount,
                bag_count: bagCount,
                d_airline: $scope.dair,
                d_flight: $scope.dflight,
                d_is_airport: d_is_airport,
                d_air_fs: dAirFs,
                car: $scope.cars[$scope.selectedCar],
                edit_vehicle_params: {
                    cars: $scope.cars,
                    selectedCar: $scope.selectedCar,
                    options: $scope.options,
                    offer: $scope.offer,
                    maxBags: $scope.maxBags,
                    selectedMaxBags: $scope.selectedMaxBags,
                    maxPassengers: $scope.maxPassengers,
                    selectedMaxPassengers: $scope.selectedMaxPassengers,
                    passengers: $scope.passengers
                }
            };

            var reParams = undefined;

            if ($scope.bookType == 1) {
                params.a_lat = $scope.dropoffLocation.geometry.location.lat();
                params.a_lng = $scope.dropoffLocation.geometry.location.lng();
                params.a_address = $scope.dropoffLocation;
                params.estimate_distance = $scope.estimate_data.distance.value / 1000;
                params.a_airline = $scope.aair;
                params.a_flight = $scope.aflight;
                params.a_air_fs = aAirFs;
                params.a_is_airport = a_is_airport;
                if ($scope.showReturnService) {
                    var rsPassengerNames = [];
                    angular.forEach($scope.rsPassengers, function (passenger) {
                        rsPassengerNames.push(passenger.name);
                    });
                    var rsPassengerCount = 0;
                    if ($scope.rsSelectedMaxPassengers == $scope.rsMaxPassengers[0]) {
                        rsPassengerCount = 0;
                    } else {
                        rsPassengerCount = $scope.rsSelectedMaxPassengers;
                    }

                    var rsBagCount = 0;
                    if ($scope.rsSelectedMaxBags == $scope.rsMaxBags[0]) {
                        rsBagCount = 0;
                    } else {
                        rsBagCount = $scope.rsSelectedMaxBags;
                    }

                    reParams = {
                        type: $scope.bookType,
                        appointed_time: (new Date($scope.rspickupTime).valueOf() + "").substr(0, 10),
                        d_lat: $scope.dropoffLocation.geometry.location.lat(),
                        d_lng: $scope.dropoffLocation.geometry.location.lng(),
                        d_address: $scope.dropoffLocation,
                        a_lat: $scope.pickupLocation.geometry.location.lat(),
                        a_lng: $scope.pickupLocation.geometry.location.lng(),
                        a_address: $scope.pickupLocation,
                        estimate_duration: $scope.rsestimate_data.duration.value / 60,
                        estimate_distance: $scope.rsestimate_data.distance.value / 1000,
                        car_id: $scope.rscars[$scope.rsselectedCar].car_id,
                        offer_id: $scope.rscars[$scope.rsselectedCar].offer.offer_id,
                        options: $scope.rsoptions.selectOption,
                        cost: $scope.rstotalPrice,
                        amountOff: $scope.amountRsOff,
                        percentOff: $scope.percentRsOff,
                        coupon: $scope.couponRsCode,
                        promo_code_shown: $scope.rs_promo_code_shown,
                        checkingCode: $scope.rs_checkingCode,
                        haveVerifyCode: $scope.rs_haveVerifyCode,
                        showTotalPrice: $scope.showRsTotalPrice,
                        note: $scope.bookNote,
                        passenger_names: rsPassengerNames.join(','),
                        passenger_count: rsPassengerCount,
                        bag_count: rsBagCount,
                        d_airline: rsDair,
                        d_flight: rsDflight,
                        d_air_fs: rsDairFs,
                        a_airline: rsAair,
                        a_flight: rsAflight,
                        a_air_fs: rsAairFs,
                        d_is_airport: rs_d_is_airport,
                        a_is_airport: rs_a_is_airport,
                        car: $scope.rscars[$scope.rsselectedCar],
                        edit_vehicle_params: {
                            cars: $scope.rscars,
                            selectedCar: $scope.rsselectedCar,
                            options: $scope.rsoptions,
                            offer: $scope.rsoffer,
                            maxBags: $scope.rsMaxBags,
                            selectedMaxBags: $scope.rsSelectedMaxBags,
                            maxPassengers: $scope.rsMaxPassengers,
                            selectedMaxPassengers: $scope.rsSelectedMaxPassengers,
                            passengers: $scope.rsPassengers
                        }
                    };
                }
            } else {
                params.a_is_airport = 0;
            }
            $state.go('customer-register',
                {
                    data: {
                        bookType: $scope.bookType,
                        params: params,
                        reParams: reParams,
                        company_infor: $scope.companyInfor
                    }
                }
            );
        };

        //eventType
        //1:编辑去程booking
        //2:添加返程booking
        //3:编辑返程booking
        $scope.editDatetime = function (eventType) {
            var isReturnSerivce;
            if (eventType == 1) {
                isReturnSerivce = false;
            } else {
                isReturnSerivce = true;
            }
            var params = {
                company_id: company_id,
                bookType: $scope.bookType,
                isReturnSerivce: isReturnSerivce,
                appointed_time: $scope.pickupTime.getTime(),
                pickupLocation: $scope.pickupLocation,
                dair: $scope.dair,
                dflight: $scope.dflight,
                dAirFs: dAirFs,
                d_is_airport: d_is_airport,
                companyInfo:$scope.companyInfor
            };
            if ($scope.bookType == 1) {
                //p2p
                if (eventType == 1) {
                    params.dropoffLocation = $scope.dropoffLocation;
                    params.aair = $scope.aair;
                    params.aflight = $scope.aflight;
                    params.aAirFs = aAirFs;
                    params.a_is_airport = a_is_airport;
                } else {
                    params.pickupLocation = $scope.dropoffLocation;
                    params.dropoffLocation = $scope.pickupLocation;
                    params.dair = rsDair;
                    params.dflight = rsDflight;
                    params.dAirFs = rsDairFs;
                    params.aair = rsAair;
                    params.aflight = rsAflight;
                    params.aAirFs = rsAairFs;
                    params.appointed_time = $scope.rspickupTime.getTime();
                    params.d_is_airport = rs_d_is_airport;
                    params.a_is_airport = rs_a_is_airport;
                }
            } else {
                //hourly
                params.hours = estimate_duration / 60;
                params.a_is_airport = 0;
            }

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/flow/book-datetime-edit.html',
                controller: 'BookDatetimeEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: params,
                        event: {
                            bookSuccess: function (params) {
                                modalInstance.dismiss();

                                if ($scope.step > 2) {
                                    $scope.step = 2;
                                    $scope.setViewState();
                                }

                                $scope.bookType = params.bookType;
                                if ($scope.bookType == 1) {
                                    if (eventType == 1) {
                                        $scope.maxBags = $scope.rsMaxBags = ['N/A'];
                                        $scope.selectedMaxBags = $scope.rsSelectedMaxBags = 'N/A';
                                        $scope.maxPassengers = $scope.rsMaxPassengers = ['N/A'];
                                        $scope.selectedMaxPassengers = $scope.rsSelectedMaxPassengers = 'N/A';
                                        $scope.passengers = $scope.rsPassengers = [];

                                        d_lat = params.pickupLocation.geometry.location.lat();
                                        d_lng = params.pickupLocation.geometry.location.lng();
                                        a_lat = params.dropoffLocation.geometry.location.lat();
                                        a_lng = params.dropoffLocation.geometry.location.lng();
                                        estimate_duration = params.estimate_data.duration.value / 60;
                                        $scope.dair = params.dair;
                                        $scope.dflight = params.dflight;
                                        dAirFs = params.dAirFs;
                                        $scope.aair = params.aair;
                                        $scope.aflight = params.aflight;
                                        aAirFs = params.aAirFs;
                                        d_is_airport = params.d_is_airport;
                                        a_is_airport = params.a_is_airport;
                                        $scope.pickupTime = new Date(params.appointed_time);
                                        $scope.pickupLocation = params.pickupLocation;
                                        $scope.pickupLocation.d_final_address = AddressTool.finalAddress($scope.pickupLocation);
                                        $scope.dropoffLocation = params.dropoffLocation;
                                        $scope.dropoffLocation.a_final_address = AddressTool.finalAddress($scope.dropoffLocation);
                                        $scope.estimate_data = params.estimate_data;
                                        $scope.estimate_time_show = estimate_duration;

                                        initVehicles(params.offers);
                                        initReturnService();
                                        if ($scope.showReturnService) {
                                            $("[name='rsSwitch']").bootstrapSwitch('toggleState');
                                        }
                                    } else {
                                        $scope.rsMaxBags = ['N/A'];
                                        $scope.rsSelectedMaxBags = 'N/A';
                                        $scope.rsMaxPassengers = ['N/A'];
                                        $scope.rsSelectedMaxPassengers = 'N/A';
                                        $scope.rsPassengers = [];

                                        rsDair = params.dair;
                                        rsDflight = params.dflight;
                                        rsDairFs = params.dAirFs;
                                        rsAair = params.aair;
                                        rsAflight = params.aflight;
                                        rsAairFs = params.aAirFs;
                                        rs_d_is_airport = params.d_is_airport;
                                        rs_a_is_airport = params.a_is_airport;
                                        $scope.rspickupTime = new Date(params.appointed_time);
                                        $scope.rsestimate_data = params.estimate_data;

                                        initRsVehicles(params.offers);
                                        $scope.showReturnService = true;
                                    }
                                } else {
                                    $scope.maxBags = $scope.rsMaxBags = ['N/A'];
                                    $scope.selectedMaxBags = $scope.rsSelectedMaxBags = 'N/A';
                                    $scope.maxPassengers = $scope.rsMaxPassengers = ['N/A'];
                                    $scope.selectedMaxPassengers = $scope.rsSelectedMaxPassengers = 'N/A';
                                    $scope.passengers = $scope.rsPassengers = [];

                                    d_lat = params.pickupLocation.geometry.location.lat;
                                    d_lng = params.pickupLocation.geometry.location.lng;
                                    estimate_duration = params.hours * 60;
                                    $scope.dair = params.dair;
                                    $scope.dflight = params.dflight;
                                    dAirFs = params.dAirFs;
                                    d_is_airport = params.d_is_airport;
                                    a_is_airport = 0;
                                    $scope.pickupTime = new Date(params.appointed_time);
                                    $scope.pickupLocation = params.pickupLocation;
                                    $scope.pickupLocation.d_final_address = AddressTool.finalAddress($scope.pickupLocation);
                                    $scope.estimate_time_show = estimate_duration;
                                    initVehicles(params.offers);

                                    if ($scope.showReturnService) {
                                        $("[name='rsSwitch']").bootstrapSwitch('toggleState');
                                    }
                                }
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                                if (eventType == 2) {
                                    $("[name='rsSwitch']").bootstrapSwitch('toggleState');
                                }
                            },
                            resetCouponCode: function () {
                                resetCouponCode();
                                resetRsCouponCode();
                            }
                        }
                    }
                }
            });
        };

        $scope.editVehicle = function () {
            var params = {};
            params.bookType = $scope.bookType;

            params.cars = $scope.cars;
            params.selectedCar = $scope.selectedCar;
            params.options = $scope.options;
            params.offer = $scope.offer;

            params.maxBags = $scope.maxBags;
            params.selectedMaxBags = $scope.selectedMaxBags;
            params.maxPassengers = $scope.maxPassengers;
            params.selectedMaxPassengers = $scope.selectedMaxPassengers;
            params.passengers = $scope.passengers;
            params.showCoupon = $scope.showCoupon;
            params.promo_code_shown = $scope.promo_code_shown;
            params.couponCode = $scope.couponCode;
            params.checkingCode = $scope.checkingCode;
            params.amountOff = $scope.amountOff;
            params.percentOff = $scope.percentOff;
            params.haveVerifyCode = $scope.haveVerifyCode;
            params.showTotalPrice = $scope.showTotalPrice;
            params.companyInfo=$scope.companyInfor;

            if (params.bookType == 1) {
                params.company_id = company_id;
                params.pickupLocation = $scope.pickupLocation;
                params.dropoffLocation = $scope.dropoffLocation;
                params.rsAppointed_time = $scope.rspickupTime.getTime();

                params.showReturnService = $scope.showReturnService;
                if (params.showReturnService) {
                    params.rscars = $scope.rscars;
                    params.rsselectedCar = $scope.rsselectedCar;
                    params.rsoptions = $scope.rsoptions;
                    params.rsoffer = $scope.rsoffer;

                    params.rsMaxBags = $scope.rsMaxBags;
                    params.rsSelectedMaxBags = $scope.rsSelectedMaxBags;
                    params.rsMaxPassengers = $scope.rsMaxPassengers;
                    params.rsSelectedMaxPassengers = $scope.rsSelectedMaxPassengers;
                    params.rsPassengers = $scope.rsPassengers;

                    params.rs_promo_code_shown = $scope.rs_promo_code_shown;
                    params.rs_checkingCode = $scope.rs_checkingCode;
                    params.couponRsCode = $scope.couponRsCode;
                    params.amountRsOff = $scope.amountRsOff;
                    params.percentRsOff = $scope.percentRsOff;
                    params.rs_haveVerifyCode = $scope.rs_haveVerifyCode;
                    params.showRsTotalPrice = $scope.showRsTotalPrice;

                    params.rsDair = rsDair;
                    params.rsDflight = rsDflight;
                    params.rsDairFs = rsDairFs;
                    params.rsAair = rsAair;
                    params.rsAflight = rsAflight;
                    params.rsAairFs = rsAairFs;
                    params.rs_d_is_airport = rs_d_is_airport;
                    params.rs_a_is_airport = rs_a_is_airport;
                    params.d_is_airport = d_is_airport;
                    params.a_is_airport = a_is_airport;

                    params.rsEstimate_data = $scope.rsestimate_data;
                } else {
                    params.rsDair = $scope.aair;
                    params.rsDflight = $scope.aflight;
                    params.rsDairFs = aAirFs;
                    params.rsAair = $scope.dair;
                    params.rsAflight = $scope.dflight;
                    params.rsAairFs = dAirFs;
                    params.rs_d_is_airport = rs_d_is_airport;
                    params.rs_a_is_airport = rs_a_is_airport;
                    params.d_is_airport = d_is_airport;
                    params.a_is_airport = a_is_airport;
                }
            } else {
                params.d_is_airport = d_is_airport;
                params.showReturnService = false;
            }

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/flow/book-vehicle-edit.html',
                controller: 'BookVehicleEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: params,
                        event: {
                            editSuccess: function (params) {
                                modalInstance.dismiss();
                                $timeout(function () {
                                    $scope.cars = params.cars;
                                    $scope.selectedCar = params.selectedCar;
                                    $scope.options = params.options;
                                    $scope.offer = params.offer;
                                    $scope.maxBags = params.maxBags;
                                    $scope.selectedMaxBags = params.selectedMaxBags;
                                    $scope.maxPassengers = params.maxPassengers;
                                    $scope.selectedMaxPassengers = params.selectedMaxPassengers;
                                    $scope.passengers = params.passengers;
                                    $scope.showCoupon = params.promo_code_shown;
                                    $scope.promo_code_shown = params.promo_code_shown;
                                    $scope.checkingCode = params.checkingCode;
                                    $scope.couponCode = params.couponCode;
                                    $scope.amountOff = params.amountOff;
                                    $scope.percentOff = params.percentOff;
                                    $scope.haveVerifyCode = params.haveVerifyCode;
                                    $scope.showTotalPrice = params.showTotalPrice;
                                    $scope.calcPrice();

                                    $scope.showReturnService = params.showReturnService;
                                    if ($scope.showReturnService) {
                                        $scope.rscars = params.rscars;
                                        $scope.rsselectedCar = params.rsselectedCar;
                                        $scope.rsoptions = params.rsoptions;
                                        $scope.rsoffer = params.rsoffer;
                                        $scope.rsMaxBags = params.rsMaxBags;
                                        $scope.rsSelectedMaxBags = params.rsSelectedMaxBags;
                                        $scope.rsMaxPassengers = params.rsMaxPassengers;
                                        $scope.rsSelectedMaxPassengers = params.rsSelectedMaxPassengers;
                                        $scope.rsPassengers = params.rsPassengers;
                                        $scope.rs_promo_code_shown = params.rs_promo_code_shown;
                                        $scope.rs_checkingCode = params.rs_checkingCode;
                                        $scope.couponRsCode = params.couponRsCode;
                                        $scope.amountRsOff = params.amountRsOff;
                                        $scope.percentRsOff = params.percentRsOff;
                                        $scope.rs_haveVerifyCode = params.rs_haveVerifyCode;
                                        $scope.showRsTotalPrice = params.showRsTotalPrice;
                                        rs_d_is_airport = params.rs_d_is_airport;
                                        rs_a_is_airport = params.rs_a_is_airport;
                                        $scope.rscalcPrice();

                                        rsDair = params.rsDair;
                                        rsDflight = params.rsDflight;
                                        rsDairFs = params.rsDairFs;
                                        rsAair = params.rsAair;
                                        rsAflight = params.rsAflight;
                                        rsAairFs = params.rsAairFs;
                                        // rs_d_is_airport = params.rs_d_is_airport;
                                        // rs_a_is_airport = params.rs_a_is_airport;
                                        $scope.rspickupTime = new Date(params.rsAppointed_time);
                                        $scope.rsestimate_data = params.rsEstimate_data;
                                    }

                                    $scope.$apply();
                                }, 0);
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        FlowBS.getCompanyInfor(company_id).then(function (result) {
            $scope.companyInfor = result.data;
            $scope.init();
        }, function (error) {
            $scope.companyInfor ={
                distance_unit: 2,
                email: "",
                id: company_id,
                name: "",
                phone1: '',
                phone2: ''
            };
            $scope.init();
        });

        $scope.setViewState();

        function resetCouponCode() {
            $scope.promo_code_shown = false;
            $scope.checkingCode = true;
            $scope.couponCode = '';
            $scope.amountOff = 0;
            $scope.percentOff = 0;
            $scope.haveVerifyCode = false;
        }

        resetCouponCode();
        $scope.showPromoCodeLine = function () {
            $scope.promo_code_shown = true;
            $scope.checkingCode = false;
        };

        $scope.dismissPromoCodeLine = function () {
            if ($scope.checkingCode) {
                return;
            }
            $scope.promo_code_shown = false;
            $scope.checkingCode = true;
        };

        $scope.getCouponCode = function ($event) {
            if ($scope.checkingCode) {
                return;
            }
            $scope.checkingCode = true;

            if ($scope.couponCode == null || $scope.couponCode == undefined || $scope.couponCode.trim(' ') == '') {
                $scope.checkingCode = false;
                MessageBox.toast($filter('translate')('flow.jsCode_not_null'), 'error');
                return;
            }

            var ladda = Ladda.create($event.target);
            ladda.start();
            FlowBS.verifyCoupon($rootScope.company_id, $scope.couponCode).then(
                function (result) {
                    console.log(result);
                    if (!result.data.valid) {
                        MessageBox.toast($filter('translate')('flow.jsCode_used'), 'error');
                    } else {
                        if (result.data.percent_off == null) {
                            $scope.percentOff = 0;
                        } else {
                            $scope.percentOff = result.data.percent_off;
                        }
                        $scope.amountOff = result.data.amount_off;
                        $scope.haveVerifyCode = true;
                    }
                    $scope.checkingCode = false;
                    $scope.calcPrice();
                    ladda.stop();
                }, function (error) {
                    $scope.checkingCode = false;
                    ladda.stop();
                    MessageBox.toast($filter('translate')('flow.jsCode_not_valid'), 'error');
                }
            );
        };

        // rs
        function resetRsCouponCode() {
            $scope.rs_promo_code_shown = false;
            $scope.rs_checkingCode = true;
            $scope.couponRsCode = '';
            $scope.amountRsOff = 0;
            $scope.percentRsOff = 0;
            $scope.rs_haveVerifyCode = false;
        }

        resetRsCouponCode();
        $scope.showRsPromoCodeLine = function () {
            $scope.rs_promo_code_shown = true;
            $scope.rs_checkingCode = false;
        };

        $scope.dismissRsPromoCodeLine = function () {
            if ($scope.rs_checkingCode) {
                return;
            }
            $scope.rs_promo_code_shown = false;
            $scope.rs_checkingCode = true;
        };

        $scope.getRsCouponCode = function ($event) {
            if ($scope.rs_checkingCode) {
                return;
            }
            $scope.rs_checkingCode = true;

            if ($scope.couponRsCode == null || $scope.couponRsCode == undefined || $scope.couponRsCode.trim(' ') == '') {
                $scope.rs_checkingCode = false;
                MessageBox.toast($filter('translate')('flow.jsCode_not_null'), 'error');
                return;
            }

            var ladda = Ladda.create($event.target);
            ladda.start();
            FlowBS.verifyCoupon($rootScope.company_id, $scope.couponRsCode).then(
                function (result) {
                    console.log(result);
                    if (!result.data.valid) {
                        MessageBox.toast($filter('translate')('flow.jsCode_used'), 'error');
                    } else {
                        if (result.data.percent_off == null) {
                            $scope.percentRsOff = 0;
                        } else {
                            $scope.percentRsOff = result.data.percent_off;
                        }
                        $scope.amountRsOff = result.data.amount_off;
                        $scope.rs_haveVerifyCode = true;
                    }
                    $scope.rs_checkingCode = false;
                    $scope.rscalcPrice();
                    ladda.stop();
                }, function (error) {
                    $scope.rs_checkingCode = false;
                    ladda.stop();
                    MessageBox.toast($filter('translate')('flow.jsCode_not_valid'), 'error');
                }
            );
        };

    })
;
/**
 * Created by gaohui on 17-1-20.
 */
angular.module('Flow.Controllers')
    .controller('PrivacyPolicyCtrl', function ($log, $scope, $state, $stateParams, $rootScope, $http, $timeout, strformat) {

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };
        var companyId = $rootScope.company_id;
        $scope.disclaimerUrl = strformat(Api.flow.getCompanyDisclaimer, companyId);

        $timeout(function () {
            //这个方法如果跨域就不能加载页面
            //但是,齐海说绝对不存在跨域问题
            $('#flow-disclaimer-div').load($scope.disclaimerUrl);

        }, 0);
    });
/**
 * Created by jian on 16-10-27.
 */
angular.module('Flow.Controllers')

    .controller('selectPaymentCtrl', function ($log, $scope, $stateParams, MapTool,
                                               $rootScope, $state, MessageBox, FlowBS, $uibModal, $timeout, $filter) {
        if (!$rootScope.company_id) {
            history.go(-1);
            return;
        }
        $scope.langStyle=localStorage.getItem('lang');
        if($scope.langStyle==='fr'){
            $scope.iosAppImgLink='img/dashboard/iox-FR.png';
            $scope.androidAppImgLink='img/dashboard/google-FR.png'
        }else {
            $scope.iosAppImgLink='img/dashboard/download-on-the-app-store.png';
            $scope.androidAppImgLink='img/dashboard/google-play.png'
        }
        console.log($stateParams);
        function resetRsCouponCode() {
            $scope.rs_promo_code_shown = false;
            $scope.rs_checkingCode = true;
            $scope.couponRsCode = '';
            $scope.amountRsOff = 0;
            $scope.percentRsOff = 0;
            $scope.rs_haveVerifyCode = false;
        }
        function resetCouponCode() {
            $scope.promo_code_shown = false;
            $scope.checkingCode = true;
            $scope.couponCode = '';
            $scope.amountOff = 0;
            $scope.percentOff = 0;
            $scope.haveVerifyCode = false;
        }
        $scope.allData = angular.copy($stateParams.data);
        $scope.offer = $scope.allData.params.edit_vehicle_params.offer;
        if(!$scope.allData.reParams){
            $scope.amountRsOff = 0;
            $scope.percentRsOff = 0;
            $scope.showRsTotalPrice = 0;
        }else {
            $scope.amountRsOff = $scope.allData.reParams.amountOff;
            $scope.percentRsOff = $scope.allData.reParams.percentOff;
            $scope.showRsTotalPrice = $scope.allData.reParams.showTotalPrice;
        }
        $scope.companyInfor = $stateParams.data.company_infor;
        $scope.getCompanyIosApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/ios';
        $scope.getCompanyGoogleApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/android';
        if ($scope.allData.reParams) {
            // $scope.cost = $scope.allData.params.cost + $scope.allData.reParams.cost;
            $scope.cost = $scope.allData.params.cost;
            $scope.reCost = $scope.allData.reParams.cost;
            $scope.rsoffer = $scope.allData.reParams.edit_vehicle_params.offer;
        } else {
            $scope.cost = $scope.allData.params.cost;
        }

        var d_is_airport = $scope.allData.params.d_is_airport;
        var a_is_airport = $scope.allData.params.a_is_airport;
        var rs_d_is_airport;
        var rs_a_is_airport;
        $scope.firstName = $scope.allData.loginUser.first_name;
        $scope.lastName = $scope.allData.loginUser.last_name;
        $scope.email = $scope.allData.loginUser.email;
        $scope.mobile = $scope.allData.loginUser.mobile;

        $scope.myCards = $scope.allData.cards;
        if (!$scope.myCards) {
            $scope.isgetCard = false;
        } else {
            $scope.isgetCard = true;

            if ($scope.myCards.length > 0) {
                $scope.selectedCard = $scope.myCards[0];
                $scope.allData.params.card_token = $scope.selectedCard.card_token;
                if ($scope.allData.reParams) {
                    $scope.allData.reParams.card_token = $scope.selectedCard.card_token;
                }
            }
        }

        // 添加卡
        $scope.cardTypes = {
            1: {name: 'VISA', value: 1},
            2: {name: 'MaserCard', value: 2},
            3: {name: 'AmericanExpress', value: 3},
            4: {name: 'Discover', value: 4}
        };
        // $scope.getLocation = function (val) {
        //     return MapTool.getSearchLocations(val);
        // };
        // $scope.onAddressSelect = function ($item, $model, $label, $event) {
        //     MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
        //         $timeout(function () {
        //             $scope.address = result;
        //         }, 0);
        //     }, function (error) {
        //     });
        //     $scope.address = angular.copy($item);
        // };
        $scope.spellCardInfo = function (card) {
            var result = $scope.cardTypes[card.card_type].name;
            if (!card.check_pass) {
                result = "Auth failed " + result + ' ' + card.card_number.replace(/x/g, '·');
            } else {
                result = result + ' ' + card.card_number.replace(/x/g, '·')
            }
            return result;
        };

        $scope.calcPrice = function () {
            if ($scope.options.length == 0) {
                $scope.totalPrice = $scope.offer.basic_cost * (1 + $scope.offer.tva / 100);
                return;
            }
            $scope.options.selectOption = [];
            // 解析checkBox价格
            var checkBoxPrice = 0;
            for (var i = 0; i < $scope.options.checkBox.length; i++) {
                var optionItem = $scope.options.checkBox[i];
                if (optionItem.count == 1) {
                    checkBoxPrice = checkBoxPrice + optionItem.price;
                    $scope.options.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            // 解析number价格
            var numberPrice = 0;
            for (var i = 0; i < $scope.options.number.length; i++) {
                var optionItem = $scope.options.number[i];
                numberPrice = numberPrice + (optionItem.price * optionItem.count);
                if (optionItem.count > 0) {
                    $scope.options.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            //解析raidoGroup价格
            var raidoGroupPrice = 0;
            for (var i = 0; i < $scope.options.radioGroup.length; i++) {
                var optionItem = $scope.options.radioGroup[i];
                raidoGroupPrice = raidoGroupPrice + parseFloat(optionItem.price);
                if (optionItem.selectId != undefined) {
                    $scope.options.selectOption.push({
                        option_id: optionItem.selectId,
                        count: 1
                    });
                }
            }

            //解析checkBoxGroup价格
            var checkBoxGroupPrice = 0;
            for (var i = 0; i < $scope.options.checkBoxGroup.length; i++) {
                for (var j = 0; j < $scope.options.checkBoxGroup[i].group.length; j++) {
                    var optionItem = $scope.options.checkBoxGroup[i].group[j];
                    if (optionItem.count == 1) {
                        checkBoxGroupPrice = checkBoxGroupPrice + optionItem.price;
                        $scope.options.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            //解析numberGrou价格
            var numberGroupPrice = 0;
            for (var i = 0; i < $scope.options.numberGroup.length; i++) {
                for (var j = 0; j < $scope.options.numberGroup[i].group.length; j++) {
                    var optionItem = $scope.options.numberGroup[i].group[j];
                    numberGroupPrice = numberGroupPrice + (optionItem.price * optionItem.count);
                    if (optionItem.count > 0) {
                        $scope.options.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }
            $scope.totalPrice = ($scope.offer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
            if ($scope.totalPrice > 0 && $scope.totalPrice < 1) {
                $scope.totalPrice = 1.00;
            }
            $scope.showTotalPrice = $scope.totalPrice-$scope.amountOff-$scope.percentOff/100*($scope.totalPrice-$scope.amountOff);
            if ($scope.showTotalPrice > 0 && $scope.showTotalPrice < 1) {
                $scope.showTotalPrice = 1.00;
            }
            if ($scope.showTotalPrice < 0) {
                $scope.showTotalPrice = 0;
            }
        };


        $scope.rscalcPrice = function () {
            if ($scope.rsoptions.length == 0) {
                $scope.rstotalPrice = $scope.rsoffer.basic_cost * (1 + $scope.rsoffer.tva / 100);
                return;
            }
            $scope.rsoptions.selectOption = [];
            // 解析checkBox价格
            var checkBoxPrice = 0;
            for (var i = 0; i < $scope.rsoptions.checkBox.length; i++) {
                var optionItem = $scope.rsoptions.checkBox[i];
                if (optionItem.count == 1) {
                    checkBoxPrice = checkBoxPrice + optionItem.price;
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            // 解析number价格
            var numberPrice = 0;
            for (var i = 0; i < $scope.rsoptions.number.length; i++) {
                var optionItem = $scope.rsoptions.number[i];
                numberPrice = numberPrice + (optionItem.price * optionItem.count);
                if (optionItem.count > 0) {
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            //解析raidoGroup价格
            var raidoGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.radioGroup.length; i++) {
                var optionItem = $scope.rsoptions.radioGroup[i];
                raidoGroupPrice = raidoGroupPrice + parseFloat(optionItem.price);
                if (optionItem.selectId != undefined) {
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.selectId,
                        count: 1
                    });
                }
            }

            //解析checkBoxGroup价格
            var checkBoxGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.checkBoxGroup.length; i++) {
                for (var j = 0; j < $scope.rsoptions.checkBoxGroup[i].group.length; j++) {
                    var optionItem = $scope.rsoptions.checkBoxGroup[i].group[j];
                    if (optionItem.count == 1) {
                        checkBoxGroupPrice = checkBoxGroupPrice + optionItem.price;
                        $scope.rsoptions.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            //解析numberGrou价格
            var numberGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.numberGroup.length; i++) {
                for (var j = 0; j < $scope.rsoptions.numberGroup[i].group.length; j++) {
                    var optionItem = $scope.rsoptions.numberGroup[i].group[j];
                    numberGroupPrice = numberGroupPrice + (optionItem.price * optionItem.count);
                    if (optionItem.count > 0) {
                        $scope.rsoptions.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }
            $scope.rstotalPrice = ($scope.rsoffer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
            if ($scope.rstotalPrice > 0 && $scope.rstotalPrice < 1) {
                $scope.rstotalPrice = 1.00;
            }
            $scope.showRsTotalPrice = $scope.rstotalPrice-$scope.amountRsOff-$scope.percentRsOff/100*($scope.rstotalPrice-$scope.amountRsOff);
            if ($scope.showRsTotalPrice > 0 && $scope.showRsTotalPrice < 1) {
                $scope.showRsTotalPrice = 1.00;
            }
            if ($scope.showRsTotalPrice < 0) {
                $scope.showRsTotalPrice = 0;
            }
        };

        var canBooking = true;
        var isBooking = false;
        $scope.onBookingButtonClick = function ($event) {
            if (!canBooking || isBooking) {
                return;
            }
            isBooking = true;
            var nextLadda = Ladda.create($event.target);
            nextLadda.start();
            MessageBox.showLoading();
            var bookParams = angular.copy($scope.allData.params);
            bookParams.coupon=bookParams.couponCode;
            delete bookParams.car;
            delete bookParams.edit_vehicle_params;
            bookParams.cost = $filter('PriceFormatFilter')(bookParams.cost);
            bookParams.d_address = JSON.stringify(bookParams.d_address);
            if (bookParams.a_address) {
                bookParams.a_address = JSON.stringify(bookParams.a_address);
            }
            bookParams.d_airline = {name: $scope.allData.params.d_airline, icao: $scope.allData.params.d_air_fs};
            bookParams.a_airline = {name: $scope.allData.params.a_airline, icao: $scope.allData.params.a_air_fs};
            // bookParams.unit=$scope.allData.company_infor.distance_unit;
            bookParams.unit=2;
            delete bookParams.d_air_fs;
            delete bookParams.a_air_fs;
            console.log(bookParams)
            FlowBS.book($scope.allData.loginUser.token, JSON.stringify(bookParams)).then(function (result) {
                if ($scope.allData.reParams) {
                    $scope.allData.reParams.d_airline=null;
                    $scope.allData.reParams.d_air_fs=null;
                    $scope.allData.reParams.d_flight=null;
                    $scope.allData.reParams.a_airline=null;
                    $scope.allData.reParams.a_air_fs=null;
                    $scope.allData.reParams.a_flight=null;
                    var reBookParams = angular.copy($scope.allData.reParams);
                    delete reBookParams.car;
                    delete reBookParams.edit_vehicle_params;
                    reBookParams.cost = $filter('PriceFormatFilter')(reBookParams.cost);
                    reBookParams.d_address = JSON.stringify(reBookParams.d_address);
                    reBookParams.a_address = JSON.stringify(reBookParams.a_address);
                    reBookParams.d_airline = {
                        name: $scope.allData.reParams.d_airline,
                        icao: $scope.allData.reParams.d_air_fs
                    };
                    reBookParams.a_airline = {
                        name: $scope.allData.reParams.a_airline,
                        icao: $scope.allData.reParams.a_air_fs
                    };
                    reBookParams.unit=2;
                    delete reBookParams.d_air_fs;
                    delete reBookParams.a_air_fs;
                    console.log(reBookParams)
                    FlowBS.book($scope.allData.loginUser.token, JSON.stringify(reBookParams)).then(function (result) {
                        isBooking = false;
                        MessageBox.hideLoading();
                        nextLadda.stop();
                        MessageBox.toast($filter('translate')('payment.jsBook_success'), "Success");
                        $state.go('booked', {data: $scope.allData});
                    }, function (error) {
                        isBooking = false;
                        MessageBox.hideLoading();
                        nextLadda.stop();

                        delete $scope.allData.reParams;
                        MessageBox.toast($filter('translate')('payment.jsBook_return_service_fault'), "Success");
                        $state.go('booked', {data: $scope.allData});
                    });
                } else {
                    isBooking = false;
                    MessageBox.hideLoading();
                    nextLadda.stop();

                    MessageBox.toast($filter('translate')('payment.jsBook_success'), "Success");
                    $state.go('booked', {data: $scope.allData});
                }
            }, function (error) {
                isBooking = false;
                MessageBox.hideLoading();
                nextLadda.stop();
                if (error.treated) {
                }
                else {
                    MessageBox.toast($filter('translate')('payment.jsBook_failed'), "error");
                }
            })
        };

        $scope.selectedCardChange = function () {
            $scope.allData.params.card_token = $scope.selectedCard.card_token;
            if ($scope.allData.reParams) {
                $scope.allData.reParams.card_token = $scope.selectedCard.card_token;
            }
        };

        $scope.getCardAgain = function ($event) {
            var ladda = Ladda.create($event.target);
            ladda.start();
            MessageBox.showLoading();
            getCard(ladda);
        };

        $timeout(function () {
            angular.element('#addCreditCardForm').validator();
        }, 0);

        $scope.charge = {
            card_type: 1
        };

        $scope.addCreditCard = function (valid, $event) {
            if (!valid) {
                return;
            }

            var cardNumberReg;
            var cvv2Reg;
            if ($scope.charge.card_type == 1) {
                //VISA
                cardNumberReg = /^4\d{12}(?:\d{3})?$/g;
                cvv2Reg = /^[0-9]{3}$/g;
            } else if ($scope.charge.card_type == 2) {
                //MasterCard
                cardNumberReg = /^5[1-5][0-9]{14}/g;
                cvv2Reg = /^[0-9]{3}$/g;
            } else if ($scope.charge.card_type == 3) {
                //AmericanExpress
                cardNumberReg = /^3[47][0-9]{13}$/g;
                cvv2Reg = /^[0-9]{4}$/g;
            } else {
                //DISCOVER
                cardNumberReg = /^6(?:011|5[0-9]{2})[0-9]{12}$/g;
                cvv2Reg = /^[0-9]{3}$/g;
            }
            // if (!$scope.address) {
            //     return;
            // } else {
            //     $scope.charge.address = JSON.stringify($scope.address);
            // }
            var number = "" + $scope.charge.card_number;
            var numberResultArray = number.match(cardNumberReg);
            if (!numberResultArray || numberResultArray != number) {
                MessageBox.toast($filter('translate')('payment.jsFill_card_num'), "error");
                return;
            }

            var ladda = Ladda.create($event.target);
            ladda.start();
            MessageBox.showLoading();
            angular.element($("#buynow")).addClass("disabled");
            canBooking = false;
            FlowBS.addCard($scope.allData.loginUser.token, $scope.charge)
                .then(function (result) {
                    getCard(ladda);
                    $scope.isAddCard = false;
                    $scope.charge = {card_type: 1};
                    angular.element($("#buynow")).removeClass("disabled");
                    canBooking = true;
                }, function (error) {
                    MessageBox.hideLoading();
                    ladda.stop();
                    $scope.isAddCard = false;
                    $scope.charge = {card_type: 1};
                    angular.element($("#buynow")).removeClass("disabled");
                    canBooking = true;
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast($filter('translate')('payment.jsCard_error'), "error");
                    }
                });
        };

        var getCard = function (ladda) {
            FlowBS.getCards($scope.allData.loginUser.token).then(function (result) {
                MessageBox.hideLoading();
                ladda.stop();

                $scope.myCards = result.data;
                if ($scope.myCards.length > 0) {
                    $scope.selectedCard = $scope.myCards[0];
                    $scope.allData.params.card_token = $scope.selectedCard.card_token;
                }
                $scope.isgetCard = true;
            }, function (error) {
                MessageBox.hideLoading();
                ladda.stop();
                MessageBox.toast($filter('translate')('payment.jsGet_Card_Failed'), "error");
            });
        };

        $scope.addPayment = function () {
            $scope.isAddCard = !$scope.isAddCard;
        };


        //编辑去程booking
        $scope.editDatetime = function () {
            var params = {
                company_id: $scope.allData.company_infor.id,
                bookType: $scope.allData.bookType,
                isReturnSerivce: false,
                appointed_time: $scope.allData.params.appointed_time * 1000,
                pickupLocation: $scope.allData.params.d_address,
                dair: $scope.allData.params.d_airline,
                dflight: $scope.allData.params.d_flight,
                dAirFs: $scope.allData.params.d_air_fs,
                d_is_airport: $scope.allData.params.d_is_airport,
                companyInfo:$scope.allData.company_infor
            };
            if ($scope.allData.bookType == 1) {
                //p2p
                params.dropoffLocation = $scope.allData.params.a_address;
                params.aair = $scope.allData.params.a_airline;
                params.aflight = $scope.allData.params.a_flight;
                params.aAirFs = $scope.allData.params.a_air_fs;
                params.a_is_airport = $scope.allData.params.a_is_airport;
            } else {
                //hourly
                params.hours = $scope.allData.params.estimate_duration / 60;
                params.a_is_airport = 0;
            }

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/flow/book-datetime-edit.html',
                controller: 'BookDatetimeEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: params,
                        event: {
                            bookSuccess: function (params) {
                                modalInstance.dismiss();
                                $state.go('flow',
                                    {
                                        data: {
                                            params: params,
                                            company_infor: $scope.allData.company_infor,
                                            login_user: $scope.allData.loginUser,
                                            cards: $scope.allData.cards
                                        }
                                    }
                                );
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            },
                            resetCouponCode:function () {
                                resetCouponCode();
                                resetRsCouponCode();
                            }
                        }
                    }
                }
            });
        };

        //编辑车辆
        $scope.editVehicle = function () {
            var params = {};
            params.bookType = $scope.allData.bookType;

            params.cars = $scope.allData.params.edit_vehicle_params.cars;
            params.selectedCar = $scope.allData.params.edit_vehicle_params.selectedCar;
            params.options = $scope.allData.params.edit_vehicle_params.options;
            params.offer = $scope.allData.params.edit_vehicle_params.offer;
            params.maxBags = $scope.allData.params.edit_vehicle_params.maxBags;
            params.selectedMaxBags = $scope.allData.params.edit_vehicle_params.selectedMaxBags;
            params.maxPassengers = $scope.allData.params.edit_vehicle_params.maxPassengers;
            params.selectedMaxPassengers = $scope.allData.params.edit_vehicle_params.selectedMaxPassengers;
            params.passengers = $scope.allData.params.edit_vehicle_params.passengers;

            params.promo_code_shown = $scope.allData.params.promo_code_shown;
            params.showCoupon = $scope.allData.params.showCoupon;
            params.couponCode = $scope.allData.params.couponCode;
            params.checkingCode = $scope.allData.params.checkingCode;
            params.amountOff = $scope.allData.params.amountOff;
            params.percentOff = $scope.allData.params.percentOff;
            params.haveVerifyCode = $scope.allData.params.haveVerifyCode;
            params.showTotalPrice = $scope.allData.params.showTotalPrice;
            params.companyInfo=$scope.allData.company_infor;


            if (params.bookType == 1) {
                params.company_id = $scope.allData.company_infor.id;
                params.pickupLocation = $scope.allData.params.d_address;
                params.dropoffLocation = $scope.allData.params.a_address;

                if ($scope.allData.reParams) {
                    params.showReturnService = true;
                    params.rsAppointed_time = $scope.allData.reParams.appointed_time * 1000;

                    params.rscars = $scope.allData.reParams.edit_vehicle_params.cars;
                    params.rsselectedCar = $scope.allData.reParams.edit_vehicle_params.selectedCar;
                    params.rsoptions = $scope.allData.reParams.edit_vehicle_params.options;
                    params.rsoffer = $scope.allData.reParams.edit_vehicle_params.offer;
                    params.rsMaxBags = $scope.allData.reParams.edit_vehicle_params.maxBags;
                    params.rsSelectedMaxBags = $scope.allData.reParams.edit_vehicle_params.selectedMaxBags;
                    params.rsMaxPassengers = $scope.allData.reParams.edit_vehicle_params.maxPassengers;
                    params.rsSelectedMaxPassengers = $scope.allData.reParams.edit_vehicle_params.selectedMaxPassengers;
                    params.rsPassengers = $scope.allData.reParams.edit_vehicle_params.passengers;

                    params.rs_promo_code_shown = $scope.allData.reParams.promo_code_shown;
                    params.rs_checkingCode = $scope.allData.reParams.checkingCode;
                    params.couponRsCode = $scope.allData.reParams.couponCode;
                    params.amountRsOff = $scope.allData.reParams.amountOff;
                    params.percentRsOff = $scope.allData.reParams.percentOff;
                    params.rs_haveVerifyCode = $scope.allData.reParams.haveVerifyCode;
                    params.showRsTotalPrice = $scope.allData.reParams.showTotalPrice;

                    params.rsDair = $scope.allData.reParams.d_airline;
                    params.rsDflight = $scope.allData.reParams.d_flight;
                    params.rsDairFs = $scope.allData.reParams.d_air_fs;
                    params.rsAair = $scope.allData.reParams.a_airline;
                    params.rsAflight = $scope.allData.reParams.a_flight;
                    params.rsAairFs = $scope.allData.reParams.a_air_fs;
                    params.rs_d_is_airport = $scope.allData.reParams.d_is_airport;
                    params.rs_a_is_airport = $scope.allData.reParams.a_is_airport;
                    params.d_is_airport = d_is_airport;
                    params.a_is_airport = a_is_airport;
                } else {
                    params.showReturnService = false;
                    params.rsAppointed_time = $scope.allData.params.appointed_time * 1000 + 3 * 60 * 60 * 1000;

                    params.rsDair = $scope.allData.params.a_airline;
                    params.rsDflight = $scope.allData.params.a_flight;
                    params.rsDairFs = $scope.allData.params.a_air_fs;
                    params.rsAair = $scope.allData.params.d_airline;
                    params.rsAflight = $scope.allData.params.d_flight;
                    params.rsAairFs = $scope.allData.params.d_air_fs;
                    params.rs_d_is_airport = $scope.allData.params.a_is_airport;
                    params.rs_a_is_airport = $scope.allData.params.d_is_airport;
                    params.d_is_airport = d_is_airport;
                    params.a_is_airport = a_is_airport;
                }
            } else {
                params.showReturnService = false;
                params.d_is_airport = d_is_airport;
            }


            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/flow/book-vehicle-edit.html',
                controller: 'BookVehicleEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: params,
                        event: {
                            editSuccess: function (params) {
                                console.log(params);
                                modalInstance.dismiss();
                                $timeout(function () {
                                    $scope.allData.params.car.img = '';
                                    $scope.$apply();

                                    $scope.allData.params.edit_vehicle_params.cars = params.cars;
                                    $scope.allData.params.edit_vehicle_params.selectedCar = params.selectedCar;
                                    $scope.allData.params.edit_vehicle_params.offer = params.offer;
                                    $scope.allData.params.edit_vehicle_params.options = params.options;
                                    $scope.allData.params.edit_vehicle_params.maxBags = params.maxBags;
                                    $scope.allData.params.edit_vehicle_params.maxPassengers = params.maxPassengers;
                                    $scope.allData.params.edit_vehicle_params.passengers = params.passengers;
                                    $scope.allData.params.edit_vehicle_params.selectedMaxBags = params.selectedMaxBags;
                                    $scope.allData.params.edit_vehicle_params.selectedMaxPassengers = params.selectedMaxPassengers;

                                    $scope.allData.params.promo_code_shown = params.promo_code_shown;
                                    $scope.allData.params.checkingCode = params.checkingCode;
                                    $scope.allData.params.couponCode = params.couponCode;
                                    $scope.allData.params.amountOff = params.amountOff;
                                    $scope.allData.params.percentOff = params.percentOff;
                                    $scope.allData.params.haveVerifyCode = params.haveVerifyCode;
                                    $scope.allData.params.showTotalPrice = params.showTotalPrice;

                                    $scope.options = params.options;
                                    $scope.offer = params.offer;
                                    // $scope.calcPrice();

                                    $scope.allData.params.car = params.cars[params.selectedCar];
                                    $scope.allData.params.car_id = params.cars[params.selectedCar].car_id;
                                    // $scope.allData.params.cost = $scope.totalPrice;
                                    $scope.allData.params.cost = params.totalPrice;
                                    $scope.allData.params.offer_id = params.cars[params.selectedCar].offer.offer_id;
                                    $scope.allData.params.options = $scope.options.selectOption;

                                    var passengerNames = [];
                                    angular.forEach(params.passengers, function (passenger) {
                                        passengerNames.push(passenger.name);
                                    });
                                    $scope.allData.params.passenger_names = passengerNames.join(',');

                                    var passengerCount = 0;
                                    if (params.selectedMaxPassengers == params.maxPassengers[0]) {
                                        passengerCount = 0;
                                    } else {
                                        passengerCount = params.selectedMaxPassengers;
                                    }
                                    $scope.allData.params.passenger_count = passengerCount;

                                    var bagCount = 0;
                                    if (params.selectedMaxBags == params.maxBags[0]) {
                                        bagCount = 0;
                                    } else {
                                        bagCount = params.selectedMaxBags;
                                    }
                                    $scope.allData.params.bag_count = bagCount;

                                    if (params.showReturnService) {
                                        var rsPassengerNames = [];
                                        angular.forEach(params.rsPassengers, function (passenger) {
                                            rsPassengerNames.push(passenger.name);
                                        });
                                        var rsPassengerCount = 0;
                                        if (params.rsSelectedMaxPassengers == params.rsMaxPassengers[0]) {
                                            rsPassengerCount = 0;
                                        } else {
                                            rsPassengerCount = params.rsSelectedMaxPassengers;
                                        }
                                        var rsBagCount = 0;
                                        if (params.rsSelectedMaxBags == params.rsMaxBags[0]) {
                                            rsBagCount = 0;
                                        } else {
                                            rsBagCount = params.rsSelectedMaxBags;
                                        }

                                        $scope.rsoptions = params.rsoptions;
                                        $scope.rsoffer = params.rsoffer;
                                        rs_d_is_airport = params.rs_d_is_airport;
                                        rs_a_is_airport = params.rs_a_is_airport;
                                        // $scope.rscalcPrice();

                                        if ($scope.allData.reParams) {
                                            $scope.allData.reParams.car.img = '';
                                            $scope.$apply();

                                            $scope.allData.reParams.a_airline = params.rsAair;
                                            $scope.allData.reParams.a_flight = params.rsAflight;
                                            $scope.allData.reParams.a_air_fs = params.rsAairFs;
                                            $scope.allData.reParams.a_is_airport = params.rs_a_is_airport;
                                            $scope.allData.reParams.appointed_time = params.rsAppointed_time / 1000;
                                            $scope.allData.reParams.bag_count = rsBagCount;
                                            $scope.allData.reParams.car = params.rscars[params.rsselectedCar];
                                            $scope.allData.reParams.car_id = params.rscars[params.rsselectedCar].car_id;
                                            // $scope.allData.reParams.cost = $scope.rstotalPrice;
                                            $scope.allData.reParams.promo_code_shown = params.rs_promo_code_shown;
                                            $scope.allData.reParams.checkingCode = params.rs_checkingCode;
                                            $scope.allData.reParams.couponCode = params.couponRsCode;
                                            $scope.allData.reParams.amountOff = params.amountRsOff;
                                            $scope.allData.reParams.percentOff = params.percentRsOff;
                                            $scope.allData.reParams.haveVerifyCode = params.rs_haveVerifyCode;
                                            $scope.allData.reParams.showTotalPrice = params.showRsTotalPrice;

                                            $scope.allData.reParams.cost = params.rstotalPrice;
                                            $scope.allData.reParams.d_airline = params.rsDair;
                                            $scope.allData.reParams.d_flight = params.rsDflight;
                                            $scope.allData.reParams.d_air_fs = params.rsDairFs;
                                            $scope.allData.reParams.d_is_airport = params.rs_d_is_airport;
                                            $scope.allData.reParams.offer_id = params.rscars[params.rsselectedCar].offer.offer_id;
                                            $scope.allData.reParams.options = $scope.rsoptions.selectOption;
                                            $scope.allData.reParams.passenger_count = rsPassengerCount;
                                            $scope.allData.reParams.passenger_names = rsPassengerNames.join(',')
                                        } else {
                                            $scope.allData.reParams = {
                                                a_address: $scope.allData.params.d_address,
                                                a_airline: params.rsAair,
                                                a_flight: params.rsAflight,
                                                a_air_fs: params.rsAairFs,
                                                a_is_airport: params.rs_a_is_airport,
                                                a_lat: $scope.allData.params.d_lat,
                                                a_lng: $scope.allData.params.d_lng,
                                                appointed_time: params.rsAppointed_time / 1000,
                                                bag_count: rsBagCount,
                                                car: params.rscars[params.rsselectedCar],
                                                car_id: params.rscars[params.rsselectedCar].car_id,
                                                card_token: $scope.allData.params.card_token,
                                                cost: params.rstotalPrice,
                                                // cost: $scope.rstotalPrice,
                                                d_address: $scope.allData.params.a_address,
                                                d_airline: params.rsDair,
                                                d_flight: params.rsDflight,
                                                d_air_fs: params.rsDairFs,
                                                d_is_airport: params.rs_d_is_airport,
                                                d_lat: $scope.allData.params.a_lat,
                                                d_lng: $scope.allData.params.a_lng,
                                                estimate_duration: params.rsEstimate_data.duration.value / 60,
                                                estimate_distance:$scope.allData.company_infor.distance_unit==1? params.rsEstimate_data.distance.value * 0.62 / 1000:params.rsEstimate_data.distance.value / 1000,
                                                offer_id: params.rscars[params.rsselectedCar].offer.offer_id,
                                                options: $scope.rsoptions.selectOption,
                                                passenger_count: rsPassengerCount,
                                                passenger_names: rsPassengerNames.join(','),
                                                type: 1,
                                                coupon: $scope.couponCode,
                                                edit_vehicle_params: {}
                                            };
                                        }

                                        $scope.allData.reParams.edit_vehicle_params.cars = params.rscars;
                                        $scope.allData.reParams.edit_vehicle_params.selectedCar = params.rsselectedCar;
                                        $scope.allData.reParams.edit_vehicle_params.offer = params.rsoffer;
                                        $scope.allData.reParams.edit_vehicle_params.options = params.rsoptions;
                                        $scope.allData.reParams.edit_vehicle_params.maxBags = params.rsMaxBags;
                                        $scope.allData.reParams.edit_vehicle_params.maxPassengers = params.rsMaxPassengers;
                                        $scope.allData.reParams.edit_vehicle_params.passengers = params.rsPassengers;
                                        $scope.allData.reParams.edit_vehicle_params.selectedMaxBags = params.rsSelectedMaxBags;
                                        $scope.allData.reParams.edit_vehicle_params.selectedMaxPassengers = params.rsSelectedMaxPassengers;
                                        $scope.cost = $scope.allData.params.cost;
                                        $scope.reCost = $scope.allData.reParams.cost;

                                        $scope.allData.reParams.promo_code_shown = params.rs_promo_code_shown;
                                        $scope.allData.reParams.checkingCode = params.rs_checkingCode;
                                        $scope.allData.reParams.couponCode = params.couponRsCode;
                                        $scope.allData.reParams.amountOff = params.amountRsOff;
                                        $scope.allData.reParams.percentOff = params.percentRsOff;
                                        $scope.allData.reParams.haveVerifyCode = params.rs_haveVerifyCode;
                                        $scope.allData.reParams.showTotalPrice = params.showRsTotalPrice;
                                        $scope.showRsTotalPrice = params.showRsTotalPrice;
                                    } else {
                                        $scope.cost = $scope.allData.params.cost;
                                        $scope.showRsTotalPrice = 0;
                                        console.log($scope.cost)
                                        delete $scope.allData.reParams;
                                    }
                                    $scope.$apply();
                                }, 0);
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };
        $scope.clientsGetCompanyDisclaimer = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/flow/privacy-policy.html',
                controller: 'PrivacyPolicyCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {},
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                initPayment();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };
    });