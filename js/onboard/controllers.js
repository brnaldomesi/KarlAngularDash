/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers', []);
/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('DriverAddCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox, VerifyBS,T) {
        angular.element('#addDriverForm').validator();
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }
        $scope.selectedCars = undefined;
        $scope.unselectedCars = angular.copy($rootScope.carList);
        if ($scope.unselectedCars == undefined) {
            $scope.unselectedCars = [];
        }

        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };

        if(localStorage.getItem('lang')==='fr'){
            $scope.timeClock = angular.copy(frTimeClock);
        }else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.savingDriver = false;

        $scope.car_select_id = 0;
        $scope.firstName = undefined;
        $scope.lastName = undefined;
        $scope.email = undefined;
        $scope.mobile = undefined;
        $scope.routine = angular.copy(DriverRoutineDefault);
        $scope.preTimes = angular.copy(DriverDelayTime);
        $scope.pre_time = 1;
        $scope.editEmailDisable = false;
        $scope.editMobileDisable = false;


        var templateFirstName;
        var templateLastName;
        var templateMobile;
        var templateEmail;

        $scope.editFirstName = function () {
            templateFirstName = $scope.firstName;
        };
        $scope.editLastName = function () {
            templateLastName = $scope.lastName;
        };

        $scope.editEmailContent = function () {
            var match = false;
            angular.forEach($rootScope.driverList , function (driver) {
                if(driver.email == $scope.email){
                    match = true;
                }
            });

            if (match){
                MessageBox.toast(T.T('board_add_driver.jsEmail_has_used'),'error');
                return;
            }

            templateEmail = $scope.email;

            if($rootScope.admin.email == $scope.email){
                $scope.editEmailDisable = true;

                $scope.firstName = $rootScope.admin.first_name;
                $scope.lastName = $rootScope.admin.last_name;
                $scope.mobile = $rootScope.admin.mobile;

            }else{
                $scope.editEmailDisable = false;
                $scope.firstName = templateFirstName;
                $scope.lastName = templateLastName;
                $scope.mobile = templateMobile;
            }
        };
        $scope.editMobileContent = function () {
            var match = false;
            angular.forEach($rootScope.driverList , function (driver) {
                if(driver.mobile == $scope.mobile){
                    match = true;
                }
            });

            if(match){
                MessageBox.toast(T.T('board_add_driver.jsMobile_has_used'),'error');
                return;
            }

            templateMobile = $scope.mobile;

            if($rootScope.admin.mobile == $scope.mobile){
                $scope.editMobileDisable = true;

                $scope.firstName = $rootScope.admin.first_name;
                $scope.lastName = $rootScope.admin.last_name;
                $scope.email = $rootScope.admin.email;

            }else{
                $scope.editMobileDisable = false;
                $scope.firstName = templateFirstName;
                $scope.lastName = templateLastName;
                $scope.email = templateEmail;
            }
        };


        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        $scope.selectCarId = function () {
            console.log('car_select_id is', $scope.car_select_id);
            if ($scope.car_select_id == undefined) {
                return;
            }
            for (var i = 0; i < $scope.unselectedCars.length; i++) {
                if ($scope.unselectedCars[i].car_id == $scope.car_select_id) {
                    var key = i;
                    break;
                }
            }

            var car = $scope.unselectedCars[key];
            if ($scope.selectedCars == undefined) {
                $scope.selectedCars = new Array(car);
            } else {
                $scope.selectedCars.push(car);
            }
            $scope.unselectedCars.splice(key, 1);
        };

        $scope.removeCars = function (key) {
            var car = $scope.selectedCars[key];
            $scope.unselectedCars.push(car);
            $scope.selectedCars.splice(key, 1);
        };

        $scope.addNewDriver = function ($event) {
            if($scope.savingDriver){
                return;
            }
            $scope.savingDriver = true;
            if ($scope.firstName == undefined || $scope.firstName.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsFirst_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.lastName == undefined || $scope.lastName.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsLast_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.email == undefined || $scope.email.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsEmail_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.mobile == undefined || $scope.mobile.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsMobile_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            var cars = '';
            angular.forEach($scope.selectedCars, function (car) {
                    cars += car.car_id + ",";
            });
            if (cars != '') {
                cars = cars.substring(0, cars.length - 1)
            }


            var driver = {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                mobile: $scope.mobile,
                email: $scope.email,
                routine: $scope.routine,
                routineCodeArray:VerifyBS.routineConversions($scope.routine),
                pre_time: $scope.pre_time,
                selectedCars: $scope.selectedCars,
                unselectedCars: $scope.unselectedCars,
                cars: cars
            };
            var ladda = Ladda.create($event.target);
            ladda.start();
            if(!$scope.editEmailDisable&&!$scope.editMobileDisable){
                driver.lang=$rootScope.comapnyLang;
                console.log(driver);
                VerifyBS.addDrivers(driver)
                    .then(
                    function (result) {
                        driver.driver_id = result.data.driver_id;
                        if ($rootScope.driverList == undefined) {
                            $rootScope.driverList = new Array(driver);
                        } else {
                            $rootScope.driverList.push(driver);
                        }
                        $scope.savingDriver = false;
                        ladda.stop();
                        $state.go('driver');
                    }, function (error) {
                        $scope.savingDriver = false;
                        ladda.stop();
                        if (error.treated) {
                        } else {
                            if (error.response.data.code == "3100") {
                                MessageBox.toast(T.T('board_add_driver.jsUsername_used'), 'error');
                            } else if (error.response.data.code == "3101") {
                                MessageBox.toast(T.T('board_add_driver.jsMobile_used'), 'error');
                            } else if (error.response.data.code == "3102") {
                                MessageBox.toast(T.T('board_add_driver.jsEmail_used'), 'error');
                            }
                        }
                    }
                );
            }else {
                driver.lang=window.localStorage.lang;
                console.log(driver);
                VerifyBS.addAddAdminAsDriver(driver,VerifyBS.routineConversions($scope.routine)).then(function (result) {
                    ladda.stop();
                    $scope.savingDriver = false;
                    driver.driver_id = result.data.id;
                    if ($rootScope.driverList == undefined) {
                        $rootScope.driverList = new Array(driver);
                    } else {
                        $rootScope.driverList.push(driver);
                    }
                    $state.go('driver');
                }, function (error) {
                    ladda.stop();
                    $scope.savingDriver = false;
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "3001") {
                            MessageBox.toast(T.T('board_add_driver.jsParam_error'), 'error');
                        } else if (error.response.data.code == "3300") {
                            MessageBox.toast(T.T('board_add_driver.jsAlready_exist'), 'error');
                        }
                    }
                });
            }

        };


        $scope.checkChanged = function (line) {
            $scope.routine[line].work = !$scope.routine[line].work;
        };

        $scope.selectWorkHour = function (index, startOrEnd) {
            if (startOrEnd) {
                if ($scope.routine[index].start >= $scope.routine[index].end) {
                    $scope.routine[index].start = $scope.routine[index].end - 1;
                }
            } else {
                if ($scope.routine[index].end <= $scope.routine[index].start) {
                    $scope.routine[index].end = $scope.routine[index].start + 1;
                }
            }
        };

        $scope.backEvent = function(){
            if($rootScope.driverList == undefined || $rootScope.driverList.length == 0 ){
                $state.go('vehicle');
            }else{
                $state.go('driver');
            }
        }
    });

