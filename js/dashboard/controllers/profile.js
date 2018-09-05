/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('ProfileCtrl', function ($scope, $timeout, $state, $uibModal, $rootScope, $log, Base64, MessageBox, CompanyBS, UserBS, CardBS, PaymentBS, UserCacheBS, MapTool, T, $filter) {

        $scope.defaultCompanyLanguage = angular.copy(defaultCompanyLanguage);
        if (!$rootScope.loginUser) {
            return;
        }
        // console.log($rootScope.loginUser)
        var GetQueryString = function (url, name) {
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

        var code = GetQueryString(location.href, 'code');
        if (!code) {
            var errorDesc = GetQueryString(location.href, 'error_description');
            var error = GetQueryString(location.href, 'error');
            if (error && errorDesc) {

            }
        } else {
            if (code) {
                CompanyBS.bindStripeAccount(code).then(
                    function (data) {
                        $scope.sAcctId = data.data.result;
                        MessageBox.toast(T.T("stripe.jsBindSuccess"), "info");
                        $state.go('profile');
                    }, function (error) {
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("stripe.jsBindFault"), "error");
                        }
                    }
                );
            }
        }

        $scope.charge = {};
        $scope.isShowAddDriver = true;
        $scope.showAdmin = false;
        $scope.showEmailDetail = false;
        $scope.changePassword = false;
        $scope.paymentMethod = angular.copy(PaymentMethod);
        $scope.sAcctId = localStorage.getItem('sAcctId');
        $scope.country = $rootScope.loginUser.admin.location.country;
        var clientId = ApiServer.stripeClientId;
        $scope.link = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=" + clientId + "&scope=read_write";

        $scope.emailList = [
            {
                name: 'Gmail',
                values: 'Smtp.gmail.com',
                port: 465,
                id: 1
            },
            {
                name: '1&1',
                values: 'Smtp.1and1.com',
                port: 587,
                id: 2
            },
            {
                name: 'Airmail',
                values: 'Mail.airmail.net',
                port: 25,
                id: 3
            },
            {
                name: 'AOL',
                values: 'Smtp.aol.com',
                port: 465,
                id: 4
            },
            {
                name: 'AT&T',
                values: 'Outbound.att.net',
                port: 465,
                id: 5
            },
            {
                name: 'Bluewin',
                values: 'Smtpauths.bluewin.ch',
                port: 465,
                id: 6
            },
            {
                name: 'Comcast',
                values: 'Smtp.comcast.net',
                port: 587,
                id: 7
            },
            {
                name: 'Earthlink',
                values: 'Smtpauth.earthlink.net',
                port: 587,
                id: 8
            },
            {
                name: 'HotPop',
                values: 'Mail.hotpop.com',
                port: 25,
                id: 9
            },
            {
                name: 'Gmx',
                values: 'Mail.gmx.net',
                port: 25,
                id: 10
            },
            {
                name: 'Libero',
                values: 'Mail.libero.it',
                port: 465,
                id: 11
            },
            {
                name: 'Lycos',
                values: 'Smtp.lycos.com',
                port: 587,
                id: 12
            },
            {
                name: 'O2',
                values: 'Smtp.o2.com',
                port: 25,
                id: 13
            },
            {
                name: 'Orange',
                values: 'Smtp.orange.net',
                port: 25,
                id: 14
            },
            {
                name: 'Outlook',
                values: 'Smtp.live.com',
                port: 465,
                id: 15
            },
            {
                name: 'Tin',
                values: 'Mail.tin.it',
                port: 587,
                id: 16
            },
            {
                name: 'Tiscali',
                values: 'Smtp.tiscali.co.uk',
                port: 587,
                id: 17
            },
            {
                name: 'Verizon',
                values: 'Outgoing.verizon.net',
                port: 465,
                id: 18
            },
            {
                name: 'Virgin',
                values: 'Smtp.virgin.net',
                port: 465,
                id: 19
            },
            {
                name: 'Wanadoo',
                values: 'Smtp.wanadoo.fr',
                port: 25,
                id: 20
            },
            {
                name: 'Yahoo',
                values: 'smtp.mail.yahoo.com',
                port: 465,
                id: 21
            },
            {
                name: 'BT Connect',
                values: 'Mail.btconnect.tom',
                port: 25,
                id: 22
            },
            {
                name: 'Other',
                values: 'Input other',
                port: null,
                id: 23
            }
        ];


        $scope.changeCard = function (id) {
            $scope.company.email_host = $scope.hey.values;
            $scope.company.email_port = $scope.hey.port;
            if (id == 23) {
                $scope.company.email_host = null
            }
        };

        $scope.onShowEmailDetailClick = function () {
            $scope.showEmailDetail = !$scope.showEmailDetail;
        };

        $scope.onChangePasswordClick = function () {
            $scope.changePassword = !$scope.changePassword;
        };

        $scope.changeTabs = function (tabIndex) {
            if (tabIndex == 0) {
                $scope.showAdmin = false;
            } else {
                $scope.showAdmin = true;
            }
        };

        $timeout(function () {
            angular.element('#adminForm').validator();
            angular.element('#companyForm').validator();
        }, 0);

        $scope.getCardNumberVerification = function (id) {
            console.log(id);
            if (id == 1) {
                return "^4\d{12}(?:\d{3})?$";
            } else if (id == 2) {
                return "^5[1-5][0-9]{14}$";
            } else if (id == 3) {
                return "^3[47][0-9]{13}$";
            } else if (id == 4) {
                return "^6(?:011|5[0-9]{2})[0-9]{12}$";
            }
        };

        $scope.getRandom = function () {
            return Math.random();
        };

        $scope.uploadUserImg = function ($files) {
            if (!$files) {
                return
            }
            MessageBox.showLoading();
            UserBS.changeAvatarToCurrentUser($files).then(function (result) {
                $rootScope.loginUser.avatar_url = result.data + "&timestamp=" + new Date().getTime();
                $scope.user = $rootScope.loginUser;
                UserCacheBS.cache($rootScope.loginUser);
                MessageBox.toast(T.T("Profile.jsChange_avatar_success"), "success");
                MessageBox.hideLoading();
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("Profile.jsChange_avatar_fail"), "error");
                }
            });
        };

        $scope.uploadCompanyImg = function ($files) {
            if (!$files) {
                return
            }
            CompanyBS.changeLogoToCurrentCompany($files).then(function (result) {
                $scope.company.img = result.data + "&timestamp=" + new Date().getTime();
                MessageBox.toast(T.T("Profile.jsChange_logo_success"), "success");
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("Profile.jsChange_logo_fail"), "error");
                }
            });
        };

        $scope.onAdminSubmit = function ($event) {
            if ($scope.changePassword && ($scope.user.newPwd != $scope.user.newPwdVerfy)) {
                MessageBox.toast(T.T("Profile.jsNew_password_error"), "error");
                return;
            }
            if ($scope.user.password == "") {
                delete $scope.user.password;
            }

            //0:正在请求;1:成功;2:失败
            var loaddingAdminState = 0;
            //0:正在请求;1:成功;2:失败
            var loaddingPasswordState = 0;
            var adminParam = angular.copy($scope.user);
            adminParam.mobile = adminParam.mobile.replace(/\s/g, "");
            var tleReg = new RegExp("^[0-9]{5,18}$");
            if(!tleReg.test(adminParam.mobile)){
                MessageBox.toast(T.T("driver_add.jsEnter_valid_digits"), "error")
                return
            }
            MessageBox.showLoading();
            var la = Ladda.create($event.target);
            la.start();
            UserBS.updateCurrentUser(JSON.stringify(adminParam)).then(function (result) {
                if ($scope.changePassword) {
                    if (loaddingPasswordState == 1) {
                        MessageBox.hideLoading();
                        la.stop();
                        MessageBox.toast(T.T("Profile.jsSave_admin_pass_success"), "success");
                    } else if (loaddingPasswordState == 2) {
                        MessageBox.hideLoading();
                        la.stop();
                        MessageBox.toast(T.T("Profile.jsSave_admin_success_pass_fail"), "error");
                    }
                } else {
                    MessageBox.hideLoading();
                    la.stop();
                    MessageBox.toast(T.T("Profile.jsSave_admin_success"), "success");
                }
                loaddingAdminState = 1;

                //result.data.token = $rootScope.loginUser.token;
                $rootScope.loginUser = adminParam;//= result.data;
                UserCacheBS.cache(adminParam);
            }, function (error) {
                if ($scope.changePassword) {
                    if (loaddingPasswordState == 1) {
                        MessageBox.hideLoading();
                        la.stop();
                        MessageBox.toast(T.T("Profile.jsSave_pass_success_admin_fail"), "error");
                    } else if (loaddingPasswordState == 2) {
                        MessageBox.hideLoading();
                        la.stop();
                        MessageBox.toast(T.T("Profile.jsSave_admin_pass_fail"), "error");
                    }
                } else {
                    MessageBox.hideLoading();
                    la.stop();
                    if (error.treated) {

                    } else {
                        if (error.response.data.code == 3700) {
                            MessageBox.toast(T.T("ErrorCode.3700"), 'error');
                        } else if (error.response.data.code == 3701) {
                            MessageBox.toast(T.T("ErrorCode.3701"), 'error');
                        } else {
                            MessageBox.toast(T.T("Profile.jsSave_admin_fail"), "error");
                        }
                    }
                }
                loaddingAdminState = 2;
            });

            if ($scope.changePassword) {
                UserBS.changePassword($scope.user.oldPwd, $scope.user.newPwd).then(function (result) {
                    if (loaddingAdminState == 1) {
                        MessageBox.hideLoading();
                        la.stop();
                        MessageBox.toast(T.T("Profile.jsSave_admin_pass_success"), "success");
                    } else if (loaddingAdminState == 2) {
                        MessageBox.hideLoading();
                        la.stop();
                        MessageBox.toast(T.T("Profile.jsSave_pass_success_admin_fail"), "error");
                    }
                    loaddingPasswordState = 1;
                }, function (error) {
                    if (loaddingAdminState == 1) {
                        MessageBox.hideLoading();
                        MessageBox.toast(T.T("Profile.jsSave_admin_success_pass_fail"), "error");
                        la.stop();
                    } else if (loaddingPasswordState == 2) {
                        MessageBox.hideLoading();
                        MessageBox.toast(T.T("Profile.jsSave_admin_pass_fail"), "error");
                        la.stop();
                    }
                    loaddingPasswordState = 2;
                });
            }
        };

        //event
        $scope.onAddPaymentClick = function () {

        };

        $scope.onActivePaymentButtonClick = function (id) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("Profile.jsChange_pay_warning"), function (isConfirm) {
                if (isConfirm) {
                    MessageBox.showLoading();
                    PaymentBS.activeFromCurrentCompany(id).then(function (result) {
                        MessageBox.hideLoading();
                        initPayment();
                    }, function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("Profile.jsActive_fail"), "error");
                        }
                    });
                }
            });

        };

        $scope.onDeletePaymentButtonClick = function (id) {
            MessageBox.showLoading();
            PaymentBS.deleteFromCurrentCompany(id).then(function (result) {
                MessageBox.hideLoading();
                initPayment();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("comment.jsDelete_fail"), "error");
                }
            });
        };

        $scope.adminAddAsDriver = function () {
            adminAddAsDriver();
        };

        var adminAddAsDriver = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/add-as-driver.html',
                controller: 'AdminAddAsDriverCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                $scope.isShowAddDriver = false;
                                UserCacheBS.cache($rootScope.loginUser);
                                $scope.user.admin.is_driver = 1;
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onChargeSubmit = function (valid, $event) {
            if (!valid) {
                return;
            }
            if ($scope.charge.card_type == 1 && !/^4\d{12}(?:\d{3})?$/.test($scope.charge.card_number)) {
                MessageBox.toast(T.T("Profile.jsNumber_format_error_visa"), "error");
                return;
            }
            if ($scope.charge.card_type == 2 && !/^5[1-5][0-9]{14}$/.test($scope.charge.card_number)) {
                MessageBox.toast(T.T("Profile.jsNumber_format_error_mastercard"), "error");
                return;
            }
            if ($scope.charge.card_type == 3 && !/^3[47][0-9]{13}$/.test($scope.charge.card_number)) {
                MessageBox.toast(T.T("Profile.jsNumber_format_error_discover"), "error");
                return;
            }
            if ($scope.charge.card_type == 4 && !/^6(?:011|5[0-9]{2})[0-9]{12}$/.test($scope.charge.card_number)) {
                MessageBox.toast(T.T("Profile.jsNumber_format_error_ae"), "error");
                return;
            }
            var l = Ladda.create($event.target);
            l.start();
            MessageBox.showLoading();
            CardBS.updateCurrentCompany($scope.charge.card_type, $scope.charge.card_number, $scope.charge.cvv2, $scope.charge.expire_month, $scope.charge.expire_year, $scope.charge.first_name, $scope.charge.last_name).then(function (result) {
                MessageBox.hideLoading();
                l.stop();
                $log.debug(result);
                $scope.charge = result.data;
                MessageBox.toast(T.T("Profile.jsSave_success"), "success");
            }, function (error) {
                l.stop();
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("Profile.jsSave_fail"), "error");
                }
            });
        };

        $scope.onCompanySubmit = function ($event) {
            // console.log($scope.company.address)
            // console.log($scope.company.email_host + '*****' + $scope.company.email_port);
            if (!$scope.company.name) {
                MessageBox.toast(T.T("Profile.jsNo_input_company_name"), 'error');
                return;
            }
            if (!$scope.company.phone1) {
                MessageBox.toast(T.T("Profile.jsNo_input_company_phone"), 'error');
                return;
            }
            if (!$scope.company.email) {
                MessageBox.toast(T.T("Profile.jsNo_input_company_email"), 'error');
                return;
            }
            if (!$scope.company.formatted_address || $scope.company.formatted_address == "") {
                MessageBox.toast(T.T("Profile.jsNo_input_company_address"), 'error');
                return;
            }
            if (!$scope.company.email_host) {
                MessageBox.toast(T.T("Profile.jsNo_input_company_email_host"), 'error');
                return;
            }
            if (!$scope.company.email_port) {
                MessageBox.toast(T.T("Profile.jsNo_input_company_email_port"), 'error');
                return;
            }
            if (!$scope.company.address || $scope.company.address == "" || !$scope.company.address.address_components)
            {
                MessageBox.toast(T.T("Profile.jsNo_input_company_address"), 'error');
                return;
            }
            var country;
            for (var i = 0; i < $scope.company.address.address_components.length; i++) {
                for (var k = 0; k < $scope.company.address.address_components[i].types.length; k++) {
                    if ($scope.company.address.address_components[i].types[k] === 'country') {
                        country = $scope.company.address.address_components[i].short_name;
                    }
                }
            }

            var phoneNumber = $scope.company.phone1.replace(/\s/g, "");
            var l = Ladda.create($event.target);
            l.start();
            MessageBox.showLoading();
            console.log($scope.selectedLanguage);
            CompanyBS.updateCurrentCompanies($scope.company.name, JSON.stringify($scope.company.address), $scope.company.lat, $scope.company.lng, $scope.company.tcp, phoneNumber,
                $scope.company.email, $scope.company.email_host, $scope.company.email_port, $scope.company.email_password, country, $scope.selectedLanguage).then(function (result) {
                l.stop();
                MessageBox.hideLoading();
                $scope.company = result.data;
                $scope.company.phone1 = $filter('phoneNumFormatter')($scope.company.phone1, $scope.country);
                $scope.company.address = JSON.parse(result.data.address);
                $scope.company.formatted_address = $scope.company.address.formatted_address;
                MessageBox.toast(T.T("Profile.jsSave_success"), "success");
            }, function (error) {
                l.stop();
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("Profile.jsSave_fail"), "error");
                }
            });
        };

        $scope.onPaySubmit = function (valid, $event) {
            alert("onPaySubmit");
        };

        var initPayment = function () {
            MessageBox.showLoading();
            PaymentBS.getCompanyPaymentList().then(function (result) {
                MessageBox.hideLoading();
                $scope.sAcctId = result.data;
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("Profile.jsGet_payment_fail"), "error");
                }
            });
        };

        var initCompany = function () {
            CompanyBS.getCurrentCompanies().then(function (result) {
                MessageBox.hideLoading();
                $timeout(function () {
                    $scope.company = angular.copy(result.data);
                    $scope.company.phone1 = $filter('phoneNumFormatter')($scope.company.phone1, $scope.country);
                    console.log($scope.company)
                    if (result.data.address.indexOf('address_components') > 0) {
                        $scope.company.address = JSON.parse(result.data.address);
                        if (!$scope.company.address.latlng) {
                            $scope.company.address.latlng = {
                                lat: $scope.company.address.geometry.location.lat,
                                lng: $scope.company.address.geometry.location.lng
                            }
                        }
                        $scope.company.formatted_address = $scope.company.address.formatted_address;
                        $scope.company.lat = $scope.company.address.geometry.location.lat;
                        $scope.company.lng = $scope.company.address.geometry.location.lng;
                    } else {
                        $scope.company.address = {
                            formatted_address: result.data.address,
                            geometry: {
                                location: {lat: result.data.lat, lng: result.data.lng}
                            }
                        };
                        $scope.company.formatted_address = result.data.address;
                        $scope.company.lat = result.data.lat;
                        $scope.company.lng = result.data.lng;
                    }
                    $rootScope.companyAddress = $scope.company.address.geometry;
                    if (!$scope.company.img) {
                        $scope.company.img = "img/dashboard/default-avatar.png";
                    }
                    $scope.selectedLanguage = $scope.company.lang;
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("Profile.jsGet_company_fail"), "error");
                }
            });
        };

        var initData = function () {
            MessageBox.showLoading();
            initCompany();
            initPayment();
        };

        initData();

        $scope.init = function () {
            $scope.user = angular.copy($rootScope.loginUser);
            $scope.user.mobile = $filter('phoneNumFormatter')($scope.user.mobile, $scope.country);
            console.log($rootScope.loginUser)
            if (parseInt($rootScope.loginUser.admin.is_driver) !== 0) {
                $scope.isShowAddDriver = false;
            }
            if (!$rootScope.loginUser.avatar_url) {
                $scope.user.avatar_url = "img/dashboard/default-avatar.png";
            }

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
        };
        $scope.init();

        $scope.getLocation = function (val) {
            return MapTool.getSearchLocations(val);
        };

        $scope.onAddressSelect = function ($item, $model, $label, $event) {
            MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
                $timeout(function () {
                    $scope.company.address = result;
                    $scope.company.address.geometry.location = {
                        lat: $scope.company.address.geometry.location.lat(),
                        lng: $scope.company.address.geometry.location.lng()
                    };
                    $scope.company.address.latlng = {
                        lat: $scope.company.address.geometry.location.lat,
                        lng: $scope.company.address.geometry.location.lng
                    };
                    $scope.company.formatted_address = result.formatted_address;
                }, 0);
            }, function (error) {
            });
            $scope.company.address = angular.copy($item);
            $scope.company.address.geometry.location = {
                lat: $scope.company.address.geometry.location.lat(),
                lng: $scope.company.address.geometry.location.lng()
            };
            $scope.company.address.latlng = {
                lat: $scope.company.address.geometry.location.lat,
                lng: $scope.company.address.geometry.location.lng
            };
            $scope.company.formatted_address = $item.vicinity + ' ' + $item.name;
            $scope.company.lat = $item.geometry.location.lat();
            $scope.company.lng = $item.geometry.location.lng();
        };

        function loadGetCompanyDisclaimer() {
            CompanyBS.getCompanyDisclaimer().then(function (result) {
                if (result.data.result.disclaimer == 'PHA+PGJyPjwvcD4=') {
                    $scope.isDisclaimer = true;
                } else {
                    $scope.isDisclaimer = false;
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("Profile.jsGet_payment_fail"), "error");
                }
            });
        };
        loadGetCompanyDisclaimer();

        $scope.onGetCompanyDisclaimer = function () {
            MessageBox.showLoading();
            CompanyBS.getCompanyDisclaimer().then(function (result) {
                MessageBox.hideLoading();
                if (result.data.result.disclaimer == 'undefined') {
                    $scope.Disclaimer = '';
                } else {
                    $scope.Disclaimer = Base64.decode(result.data.result.disclaimer);
                }
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/terms-conditions.html',
                    controller: 'TermsConditionsAddCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: {
                                payment: $scope.Disclaimer
                            },
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
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("Profile.jsGet_payment_fail"), "error");
                }
            });
        };

        $scope.onEditCompanyDisclaimer = function () {
        };

        $scope.selectLocationOnMap = function () {
            var locationData = 0;
            if ($scope.company.address) {
                locationData = angular.copy($scope.company.address);
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
                                console.log("address is ", data);
                                $scope.company.address = angular.copy(data);
                                $scope.company.address.geometry.location = {
                                    lat: $scope.company.address.latlng.lat,
                                    lng: $scope.company.address.latlng.lng
                                };
                                $scope.company.formatted_address = data.formatted_address;
                                $scope.company.lat = data.latlng.lat;
                                $scope.company.lng = data.latlng.lng;
                            }
                            modalInstance.dismiss();
                        }
                    }
                }
            });
        };

        //Mail Chimp block
        $scope.mcMsg = T.T("Profile.jsLoading_settings");
        var mailChimp = undefined;
        var loadMailChimp = function () {
            CompanyBS.getMailChimpSetting().then(function (result) {
                // console.log(result);
                mailChimp = result.data.result;
                // console.log("mail chimp", result);
                if (mailChimp !== undefined &&
                    mailChimp.groups &&
                    mailChimp.outer_key !== "") {
                    $scope.mcMsg = "API Key:" + mailChimp.outer_key;
                } else {
                    $scope.mcMsg = T.T("Profile.jsClick_Set");
                }
            }, function (error) {
                $scope.mcMsg = T.T("Profile.jsLoading_error");
            });
        };
        loadMailChimp();

        $scope.popMailChimpSetting = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/mail-chimp-pop.html',
                controller: 'MailChimpCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: function () {
                            return mailChimp;
                        },
                        event: {
                            success: function (key) {
                                modalInstance.dismiss();
                                mailChimp = key;
                                if (mailChimp !== undefined &&
                                    mailChimp.groups &&
                                    mailChimp.outer_key !== "") {
                                    $scope.mcMsg = "API Key:" + mailChimp.outer_key;
                                } else {
                                    $scope.mcMsg = T.T("Profile.jsClick_Set");
                                }
                            },
                            cancel: function (key) {
                                modalInstance.dismiss();
                                console.log(key);
                                mailChimp = key;
                                if (mailChimp !== undefined &&
                                    mailChimp.groups &&
                                    mailChimp.outer_key !== "") {
                                    $scope.mcMsg = "API Key:" + mailChimp.outer_key;
                                } else {
                                    $scope.mcMsg = T.T("Profile.jsClick_Set");
                                }
                            }
                        }
                    }

                }
            });
        };

        $scope.formatPhone = function (type) {
            if (type === 1) {
                $scope.company.phone1 = $filter('phoneNumFormatter')($scope.company.phone1, $scope.country);
            } else {
                $scope.user.mobile = $filter('phoneNumFormatter')($scope.user.mobile, $scope.country);
            }
        }
    });
