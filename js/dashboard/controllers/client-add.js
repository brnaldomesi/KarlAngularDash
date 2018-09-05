/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 * @event cancel
 */
angular.module('KARL.Controllers')
    .controller('ClientAddCtrl', function ($log, $scope, $rootScope,$state, $stateParams, $timeout, MessageBox, CustomerBS, PaymentBS, MapTool, $uibModal,T,$filter) {

        $timeout(function () {
            angular.element('#clientForm').validator();
        }, 0);

        $scope.genders = [
            {
                name: T.T('comment.jsMr')+'.',
                value: 2
            },
            {
                name:  T.T('comment.jsMrs')+'.',
                value: 1
            }
        ];

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
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.customer = {"gender": 2};
        $scope.charge = {
            card_type: 1
        };

        $scope.showPaymentCustomerInput = false;
        $scope.paymentExistCustomerId = "";
        var currentPayment = undefined;

        $scope.tipsMsg = "";
        $scope.resultMsg = "";
        $scope.addPaymentExistCheck = false;
        $scope.customerPlaceholder = "";
        var init = function () {
            PaymentBS.getCompanyPaymentList().then(function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].active == 1) {
                        currentPayment = result.data[i];
                        break;
                    }
                }
                if (currentPayment && currentPayment.pay_type == 3) {
                    $scope.showPaymentCustomerInput = true;
                    $scope.tipsMsg = T.T('ClientAdd.jsTipsMsg');
                    $scope.customerPlaceholder = T.T('ClientAdd.jsCustomerPlaceholder');
                }
            }, function (error) {
                $scope.showPaymentCustomerInput = false;
            })

        };
        init();

        $scope.getStripeCustomerInfo = function (item) {

            return item.id + " " + (item.email ? item.email : "" );
        };

        $scope.$watch("paymentExistCustomerId", function () {
            checkPaymentCustomerInput();
        });

        var checkPaymentCustomerInput = function () {
            if (currentPayment && currentPayment.pay_type == 3) {
                if (!$scope.paymentExistCustomerId.match(/^cus_[0-9a-zA-Z]{14}$/g)) {
                    $scope.resultMsg =  T.T('ClientEdit.jsInput_Stripe_id');
                    angular.element($("#resultColor")).css("color", "red");
                    return;
                }
            } else {
                return;
            }
            angular.element($("#resultColor")).css("color", "white");
            $scope.resultMsg = T.T('ClientEdit.jsChecking');
            CustomerBS.checkPaymentExistCustomer($scope.paymentExistCustomerId).then(
                function (result) {
                    $scope.stripeCustomer = result.data;
                    $scope.resultMsg = T.T('ClientEdit.jsValid');
                    if (result.data && result.data.exist_customer) {
                        angular.element($("#resultColor")).css("color", "yellow");
                        $scope.resultMsg = T.T('ClientEdit.jsStripe_Subscriber_belongs_to') + result.data.exist_customer.first_name + " " + result.data.exist_customer.last_name;
                    }
                    $scope.customer.email = $scope.stripeCustomer.email;
                    $scope.stripeCustomerShow = 1;
                }, function (error) {
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "8600") {
                            angular.element($("#resultColor")).css("color", "red");
                            if (currentPayment.pay_type == 3) {
                                $scope.resultMsg = T.T('ClientEdit.jsCheck_the_Stripe');
                            }
                        } else if (error.response.data.code == "8601") {
                            $scope.showPaymentCustomerInput = false;
                            MessageBox.toast(T.T('ClientEdit.jsCompany_Payment_changed'), "error")
                        } else if (error.response.data.code == "8602") {
                            angular.element($("#resultColor")).css("color", "red");
                            if (currentPayment.pay_type == 3) {
                                $scope.resultMsg = T.T('ClientEdit.jsGet_stripe_failed');
                            }
                        }
                    }
                }
            );
        };

        // Event
        $scope.onSaveButtonClick = function (valid) {
            // var cvv2Reg;
            // var cvv2ResultArray;
            // if ($scope.charge.card_type == 1 && !/^4\d{12}(?:\d{3})?$/.test($scope.charge.card_number)) {
            //     MessageBox.toast("VISA Credit card number format error", "error");
            //     return;
            // }
            // if ($scope.charge.card_type == 2 && !/^5[1-5][0-9]{14}$/.test($scope.charge.card_number)) {
            //     MessageBox.toast("MasterCard Credit card number format error", "error");
            //     return;
            // }
            // if ($scope.charge.card_type == 3 && !/^3[47][0-9]{13}$/.test($scope.charge.card_number)) {
            //     MessageBox.toast("DISCOVER Credit card number format error", "error");
            //     return;
            // }
            // if ($scope.charge.card_type == 4 && !/^6(?:011|5[0-9]{2})[0-9]{12}$/.test($scope.charge.card_number)) {
            //     MessageBox.toast("AmericanExpress Credit card number format error", "error");
            //     return;
            // }
            // if($scope.charge.card_type != 3){
            //     cvv2Reg = /^[0-9]{3}$/g;
            // }else {
            //     cvv2Reg = /^[0-9]{4}$/g;
            // }
            // cvv2ResultArray = $scope.charge.cvv2.match(cvv2Reg);
            // if(!cvv2ResultArray || cvv2ResultArray != $scope.charge.cvv2){
            //     MessageBox.toast('Please fill in the CVC in correct format ', 'error');
            //     return;
            // }

            if (!valid) {
                return;
            }

            addClient();
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.clientForm.$dirty) {
                MessageBox.confirm(T.T('alertTitle.warning'),T.T('ClientEdit.jsCancel_exit'), function (isConfirm) {
                    if (isConfirm) {
                        if ($stateParams.event.cancel) {
                            $stateParams.event.cancel();
                        }
                    }
                });
            }
            else {
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel();
                }
            }
        };

        // Function
        var addClient = function () {

            if ($scope.stripeCustomer && $scope.stripeCustomer.id != $scope.paymentExistCustomerId) {
                MessageBox.toast(T.T('ClientEdit.jsCheck_the_Stripe'),"error");
                return;
            }

            var mobile = $scope.customer.mobile.replace(/\s/g, "");
            var tleReg = new RegExp("^[0-9]{5,18}$");
            if(!tleReg.test(mobile)){
                MessageBox.toast(T.T("driver_add.jsEnter_valid_digits"), "error")
                return
            }

            var param = {
                // password: $scope.customer.password,
                first_name: $scope.customer.first_name,
                last_name: $scope.customer.last_name,
                mobile: mobile,
                email: $scope.customer.email,
                gender: $scope.customer.gender,
                lang:localStorage.getItem('companyLang')
            };

            if ($scope.customer.formatted_address && $scope.address && $scope.lat && $scope.lng) {
                param.address = JSON.stringify($scope.address);
                param.lat = $scope.lat;
                param.lng = $scope.lng
            }

            if ($scope.stripeCustomer && $scope.stripeCustomer.id == $scope.paymentExistCustomerId) {
                param.sc_id = $scope.stripeCustomer.id;
                showAddPaymentExistCustomerAlert(param);
            }else{
                createCustomer(param);
            }

        };


        var showAddPaymentExistCustomerAlert = function (param) {
            MessageBox.confirm(
                T.T('alertTitle.warning'),
                T.T('ClientEdit.jsMake_sure_Stripe_Customer_ID'),
                function (isConfirm) {
                if (isConfirm) {
                    createCustomer(param);
                }
            });
        };

        var createCustomer = function (param) {
            MessageBox.showLoading();
            CustomerBS.addToCurrentUser(param)
                .then(function (result) {
                    // PaymentBS.addCardByClient(result.data.customer_id, $scope.charge)
                    //     .then(function (result) {
                    //         MessageBox.hideLoading();
                    //         if ($stateParams.event.addSuccess) {
                    //             $stateParams.event.addSuccess();
                    //         }
                    //     }, function (error) {
                    //         MessageBox.hideLoading();
                    //         if (error.treated) {
                    //         }
                    //         else {
                    //             MessageBox.toast("Add Client Success,But Add Credit Card Fail", "error");
                    //         }
                    //         if ($stateParams.event.addSuccess) {
                    //             $stateParams.event.addSuccess();
                    //         }
                    //     });
                    MessageBox.hideLoading();
                    openCustomerMc();
                    $stateParams.event.Data(result)
                    if ($stateParams.event.addSuccess) {
                        $stateParams.event.addSuccess();
                    }
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T('ClientAdd.jsAdd_fail'), "error");
                    }
                });
        };


        $scope.getLocation = function (val) {
            return MapTool.getSearchLocations(val);
        };

        $scope.onAddressSelect = function ($item, $model, $label, $event) {
            MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
                $timeout(function () {
                    $scope.address = result;
                    $scope.address.geometry.location = {
                        lat: $scope.address.geometry.location.lat(),
                        lng: $scope.address.geometry.location.lng()
                    };
                    $scope.address.latlng = {
                        lat: $scope.address.geometry.location.lat,
                        lng: $scope.address.geometry.location.lng
                    };
                    $scope.customer.formatted_address = result.formatted_address;
                }, 0);
            }, function (error) {
            });
            $scope.address = angular.copy($item);
            $scope.address.geometry.location = {
                lat: $scope.address.geometry.location.lat(),
                lng: $scope.address.geometry.location.lng()
            };
            $scope.address.latlng = {
                lat: $scope.address.geometry.location.lat,
                lng: $scope.address.geometry.location.lng
            };
            $scope.customer.formatted_address = $item.vicinity + ' ' + $item.name;
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
                                $scope.address = angular.copy(data);
                                $scope.address.geometry.location = {
                                    lat: $scope.address.latlng.lat,
                                    lng: $scope.address.latlng.lng
                                };
                                $scope.customer.formatted_address = data.formatted_address;
                                $scope.lat = data.latlng.lat;
                                $scope.lng = data.latlng.lng;
                            }
                            modalInstance.dismiss();
                        }
                    }
                }
            });
        };


        var openCustomerMc = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/mgr-customer-mc.html',
                controller: 'MgrMCCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            email: $scope.customer.email
                        },
                        event: {
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.formatPhone=function () {
            $scope.customer.mobile = $filter('phoneNumFormatter')($scope.customer.mobile,$scope.country);
        }
    });