/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('DriverEditCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox,VerifyBS,T) {
        angular.element('#editDriverForm').validator();
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }
        var driverIndex = $rootScope.driverIndex;
        $scope.driver = angular.copy($rootScope.driverList[driverIndex]);
        $scope.car_select_id = undefined;
        if(localStorage.getItem('lang')==='fr'){
            $scope.timeClock = angular.copy(frTimeClock);
        }else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.preTimes = angular.copy(DriverDelayTime);
        $scope.savingDriver = false;
        $scope.editDisable = ($scope.driver.email == $rootScope.admin.email) || ($scope.driver.mobile == $rootScope.admin.mobile) ;
        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };


        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        $scope.selectCarId = function () {
            if ($scope.car_select_id == undefined) {
                return;
            }
            for (var i = 0; i < $scope.driver.unselectedCars.length; i++) {
                if ($scope.driver.unselectedCars[i].car_id == $scope.car_select_id) {
                    var key = i;
                    break;
                }
            }

            var car = $scope.driver.unselectedCars[key];
            if ($scope.driver.selectedCars == undefined) {
                $scope.driver.selectedCars = new Array(car);
            } else {
                $scope.driver.selectedCars.push(car);
            }
            $scope.driver.unselectedCars.splice(key, 1);
        };

        $scope.removeCars = function (key) {
            var car = $scope.driver.selectedCars[key];
            $scope.driver.unselectedCars.push(car);
            $scope.driver.selectedCars.splice(key, 1);
        };

        $scope.updateCurrentDriver = function ($event) {
            if($scope.savingDriver){
                return;
            }
            $scope.savingDriver = true;
            if ($scope.driver.firstName == undefined || $scope.driver.firstName.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsFirst_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.driver.lastName == undefined || $scope.driver.lastName.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsLast_name_null'), 'error');
                return;
            }
            if ($scope.driver.email == undefined || $scope.driver.email.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsEmail_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.driver.mobile == undefined || $scope.driver.mobile.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsMobile_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            var cars = '';
            angular.forEach($scope.driver.selectedCar, function (car) {
                if (car.selected == 1) {
                    cars += car.car_id + ",";
                }
            });
            if (cars != '') {
                cars = cars.substring(0, cars.length - 1)
            }
            $scope.driver.cars = cars;
            $scope.driver.routineCodeArray = VerifyBS.routineConversions($scope.driver.routine);
            var ladda = Ladda.create($event.target);
            ladda.start();
            VerifyBS.updatedDriver($scope.driver)
                .then(function (result) {
                    $scope.savingDriver = false;
                    ladda.stop();
                    $rootScope.driverList[driverIndex] = $scope.driver;
                    $state.go('driver');
                },function (error) {
                    $scope.savingDriver = false;
                    ladda.stop();
                });
        };


        $scope.deleteCurrentDriver = function () {
            VerifyBS.deleteCurrentDriver($scope.driver.driver_id)
                .then(function (result) {
                    $rootScope.driverList.splice(driverIndex,1);
                    $state.go('driver');
                },function (error) {
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "3100") {
                            MessageBox.toast(T.T('board_add_driver.jsUsername_used'), 'error');
                        } else if (error.response.data.code == "3101") {
                            MessageBox.toast(T.T('board_add_driver.jsMobile_used'), 'error');
                        } else if (error.response.data.code == "3102") {
                            MessageBox.toast(T.T('board_add_driver.jsEmail_used'), 'error');
                        }
                    }
                });
        };

        $scope.checkChanged = function (line) {
            $scope.driver.routine[line].work = !$scope.driver.routine[line].work;
        };
        $scope.selectWorkHour = function (index, startOrEnd) {
            if (startOrEnd) {
                if ($scope.driver.routine[index].start >= $scope.driver.routine[index].end) {
                    $scope.driver.routine[index].start = $scope.driver.routine[index].end - 1;
                }
            } else {
                if ($scope.driver.routine[index].end <= $scope.driver.routine[index].start) {
                    $scope.driver.routine[index].end = $scope.driver.routine[index].start + 1;
                }
            }
        };

        $scope.backEvent = function(){
            $state.go('driver');
        }
    });

