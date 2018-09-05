/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event editSuccess
 * @event cancel
 */
angular.module('KARL.Controllers')
    .controller('ClientEditCtrl', function ($log, $scope, $rootScope, $state, $stateParams, $timeout, $uibModal, MessageBox, CustomerBS, UserCacheBS, PaymentBS, MapTool,T,$filter) {
        $timeout(function () {
            angular.element('#clientForm').validator();
        }, 0);
        var customer = $stateParams.data.customer;
        $scope.langStyle=localStorage.getItem('lang');
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.companyMCList = [];
        var getMCList = function () {
            CustomerBS.getCustomerMCList(customer.email).then(
                function (result) {
                    if(result.data.code === 2000){
                        $scope.companyMCList = result.data.result;
                    }else{
                        $scope.companyMCList = [];
                    }
                }, function (error) {
                }
            )
        };
        $scope.openCustomerMc = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/mgr-customer-mc.html',
                controller: 'MgrMCCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            email: $scope.customer.email,
                        },
                        event: {
                            cancel: function () {
                                loadDetailData();
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.showPayment = false;
        {
            $scope.showPaymentCustomerInput = false;
            $scope.paymentExistCustomerId = "";
            var currentPayment = undefined;

            $scope.tipsMsg = "";
            $scope.resultMsg = "";
            $scope.addPaymentExistCheck = false;
            $scope.customerPlaceholder = "";
            $scope.getStripeCustomerInfo = function (item) {

                return item.id + " " + (item.email ? item.email : "" );
            };

            $scope.$watch("paymentExistCustomerId", function () {
                checkPaymentCustomerInput();
            });

            var checkPaymentCustomerInput = function () {
                if (currentPayment && currentPayment.pay_type == 3) {
                    if (!$scope.paymentExistCustomerId.match(/^cus_[0-9a-zA-Z]{14}$/g)) {
                        $scope.resultMsg = T.T('ClientEdit.jsInput_Stripe_id');
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
                        $scope.stripeCustomerShow = 1;
                    }, function (error) {
                        if (error.treated) {
                        } else {
                            if (error.response.data.code == "8600") {
                                angular.element($("#resultColor")).css("color", "red");
                                if (currentPayment.pay_type == 3) {
                                    $scope.resultMsg =  T.T('ClientEdit.jsCheck_the_Stripe');
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
        }

        $scope.genders = [
            {
                name: T.T('comment.jsMr')+'.',
                value: 2
            },
            {
                name: T.T('comment.jsMrs')+'.',
                value: 1
            }
        ];

        $scope.customer = {"gender": 2};

        $scope.onSaveButtonClick = function () {
            if (!$scope.customer.first_name
                || !$scope.customer.last_name
                || !$scope.customer.mobile
                || !$scope.customer.email) {
                MessageBox.toast(T.T('ClientEdit.jsValue_format_error'), 'error');
                return;
            }
            editClient();
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

        $scope.onDeleteCardButtonClick = function (index) {
            PaymentBS.deleteCardByClient($scope.customer.customer_id, $scope.paymentListData[index].card_token).then(function (result) {
                MessageBox.hideLoading();
                loadPaymentData();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T('ClientEdit.jsDelete_fail'), "error");
                }
            });
        };

        $scope.addCardClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/credit-card-add.html',
                controller: 'CreditCardAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            customerId: $scope.customer.customer_id,
                            address: $scope.address
                        },
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadPaymentData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onCreditCardDetailClick = function (index) {
            var card = $scope.paymentListData[index];
            if (!card.check_pass) {
                return;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/client-credit-card.html',
                controller: 'ClientCreditCardCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            card: card
                        },
                        event: {
                            cancel: function () {
                                loadDetailData();
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.changeTabs = function (tabIndex) {
            if (tabIndex == 0) {
                $scope.showPayment = false;
            } else {
                $scope.showPayment = true;
                loadPaymentData();
            }
        };


        var editClient = function () {
            MessageBox.showLoading();
            var mobile = $scope.customer.mobile.replace(/\s/g, "");
            var tleReg = new RegExp("^[0-9]{5,18}$");
            if(!tleReg.test(mobile)){
                MessageBox.toast(T.T("driver_add.jsEnter_valid_digits"), "error")
                return
            }
            var param = {
                customerId: $scope.customer.customer_id,
                first_name: $scope.customer.first_name,
                last_name: $scope.customer.last_name,
                mobile: mobile,
                email: $scope.customer.email,
                gender: $scope.customer.gender
            };
            if ($scope.customer.formatted_address && $scope.address && $scope.lat && $scope.lng) {
                param.address = JSON.stringify($scope.address);
                param.lat = $scope.lat;
                param.lng = $scope.lng;
            } else {
                param.address = "";
            }
            if ($scope.stripeCustomer) {
                param.sc_id = $scope.stripeCustomer.id;
                showAddPaymentExistCustomerAlert(param);
            } else {
                updateCustomerInfo(param);
            }
        };

        var showAddPaymentExistCustomerAlert = function (param) {
            MessageBox.confirm(
                T.T('alertTitle.warning'),
                T.T('ClientEdit.jsMake_sure_Stripe_Customer_ID'),
                function (isConfirm) {
                    if (isConfirm) {
                        updateCustomerInfo(param);
                    }
                });
        };

        var updateCustomerInfo = function (param) {
            CustomerBS.updateToCurrentUser(param)
                .then(function (result) {
                    MessageBox.hideLoading();
                    $stateParams.data.customer.mc_count = result.data.mc_count;
                    if ($stateParams.event.editSuccess) {
                        $stateParams.event.editSuccess();
                    }

                    if ($rootScope.loginUser.id == result.data.user_id) {
                        $rootScope.loginUser.first_name = result.data.first_name;
                        $rootScope.loginUser.last_name = result.data.last_name;
                        $rootScope.loginUser.gender = result.data.gender;
                        $rootScope.loginUser.mobile = result.data.mobile;
                        $rootScope.loginUser.email = result.data.email;
                        $rootScope.loginUser.address = JSON.parse(result.data.address);
                        $rootScope.loginUser.address_code_postal = MapTool.analysisAddressCodePostal($rootScope.loginUser.address);
                        $rootScope.loginUser.address_number = MapTool.analysisAddressNumber($rootScope.loginUser.address);
                        UserCacheBS.cache($rootScope.loginUser);
                        console.log($rootScope.loginUser);
                    }
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T('ClientEdit.jsUpdate_fail'), "error");
                    }
                });
        };

        var loadDetailData = function () {
            MessageBox.showLoading();

            CustomerBS.getDetailFromCurrentUser(customer.customer_id).then(function (result) {
                MessageBox.hideLoading();
                $scope.customer = result.data;
                $scope.customer.mobile = $filter('phoneNumFormatter')($scope.customer.mobile,$scope.country);
                console.log($scope.customer)
                $stateParams.data.customer.mc_count = result.data.mc_count;
                if (result.data.address == "") {
                    $scope.address = undefined;
                } else if (result.data.address.indexOf('address_components') > 0) {
                    $scope.address = JSON.parse(result.data.address);
                    if(!$scope.address.latlng){
                        $scope.address.latlng={
                            lat:$scope.address.geometry.location.lat,
                            lng:$scope.address.geometry.location.lng
                        }
                    }
                    console.log("customer address is ",$scope.address);
                    $scope.customer.formatted_address = $scope.address.formatted_address;
                    $scope.lat = result.data.lat;
                    $scope.lng = result.data.lng;
                } else {
                    $scope.customer.formatted_address = result.data.address;
                }
                if($scope.customer.bind_stripe==1){
                    $scope.stripeMsg=T.T('ClientEdit.jsCustomer_has_stripe');
                }
                getMCList();
                $timeout(function () {
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
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    MessageBox.alertView(T.T('ClientEdit.jsGet_detail_fail'), '', function () {
                        $scope.onCancelButtonClick();
                    });
                }
            });


            PaymentBS.getCompanyPaymentList().then(function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].active == 1) {
                        currentPayment = result.data[i];
                        break;
                    }
                }
                if (currentPayment && currentPayment.pay_type == 3) {
                    $scope.showPaymentCustomerInput = true;
                    $scope.tipsMsg = T.T('ClientEdit.jsTipsMsg');
                    $scope.customerPlaceholder = T.T('ClientEdit.jsCustomerPlaceholder');
                }
            }, function (error) {
                $scope.showPaymentCustomerInput = false;
            })
        };

        var loadPaymentData = function () {
            MessageBox.showLoading();
            PaymentBS.getCardByClient($scope.customer.customer_id).then(function (result) {
                MessageBox.hideLoading();
                if (typeof result.data == "string") {
                    MessageBox.toast(T.T('ClientEdit.jsNo_credit_card'), "info");
                    // TODO
                    $scope.paymentListData = undefined;
                    customer.cards = [];
                    customer.cardNumber = 'No Card';
                    customer.cardCount = '';
                    customer.cardTypeImg = '';

                } else {
                    customer.cards = result.data;
                    if (customer.cards[0].card_type == 1) {
                        customer.cardTypeImg = 'img/dashboard/card-visa.png';
                    } else if (customer.cards[0].card_type == 2) {
                        customer.cardTypeImg = 'img/dashboard/card-mastercard.png';
                    } else if (customer.cards[0].card_type == 3) {
                        customer.cardTypeImg = 'img/dashboard/card-american-express.png';
                    } else if (customer.cards[0].card_type == 4) {
                        customer.cardTypeImg = 'img/dashboard/card-discover.png';
                    }
                    if (customer.cards[0].card_number) {
                        customer.cardNumber = ' ****' + customer.cards[0].card_number.replace(/x/g, '');
                    } else {
                        customer.cardNumber = '';
                    }
                    if (customer.cards.length > 1) {
                        customer.cardCount = '+' + (customer.cards.length - 1).toString() + ' Payments';
                    } else {
                        customer.cardCount = '';
                    }

                    angular.forEach(result.data, function (item) {
                        item.cardTypeName = '';
                        if (item.card_type == 1) {
                            item.cardTypeName = 'VISA';
                        } else if (item.card_type == 2) {
                            item.cardTypeName = 'MaserCard';
                        } else if (item.card_type == 3) {
                            item.cardTypeName = 'AmericanExpress';
                        } else if (item.card_type == 4) {
                            item.cardTypeName = 'Discover';
                        }
                    });

                    $scope.paymentListData = result.data;
                }

                $timeout(function () {
                    $(document).ready(function () {
                        $(".pay-more").click(function () {
                            $(this).nextUntil(1).fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".card-del").click(function () {
                            $(this).parent().find(".pay-del-panel").fadeIn(200);
                        });
                        $(".card-del-cancel").click(function () {
                            $(this).parents(".pay-del-panel").fadeOut(200);
                        });
                    });
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T('ClientEdit.jsPull_up_payment_info_error'), "error");
                }
            });
        };

        // Init
        loadDetailData();

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
        $scope.formatPhone=function () {
            $scope.customer.mobile = $filter('phoneNumFormatter')($scope.customer.mobile,$scope.country);
        }
    });