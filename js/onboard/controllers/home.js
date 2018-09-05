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
