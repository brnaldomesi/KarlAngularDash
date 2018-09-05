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