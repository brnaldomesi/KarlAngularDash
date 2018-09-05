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