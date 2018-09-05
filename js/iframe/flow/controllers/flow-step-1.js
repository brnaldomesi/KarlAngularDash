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