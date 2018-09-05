/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('LoginCtrl', function ($log, $scope, $rootScope, $uibModal, $uibModalStack, $timeout, $state, MessageBox, UserBS, CompanyBS, T, $translate) {
        angular.element('#loginForm').validator();

        console.log($rootScope.loginUser);

        $scope.learnmoreUrl = ApiServer.learnmoreUrl;
        $scope.showPas = false;

        $uibModalStack.dismissAll();

        var checkRemember = function () {
            var remember = localStorage.getItem('rememberme');
            // console.log(remember);
            if (remember && remember == 1) {
                $scope.remember = true;
                $scope.userName = localStorage.getItem('loginusername');
                $scope.password = localStorage.getItem('loginpassword');
                $timeout(function () {
                    $('#saveButton').click();
                }, 10);
            } else {
                $scope.remember = false;
            }
        };

        checkRemember();

        $scope.onRememberClick = function () {
            $scope.remember = !$scope.remember;
        };

        $scope.onLoginButtonClick = function (valid, $event) {
            if (!valid) {
                return;
            }
            if (!$scope.userName) {
                MessageBox.toast(T.T("login.jsUsername_empty_warning"), "error");
                return
            }
            if (!$scope.password) {
                MessageBox.toast(T.T("login.jsPassword_empty_warning"), "error");
                return
            }
            var l = Ladda.create($event.target);
            l.start();
            UserBS.login($scope.userName, $scope.password).then(function (result) {
                $rootScope.loginUser = result.data;
                console.log($rootScope.loginUser.first_name+""+$rootScope.loginUser.last_name);
                console.log($rootScope.loginUser.email);
                // window.intercomSettings = {
                //     app_id: 'e5bs52ge',
                //     name: "Alur Lizard", // Full name
                //     email: "heroalur@qq.com" // Email address
                // };

                if (result.data.company_id === 0) {
                    loginInfo(result)
                } else {
                    CompanyBS.getCompanySetting().then(function (results) {
                        l.stop();
                        console.log(results.data);
                        localStorage.setItem('companyLang', results.data.lang);
                        localStorage.setItem('companyCurrency', results.data.ccy);
                        localStorage.setItem('distanceunit', results.data.distance_unit);
                        localStorage.setItem('sAcctId', results.data.stripe_acct_id);
                        loginInfo(result)
                    }, function () {
                        l.stop();
                        localStorage.setItem('distanceunit', 2);
                        loginInfo(result)
                    });
                }
                // $rootScope.loginUser = result.data;
                // l.stop();
                // if ($rootScope.loginUser.superadmin) {
                //     MessageBox.toast(T.T("login.jsWelcome_back") + result.data.first_name + ' ' + result.data.last_name, "info");
                //     $state.go('companies');
                // }
                // else if ($rootScope.loginUser.admin) {
                //     window._pcq = window._pcq || [];
                //     _pcq.push(['APIReady', function () {
                //         console.log(pushcrew.subscriberId);
                //         if(pushcrew.subscriberId != -1 && pushcrew.subscriberId != false){
                //             UserBS.updateAdminWebToken(pushcrew.subscriberId).then(function (result) {
                //             },function (error) {
                //             });
                //         }
                //     },function (values) {
                //         //error
                //         console.log(values.reasons);
                //     }]);
                //
                //     MessageBox.toast(T.T("login.jsWelcome_back") + result.data.first_name + ' ' + result.data.last_name, "info");
                //     $state.go('home');
                // } else {
                //     MessageBox.toast(T.T("login.jsLogin_warning"));
                // }
                // if($scope.remember){
                //     localStorage.setItem('rememberme','1');
                //     localStorage.setItem('loginusername',$scope.userName);
                //     localStorage.setItem('loginpassword',$scope.password);
                // }else {
                //     localStorage.setItem('rememberme','0');
                //     localStorage.removeItem('loginusername');
                //     localStorage.removeItem('loginpassword');
                // }
            }, function (error) {
                l.stop();
            });
        };

        var loginInfo = function (data) {
            if (data.data.lang) {
                localStorage.setItem('lang', data.data.lang);
            } else if (!localStorage.getItem('lang')) {
                localStorage.setItem('lang', 'en');
            }
            var lang = localStorage.getItem('lang');
            $translate.use(lang);
            moment.locale(lang);
            if ($rootScope.loginUser.superadmin) {
                MessageBox.toast(T.T("login.jsWelcome_back") + data.data.first_name + ' ' + data.data.last_name, "info");
                $state.go('companies');
            } else if ($rootScope.loginUser.sale) {
                MessageBox.toast(T.T("login.jsWelcome_back") + data.data.first_name + ' ' + data.data.last_name, "info");
                $state.go('sales-rep-home');
            } else if ($rootScope.loginUser.asst) {
                MessageBox.toast(T.T("login.jsWelcome_back") + data.data.first_name + ' ' + data.data.last_name, "info");
                $state.go('sales-assistant-home');
            } else if ($rootScope.loginUser.admin) {
                window._pcq = window._pcq || [];
                _pcq.push(['APIReady', function () {
                    console.log(pushcrew.subscriberId);
                    if (pushcrew.subscriberId != -1 && pushcrew.subscriberId != false) {
                        UserBS.updateAdminWebToken(pushcrew.subscriberId).then(function (result) {
                        }, function (error) {
                        });
                    }
                }, function (values) {
                    //error
                    console.log(values.reasons);
                }]);
                var sAcctId = localStorage.getItem("sAcctId");

                MessageBox.toast(T.T("login.jsWelcome_back") + data.data.first_name + ' ' + data.data.last_name, "info");
                if (sAcctId === "null" || sAcctId === "") {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'templates/dashboard/stripe-alert-modal.html',
                        controller: 'StripeAcctCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            $stateParams: {
                                event: {
                                    cancel: function () {
                                        modalInstance.dismiss();
                                    }
                                }
                            }
                        }
                    });
                }
                $state.go('home');
            } else {
                MessageBox.toast(T.T("login.jsLogin_warning"));
            }
            if ($scope.remember) {
                localStorage.setItem('rememberme', '1');
                localStorage.setItem('loginusername', $scope.userName);
                localStorage.setItem('loginpassword', $scope.password);
            } else {
                localStorage.setItem('rememberme', '0');
                localStorage.removeItem('loginusername');
                localStorage.removeItem('loginpassword');
            }
        };

        $scope.showForgotPasswordPage = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/forgot-password.html',
                controller: 'ForgotPwdCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
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

        $scope.showPasClick = function () {
            $scope.showPas = !$scope.showPas;
            $timeout(function () {
                var pass;
                pass = angular.element($('#pas'));
                if ($scope.showPas) {
                    pass[0].type = 'text';
                } else {
                    pass[0].type = 'password';
                }
                console.log(pass)
            })
        }

    });