/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('DriverCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox,VerifyBS,T) {
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }

        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        $scope.driverList = $rootScope.driverList;
        if($scope.driverList == null || $scope.driverList.length==0){
            $state.go('driver-add');
        }else {
            $scope.driver = $scope.driverList[0];
            $timeout(function () {
                $("body").find(".vehicle-item").eq(0).addClass("vehicle-active");
            },100);
        }

        if(localStorage.getItem('lang')==='fr'){
            $scope.timeClock = angular.copy(frTimeClock);
        }else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.editDriver = function(index){
            $rootScope.driverIndex = index;
            $state.go('driver-edit');
        };

        $scope.addAnotherDriver = function () {
            $state.go('driver-add');
        };

        $scope.switchDriver = function (index) {
            $scope.driver = $scope.driverList[index];
        };

        $scope.nextToFinish = function (){
            $state.go('finish');
        };
        $scope.backToVehicle = function (){
            $state.go('vehicle');
        };
    });

/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('FinishCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox,VerifyBS,T) {
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }

        $scope.dashboardUrl = DashboardUrl;

        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };
    });

/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('HomeCtrl', function ($log, $scope, $rootScope, $state, $http, $uibModal, $location, $timeout, MessageBox, VerifyBS, stripe,MapTool,T,$filter,$translate) {
        angular.element('#companyAndAdmin').validator();
        angular.element('#payment-form').validator();

        $scope.lang= window.localStorage.lang;
        console.log($scope.lang)
        $rootScope.carIndex = undefined;
        $rootScope.driverIndex = undefined;
        $rootScope.carList = undefined;
        $rootScope.driverList = undefined;
        $rootScope.admin = undefined;
        $rootScope.token = undefined;
        $rootScope.comapnyLang = 'en';
        $rootScope.saleId = "FRA02";

        $scope.companyName = null;
        $scope.firstName = null;
        $scope.lastName = null;
        $scope.email = null;
        $scope.mobile = null;
        $scope.tcp = null;
        $scope.locationList = USAStates;
        $scope.zip = null;
        $scope.currencyList=countryCurrency;
        $scope.selectCurrency='US';
        $scope.selectCountry='';
        // $scope.comapnyLang='en';
        $scope.couponCode = '';

        $scope.promo_code_shown = false;
        var price = 0;
        $scope.servicePrice = '--';
        $scope.servicePriceSuffix = T.T('board_home.jsOne_time_fee');
        $scope.commitButtonTxt = T.T('board_home.jsBuy_Now');
        $scope.checkPaymentInfo = false;
        $scope.priceShow = false;

        $scope.haveVerifyCode = false;

        $scope.check = false;
        $scope.canBuy = false;

        $scope.checkingCode = false;

        var order_id = undefined;
        var card_token = undefined;

        $scope.card = {
            number: '',
            exp_month: '',
            exp_year: '',
            cvc: '',
            address_zip:''
        };

        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        var initLanguage=function () {
            // todo
            if(window.localStorage.lang){
                $scope.cur_lang = window.localStorage.lang;
            }else {
                $scope.cur_lang = navigator.language.toLocaleLowerCase();
            }
            if($scope.cur_lang!='en'&&$scope.cur_lang!='fr'){
                $scope.cur_lang='en'
            }
            $translate.use($scope.cur_lang);
        };


        $scope.switching=function () {
            console.log($scope.cur_lang);
            window.localStorage.lang = $scope.cur_lang;
            window.location.reload();
            $translate.use($scope.cur_lang);
        };

        $scope.showPromoCodeLine = function () {
            $scope.promo_code_shown = true;
            $scope.checkingCode = false;
        };
        $scope.dismissPromoCodeLine = function () {
            if($scope.checkingCode){
                return;
            }
            $scope.promo_code_shown = false;
            $scope.checkingCode = true;
        };


        var initData = function () {
            initLanguage();
            VerifyBS.getAllCarsModels().then(function (result) {
                $rootScope.brands = result.data;
            }, function (error) {
                if (error.treated) {

                } else {

                }
            });

            VerifyBS.getServicePrice()
                .then(function (result) {
                    var servicePrice;
                    var ButtonTxt;
                    var PriceSuffix;
                    if (!result.data.active) {
                        MessageBox.toast(T.T('board_home.jsError_service_stop'), 'error');
                    } else {
                        if(result.data.price === 0){
                            if($scope.lang==='fr'){
                                servicePrice="GRATUIT !!!";
                                ButtonTxt="Recevoir mes accès"
                            }else {
                                servicePrice="Free!";
                                ButtonTxt="Send My Login Credentials"
                            }
                            $scope.servicePrice = servicePrice;
                            // $scope.servicePriceSuffix = "$997";
                            $scope.servicePriceSuffix = $filter('princeTranslateFilters')(997);
                            $scope.commitButtonTxt = ButtonTxt;
                            $scope.checkPaymentInfo = false;
                            $scope.priceShow = true;
                        }else{
                            if($scope.lang==='fr'){
                                PriceSuffix="/ frais d'entrée"
                            }else {
                                PriceSuffix="/ one time fee"
                            }
                            price =  result.data.price / 100.0;
                            // $scope.servicePrice = "$" + price;
                            $scope.commitButtonTxt = T.T('board_home.jsBuy_Now');
                            $scope.servicePrice = $filter('princeTranslateFilters')(price);
                            $scope.servicePriceSuffix = PriceSuffix;
                            $scope.checkPaymentInfo = true;
                            $scope.priceShow = false;
                        }
                        $scope.canBuy = true;
                    }
                }, function (error) {
                    if (error.treated) {

                    } else {
                        MessageBox.toast(T.T('board_home.jsError_price'), 'error');
                    }
                });
        };
        initData();

        $scope.getCouponCode = function ($event) {
            if($scope.checkingCode){
                return;
            }
            $scope.checkingCode = true;

            if ($scope.couponCode == null || $scope.couponCode == undefined || $scope.couponCode.trim(' ') == '') {
                $scope.checkingCode = false;
                MessageBox.toast(T.T('board_home.jsPromo_code_null'), 'error');
                return;
            }

            var ladda = Ladda.create($event.target);
            ladda.start();
            VerifyBS.verifyCoupon($scope.couponCode).then(
                function (result) {
                    if (!result.data.valid) {
                        MessageBox.toast(T.T('board_home.jsError_code_used'), 'error');
                    } else {
                        price = price - result.data.amount_off / 100;
                        // $scope.servicePrice = "$" + price;
                        $scope.servicePrice = $filter('princeTranslateFilters')(price);
                        $scope.haveVerifyCode = true;
                    }
                    $scope.checkingCode = false;
                    ladda.stop();
                }, function (error) {
                    $scope.checkingCode = false;
                    ladda.stop();
                    MessageBox.toast(T.T('board_home.jsCoupon_not_valid'), 'error');
                }
            );
        };
        var createCompany = function (ladda) {
            var currency;
            for(var i=0;i<countryCurrency.length;i++){
                if($scope.selectCurrency==countryCurrency[i].country){
                    currency=countryCurrency[i].currency
                }
            }
            var company = {
                name: $scope.companyName,
                address: JSON.stringify($scope.address),
                lat: $scope.lat,
                lng: $scope.lng,
                tcp: $scope.tcp,
                ccy: currency,
                sale_id: $scope.saleId,
                lang:$rootScope.comapnyLang,
                country:$scope.selectCountry
            };
            var admin = {
                first_name: $scope.firstName,
                last_name: $scope.lastName,
                mobile: $scope.mobile,
                email: $scope.email,
                lang:$scope.cur_lang
            };
            console.log(company);
            console.log($scope.selectCountry);
            VerifyBS.addCompany(JSON.stringify(company),
                JSON.stringify(admin),
                card_token, $scope.couponCode).
            then(function (result) {
                $rootScope.admin = admin;
                console.log('add company result ', result);
                MessageBox.toast(T.T('board_home.jsEnter_com_detail'));
                $rootScope.token = result.data.token;
                $state.go('vehicle');
                $scope.canBuy = true;
                ladda.stop();
            }, function (error) {
                $scope.canBuy = true;
                ladda.stop();
                console.log('add company error ', error);
                if (error.treated) {
                } else {
                    if (error.response.data.code == "3301") {
                        MessageBox.toast(T.T('board_home.jsPromo_code_error'), 'error');
                    } else if (error.response.data.code == "3303") {
                        MessageBox.toast(T.T('board_home.jsSaleIdNotExist'), 'error');
                    } else if (error.response.data.code == "3300") {
                        MessageBox.toast(T.T('board_home.jsCompany_already_exit'), 'error');
                    } else if (error.response.data.code == "3100") {
                        MessageBox.toast(T.T('board_home.jsAdmin_username_used'), 'error');
                    } else if (error.response.data.code == "3101") {
                        MessageBox.toast(T.T('board_home.jsAdmin_mobile_used'), 'error');
                    } else if (error.response.data.code == "3102") {
                        MessageBox.toast(T.T('board_home.jsAdmin_email_used'), 'error');
                    }
                }
            })
        };

        var createCardToken = function (ladda) {
            stripe.card.createToken($scope.card)
                .then(function (response) {
                    card_token = response.id;
                    createCompany(ladda);
                })
                .then(function (payment) {
                    console.log('successfully submitted payment for $', payment);
                })
                .catch(function (err) {
                    $scope.canBuy = true;
                    ladda.stop();
                    MessageBox.toast(T.T('board_home.jsCheck_card_info'), 'error');
                });
        };

        $scope.submitCompanyAndAdmin = function ($event) {
            var currency;
            for(var i=0;i<countryCurrency.length;i++){
                if($scope.selectCurrency==countryCurrency[i].country){
                    currency=countryCurrency[i].currency
                }
            }
            if (!$scope.canBuy) {
                return;
            }
            $scope.canBuy = false;

            if ($scope.companyName == null || $scope.companyName == undefined || $scope.companyName.trim(' ') == '') {
                $scope.canBuy = true;
                MessageBox.toast(T.T('board_home.jsCompany_name_null'), 'error');
                return;
            }
            if ($scope.firstName == null || $scope.firstName == undefined || $scope.firstName.trim(' ') == '') {
                MessageBox.toast(T.T('board_home.jsAdmin_first_name_null'), 'error');
                $scope.canBuy = true;

                return;
            }
            if ($scope.lastName == null || $scope.lastName == undefined || $scope.lastName.trim(' ') == '') {
                MessageBox.toast(T.T('board_home.jsAdmin_last_name_null'), 'error');
                $scope.canBuy = true;

                return;
            }
            if ($scope.email == null || $scope.email == undefined || $scope.email.trim(' ') == '') {
                MessageBox.toast(T.T('board_home.jsAdmin_email_null'), 'error');
                $scope.canBuy = true;

                return;
            }
            if ($scope.mobile == null || $scope.mobile == undefined || $scope.mobile.trim(' ') == '') {
                MessageBox.toast(T.T('board_home.jsAdmin_mobile_null'), 'error');
                $scope.canBuy = true;

                return;
            }
            if ($scope.tcp == null || $scope.tcp == undefined || $scope.tcp.trim(' ') == '') {
                MessageBox.toast(T.T('board_home.jsCompany_tcp_null'), 'error');
                $scope.canBuy = true;

                return;
            }
            if ($scope.formatted_address == null || $scope.formatted_address == undefined || $scope.formatted_address.trim(' ') == '') {
                MessageBox.toast(T.T('board_home.jsCompany_street_null'), 'error');
                $scope.canBuy = true;

                return;
            }
            if($scope.saleId == null || $scope.saleId == undefined || $scope.saleId.trim(' ')==''){
                MessageBox.toast(T.T('board_home.jsSaleId'));
                $scope.canBuy = true;
                return;
            }
            if($scope.promo_code_shown&&!$scope.haveVerifyCode){
                MessageBox.toast(T.T('board_home.jsVerify_promo'));
                $scope.canBuy = true;
                return;
            }


            if($scope.checkPaymentInfo){
                if (
                    $scope.card.number == '' || $scope.card.number.trim(' ') == '' ||
                    $scope.card.exp_month == '' || $scope.card.exp_month.trim(' ') == '' ||
                    $scope.card.exp_year == '' || $scope.card.exp_year.trim(' ') == '' ||
                    $scope.card.address_zip == '' || $scope.card.address_zip.trim(' ') == '' ||
                    $scope.card.cvc == '' || $scope.card.cvc.trim(' ') == ''
                ) {
                    $scope.canBuy = true;
                    MessageBox.toast(T.T('board_home.jsCheck_card_info'), 'error');
                    return;
                }
            }

            var ladda = Ladda.create($event.target);
            ladda.start();
            if($scope.checkPaymentInfo){
                createCardToken(ladda);
            }else{
                card_token="";
                createCompany(ladda);
            }
        };

        $scope.getLocation = function (val) {
            return MapTool.getSearchLocations(val);
        };

        $scope.onAddressSelect = function ($item, $model, $label, $event) {
            MapTool.geocoderAddress($item.geometry.location.lat(),$item.geometry.location.lng(),function (result) {
                console.log(result)
                $timeout(function () {
                    $scope.selectCurrency=analysisAddressCountry(result);
                    $scope.address = result;
                    $scope.address.geometry.location = {
                        lat:$scope.address.geometry.location.lat(),
                        lng:$scope.address.geometry.location.lng()
                    };
                    $scope.address.latlng = {
                        lat:$scope.address.geometry.location.lat,
                        lng:$scope.address.geometry.location.lng
                    };
                    $scope.formatted_address = result.formatted_address;
                    $scope.address_number = MapTool.analysisAddressNumber(result);
                    $scope.address_code_postal = MapTool.analysisAddressCodePostal(result);
                },0);
            },function (error) {});
            $scope.address = angular.copy($item);
            $scope.address.geometry.location = {
                lat:$scope.address.geometry.location.lat(),
                lng:$scope.address.geometry.location.lng()
            };
            $scope.address.latlng = {
                lat:$scope.address.geometry.location.lat,
                lng:$scope.address.geometry.location.lng
            };
            $scope.formatted_address = $item.vicinity+' '+$item.name;
            $scope.lat = $item.geometry.location.lat();
            $scope.lng = $item.geometry.location.lng();
        };

        $scope.selectLocationOnMap = function () {
            var locationData = 0;
            if ($scope.address) {
                locationData = angular.copy($scope.address);
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
                                $scope.selectCurrency=analysisAddressCountry(data);
                                $scope.address = angular.copy(data);
                                $scope.address.geometry.location = {
                                    lat:$scope.address.latlng.lat,
                                    lng:$scope.address.latlng.lng
                                };
                                $scope.formatted_address = data.formatted_address;
                                $scope.address_number = MapTool.analysisAddressNumber(data);
                                $scope.address_code_postal = MapTool.analysisAddressCodePostal(data);
                                $scope.lat = data.latlng.lat;
                                $scope.lng = data.latlng.lng;
                            }
                            modalInstance.dismiss();
                        }
                    }
                }
            });
        };

        var analysisAddressCountry=function (address) {
            var addressCountry = '';
            if (address && address.address_components && address.address_components.length > 0) {
                for (var i = 0; i < address.address_components.length; i++) {
                    var find = false;
                    if (address.address_components[i].types && address.address_components[i].types.length > 0) {
                        for (var j = 0; j < address.address_components[i].types.length; j++) {
                            if (address.address_components[i].types[j] == "country") {
                                addressCountry = address.address_components[i].short_name;
                                $scope.selectCountry = address.address_components[i].short_name;
                                if(addressCountry=='FR'){
                                    $rootScope.comapnyLang='fr'
                                }else {
                                    $rootScope.comapnyLang='en'
                                }
                                find = true;
                                break;
                            }
                        }
                    }
                    if (find) {
                        break;
                    }
                }
            }
            for(var k=0;k<EuropeCountry.length;k++){
                if(addressCountry==EuropeCountry[k]){
                    addressCountry='EURO'
                }
            }
            var haveCountry=false;
            for(var h=0;h<countryCurrency.length;h++){
                if(addressCountry==countryCurrency[h].country){
                    haveCountry=true;
                }
            }
            if(!haveCountry){
                addressCountry='US'
            }
            return addressCountry;
        };

    });

