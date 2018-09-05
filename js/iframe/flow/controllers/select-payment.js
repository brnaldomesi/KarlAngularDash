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