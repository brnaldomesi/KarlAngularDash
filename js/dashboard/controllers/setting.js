/**
 * Created by jian on 17-1-17.
 */
angular.module('KARL.Controllers')
    .controller('SettingCtrl', function ($scope, MessageBox, $timeout, $interval, CompanyBS,T,$rootScope) {
        if(!$rootScope.loginUser){
            return;
        }
        $scope.showToggle = false;
        $scope.paypalOrStripe='';
        function loadData() {
            MessageBox.showLoading();
            CompanyBS.getCompanySetting().then(function (result) {
                console.log(result);
                $scope.copyResult = result.data;
                $scope.seePrice = result.data.hide_driver_fee;
                $scope.payAuth = result.data.pay_auth;
                $scope.SettlementType = result.data.settle_type;
                $scope.paymentMethod = result.data.pay_type;
                $scope.distanceUnit = result.data.distance_unit;
                localStorage.setItem('distanceunit',result.data.distance_unit);
                if($scope.paymentMethod==1){
                    $scope.paypalOrStripe=T.T('setting.jsPaypal')
                }else {
                    $scope.paypalOrStripe=T.T('setting.jsStripe')
                }
                CompanyBS.getProxyAdmin().then(function (result) {
                    MessageBox.hideLoading();
                    $timeout(function () {
                        $scope.showToggle = true;
                        if (result.data.code == 2100) {
                            $scope.swichs = false;
                            $scope.showMaster = false;
                        } else {
                            countDown(result.data.result.expire_time);
                            getPassword();
                            $scope.swichs = true;
                            $scope.showMaster = true;
                            $scope.userName = result.data.result.username;
                        }
                        $scope.$apply();
                        initBootstrapSwitch();
                    }, 0);

                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T('setting.jsGet_Proxy_Failed'), "error");
                        $scope.swichs = false;
                        $scope.showMaster = false;
                        initBootstrapSwitch();
                    }
                })
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T('setting.jsGet_Company_Setting_Failed'), "error");
                    CompanyBS.getProxyAdmin().then(function (result) {
                        $timeout(function () {
                            if (result.data.code == 2100) {
                                $scope.swichs = false;
                                $scope.showMaster = false;
                            } else {
                                countDown(result.data.result.expire_time);
                                getPassword();
                                $scope.swichs = true;
                                $scope.showMaster = true;
                                $scope.userName = result.data.result.username;
                            }
                            $scope.$apply();
                            initBootstrapSwitch();
                        }, 0);

                    }, function (error) {
                        // MessageBox.hideLoading();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T('setting.jsGet_Proxy_Failed'), "error");
                            $scope.swichs = false;
                            $scope.showMaster = false;
                            initBootstrapSwitch();
                        }
                    })
                }
            });

        }

        loadData();

        var initBootstrapSwitch = function () {
            $("[name='masterLogin']").bootstrapSwitch();
            $("[name='masterLogin']").on('switchChange.bootstrapSwitch', function (event, state) {
                $timeout(function () {
                    if (state) {
                        MessageBox.confirm(T.T('alertTitle.warning'), T.T('setting.jsTemporary_access'), function (isConfirm) {
                            if (isConfirm) {
                                CompanyBS.createProxyAdmin().then(function (result) {
                                    sessionStorage.setItem('password', result.data.result.password);
                                    $scope.showMaster = true;
                                    $scope.swichs = true;
                                    getPassword();
                                    countDown(result.data.result.expire_time);
                                    $scope.userName = result.data.result.username;
                                }, function (error) {
                                    if (error.treated) {
                                    }
                                    else {
                                        MessageBox.toast(T.T('setting.jsCreate_Proxy_Failed'), "error");
                                        $scope.swichs = false;
                                        $scope.showMaster = false;
                                        $("[name='masterLogin']").bootstrapSwitch('state', false,true);
                                    }
                                })
                            } else if (!isConfirm) {
                                $("[name='masterLogin']").bootstrapSwitch('state', false,true);
                            }
                        })
                    } else {
                        if ($scope.swichs) {
                            MessageBox.confirm(T.T('alertTitle.warning'), T.T('setting.jsDelete_proxy'), function (isConfirm) {
                                if (isConfirm) {
                                    $scope.showMaster = false;
                                    $interval.cancel($scope.timesInterval);
                                    CompanyBS.deleteProxyAdmin().then(function (result) {
                                        sessionStorage.clear('password')
                                    }, function (error) {
                                        if (error.treated) {
                                        }
                                        else {
                                            MessageBox.toast(T.T('setting.jsDelete_Proxy_Failed'), "error");
                                            $("[name='masterLogin']").bootstrapSwitch('state', true,true);
                                        }
                                    })
                                } else if (!isConfirm) {
                                    $("[name='masterLogin']").bootstrapSwitch('state', true,true);
                                    $scope.showMaster = true;
                                }
                            })
                        }
                    }
                }, 0)
            });
        };


        $scope.settingClick = function (type) {
            if (type == 0) {
                $scope.seePrice = 0
            } else if (type == 1) {
                $scope.seePrice = 1
            }
            if (type == 2) {
                $scope.payAuth = 0
            } else if (type == 3) {
                $scope.payAuth = 1
            }
            if (type == 4) {
                $scope.SettlementType = 0
            } else if (type == 5) {
                $scope.SettlementType = 1
            } else if (type == 6) {
                $scope.SettlementType = 2
            }
            if(type==7){
                $scope.distanceUnit=1
            }else if(type==8){
                $scope.distanceUnit=2
            }
            MessageBox.confirm(T.T('alertTitle.warning'), T.T('alertTitle.determine'), function (isConfirm) {
                if (isConfirm) {
                    MessageBox.showLoading();
                    CompanyBS.editCompanySetting($scope.seePrice, $scope.payAuth, $scope.SettlementType,$scope.distanceUnit).then(function (result) {
                        console.log(result)
                        MessageBox.hideLoading();
                        MessageBox.toast(T.T('setting.jsSetting_Success'), "Success");
                        $scope.copyResult = result.data;
                        localStorage.setItem('distanceunit',result.data.distance_unit);
                    }, function (error) {
                        $scope.seePrice = $scope.copyResult.hide_driver_fee;
                        $scope.payAuth = $scope.copyResult.pay_auth;
                        $scope.SettlementType = $scope.copyResult.settle_type;
                        $scope.distanceUnit = $scope.copyResult.distance_unit;
                        MessageBox.hideLoading();
                    })
                } else if (!isConfirm) {
                    $scope.seePrice = $scope.copyResult.hide_driver_fee;
                    $scope.payAuth = $scope.copyResult.pay_auth;
                    $scope.SettlementType = $scope.copyResult.settle_type;
                    $scope.distanceUnit = $scope.copyResult.distance_unit;
                }
            });
        };

        // 获取密码
        var getPassword = function () {
            var isPassword = sessionStorage.getItem('password');
            if (isPassword) {
                $scope.passWord = isPassword;
                $scope.showPassword = true;
            } else {
                $scope.showPassword = false;
            }
        };


        // 倒计时
        var countDown = function (value) {
            var second = value;// 秒
            var copySecond=angular.copy(second);
            var minute = 0;// 分
            var hour = 0;// 小时
            $scope.timesInterval = $interval(function () {
                second--;
                copySecond--;
                if (second > 60) {
                    minute = parseInt(second / 60);
                    second = parseInt(second % 60);
                    if (minute > 60) {
                        hour = parseInt(minute / 60);
                        minute = parseInt(minute % 60);
                    }
                }
                if (second < 0) {
                    --minute;
                    second = 59;
                }
                if (minute < 0) {
                    --hour;
                    minute = 59
                }
                if (hour < 0) {
                    second = 0;
                    minute = 0;
                }
                var h = parseInt(hour);
                var m = parseInt(minute);
                var s = parseInt(second);

                var result = (h < 10 ? '0' + h : '' + h) + ':' + (m < 10 ? '0' + m : '' + m) + ':' + (s < 10 ? '0' + s : '' + s);
                $scope.expireTime = result;
                if (copySecond <= 0) {
                    $scope.swichs = false;
                    $scope.showMaster = false;
                    $("[name='masterLogin']").bootstrapSwitch('state', false,true);
                    $interval.cancel($scope.timesInterval)
                }
            }, 1000);
        };
    });