/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('VehicleAddCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox, VerifyBS,T) {
        if ($rootScope.token == null || $rootScope.token == '') {
            $state.go('home');
        }
        var vehicle = {};

        $scope.canSave = true;
        $scope.notEmpty = ($rootScope.carList == null)||($rootScope.carList.length == 0);

        $scope.brands = undefined;
        $scope.brandModels = undefined;
        $scope.brand_id = undefined;
        var carBrand = undefined;
        $scope.model_id = undefined;
        var carModel = undefined;
        $scope.color = undefined;
        $scope.year = undefined;
        $scope.license = undefined;


        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };

        $scope.backEvent = function () {
            if ($rootScope.carList == null) {
                $rootScope.token = null;
                $state.go('home');
            } else {
                $state.go('vehicle');
            }
        };

        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        $scope.selectCarBrands = function () {
            angular.forEach($scope.brands, function (brand) {
                if (brand.car_brand_id == $scope.brand_id) {
                    carBrand = brand;
                    $scope.brandModels = brand.car_models;
                    carModel = brand.car_models[0];
                    $scope.model_id = brand.car_models[0].car_model_id;
                    return false;
                }
            });
        };
        $scope.selectCarBrandModels = function () {
            angular.forEach($scope.brandModels, function (model) {
                if (model.car_model_id == $scope.model_id) {
                    carModel = model;
                }
            })
        };

        var initBrandAndModel = function () {
            $scope.brandModels = $scope.brands[0].car_models;

            carBrand = $scope.brands[0];
            $scope.brand_id = carBrand.car_brand_id;
            carModel = $scope.brandModels[0];
            $scope.model_id = $scope.brandModels[0].car_model_id;
        };

        var initData = function () {
            VerifyBS.getAllCarsModels().then(function (result) {
                $scope.brands = result.data;
                $rootScope.brands = $scope.brands;
                initBrandAndModel();
            }, function (error) {
                //TODO
                if (error.treated) {

                } else {

                }
            })
        };
        if ($rootScope.brands == undefined) {
            initData();
        } else {
            $scope.brands = $rootScope.brands;
            initBrandAndModel();
        }

        $scope.addNewCars = function ($event) {
            if (!$scope.canSave) {
                return;
            }
            $scope.canSave = false;
            if ($scope.year == undefined || $scope.year.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_vehicle.jsYear_null'), 'error');
                $scope.canSave = true;
                return;
            }

            if ($scope.color == undefined || $scope.color.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_vehicle.jsColor_null'), 'error');
                $scope.canSave = true;
                return;
            }

            if ($scope.brand_id == undefined) {
                MessageBox.toast(T.T('board_add_vehicle.jsBrand_null'), 'error');
                $scope.canSave = true;
                return;
            }

            if ($scope.model_id == undefined) {
                MessageBox.toast(T.T('board_add_vehicle.jsModel_null'), 'error');
                $scope.canSave = true;
                return;
            }
            if ($scope.license == undefined || $scope.license.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_vehicle.jsLicense_null'), 'error');
                $scope.canSave = true;
                return;
            }

            vehicle.year = $scope.year;
            vehicle.color = $scope.color;
            vehicle.license = $scope.license;
            vehicle.brand_id = $scope.brand_id;
            vehicle.brand_name = carBrand.car_brand_name;
            vehicle.model_id = $scope.model_id;
            vehicle.bags_max = carModel.bags_max;
            vehicle.seats_max = carModel.seats_max;
            vehicle.model_name = carModel.car_model_name;
            vehicle.model_img_id = carModel.model_imgs[0].image_id;
            var ladda = Ladda.create($event.target);
            ladda.start();
            VerifyBS.addCars(
                vehicle,{
                    0: "000000000000000000000000000000000000000000000000",
                    1: "000000000000000000000000000000000000000000000000",
                    2: "000000000000000000000000000000000000000000000000",
                    3: "000000000000000000000000000000000000000000000000",
                    4: "000000000000000000000000000000000000000000000000",
                    5: "000000000000000000000000000000000000000000000000",
                    6: "000000000000000000000000000000000000000000000000"
                }
            ).then(
                function (result) {
                    vehicle.car_id = result.data.id;
                    vehicle.selected = 0;
                    if ($rootScope.carList == null) {
                        $rootScope.carList = new Array(vehicle);
                    } else {
                        $rootScope.carList.push(vehicle);
                    }
                    $state.go('vehicle');
                    $scope.canSave = true;
                    ladda.stop();
                }, function (error) {
                    $scope.canSave = true;
                    MessageBox.toast(T.T('board_add_vehicle.jsAdd_vehicle_fault'), 'error');
                    ladda.stop();
                }
            );
        }

    });

