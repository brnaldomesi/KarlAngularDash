/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('BookCtrl', function ($scope, $rootScope, $state, $http, $uibModal, $q, $log, BookBS, MessageBox, $timeout, CustomerBS, CardBS, MapTool, MapBS, PaymentBS, AddressTool, AirLineTool, T) {

            if (!$rootScope.loginUser || !window.localStorage.companyCurrency) {
                return;
            }
            var nWatchedModelChangeCount = 0;
            var book = {};
            book.drivers = undefined;
            book.type = 1;
            $scope.promo_code_shown = false;
            $scope.bookType = 1;
            $scope.selectedCard = undefined;
            $scope.isGetOffer = false;
            $scope.customTva = 0;
            $scope.customCost = 0;
            $scope.customDetermine = 0;
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
            $scope.isDropMarkedWords = false;
            $scope.isPickMarkedWords = false;
            $scope.amountOff = 0;
            $scope.percent_off = 0;
            $scope.finalCustomCost = 0;
            $scope.distanceUnit = localStorage.getItem('distanceunit');
            $scope.langStyle = localStorage.getItem('lang');
            $scope.flight = function () {
                $scope.airPort = !$scope.airPort;
                if (!$scope.airPort) {
                    $scope.airLineMessage = null;
                    $scope.airLineCompanyFs = null;
                    $scope.airLineMessageNum = null;
                }
            };

            $scope.reflight = function () {
                $scope.reAirPort = !$scope.reAirPort;
                if (!$scope.reAirPort) {
                    $scope.reAirLineMessage = null;
                    $scope.reAirLineCompanyFs = null;
                    $scope.reAirLineMessageNum = null;
                }
            };

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
                } else {
                    if (book.hourlyPickup) {
                        locationData = angular.copy(book.hourlyPickup);
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
                                        console.log("return data is ", data);
                                        book.pickup = angular.copy(data);
                                        book.pickup.geometry.location = {
                                            lat: book.pickup.latlng.lat,
                                            lng: book.pickup.latlng.lng
                                        };
                                        $scope.bookPickUpAddress = book.pickup.formatted_address
                                        // MapTool.geocoderAddress(data.geometry.location.lat(), data.geometry.location.lng(), function (result) {
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
                                        book.dropoff.geometry.location = {
                                            lat: book.dropoff.latlng.lat,
                                            lng: book.dropoff.latlng.lng
                                        };
                                        $scope.bookDropOffAddress = book.dropoff.formatted_address;

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
                                            lat: book.hourlyPickup.latlng.lat,
                                            lng: book.hourlyPickup.latlng.lng
                                        };
                                        if (book.type == 2) {
                                            $scope.bookHourlyAddress = book.hourlyPickup.formatted_address;
                                        } else {
                                            $scope.bookCustomAddress = book.hourlyPickup.formatted_address;
                                        }
                                        // MapTool.geocoderAddress(data.geometry.location.lat(), data.geometry.location.lng(), function (result) {
                                        //     $timeout(function () {
                                        //         book.hourlyPickup = result;
                                        //         book.hourlyPickup.geometry.location = {
                                        //             lat: book.hourlyPickup.geometry.location.lat(),
                                        //             lng: book.hourlyPickup.geometry.location.lng()
                                        //         };
                                        //         if (book.type == 2) {
                                        //             $scope.bookHourlyAddress = result.formatted_address;
                                        //         } else {
                                        //             $scope.bookCustomAddress = result.formatted_address;
                                        //         }
                                        //     }, 0);
                                        // }, function (error) {
                                        // });
                                    }
                                }
                                modalInstance.dismiss();
                            }
                        }
                    }
                });
            };

            $scope.onChangePassengerCount = function () {
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
            };

            // 滚动到车辆
            var scrollPositions = function () {
                $timeout(function () {
                    var position = angular.element($('#scrollPosition'));
                    $("html,body").animate({scrollTop: position[0].offsetTop}, "slow");
                }, 0);
            };

            $scope.onCheckP2pOffers = function ($event) {
                if (!$scope.bookPickUpAddress) {
                    MessageBox.toast(T.T("booking.jsinput_pickup_address"), "error");
                    return;
                }
                if (!book.pickup) {
                    MessageBox.toast(T.T("booking.jsinput_valid_pickup_address"), "error");
                    return;
                }
                if (!$scope.bookDropOffAddress) {
                    MessageBox.toast(T.T("booking.jsinput_drop_off_address"), "error");
                    return;
                }
                if (!book.dropoff) {
                    MessageBox.toast(T.T("booking.jsinput_valid_drop_off_address"), "error");
                    return;
                }
                var directionsService = new google.maps.DirectionsService;
                MapTool.calculateAndDisplayRoute(
                    directionsService,
                    {
                        placeId: book.pickup.place_id
                    },
                    {
                        placeId: book.dropoff.place_id
                    },
                    (new Date(book.p2pDatetime).valueOf() + "").substr(0, 10),
                    function (response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            var result = {
                                "distance": response.routes[0].legs[0].distance.value,
                                "duration": response.routes[0].legs[0].duration.value
                            };
                            book.estimate = result;
                            $scope.matrixDistance = result;
                            getOffersByRemote($event);
                        }
                    }
                )
                ;
            };

            $scope.onCheckHourlyOffers = function ($event) {
                if (!$scope.bookHourlyAddress) {
                    MessageBox.toast(T.T("booking.jsinput_pickup_address"), "error");
                    return;
                }
                if (!book.hourlyPickup) {
                    MessageBox.toast(T.T("booking.jsinput_valid_pickup_address"), "error");
                    return;
                }

                if (!$scope.hourlyDate) {
                    MessageBox.toast(T.T("booking.jsinput_hourly_date"), "error");
                    return;
                }

                var hourlyLadda = Ladda.create($event.target);
                hourlyLadda.start();
                book.hourlyDatetime = $('.datetimepicker2').data("DateTimePicker").date()._d;
                // console.log('MF: ' + book.hourlyDatetime);
                // console.log('MF2: ' + book.hourlyDatetime.getTimezoneOffset());
                // console.log('MF3: ' + $scope.bookHourlyAddress);
                // console.log('MF4: ' + book.hourlyPickup);
                // MapBS.getTimezone(book.hourlyPickup.geometry.location.lat,
                //     book.hourlyPickup.geometry.location.lng)
                //     .then(function (result) {
                //         console.log('MF5: ' + result);
                //
                //         // if (result.data.code == '2100' || result.data.code == '3001') {
                //     //     MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                //     //     $scope.isGetOffer = false;
                //     //     $scope.options = undefined;
                //     //     hourlyLadda.stop();
                //     // } else if (typeof result.data == "string" || result.data.length < 1) {
                //     //     MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                //     //     hourlyLadda.stop();
                //     // } else {
                //     //     $scope.isGetOffer = true;
                //     //     $scope.bookTime.hourlyPickupTime = book.hourlyDatetime.valueOf();
                //     //     $scope.bookAddress.hourlyPickup = book.hourlyPickup;
                //     //     $scope.bookAddress.hourlyPickup.final_address = AddressTool.finalAddress(book.hourlyPickup);
                //     //     $scope.bookTime.hourlyDate = $scope.hourlyDate * 60;
                //     //     hourlyLadda.stop();
                //     //     $scope.initOption(result);
                //     //     scrollPositions();
                //     // }
                // }, function (error) {
                //         console.log('MF6: ' + error);
                // hourlyLadda.stop();
                // if (error.treated) {
                // }
                // else {
                //     MessageBox.toast(T.T("booking.jsoffer_not_found"), "error");
                // }
                // });
                // return;
                BookBS.getOffersHourly(
                    book.type,
                    book.hourlyPickup,
                    $scope.hourlyDate * 60,
                    book.hourlyDatetime,
                    $scope.airPort,
                    $scope.distanceUnit
                ).then(function (result) {
                    if (result.data.code == '2100' || result.data.code == '3001') {
                        MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                        $scope.isGetOffer = false;
                        $scope.options = undefined;
                        hourlyLadda.stop();
                    } else if (typeof result.data == "string" || result.data.length < 1) {
                        MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                        hourlyLadda.stop();
                    } else {
                        $scope.isGetOffer = true;
                        $scope.bookTime.hourlyPickupTime = book.hourlyDatetime.valueOf();
                        $scope.bookAddress.hourlyPickup = book.hourlyPickup;
                        $scope.bookAddress.hourlyPickup.final_address = AddressTool.finalAddress(book.hourlyPickup);
                        $scope.bookTime.hourlyDate = $scope.hourlyDate * 60;
                        hourlyLadda.stop();
                        $scope.initOption(result);
                        scrollPositions();
                    }
                }, function (error) {
                    hourlyLadda.stop();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("booking.jsoffer_not_found"), "error");
                    }
                });
            };

            $scope.onCheckCustomOffers = function ($event) {
                book.customStartDateTime = $('.datetimepicker3').data("DateTimePicker").date()._d;
                var appointed_time = parseInt((book.customStartDateTime.valueOf() + "").substr(0, 10));
                book.customEndDateTime = $('.datetimepicker4').data("DateTimePicker").date()._d;
                var end_time = parseInt((book.customEndDateTime.valueOf() + "").substr(0, 10));
                if (end_time <= appointed_time) {
                    MessageBox.toast(T.T("booking.jscheck_start_end_time"));
                    return;
                }
                if (!$scope.bookCustomAddress) {
                    MessageBox.toast(T.T("booking.jsinput_pick_up_location"), 'error');
                    return;
                }
                if (!book.hourlyPickup) {
                    MessageBox.toast(T.T("booking.jsinput_valid_pickup_address"), "error");
                    return;
                }
                var lat = book.hourlyPickup.geometry.location.lat;
                var lng = book.hourlyPickup.geometry.location.lng;
                var duration_time = (end_time - appointed_time) / 60;

                var hourlyLadda = Ladda.create($event.target);
                hourlyLadda.start();
                BookBS.getCustomQuote(
                    duration_time,
                    appointed_time,
                    lat,
                    lng,
                    $scope.airPort,
                    $scope.distanceUnit
                ).then(
                    function (result) {
                        hourlyLadda.stop();
                        $scope.categories = result.date;
                        $scope.categories[0].isSelect = true;
                        $scope.categories[0].cars[0].isSelect = true;
                        $scope.categories[0].cars[0].drivers[0].isSelect = true;
                        $scope.carSelected = $scope.categories[0].cars[0];
                        $scope.initBagCountAndPassengerCount($scope.carSelected);
                        $scope.driverSelected = $scope.categories[0].cars[0].drivers[0];
                        $scope.priceFormat = window.localStorage.companyCurrency.toLowerCase();
                        $timeout(function () {
                            if (firstLoad) {
                                $(".accordion").accordion({
                                    header: 'h3.myselect',
                                    active: false,
                                    collapsible: true,
                                    heightStyle: "content"
                                });
                            } else {
                                $(".accordion").accordion("refresh");
                                $(".accordion").accordion("option", "active", false);
                            }
                            firstLoad = false;
                        }, 0);

                        $scope.isGetOffer = true;
                        $scope.bookTime.customStartTime = book.customStartDateTime.valueOf();
                        $scope.bookTime.customEndTime = book.customEndDateTime.valueOf();
                        $scope.bookAddress.hourlyPickup = book.hourlyPickup;
                        $scope.bookAddress.hourlyPickup.final_address = AddressTool.finalAddress(book.hourlyPickup);
                        $scope.bookTime.hourlyDate = $scope.hourlyDate * 60;
                        scrollPositions();
                    }, function (error) {
                        hourlyLadda.stop();
                        $scope.isGetOffer = false;
                        if (error.response.data.code == '3804') {
                            MessageBox.toast(T.T("booking.jsno_car_provide_service"), 'info');
                            return;
                        }
                        if (error.response.data.code == '3805') {
                            MessageBox.toast(T.T("booking.jsno_driver_provide_service"), 'info');
                            return;
                        }
                    }
                );
            };

            $scope.searchCurrentCustomers = function (key) {
                return CustomerBS.searchCurrentCustomers(key).then(function (result) {
                    return result.data.customers;
                }, function (error) {
                    $log.error(error);
                    if (error.treated) {
                    }
                    else {
                    }
                });
            };

            $scope.searchDriver = function (key) {
                var drivers = new Array();
                for (var i in book.drivers) {
                    var driver = book.drivers[i];
                    var matchKey = driver.first_name.toString().toLowerCase().indexOf(key.toLowerCase());
                    if (matchKey >= 0) {
                        drivers.push(driver);
                        continue;
                    }
                    matchKey = driver.last_name.toString().toLowerCase().indexOf(key.toLowerCase());
                    if (matchKey >= 0) {
                        drivers.push(driver);
                        continue;
                    }
                    matchKey = driver.email.toString().indexOf(key.toLowerCase());
                    if (matchKey >= 0) {
                        drivers.push(driver);
                        continue;
                    }
                    matchKey = driver.mobile.toString().indexOf(key.toLowerCase());
                    if (matchKey >= 0) {
                        drivers.push(driver);
                        continue;
                    }
                    matchKey = driver.license_number.toString().indexOf(key.toLowerCase());

                    if (matchKey >= 0) {
                        drivers.push(driver);
                    }
                }
                return drivers;
            };

            // 根据时间获取offer ------- end --------------
            //--------- book ----start ---------
            $scope.onBookButtonClick = function ($event) {
                if (book.type == 1) {
                    if (!$scope.options) {
                        MessageBox.toast(T.T("booking.jsclick_next"), "error");
                        return;
                    }
                    $scope.onP2PBook($event);
                } else if (book.type == 2) {
                    if (!$scope.options) {
                        MessageBox.toast(T.T("booking.jsclick_next"), "error");
                        return;
                    }
                    $scope.onHourlyBook($event);
                } else if (book.type == 3) {
                    $scope.onCustomQuoteBook($event);
                }
            };

            $scope.onP2PBook = function ($event) {
                if (!$scope.customerSelected) {
                    MessageBox.toast(T.T("booking.jsselect_client"), "error");
                    return;
                } else if (!$scope.selectedCard) {
                    MessageBox.toast(T.T("booking.jsselect_credit_card"), "error");
                    return;
                }

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

                var cost;
                if ($scope.airPort) {
                    if ($scope.reAirPort) {
                        cost = Math.round(($scope.totalPrice + $scope.offer.a_port_price + $scope.offer.d_port_price) * (1 + $scope.offer.tva / 100) * 100) / 100;
                    } else {
                        cost = Math.round(($scope.totalPrice + $scope.offer.d_port_price) * (1 + $scope.offer.tva / 100) * 100) / 100;
                    }
                } else {
                    if ($scope.reAirPort) {
                        cost = Math.round(($scope.totalPrice + $scope.offer.a_port_price) * (1 + $scope.offer.tva / 100) * 100) / 100;
                    } else {
                        cost = Math.round($scope.totalPrice * (1 + $scope.offer.tva / 100) * 100) / 100;
                    }
                }
                // cost = Math.round($scope.totalPrice * (1 + $scope.offer.tva / 100) * 100) / 100;
                if (cost > 0 && cost < 1) {
                    cost = 1;
                }

                console.log(book.p2pDatetime);

                var realTime = ((new Date(book.p2pDatetime)).getYear() + 1900) + "-";

                var month = (new Date(book.p2pDatetime)).getMonth() + 1 ;

                if(month < 10)
                {
                    month = "0" + month;
                }

                realTime = realTime + month + "-";

                var day = (new Date(book.p2pDatetime)).getDate();

                if(day < 10)
                {
                    day = "0" + day;
                }

                realTime = realTime + day + " ";

                var hour = (new Date(book.p2pDatetime)).getHours();

                if(hour < 10)
                {
                    hour = "0" + hour;
                }

                realTime = realTime + hour + ":";

                var minute = (new Date(book.p2pDatetime)).getMinutes();

                if(minute < 10)
                {
                    minute = "0" + minute;
                }

                realTime = realTime + minute + ":00";

                var param = {
                    d_lat: book.pickup.geometry.location.lat,
                    d_lng: book.pickup.geometry.location.lng,
                    d_address: JSON.stringify(book.pickup),
                    type: book.type,
                    a_lat: book.dropoff.geometry.location.lat,
                    a_lng: book.dropoff.geometry.location.lng,
                    a_address: JSON.stringify(book.dropoff),
                    cost: cost,
                    appointed_time: parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10)),
                    real_time:realTime,
                    estimate_duration: book.estimate.duration / 60,
                    estimate_distance: book.estimate.distance / 1000,
                    car_id: $scope.carSelected.car_id,
                    offer_id: $scope.offer.offer_id,
                    options: $scope.options.selectOption,
                    driver_id: $scope.driverSelected.driver_id,
                    note: $scope.bookingMsg.msg,
                    passenger_names: passengerNames.join(','),
                    passenger_count: passengerCount,
                    bag_count: bagCount,
                    card_token: $scope.selectedCard.card_token,
                    // d_airline: $scope.airLineMessage,
                    d_airline: {name: $scope.airLineMessage, icao: $scope.airLineCompanyFs},
                    d_flight: $scope.airLineMessageNum,
                    a_airline: {name: $scope.reAirLineMessage, icao: $scope.reAirLineCompanyFs},
                    // a_airline: $scope.reAirLineMessage,
                    a_flight: $scope.reAirLineMessageNum,
                    d_is_airport: $scope.airPort ? 1 : 0,
                    a_is_airport: $scope.reAirPort ? 1 : 0,
                    coupon: $scope.couponCode,
                    unit: 2
                };

                var bookLadda = Ladda.create($event.target);
                bookLadda.start();

                if (!$scope.customerSelected.customer_id) {
                    BookBS.book(JSON.stringify(param), $scope.data.customer_id).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickOneWay();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                } else {
                    BookBS.book(JSON.stringify(param), $scope.customerSelected.customer_id).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickOneWay();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                }
            };

            $scope.onHourlyBook = function ($event) {
                if (!book.hourlyPickup) {
                    MessageBox.toast(T.T("booking.jsinput_pickup_address"), "error");
                    return;
                } else if (!$scope.customerSelected) {
                    MessageBox.toast(T.T("booking.jsselect_client"), "error");
                    return;
                } else if (!$scope.selectedCard) {
                    MessageBox.toast(T.T("booking.jsselect_credit_card"), "error");
                    return;
                }

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

                var cost;
                if ($scope.airPort) {
                    cost = Math.round(($scope.totalPrice + $scope.offer.d_port_price) * (1 + $scope.offer.tva / 100) * 100) / 100;
                } else {
                    cost = Math.round($scope.totalPrice * (1 + $scope.offer.tva / 100) * 100) / 100;
                }
                if (cost > 0 && cost < 1) {
                    cost = 1;
                }
                var param = {
                    d_lat: book.hourlyPickup.geometry.location.lat,
                    d_lng: book.hourlyPickup.geometry.location.lng,
                    d_address: JSON.stringify(book.hourlyPickup),
                    type: book.type,
                    cost: cost,
                    appointed_time: parseInt((book.hourlyDatetime.valueOf() + "").substr(0, 10)),
                    estimate_duration: $scope.hourlyDate * 60,
                    car_id: $scope.carSelected.car_id,
                    offer_id: $scope.offer.offer_id,
                    options: $scope.options.selectOption,
                    driver_id: $scope.driverSelected.driver_id,
                    note: $scope.bookingMsg.msg,
                    passenger_names: passengerNames.join(','),
                    passenger_count: passengerCount,
                    bag_count: bagCount,
                    card_token: $scope.selectedCard.card_token,
                    // d_airline: $scope.airLineMessage,
                    d_airline: {name: $scope.airLineMessage, icao: $scope.airLineCompanyFs},
                    d_flight: $scope.airLineMessageNum,
                    d_is_airport: $scope.airPort ? 1 : 0,
                    coupon: $scope.couponCode,
                    unit: 2
                };

                var bookLadda = Ladda.create($event.target);
                bookLadda.start();
                if (!$scope.customerSelected.customer_id) {
                    BookBS.book(JSON.stringify(param), $scope.data.customer_id).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickHourly();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        $log.error(error);
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                } else {
                    BookBS.book(JSON.stringify(param), $scope.customerSelected.customer_id).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickHourly();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        $log.error(error);
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                }
            };

            $scope.onCustomQuoteBook = function ($event) {
                var appointed_time = parseInt((book.customStartDateTime.valueOf() + "").substr(0, 10));
                var end_time = parseInt((book.customEndDateTime.valueOf() + "").substr(0, 10));
                if (end_time <= appointed_time) {
                    MessageBox.toast(T.T("booking.jsCheck_start_end_time"));
                    return;
                }
                var duration_time = (end_time - appointed_time) / 60;

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
                var param = {
                    d_lat: book.hourlyPickup.geometry.location.lat,
                    d_lng: book.hourlyPickup.geometry.location.lng,
                    d_address: JSON.stringify(book.hourlyPickup),
                    cost: $scope.customCost,
                    appointed_time: appointed_time,
                    estimate_duration: duration_time,
                    car_id: $scope.carSelected.car_id,
                    driver_id: $scope.driverSelected.driver_id,
                    note: $scope.bookingMsg.msg,
                    tva: $scope.customTva,
                    passenger_names: passengerNames.join(','),
                    passenger_count: passengerCount,
                    bag_count: bagCount,
                    card_token: $scope.selectedCard.card_token,
                    // d_airline: $scope.airLineMessage,
                    d_airline: {name: $scope.airLineMessage, icao: $scope.airLineCompanyFs},
                    d_flight: $scope.airLineMessageNum,
                    d_is_airport: $scope.airPort ? 1 : 0,
                    coupon: $scope.couponCode,
                    unit: 2
                };
                var bookLadda = Ladda.create($event.target);
                bookLadda.start();
                if (!$scope.customerSelected.customer_id) {
                    BookBS.bookCustomQuote(
                        $scope.data.customer_id,
                        JSON.stringify(param),
                        $scope.customDetermine
                    ).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickCustomQuote();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                } else {
                    BookBS.bookCustomQuote(
                        $scope.customerSelected.customer_id,
                        JSON.stringify(param),
                        $scope.customDetermine
                    ).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickCustomQuote();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                }

            };

            var clearData = function () {
                $scope.bookPickUpAddress = "";
                $scope.bookDropOffAddress = "";
                $scope.bookHourlyAddress = "";
                $scope.bookCustomAddress = "";
                book.pickup = undefined;
                book.dropoff = undefined;
                book.hourlyPickup = undefined;
                $scope.customerSelected = undefined;
                $scope.carSelected = undefined;
                $scope.driverSelected = undefined;
                $scope.customTva = 0;
                $scope.customCost = 0;
                $scope.customDetermine = 0;
                $scope.hourlyDate = 2;
                $scope.selectedCard = undefined;
                $scope.isGetOffer = false;
                $scope.selectedMaxBags = 'N/A';
                $scope.maxBags = ['N/A'];
                $scope.maxPassengers = ['N/A'];
                $scope.selectedMaxPassengers = 'N/A';
                $scope.passengers = [];
                $scope.bookTime = {};
                $scope.bookAddress = {};
                $scope.bookingMsg.msg = "";
                $scope.airPort = false;
                $scope.reAirPort = false;
                $scope.airLineMessage = null;
                $scope.airLineCompanyFs = null;
                $scope.airLineMessageNum = null;
                $scope.reAirLineMessage = null;
                $scope.reAirLineCompanyFs = null;
                $scope.reAirLineMessageNum = null;
                $scope.isAirport = false;
                $scope.isDropAirport = false;
            };

            //--------- book ----end---------
            //--------------预估价计算-----------start--------
            $scope.accountingPrice = function () {
                if ($scope.offer.company_id == $rootScope.loginUser.company_id) {
                    $scope.showCoupon = true;
                } else {
                    $scope.showCoupon = false;
                    resetCouponCode();
                }
                if ($scope.options.length == 0) {
                    $scope.totalPrice = $scope.offer.basic_cost;
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

                $scope.totalPrice = $scope.offer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
                $scope.optionsPrice = checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
            };
            //--------------预估价计算-----------end--------

            $scope.getOfferBookingPrice = function () {
                if ($scope.offer) {
                    var testPrice = angular.copy($scope.totalPrice);
                    if ($scope.airPort) {
                        testPrice = $scope.offer.d_port_price + $scope.totalPrice;
                    }
                    if ($scope.reAirPort) {
                        testPrice = $scope.offer.a_port_price + $scope.totalPrice;
                    }
                    if ($scope.reAirPort && $scope.airPort) {
                        testPrice = $scope.offer.a_port_price + $scope.offer.d_port_price + $scope.totalPrice;
                    }
                    var price = testPrice * (1 + $scope.offer.tva / 100);
                    if (price > 0 && price < 1) {
                        price = 1;
                    }
                }
                if (price - $scope.amountOff - $scope.percent_off / 100 * (price - $scope.amountOff) < 0) {
                    return 0;
                } else if (price - $scope.amountOff - $scope.percent_off / 100 * (price - $scope.amountOff) > 0 && price - $scope.amountOff - $scope.percent_off / 100 * (price - $scope.amountOff) < 1) {
                    return 1;
                } else {
                    return price - $scope.amountOff - $scope.percent_off / 100 * (price - $scope.amountOff);
                }
            };


            $scope.onEnableOption = function (option) {
                if (option.enable) {
                    option.count = 1;
                } else {
                    option.count = 0;
                }
                $scope.accountingPrice();
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
                $scope.accountingPrice();
            };

            //---------- 获取 Offer --- start -------------
            var getOffersByRemote = function ($event) {
                console.log(book.estimate.distance)
                var hourlyLadda = Ladda.create($event.target);
                hourlyLadda.start();
                book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                BookBS.getOffersP2P(
                    book.type,
                    book.pickup,
                    book.dropoff,
                    book.estimate.distance / 1000,
                    book.estimate.duration / 60,
                    book.p2pDatetime,
                    $scope.airPort,
                    $scope.reAirPort,
                    2
                ).then(function (result) {
                    console.log(result)
                    if (result.data.code == '2100' || result.data.code == '3001') {
                        MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                        $scope.isGetOffer = false;
                        hourlyLadda.stop();
                        $scope.options = undefined;
                    } else if (typeof result.data == "string" || result.data.length < 1) {
                        $scope.isGetOffer = false;
                        MessageBox.toast(result.data, 'error');
                        hourlyLadda.stop();
                    } else {
                        $scope.isGetOffer = true;
                        $scope.bookTime.p2pPickupTime = book.p2pDatetime.valueOf();
                        $scope.bookAddress.p2pPickup = book.pickup;
                        $scope.bookAddress.p2pPickup.final_address = AddressTool.finalAddress(book.pickup);
                        $scope.bookAddress.p2pDropoff = book.dropoff;
                        $scope.bookAddress.p2pDropoff.final_address = AddressTool.finalAddress(book.dropoff);
                        hourlyLadda.stop();
                        $scope.initOption(result);
                        scrollPositions();
                    }
                }, function (error) {
                    $scope.isGetOffer = false;
                    hourlyLadda.stop();
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "3808") {
                            MessageBox.toast(T.T("booking.jsoffer_not_found"), 'error');
                        } else if (error.response.data.code == "3809") {
                            MessageBox.toast(T.T("booking.jsVehicles_not_found"), 'error');
                        } else if (error.response.data.code == "3810") {
                            MessageBox.toast(T.T("booking.jsDriver_not_found"), 'error');
                        } else {
                            MessageBox.toast(T.T("booking.jsoffer_not_found"), "error");
                        }

                    }
                });
            };
            //---------- 获取 Offer --- end -------------

            //------------- category ,car , driver , option 解析  start-------------

            // 1.从数据中解析出 category 所有类型

            var initCategory = function (data) {
                var categories = [];

                //循环遍历offer
                for (var i = 0; i < data.data.length; i++) {

                    //循环遍历offer 中的car_categories
                    for (var k = 0; k < data.data[i].car_categories.length; k++) {

                        var isNewCategory = true;

                        //循环对比category类型 如果是已知类型，直接在此类型下添加数据，如果未知类型，创建此新类型。
                        for (var j = 0; j < categories.length; j++) {
                            if (categories[j].category_id == data.data[i].car_categories[k].category_id) {
                                for (var m = 0; m < data.data[i].car_categories[k].cars.length; m++) {
                                    var option = $scope.initOptionData(data.data[i].options);
                                    data.data[i].car_categories[k].cars[m].options = jQuery.extend(true, {}, option);
                                    data.data[i].car_categories[k].cars[m].offer = data.data[i];
                                }
                                categories[j].cars = categories[j].cars.concat(data.data[i].car_categories[k].cars);
                                isNewCategory = false;
                            }
                        }

                        if (isNewCategory) {
                            var category = {
                                category: "",
                                category_id: "",
                                cars: [],
                                options: [],
                                offer: "",
                                isSelect: false
                            };
                            category.category_id = data.data[i].car_categories[k].category_id;
                            category.category = data.data[i].car_categories[k].category;
                            category.cars = data.data[i].car_categories[k].cars;
                            for (var m = 0; m < category.cars.length; m++) {
                                var option = $scope.initOptionData(data.data[i].options);
                                category.cars[m].options = jQuery.extend(true, {}, option);
                                category.cars[m].offer = data.data[i];
                                category.cars[m].isSelect = false;
                                for (var n = 0; n < category.cars[m].drivers.length; n++) {
                                    category.cars[m].drivers[n].isSelect = false;
                                    category.cars[m].drivers[n].an_offer = category.cars[m].offer.an_offer;
                                }
                            }
                            categories.push(category);
                        }
                    }
                }
                var noRepeatCategories = categories;

                // 对生成的car 增加序号
                for (var i = 0; i < noRepeatCategories.length; i++) {
                    for (var j = 0; j < noRepeatCategories[i].cars.length; j++) {
                        noRepeatCategories[i].cars[j].index = j;
                    }
                }
                return noRepeatCategories;
            };

            var firstLoad = true;
            $scope.initOption = function (data) {
                $scope.categories = [];
                $scope.book = book;
                $scope.categories = initCategory(data);
                $scope.categories[0].isSelect = true;
                $scope.categories[0].cars[0].isSelect = true;
                $scope.categories[0].cars[0].drivers[0].isSelect = true;
                $scope.carSelected = $scope.categories[0].cars[0];
                $scope.initBagCountAndPassengerCount($scope.carSelected);
                $scope.driverSelected = $scope.categories[0].cars[0].drivers[0];
                $scope.initDriversAndOptions();

                $timeout(function () {
                    if (firstLoad) {
                        $(".accordion").accordion({
                            header: 'h3.myselect',
                            active: false,
                            collapsible: true,
                            heightStyle: "content"
                        });
                    } else {
                        $(".accordion").accordion("refresh");
                        $(".accordion").accordion("option", "active", false);
                    }
                    firstLoad = false;
                }, 0);
            };

            $scope.initDriversAndOptions = function () {
                $scope.options = $scope.carSelected.options;
                $scope.offer = $scope.carSelected.offer;
                $scope.priceFormat = $scope.offer.ccy;
                $scope.accountingPrice();
            };

            $scope.onCarCardClick = function (category, car) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/book-selectdriver.html',
                    controller: 'BookSelectDriverCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: {
                                drivers: car.drivers
                            },
                            event: {
                                ok: function (selectDriver) {
                                    $scope.selectedDriverChange(category, car, selectDriver);
                                    modalInstance.dismiss();
                                },
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }
                    }
                });
            };

            $scope.initBagCountAndPassengerCount = function (selectCar) {
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
            };

            $scope.selectedDriverChange = function (selectCategory, selectCar, selectDriver) {
                angular.forEach($scope.categories, function (category) {
                    if (category.category_id == selectCategory.category_id) {
                        category.isSelect = true;
                        angular.forEach(category.cars, function (car) {
                            if (car.car_id == selectCar.car_id) {
                                if ($scope.bookType == 1 || $scope.bookType == 2) {
                                    if (car.offer.offer_id == selectCar.offer.offer_id) {
                                        car.isSelect = true;
                                        angular.forEach(car.drivers, function (driver) {
                                            if (driver.driver_id == selectDriver.driver_id) {
                                                driver.isSelect = true;
                                            } else {
                                                driver.isSelect = false;
                                            }
                                        })
                                    } else {
                                        car.isSelect = false;
                                        angular.forEach(car.drivers, function (driver) {
                                            driver.isSelect = false;
                                        })
                                    }
                                } else {
                                    car.isSelect = true;
                                    angular.forEach(car.drivers, function (driver) {
                                        if (driver.driver_id == selectDriver.driver_id) {
                                            driver.isSelect = true;
                                        } else {
                                            driver.isSelect = false;
                                        }
                                    })
                                }
                            } else {
                                car.isSelect = false;
                                angular.forEach(car.drivers, function (driver) {
                                    driver.isSelect = false;
                                })
                            }
                        })
                    } else {
                        category.isSelect = false;
                        angular.forEach(category.cars, function (car) {
                            car.isSelect = false;
                            angular.forEach(car.drivers, function (driver) {
                                driver.isSelect = false;
                            })
                        })
                    }
                });

                if ($scope.carSelected.car_id != selectCar.car_id) {
                    $scope.initBagCountAndPassengerCount(selectCar);
                }
                $scope.carSelected = selectCar;
                $scope.driverSelected = selectDriver;
                if ($scope.bookType == 1 || $scope.bookType == 2) {
                    $scope.initDriversAndOptions();
                }
            };

            $scope.initOptionData = function (options) {

                var formatOptions = {number: [], checkBox: [], radioGroup: [], checkBoxGroup: [], numberGroup: []};
                for (var i = 0; i < options.length; i++) {
                    var option = options[i];
                    if (option.type == "NUMBER") {
                        option.count = 0;
                        option.enable = false;
                        if (option.add_max > 1) {
                            formatOptions.number.push(option);
                        } else {
                            formatOptions.checkBox.push(option);
                        }
                    } else if (option.type == "CHECKBOX") {
                        option.count = 0;
                        option.enable = false;
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

            //-------------category ,car , driver , option  解析  end-------------
            //初始化页面控件
            $scope.init = function () {
                //init 选项卡
                $scope.clickOneWay = function () {
                    $scope.options = undefined;
                    book.type = 1;
                    $scope.bookType = 1;
                    $scope.isGetOffer = false;
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
                    $scope.isAirport = false;
                    $scope.isDropAirport = false;
                    $scope.isPickMarkedWords = false;
                    $scope.isDropMarkedWords = false;
                    resetCouponCode();
                };
                $scope.clickHourly = function () {
                    $scope.options = undefined;
                    book.type = 2;
                    $scope.bookType = 2;
                    $scope.isGetOffer = false;
                    $scope.airPort = false;
                    $scope.reAirPort = false;
                    $scope.airLineMessage = null;
                    $scope.airLineCompanyFs = null;
                    $scope.airLineMessageNum = null;
                    $scope.reAirLineMessage = null;
                    $scope.reAirLineCompanyFs = null;
                    $scope.reAirLineMessageNum = null;
                    $scope.bookHourlyAddress = '';
                    $scope.FlightsList = '';
                    $scope.airlineCompanyMessage = '';
                    $scope.dropFlightsList = '';
                    $scope.isAirport = false;
                    $scope.isDropAirport = false;
                    $scope.isPickMarkedWords = false;
                    $scope.isDropMarkedWords = false;
                    resetCouponCode();
                };
                $scope.clickCustomQuote = function () {
                    $scope.options = undefined;
                    book.type = 3;
                    $scope.bookType = 3;
                    $scope.isGetOffer = false;
                    $scope.airPort = false;
                    $scope.reAirPort = false;
                    $scope.airLineMessage = null;
                    $scope.airLineCompanyFs = null;
                    $scope.airLineMessageNum = null;
                    $scope.reAirLineMessage = null;
                    $scope.reAirLineCompanyFs = null;
                    $scope.reAirLineMessageNum = null;
                    $scope.bookCustomAddress = '';
                    $scope.FlightsList = '';
                    $scope.airlineCompanyMessage = '';
                    $scope.dropFlightsList = '';
                    $scope.isAirport = false;
                    $scope.isDropAirport = false;
                    $scope.isPickMarkedWords = false;
                    $scope.isDropMarkedWords = false;
                    resetCouponCode();
                };

                //init datetimepicker
                var date = new Date();
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                book.p2pDatetime = new Date((tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear() + ' ' + "12:00 PM");
                $('.datetimepicker').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: date,
                    defaultDate: book.p2pDatetime,
                    sideBySide: true,
                    locale: $scope.langStyle
                });

                book.hourlyDatetime = new Date((tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear() + ' ' + "12:00 PM");
                $('.datetimepicker2').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: date,
                    defaultDate: book.hourlyDatetime,
                    sideBySide: true,
                    locale: $scope.langStyle
                });

                book.customStartDateTime = new Date((tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear() + ' ' + "12:00 PM");
                $('.datetimepicker3').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: date,
                    defaultDate: book.customStartDateTime,
                    sideBySide: true,
                    locale: $scope.langStyle
                });

                book.customEndDateTime = new Date((tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear() + ' ' + "01:00 PM");
                $('.datetimepicker4').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: date,
                    defaultDate: book.customEndDateTime,
                    sideBySide: true,
                    locale: $scope.langStyle
                });

                //init  mapselect
                $scope.getLocation = function (val) {

                    if ($scope.airPort) {
                        $scope.airPort = false;
                        $scope.FlightsList = '';
                        $scope.airlineCompanyMessage = '';
                        $scope.airLineMessage = null;
                        $scope.airLineCompanyFs = null;
                        $scope.airLineMessageNum = null;
                    }
                    resetCouponCode();
                    $scope.isPickMarkedWords = false;
                    return MapTool.getSearchLocations(val);
                };
                $scope.getDropLocation = function (val) {
                    if ($scope.reAirPort) {
                        $scope.reAirPort = false;
                        $scope.dropFlightsList = '';
                        $scope.airDroplineCompanyMessage = '';
                        $scope.reAirLineMessage = null;
                        $scope.reAirLineCompanyFs = null;
                        $scope.reAirLineMessageNum = null;
                    }
                    resetCouponCode();
                    $scope.isDropMarkedWords = false;
                    return MapTool.getSearchLocations(val);
                };

                $scope.getAirlineCompany = function (val) {
                    if ($scope.haveAirline) {
                        return AirLineTool.matchingAirlineCompany(val, $scope.FlightsList);
                    } else {
                        $scope.airLineMessage = val;
                        $scope.airLineCompanyFs = val;
                    }
                };
                $scope.getDropAirlineCompany = function (val) {
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

                $scope.getAirlineNumber = function (val) {
                    if ($scope.haveAirline) {
                        return AirLineTool.matchingAirlineNumber(val, $scope.airlineCompanyMessage)
                    } else {
                        $scope.airLineMessageNum = val;
                    }
                };

                $scope.getDropAirlineNumber = function (val) {
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

                $scope.onPickUpSearchSelect = function ($item, $model, $label, $event) {

                    $scope.airPort = $item.isAirport;
                    if ($item.isAirport) {
                        $scope.isAirport = true;
                        var pickUpLocation = $item.geometry.location;
                        book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                        var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                        $scope.getFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 0, p2pDatetime);
                    } else {
                        $scope.isAirport = false;
                    }
                    book.pickup = $item;
                    book.pickup.geometry.location = {
                        lat: book.pickup.geometry.location.lat(),
                        lng: book.pickup.geometry.location.lng()
                    };
                    $scope.bookPickUpAddress = $item.formatted_address;
                    $scope.PickUpAddress = $item.formatted_address;

                    // MapTool.geocoderAddress(book.pickup.geometry.location.lat, book.pickup.geometry.location.lng, function (result) {
                    //     $timeout(function () {
                    //         $scope.airPort = result.isAirport;
                    //         if (result.isAirport) {
                    //             $scope.isAirport = true;
                    //             var pickUpLocation = result.geometry.location;
                    //             book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                    //             var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                    //             $scope.getFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 0, p2pDatetime);
                    //         } else {
                    //             $scope.isAirport = false;
                    //         }
                    //         book.pickup = result;
                    //         book.pickup.geometry.location = {
                    //             lat: book.pickup.geometry.location.lat(),
                    //             lng: book.pickup.geometry.location.lng()
                    //         };
                    //         $scope.bookPickUpAddress = result.formatted_address;
                    //         $scope.PickUpAddress = result.formatted_address;
                    //
                    //     }, 0);
                    // }, function (error) {
                    // });
                };

                $(".datetimepicker").on('dp.change', function () {
                    $timeout(function () {
                        if ($scope.isAirport) {
                            $scope.isPickMarkedWords = true;
                            $scope.airPort = true;
                            $scope.FlightsList = '';
                            $scope.airlineCompanyMessage = '';
                            $scope.airLineMessage = null;
                            $scope.airLineCompanyFs = null;
                            $scope.airLineMessageNum = null;
                            book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                            var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                            $scope.getFlightsList(book.pickup.geometry.location.lat, book.pickup.geometry.location.lng, 0, p2pDatetime);
                        }
                        if ($scope.isDropAirport) {
                            $scope.isDropMarkedWords = true;
                            $scope.reAirPort = true;
                            $scope.dropFlightsList = '';
                            $scope.airDroplineCompanyMessage = '';
                            $scope.reAirLineMessage = null;
                            $scope.reAirLineCompanyFs = null;
                            $scope.reAirLineMessageNum = null;
                            book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                            var p2pDropDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                            $scope.getDropFlightsList(book.dropoff.geometry.location.lat, book.dropoff.geometry.location.lng, 1, p2pDropDatetime);
                        }
                    }, 0);
                });

                $scope.onDropOffSearchSelect = function ($item, $model, $label, $event) {
                    book.dropoff = $item;
                    book.dropoff.geometry.location = {
                        lat: book.dropoff.geometry.location.lat(),
                        lng: book.dropoff.geometry.location.lng()
                    };

                    $scope.reAirPort = $item.isAirport;
                    if ($item.isAirport) {
                        $scope.isDropAirport = true;
                        var pickUpLocation = $item.geometry.location;
                        book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                        var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                        $scope.getDropFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 1, p2pDatetime);
                    } else {
                        $scope.isDropAirport = false;
                    }

                    $scope.bookDropOffAddress = $item.formatted_address;

                    // MapTool.geocoderAddress(book.dropoff.geometry.location.lat, book.dropoff.geometry.location.lng, function (result) {
                    //     $timeout(function () {
                    //         $scope.reAirPort = result.isAirport;
                    //         if (result.isAirport) {
                    //             $scope.isDropAirport = true;
                    //             var pickUpLocation = result.geometry.location;
                    //             book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                    //             var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                    //             $scope.getDropFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 1, p2pDatetime);
                    //         } else {
                    //             $scope.isDropAirport = false;
                    //         }
                    //         book.dropoff = result;
                    //         book.dropoff.geometry.location = {
                    //             lat: book.dropoff.geometry.location.lat(),
                    //             lng: book.dropoff.geometry.location.lng()
                    //         };
                    //         $scope.bookDropOffAddress = result.formatted_address;
                    //     }, 0)
                    // }, function (error) {
                    // });
                };

                $scope.onHourlySearchSelect = function ($item, $model, $label, $event) {
                    $timeout(function () {
                        $scope.airPort = $item.isAirport;
                        book.hourlyPickup = $item;
                        book.hourlyPickup.geometry.location = {
                            lat: book.hourlyPickup.geometry.location.lat(),
                            lng: book.hourlyPickup.geometry.location.lng()
                        };
                        if (book.type == 2) {
                            if ($item.isAirport) {
                                $scope.isAirport = true;
                                var pickUpLocation = $item.geometry.location;
                                book.hourlyDatetime = $('.datetimepicker2').data("DateTimePicker").date()._d;
                                var hourlyDatetime = parseInt((new Date(book.hourlyDatetime).valueOf() + "").substr(0, 10));
                                $scope.getFlightsList(pickUpLocation.lat, pickUpLocation.lng, 0, hourlyDatetime);
                            } else {
                                $scope.isAirport = false;
                            }
                            $scope.bookHourlyAddress = $item.formatted_address;
                            $(".datetimepicker2").on('dp.change', function () {
                                $timeout(function () {
                                    if ($scope.isAirport) {
                                        $scope.isPickMarkedWords = true;
                                        $scope.airPort = true;
                                        $scope.FlightsList = '';
                                        $scope.airlineCompanyMessage = '';
                                        $scope.airLineMessage = null;
                                        $scope.airLineCompanyFs = null;
                                        $scope.airLineMessageNum = null;
                                        book.hourlyDatetime = $('.datetimepicker2').data("DateTimePicker").date()._d;
                                        hourlyDatetime = parseInt((new Date(book.hourlyDatetime).valueOf() + "").substr(0, 10));
                                        $scope.getFlightsList(pickUpLocation.lat, pickUpLocation.lng, 0, hourlyDatetime);
                                    }
                                }, 0);
                            });
                        } else {
                            if ($item.isAirport) {
                                $scope.isAirport = true;
                                var pickUpLocation = $item.geometry.location;
                                book.customStartDateTime = $('.datetimepicker3').data("DateTimePicker").date()._d;
                                var appointed_time = parseInt((book.customStartDateTime.valueOf() + "").substr(0, 10));
                                $scope.getFlightsList(pickUpLocation.lat, pickUpLocation.lng, 0, appointed_time);
                            } else {
                                $scope.isAirport = false;
                            }
                            $scope.bookCustomAddress = $item.formatted_address;
                            $(".datetimepicker3").on('dp.change', function () {
                                $timeout(function () {
                                    if ($scope.isAirport) {
                                        $scope.isPickMarkedWords = true;
                                        $scope.airPort = true;
                                        $scope.FlightsList = '';
                                        $scope.airlineCompanyMessage = '';
                                        $scope.airLineMessage = null;
                                        $scope.airLineCompanyFs = null;
                                        $scope.airLineMessageNum = null;
                                        book.customStartDateTime = $('.datetimepicker3').data("DateTimePicker").date()._d;
                                        appointed_time = parseInt((new Date(book.customStartDateTime).valueOf() + "").substr(0, 10));
                                        $scope.getFlightsList(pickUpLocation.lat, pickUpLocation.lng, 0, appointed_time);
                                    }
                                }, 0);
                            });
                        }
                    }, 0);

                };
            };

            $scope.init();

            //user
            $scope.onSearchSelect = function (client) {
                $scope.cards = [];
                CardBS.getFromCurrentUser(client.customer_id).then(function (result) {
                    if (typeof result.data == "string") {
                    } else {
                        angular.forEach(result.data, function (card, index) {
                            if (index == 0) {
                                card.isSelect = true;
                            } else {
                                card.isSelect = false;
                            }
                        });
                        $scope.cards = result.data;
                        $scope.selectedCard = $scope.cards[0];
                    }

                    $timeout(function () {
                        $(".pay-more").click(function () {
                            $(this).nextUntil(1).fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".payment-active").click(function () {
                            $(this).parent().find(".pay-act-panel").fadeIn(200);
                        });
                        $(".card-del-cancel").click(function () {
                            $(this).parents(".pay-act-panel").fadeOut(200);
                        });
                        $(".card-del-ok").click(function () {
                            $(this).parents(".pay-act-panel").fadeOut(200);
                        });
                    }, 0);
                }, function (error) {
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("booking.jsPull_up_payment_info_error"), "error");
                    }
                });
            };

            $scope.onDeleteCardButtonClick = function (index) {
                PaymentBS.deleteCardByClient($scope.customerSelected.customer_id, $scope.cards[index].card_token).then(function (result) {
                    MessageBox.hideLoading();
                    $scope.onSearchSelect($scope.customerSelected);
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast("Delete Failed", "error");
                    }
                });
            };

            $scope.onSelectedCard = function (selectIndex) {
                $timeout(function () {
                    var tempCard = angular.copy($scope.cards);
                    angular.forEach(tempCard, function (card, index) {
                        if (index == selectIndex) {
                            card.isSelect = true;
                        } else {
                            card.isSelect = false;
                        }
                    });

                    $scope.cards = tempCard;
                    $scope.selectedCard = $scope.cards[selectIndex];
                    $scope.$apply();

                    $(".pay-more").click(function () {
                        $(this).nextUntil(1).fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".payment-active").click(function () {
                        $(this).parent().find(".pay-act-panel").fadeIn(200);
                    });
                    $(".card-del-cancel").click(function () {
                        $(this).parents(".pay-act-panel").fadeOut(200);
                    });
                    $(".card-del-ok").click(function () {
                        $(this).parents(".pay-act-panel").fadeOut(200);
                    });
                }, 0);
            };

            $scope.onAddCardClick = function () {
                if (!$scope.customerSelected.customer_id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'templates/dashboard/credit-card-add.html',
                        controller: 'CreditCardAddCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            $stateParams: {
                                data: {
                                    customerId: $scope.data.customer_id
                                },
                                event: {
                                    addSuccess: function () {
                                        modalInstance.dismiss();
                                        $scope.onSearchSelect($scope.data);
                                    },
                                    cancel: function () {
                                        modalInstance.dismiss();
                                    }
                                }
                            }
                        }
                    });
                } else {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'templates/dashboard/credit-card-add.html',
                        controller: 'CreditCardAddCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            $stateParams: {
                                data: {
                                    customerId: $scope.customerSelected.customer_id
                                },
                                event: {
                                    addSuccess: function () {
                                        modalInstance.dismiss();
                                        $scope.onSearchSelect($scope.customerSelected);
                                    },
                                    cancel: function () {
                                        modalInstance.dismiss();
                                    }
                                }
                            }
                        }
                    });
                }

            };

            $scope.getCardType = function (typeId) {
                switch (typeId) {
                    case "1":
                        return "Visa";
                    case "2":
                        return "MasterCard";
                    case "3":
                        return "AmericanExpress";
                    case "4":
                        return "Discover";
                    default:
                        return "";
                }
            };

            $scope.customPriceChanged = function () {
                // resetCouponCode();
                if ($scope.customCost > 0 && $scope.customCost < 1) {
                    $scope.customCost = 1;
                }
                $scope.finalCustomCost = $scope.customCost - $scope.amountOff - $scope.percent_off / 100 * ($scope.customCost - $scope.amountOff);
                if ($scope.finalCustomCost < 0) {
                    $scope.finalCustomCost = 0;
                }
                if ($scope.finalCustomCost > 0 && $scope.finalCustomCost < 1) {
                    $scope.finalCustomCost = 1;
                }
            };

            $scope.onRequestCustomerApprovalChanged = function () {
                if ($scope.customDetermine == 1) {
                    $scope.customDetermine = 0;
                } else {
                    $scope.customDetermine = 1;
                }
            };

            $scope.onAddButtonClick = function () {
                addClient();
            };

            var addClient = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/client-add.html',
                    controller: 'ClientAddCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            event: {
                                addSuccess: function () {
                                    modalInstance.dismiss();
                                    loadData();
                                },
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }
                    }
                });
            };


            $scope.$watchGroup(['bookPickUpAddress', 'bookDropOffAddress',
                    'bookHourlyAddress', 'hourlyDate', 'bookCustomAddress'],
                function (n, o) {
                    nWatchedModelChangeCount++;
                });

            $scope.$on('$locationChangeStart', function (event, newUrl) {
                if (nWatchedModelChangeCount <= 1) return;
                event.preventDefault();
                MessageBox.confirm(T.T('alertTitle.warning'), T.T('booking.jsExit_easy_book_warning'), function (isConfirm) {
                    if (isConfirm) {
                        $timeout(function () {
                            var index = newUrl.toString().indexOf('#/');
                            if (index > -1) {
                                var state = newUrl.toString().substring(index + 2);
                                $state.go(state);
                            }
                        }, 10);
                    }
                });
            });
            $scope.onAddClientClick = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/client-add.html',
                    controller: 'ClientAddCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            event: {
                                addSuccess: function (data) {
                                    modalInstance.dismiss();
                                },
                                cancel: function () {
                                    modalInstance.dismiss();
                                },
                                Data: function (data) {
                                    $scope.data = {customer_id: ''};
                                    $scope.customerSelected = data.data.first_name + ' ' + data.data.last_name;
                                    $scope.data.customer_id = data.data.customer_id;
                                    $scope.onSearchSelect($scope.data);

                                }
                            }
                        }
                    }
                });
            };
            $scope.getFlightsList = function (lat, lng, type, time) {
                AirLineTool.getFlightsList(lat, lng, type, time).then(function (result) {
                    if (result.data.code == '2100') {
                        $scope.haveAirline = false;
                    } else {
                        $scope.haveAirline = true;
                        $scope.FlightsList = result.data.result;
                    }
                }, function (error) {
                    console.log(error);
                });
            };

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

            function resetCouponCode() {
                $scope.promo_code_shown = false;
                $scope.checkingCode = true;
                $scope.couponCode = '';
                $scope.amountOff = 0;
                $scope.percent_off = 0;
                $scope.finalCustomCost = 0;
                $scope.haveVerifyCode = false;
            }

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
                    MessageBox.toast(T.T('booking.jsPromo_Code_Not_Null'), 'error');
                    return;
                }

                var ladda = Ladda.create($event.target);
                ladda.start();

                
                //$scope.bookTime.p2pPickupTime = book.p2pDatetime.valueOf();

                /*BookBS.verifyCoupon($rootScope.loginUser.company_id, $scope.couponCode).then(
                    function (result) {
                        console.log(result);
                        if (!result.data.valid) {
                            MessageBox.toast(T.T('alertTitle.error'), T.T('booking.jsCode_Used'), 'error');
                        } else {
                            if (result.data.percent_off == null) {
                                $scope.percent_off = 0;
                            } else {
                                $scope.percent_off = result.data.percent_off;
                            }
                            $scope.amountOff = result.data.amount_off;
                            $scope.haveVerifyCode = true;
                            if ($scope.bookType !== 3) {
                                $scope.accountingPrice();
                            } else {
                                $scope.finalCustomCost = $scope.customCost - $scope.amountOff - $scope.percent_off / 100 * ($scope.customCost - $scope.amountOff);
                            }
                        }
                        $scope.checkingCode = false;
                        ladda.stop();
                    }, function (error) {
                        $scope.checkingCode = false;
                        ladda.stop();
                        MessageBox.toast(T.T('booking.jsCoupon_Not_Valid'), 'error');
                    }
                );*/
            };
        }
    );
