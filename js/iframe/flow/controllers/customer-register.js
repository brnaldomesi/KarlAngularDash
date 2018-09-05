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