/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('VehicleEditCtrl', function ($log, $scope, $rootScope,$stateParams,$state, $uibModal, $location, $timeout, MessageBox,VerifyBS,T) {
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }
        var index = $rootScope.carIndex;
        $scope.car = angular.copy($rootScope.carList[index]);
        $scope.brands = undefined;
        $scope.brandModels = undefined;

        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };


        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        var loopBrandAndModels = function () {
            angular.forEach($scope.brands,function (brand) {
                if(brand.car_brand_id == $scope.car.brand_id){
                    $scope.brandModels = brand.car_models;
                }
            });
        };

        var initData = function () {
            VerifyBS.getAllCarsModels().then(function (result) {
                $scope.brands = result.data;
                $rootScope.brands = $scope.brands;
                loopBrandAndModels();
            },function (error) {
                if(error.treated){

                }else{

                }
            })
        };

        $scope.selectCarBrands = function () {
            angular.forEach($scope.brands ,function (brand) {
                if (brand.car_brand_id == $scope.car.brand_id){
                    $scope.car.brand_name = brand.car_brand_name;
                    $scope.brandModels = brand.car_models;
                    $scope.car.model_id = brand.car_models[0].car_model_id;
                    $scope.car.model_name = brand.car_models[0].car_model_name;
                    return false;
                }
            });
        };
        $scope.selectCarBrandModels = function () {
            angular.forEach($scope.brandModels,function (model) {
                if (model.car_model_id == $scope.car.model_id){
                    $scope.car.model_name = model.car_model_name;
                }
            })
        };

        if($rootScope.brands == undefined){
            initData();
        }else{
            $scope.brands = $rootScope.brands ;
            loopBrandAndModels();
        }


        $scope.deleteCar = function () {
            VerifyBS.deleteCars($scope.car.car_id).then(
                function (result) {
                    $rootScope.carList.splice(index,1);
                    $state.go('vehicle')
                },function (error) {
                    MessageBox.toast(T.T('board_edit_vehicle.jsDelete_car_error'));
                }
            );
        };
        $scope.updateCarInfo = function () {
            if ($scope.car.year == undefined || $scope.car.year.trim(' ')==''){
                MessageBox.toast(T.T('board_add_vehicle.jsYear_null'),'error');
                return;
            }

            if ($scope.car.color == undefined || $scope.car.color.trim(' ') =='' ){
                MessageBox.toast(T.T('board_add_vehicle.jsColor_null'),'error');
                return;
            }
            if ($scope.car.license == undefined || $scope.car.license.trim(' ') =='' ){
                MessageBox.toast(T.T('board_add_vehicle.jsLicense_null'),'error');
                return;
            }
            VerifyBS.updateCarsInfo($scope.car).then(
                function (result) {
                    $rootScope.carList[index]=$scope.car;
                    $state.go('vehicle')
                },function (error) {
                    MessageBox.toast(T.T('board_edit_vehicle.jsUpdate_car_error'));
                }
            );
        }


        $scope.backEvent = function () {
            $state.go('vehicle');
        }
    });

/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('VehicleCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox, VerifyBS,T) {

        // $rootScope.token = 'd527d168-30cb-34c8-9cef-bbe6e5336708';
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }
        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };

        $scope.carList = $rootScope.carList;
        if ($scope.carList == null || $scope.carList.length == 0) {
            $state.go('vehicle-add');
        }else {
            $scope.car = $scope.carList[0];
            $timeout(function () {
                $("body").find(".vehicle-item").eq(0).addClass("vehicle-active");
            },100);
        }

        $scope.showCarDetail = function (index) {
            $rootScope.carIndex = index;
            $state.go('vehicle-edit');
        };

        $scope.switchCar = function (index) {
            $scope.car = $scope.carList[index];
        };

        $scope.nextToDriver = function () {
            $state.go('driver');
        };
        $scope.addAnotherVehicle = function () {
            $state.go('vehicle-add');
        };
        $scope.backEvent = function(){
            $state.go('home');
            $rootScope.token=null;
        }
    });
