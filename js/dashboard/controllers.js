'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Controllers', []);
/**
 * Created by gaohui on 17-1-18.
 */
angular.module('KARL.Controllers', ['angular-medium-editor'])
    .controller('TermsConditionsAddCtrl', function ($log, $scope, $state, $stateParams, $rootScope, $http, Base64, $timeout, CompanyBS, MessageBox, T) {
        $scope.disclaimer = $stateParams.data.payment;

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onEditCompanyDisclaimer = function () {
            if (!$scope.disclaimer) {
                $scope.disclaimer = '<p><br></p>';
            }
            CompanyBS.editCompanyDisclaimer(Base64.encode($scope.disclaimer)).then(function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("terms_conditions.jsEdit_Company_Disclaimer_Successfully"), "Success");
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel(0);
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (treated) {
                }
                else {
                    MessageBox.toast(T.T("terms_conditions.jsCancel_Edit_Company_Disclaimer_Fail"), "error");
                }
            })
        };
    });
/**
 * Created by lqh on 2017/5/5.
 */
angular.module('KARL.Controllers')
    .controller('AdminAddAsDriverCtrl', function ($log, $scope, $state, $stateParams, $rootScope, $http, $timeout, MessageBox, DriverBS, CarBS,T) {
        $scope.cars = [];
        $scope.delayTime = 0;
        $scope.selectedCars = [];
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        var loadCars = function () {
            CarBS.getCurrentUserAll().then(function (result) {
                $scope.cars = result.data.cars;
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("add_as_driver.jsGet_car_failed"), "error");
                }
            });
        };
        $scope.onSubmitButtonClick = function (valid, $event) {
            var selectCar = "";
            for (var i = 0; i < $scope.cars.length; i++) {
                if (!$scope.cars[i].isSelect) {
                    continue;
                } else {
                    if ($scope.cars[i].isSelect == 1 || $scope.cars[i].isSelect) {
                        if (selectCar.length > 0) {
                            selectCar = selectCar + ",";
                        }
                        selectCar = selectCar + $scope.cars[i].id;
                    }
                }
            }
            MessageBox.showLoading();
            var param = {
                license_number: $scope.license,
                delay_time: $scope.delayTime * 60,
                cars: selectCar,
                calendar: [
                    "000000000000000000000000000000000000000000000000",
                    "000000000000000000000000000000000000000000000000",
                    "000000000000000000000000000000000000000000000000",
                    "000000000000000000000000000000000000000000000000",
                    "000000000000000000000000000000000000000000000000",
                    "000000000000000000000000000000000000000000000000",
                    "000000000000000000000000000000000000000000000000"
                ]
            };
            DriverBS.addAdminAsDriver(JSON.stringify(param))
                .then(function (result) {
                    $rootScope.loginUser.admin.is_driver = 1;
                    MessageBox.toast(T.T("add_as_driver.jsAdmin_add_as_driver"));
                    MessageBox.hideLoading();
                    if ($stateParams.event.addSuccess) {
                        $stateParams.event.addSuccess();
                    }
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("add_as_driver.jsAdd_as_driver_failed"), "error");
                    }
                });
        };

        // Init
        $scope.gender = "2";
        loadCars();
    });

/**
 * Created by wangyaunzhi on 16/9/24.
 */
angular.module('KARL.Controllers')
    .controller('AffiliateNetworkCtrl', function ($filter, $scope, $timeout, MessageBox, AffiliateNetworkBS, EncodeTool, T, $rootScope) {
        if (!$rootScope.loginUser) {
            return;
        }
        $scope.onLn = false;
        $scope.onGn = false;
        $scope.anLocked = true;
        $scope.showToggle = false;
        $scope.LNRadius = 1;
        $scope.showWantedAccordion = true;
        $scope.booking_count = 0;
        $scope.bookingUnlock = '';
        $scope.distanceUnit=localStorage.getItem('distanceunit');
        $scope.selectWantedVehicles = function (carModel, category) {
            MessageBox.showLoading();
            if (carModel.selected == 0) {
                AffiliateNetworkBS.addWantedCarModel(EncodeTool.enCode([carModel.car_model_id].join(','))).then(function (result) {
                    MessageBox.hideLoading();
                    var wantCarsData = result.data.ask;
                    var count = 0;
                    for (var i = 0; i < wantCarsData.length; i++) {
                        if (wantCarsData[i].category_id === category.category_id) {
                            for (var j = 0; j < wantCarsData[i].car_models.length; j++) {
                                if (wantCarsData[i].car_models[j].selected == 1) {
                                    count++;
                                }
                            }
                        }
                    }
                    category.selectedCount=count;
                    carModel.selected = 1;
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {

                        if (error.response.data.code == 5001) {
                            loadData();
                        } else {
                            MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                        }
                    }
                });
            } else {
                AffiliateNetworkBS.deleteWantedCarModel(EncodeTool.enCode([carModel.car_model_id].join(','))).then(function (result) {
                    MessageBox.hideLoading();
                    var wantCarsData = result.data.ask;
                    var count = 0;
                    for (var i = 0; i < wantCarsData.length; i++) {
                        if (wantCarsData[i].category_id === category.category_id) {
                            for (var j = 0; j < wantCarsData[i].car_models.length; j++) {
                                if (wantCarsData[i].car_models[j].selected == 1) {
                                    count++;
                                }
                            }
                        }
                    }
                    category.selectedCount=count;
                    carModel.selected = 0;
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }
                    if (error) {
                        if (error.response.data.code == 5001) {
                            loadData();
                        } else if (error.response.data.code == 3301) {
                            carModel.selected = 0;
                            for (var i = 0; i < $scope.wantedCategorys.length; i++) {
                                var find = false;
                                for (var j = 0; j < $scope.wantedCategorys[i].car_models.length; j++) {
                                    if ($scope.wantedCategorys[i].car_models[j].car_model_id == carModel.car_model_id) {
                                        find = true;
                                        $scope.wantedCategorys[i].selectedCount--;
                                        break;
                                    }
                                }
                                if (find) {
                                    break;
                                }
                            }
                        }
                    }
                });
            }
        };

        $scope.addAllWantedVehicles = function (category) {
            var ids = [];
            angular.forEach(category.car_models, function (carModel) {
                ids.push(carModel.car_model_id);
            });
            MessageBox.showLoading();
            AffiliateNetworkBS.addWantedCarModel(EncodeTool.enCode(ids.join(','))).then(function (result) {
                MessageBox.hideLoading();
                angular.forEach(category.car_models, function (carModel) {
                    carModel.selected = 1;
                });
                category.selectedCount = category.car_models.length;
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == 5001) {
                        loadData();
                    } else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }
                }
            });
        };

        $scope.deleteAllWantedVehicles = function (category) {
            var ids = [];
            angular.forEach(category.car_models, function (carModel) {
                ids.push(carModel.car_model_id);
            });
            MessageBox.showLoading();
            AffiliateNetworkBS.deleteWantedCarModel(EncodeTool.enCode(ids.join(','))).then(function (result) {
                MessageBox.hideLoading();
                angular.forEach(category.car_models, function (carModel) {
                    carModel.selected = 0;
                });
                category.selectedCount = 0;
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == 5001) {
                        loadData();
                    } else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }
                }
            });
        };

        $scope.selectGivenVehicles = function (car, category) {
            MessageBox.showLoading();
            if (car.selected == 0) {
                AffiliateNetworkBS.addGivenCar(EncodeTool.enCode([car.car_id].join(','))).then(function (result) {
                    MessageBox.hideLoading();
                    var givenCarsData = result.data.provide;
                    var count = 0;
                    for (var i = 0; i < givenCarsData.length; i++) {
                        if (givenCarsData[i].category_id === category.category_id) {
                            for (var j = 0; j < givenCarsData[i].cars.length; j++) {
                                if (givenCarsData[i].cars[j].selected == 1) {
                                    count++;
                                }
                            }
                        }
                    }
                    category.selectedCount = count;
                    car.selected = 1;
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        if (error.response.data.code == 5001) {
                            loadData();
                        } else {
                            MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                        }
                    }
                });
            } else {
                AffiliateNetworkBS.deleteGivenCar(EncodeTool.enCode([car.car_id].join(','))).then(function (result) {
                    MessageBox.hideLoading();
                    var givenCarsData = result.data.provide;
                    var count = 0;
                    for (var i = 0; i < givenCarsData.length; i++) {
                        if (givenCarsData[i].category_id === category.category_id) {
                            for (var j = 0; j < givenCarsData[i].cars.length; j++) {
                                if (givenCarsData[i].cars[j].selected == 1) {
                                    count++;
                                }
                            }
                        }
                    }
                    category.selectedCount = count;
                    car.selected = 0;
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }

                    if (error) {
                        if (error.response.data.code == 3301) {
                            car.selected = 0;
                            for (var i = 0; i < $scope.givenCategorys.length; i++) {
                                var find = false;
                                for (var j = 0; j < $scope.givenCategorys[i].cars.length; j++) {
                                    if ($scope.givenCategorys[i].cars[j].car_id == car.car_id) {
                                        find = true;
                                        $scope.givenCategorys[i].selectedCount--;
                                        break;
                                    }
                                }
                                if (find) {
                                    break;
                                }
                            }
                        } else if (error.response.data.code == 5001) {
                            loadData();
                        }
                    }
                });
            }
        };

        $scope.addAllGivenVehicles = function (category) {
            var ids = [];
            angular.forEach(category.cars, function (car) {
                ids.push(car.car_id);
            });
            MessageBox.showLoading();
            AffiliateNetworkBS.addGivenCar(EncodeTool.enCode(ids.join(','))).then(function (result) {
                MessageBox.hideLoading();
                angular.forEach(category.cars, function (car) {
                    car.selected = 1;
                });
                category.selectedCount = category.cars.length;
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == 5001) {
                        loadData();
                    } else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }
                }
            });
        };

        $scope.deleteAllGivenVehicles = function (category) {
            var ids = [];
            angular.forEach(category.cars, function (car) {
                ids.push(car.car_id);
            });
            MessageBox.showLoading();
            AffiliateNetworkBS.deleteGivenCar(EncodeTool.enCode(ids.join(','))).then(function (result) {
                MessageBox.hideLoading();
                angular.forEach(category.cars, function (car) {
                    car.selected = 0;
                });
                category.selectedCount = 0;
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == 5001) {
                        loadData();
                    } else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }
                }
            });
        };

        $scope.enableCombine = function (enable) {
            MessageBox.showLoading();
            var param;
            if (enable) {
                //开启
                param = 1;
            } else {
                //关闭
                param = 0;
            }
            $scope.onCombine = enable;
            AffiliateNetworkBS.enableCombine(param).then(function (result) {
                MessageBox.hideLoading();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == 5001) {
                        loadData();
                    } else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }
                }
            });
        };

        var firstLoad = true;
        var loadData = function () {
            MessageBox.showLoading();
            AffiliateNetworkBS.getAnSeting().then(function (result) {
                $scope.showToggle = true;
                MessageBox.hideLoading();
                console.log(result)
                $timeout(function () {
                    if (result.data.ln == 1) {
                        $scope.onLn = true;
                    } else {
                        $scope.onLn = false;
                    }
                    if (result.data.gn == 1) {
                        $scope.onGn = true;
                    } else {
                        $scope.onGn = false;
                    }
                    $scope.LNRadius = result.data.radius;

                    if (result.data.locked == AnLocked.Locked) {
                        $scope.anLocked = true;
                        $scope.onGn = false;
                        $scope.onLn = false;
                        $scope.booking_count = 10 - result.data.booking_count;
                        $scope.bookingUnlock = $filter('translate')('affiliate_network.jsBooking_count_unlock', {booking_count: $scope.booking_count});
                    } else {
                        $scope.anLocked = false;

                    }
                    // console.log('locked is ', $scope.anLocked);

                    if (result.data.combine == 1) {
                        $scope.onCombine = true;
                    } else {
                        $scope.onCombine = false;
                    }
                    integrateWantedVehicles(result.data.ask);
                    integrateGivenVehicles(result.data.provide);
                    $scope.$apply();
                    $("[name='ln-switch']").bootstrapSwitch('destroy');

                    $("[name='gn-switch']").bootstrapSwitch('destroy');
                    $("[name='ln-switch']").bootstrapSwitch({disabled: $scope.anLocked});
                    $("[name='gn-switch']").bootstrapSwitch({disabled: $scope.anLocked});
                    $('input[name="ln-switch"]').on('switchChange.bootstrapSwitch', function (event, state) {
                        enableLn(state);
                    });
                    $('input[name="gn-switch"]').on('switchChange.bootstrapSwitch', function (event, state) {
                        enableGn(state)
                    });

                    if(firstLoad){
                        $(function () {
                            $("#wanted-accordion").accordion({
                                header: 'h3.myselect',
                                active: false,
                                collapsible: true,
                                heightStyle: "content"
                            });
                            $("#given-accordion").accordion({
                                header: 'h3.myselect',
                                active: false,
                                collapsible: true,
                                heightStyle: "content"
                            });
                        });
                    }else {
                        $("#wanted-accordion").accordion("refresh");
                        $("#wanted-accordion").accordion("option", "active", false);
                        $("#wanted-accordion").accordion("option", "animate", false);

                        $("#given-accordion").accordion("refresh");
                        $("#given-accordion").accordion("option", "active", false);
                        $("#given-accordion").accordion("option", "animate", false);
                    }
                    firstLoad = false;
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("affiliate_network.jsGet_affiliate_network_setting_fail"), "error");
                }
            });
        };

        var allWantedModels;
        var integrateWantedVehicles = function (cagetorys) {
            var tempModels = [];
            for (var i = 0; i < cagetorys.length; i++) {
                cagetorys[i].selectedCount = 0;
                if (cagetorys[i].car_models.length == 0) {
                    cagetorys.splice(i, 1);
                    i--;
                } else {
                    for (var j = 0; j < cagetorys[i].car_models.length; j++) {
                        if (cagetorys[i].car_models[j].selected == 1) {
                            cagetorys[i].selectedCount++;
                        }
                        tempModels.push(cagetorys[i].car_models[j]);
                    }
                }
            }
            allWantedModels = tempModels;
            $scope.wantedCategorys = cagetorys;
        };

        var allGivenCars;
        var integrateGivenVehicles = function (cagetorys) {
            var tempCars = [];
            for (var i = 0; i < cagetorys.length; i++) {
                cagetorys[i].selectedCount = 0;
                if (cagetorys[i].cars.length == 0) {
                    cagetorys.splice(i, 1);
                    i--;
                } else {
                    for (var j = 0; j < cagetorys[i].cars.length; j++) {
                        if (cagetorys[i].cars[j].selected == 1) {
                            cagetorys[i].selectedCount++;
                        }
                        tempCars.push(cagetorys[i].cars[j]);
                    }
                }
            }
            allGivenCars = tempCars;
            $scope.givenCategorys = cagetorys;
        };

        var enableLn = function (enable) {
            MessageBox.showLoading();
            $scope.onLn = enable;
            var param;
            if (enable) {
                //开启
                param = 1;
                $(".cl-block").css('display', 'none');
            } else {
                //关闭
                param = 0;
            }
            AffiliateNetworkBS.enableLn(param).then(function (result) {
                MessageBox.hideLoading();
            }, function (error) {
                MessageBox.hideLoading();
                // console.log('error is ', error);
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == 5001) {
                        loadData();
                    } else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }
                }
            });
        };

        var enableGn = function (enable) {
            MessageBox.showLoading();
            var param;
            if (enable) {
                //开启
                param = 1;
            } else {
                //关闭
                param = 0;
            }
            $scope.onGn = enable;
            AffiliateNetworkBS.enableGn(param).then(function (result) {
                MessageBox.hideLoading();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == 5001) {
                        loadData();
                    } else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }
                }
            });
        };

        $scope.$watch('wantedInput.searchText', function (word) {
            $timeout(function () {
                var tempWantedSearch = [];
                if (!word) {
                    $scope.showWantedAccordion = true;
                } else {
                    $scope.showWantedAccordion = false;
                    angular.forEach(allWantedModels, function (model) {
                        if (model.model_name.toString().toLowerCase().indexOf(word.toString().toLowerCase()) > -1
                            || model.brand_name.toString().toLowerCase().indexOf(word.toString().toLowerCase()) > -1) {
                            tempWantedSearch.push(model);
                        }
                    });
                    $scope.wantedSearchResult = tempWantedSearch;
                }
            }, 200);
        });

        $scope.onCancelWantedSearchButtonClick = function () {
            $scope.wantedInput.searchText = undefined;
        };

        $scope.$watch('givenInput.searchText', function (word) {
            $timeout(function () {
                var tempGivenSearch = [];
                if (!word) {
                    $scope.showGivenAccordion = true;
                } else {
                    $scope.showGivenAccordion = false;
                    angular.forEach(allGivenCars, function (car) {
                        if (car.model_name.toString().toLowerCase().indexOf(word.toString().toLowerCase()) > -1
                            || car.brand_name.toString().toLowerCase().indexOf(word.toString().toLowerCase()) > -1
                            || car.license_plate.toString().toLowerCase().indexOf(word.toString().toLowerCase()) > -1) {
                            tempGivenSearch.push(car);
                        }
                    });
                    $scope.givenSearchResult = tempGivenSearch;
                }
            }, 200);
        });

        $scope.onCancelGivenSearchButtonClick = function () {
            $scope.givenInput.searchText = undefined;
        };

        loadData();


        $scope.updateLocalRadius = function(){
            MessageBox.showLoading();
            AffiliateNetworkBS.updateLNRadius($scope.LNRadius).then(function (result) {
                MessageBox.hideLoading();
                //TODO
                loadData();
            },function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == 5001) {
                        loadData();
                    } else {
                        MessageBox.toast(T.T("affiliate_network.jsSet_affiliate_network_fail"), "error");
                    }
                }
            })
        }
    });
/**
 * Created by wanghui on 16-11-18.
 */
angular.module('KARL.Controllers')
    .controller('anDetailCtrl', function (TransactionBS, $log, $rootScope, $scope, $state, MessageBox, OptionBS, $stateParams,$uibModal) {
        $scope.listDataDetail = $stateParams.data;
        $scope.customerDetail = $stateParams.data.customer_data;
        $scope.driverDetail = $stateParams.data.driver_data;
        $scope.showEditButton = $stateParams.showEmailButton;
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.csvPage=3;
        if ($scope.listDataDetail.own_com_id == $rootScope.loginUser.company_id) {
            $scope.canSendEmail = true;
        } else {
            $scope.canSendEmail = false;
        }

        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };

        $scope.orderInvoice = function () {

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/finance-send-email.html',
                controller: 'financeSendEmail',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            customerData: $scope.customerDetail,
                            bookingId:$scope.listDataDetail.booking_id
                        },
                        event: {
                            cancel: function (close) {
                                if(close){
                                    modalInstance.dismiss();
                                    $stateParams.event.cancel();
                                    $stateParams.event.archive()
                                }else {
                                    modalInstance.dismiss();
                                }

                            }
                        }
                    }

                }
            });
        }
        $scope.showInvoiceHtml = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/book-invoice-detail.html',
                controller: 'BookInvoiceDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            bookingId:$scope.listDataDetail.booking_id
                        },
                        event: {
                            cancel: function (close) {
                                if(close){
                                    modalInstance.dismiss();
                                    $stateParams.event.cancel();
                                    $stateParams.event.archive()
                                }else {
                                    modalInstance.dismiss();
                                }

                            }
                        }
                    }

                }
            });
        }
    });
/**
 * Created by wanghui on 16-11-18.
 */
angular.module('KARL.Controllers')
    .controller('billDetailCtrl', function (TransactionBS,$log, $scope, $rootScope,$state, MessageBox, OptionBS, $stateParams, $timeout) {
        $scope.listDataDetail = $stateParams.data;
        $scope.customerDetail = $stateParams.data.customer_data;
        $scope.driverDetail = $stateParams.data.driver_data;
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.csvPage=2;
        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
//--- this start
angular.module('KARL.Controllers')
    .controller('BookDetailCtrl', function ($log, $scope, $rootScope, $state, $stateParams, MessageBox, BookBS, $uibModal, T) {
        var companyId = $rootScope.loginUser.company_id;


        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };
        $scope.showEndButton = false;
        $scope.showMoreNotes = false;
        $scope.showSendBack = false;
        $scope.hasSentBack = false;
        $scope.distanceUnit = localStorage.getItem('distanceunit');
        $scope.langStyle=localStorage.getItem('lang');
        $scope.country=$rootScope.loginUser.admin.location.country;
         //todo
        // var lang='en';
        var lang;
        var initialize = function () {
            if (window.localStorage.lang) {
                lang = window.localStorage.lang;
            } else {
                lang = navigator.language.toLocaleLowerCase();
            }
            // console.log(lang);
            if ( lang == 'zh') {
                $scope.disclaimerTranslate = 0
            }else if(lang == 'eur'||lang == 'fr'){
                $scope.disclaimerTranslate = 1
            }else {
                $scope.disclaimerTranslate = 2
            }
            console.log($scope.disclaimerTranslate);
        };

        $scope.onEndBookButtonClick = function () {
            if ($scope.showAffiliate == 1) {
                MessageBox.confirm(T.T("alertTitle.determine"), T.T("book_detail.jsSuspend_waring"), function (isConfirm) {
                    if (isConfirm) {
                        BookBS.cancel($stateParams.data.bookingId).then(function (result) {
                            MessageBox.hideLoading();
                            MessageBox.toast(T.T("book_detail.jsCancel_booking_success"), "info");
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel(0);
                            }
                        }, function (treated) {
                            MessageBox.hideLoading();
                            if (treated) {
                            }
                            else {
                                MessageBox.toast(T.T("book_detail.jsCancel_booking_fail"), "error");
                            }
                        });
                    }
                });
            } else {
                MessageBox.confirm(T.T("alertTitle.determine"), '', function (isConfirm) {
                    if (isConfirm) {
                        BookBS.cancel($stateParams.data.bookingId).then(function (result) {
                            MessageBox.hideLoading();
                            MessageBox.toast(T.T("book_detail.jsCancel_booking_success"), "info");
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel(0);
                            }
                        }, function (treated) {
                            MessageBox.hideLoading();
                            if (treated) {
                            }
                            else {
                                MessageBox.toast(T.T("book_detail.jsCancel_booking_fail"), "error");
                            }
                        });
                    }
                });
            }

        };

        $scope.showOrHideMoreNotes = function () {
            $scope.showMoreNotes = !$scope.showMoreNotes;
        };

        // Function
        function loadDetail(bookId) {
            initialize();
            MessageBox.showLoading();
            var rightNow = (new Date().getTime() + "").substring(0, 10) * 1;
            BookBS.getDetail(bookId).then(function (result) {
                console.log(result)
                MessageBox.hideLoading();
                $scope.book = result.data;
                $scope.isCoupon = false;
                if ($scope.book.coupon) {
                    $scope.isCoupon = true;
                }
                if ($scope.book.company_id != companyId) {
                    $scope.isCoupon = false;
                }
                if ($scope.book.type == 3 || $scope.book.appointed_at - rightNow < 300) {
                    $scope.showEditButton = false;
                } else if ($scope.book.order_state > 0) {
                    $scope.showEditButton = false;
                } else {
                    $scope.showEditButton = true;
                }
                if (($scope.book.trip_state == 0 || $scope.book.trip_state == 1 || $scope.book.trip_state == 2) && $scope.book.order_state == 0) {
                    $scope.isStart = true;
                } else if ($scope.book.trip_state == 3 && ($scope.book.order_state == 1 || $scope.book.order_state == 2)) {
                    $scope.isStart = false;
                }
                $scope.bookType = result.data.type;
                if (companyId == $scope.book.company_id && companyId != $scope.book.exe_com_id) { //A单
                    $scope.isTirp = true;
                    $scope.showEditButton = false;
                    if ($scope.book.order_state > 3 || ($scope.book.trip_state > 3 && $scope.book.trip_state < 9)) {
                        $scope.isTirp = false;
                    }
                    $scope.showAffiliate = 1;
                    $scope.comapnyName = $scope.book.exe_com_name;
                    $scope.book.driver_data = JSON.parse($scope.book.driver_data);
                    $scope.book.driver_data.mobile = $scope.book.exe_com_phone1;
                    $scope.book.driver_data.email = $scope.book.exe_com_email;
                    if ($scope.book.reject == 0) {
                        $scope.hasSentBack = false;
                        $scope.showSendBack = false;
                    } else {
                        $scope.hasSentBack = true;
                        $scope.showSendBack = false;
                        $scope.showEditButton = true;
                    }
                } else if (companyId != $scope.book.company_id && companyId == $scope.book.exe_com_id) { //B单
                    $scope.showEndButton = false;
                    $scope.isTirp = false;
                    $scope.book.c_email = $scope.book.own_com_email;
                    $scope.book.driver_data = JSON.parse($scope.book.driver_data);
                    $scope.showAffiliate = 2;
                    if ($scope.book.order_state == 0) {
                        if ($scope.book.reject == 0) {
                            $scope.hasSentBack = false;
                            $scope.showSendBack = true;
                        } else {
                            $scope.hasSentBack = true;
                            $scope.showSendBack = false;
                            $scope.showEditButton = false;
                        }
                    } else {
                        $scope.hasSentBack = false;
                        $scope.showSendBack = false;
                        $scope.showEditButton = false;
                    }

                } else {
                    if ($scope.book.reject == 0) {
                        $scope.hasSentBack = false;
                    } else {
                        $scope.hasSentBack = true;
                    }
                    $scope.isTirp = true;
                    if ($scope.book.order_state > 3 || ($scope.book.trip_state > 3 && $scope.book.trip_state < 9)) {
                        $scope.isTirp = false;
                    }
                    $scope.book.driver_data = JSON.parse($scope.book.driver_data);
                }
                $scope.book.car_data = JSON.parse($scope.book.car_data);
                $scope.book.offer_data = JSON.parse($scope.book.offer_data);
                $scope.book.option_data = JSON.parse($scope.book.option_data);
                $scope.book.passengerNames = $scope.book.passenger_names.split(",");
                if ($scope.book.type == 1) {
                    if ($scope.book.detail_distance.toString().indexOf('.') > -1 && $scope.book.detail_distance.toString().length > $scope.book.detail_distance.toString().indexOf('.') + 3) {
                        $scope.book.detail_distance = $scope.book.detail_distance.toString().substring(0, $scope.book.detail_distance.toString().indexOf('.') + 3);
                    }
                }
                if (
                    $scope.book.order_state == OrderOrderState.ORDER_STATE_ADMIN_CANCEL ||
                    $scope.book.order_state == OrderOrderState.ORDER_STATE_SUPER_ADMIN_CANCEL ||
                    $scope.book.order_state == OrderOrderState.ORDER_STATE_PASSENGER_CANCEL ||
                    $scope.book.order_state == OrderOrderState.ORDER_STATE_TIMES_UP_CANCEL
                ) {
                    $scope.hasSentBack = false;
                    $scope.showEndButton = false;
                    $scope.showEditButton = false;
                    $scope.tripStateString = T.T("book_detail.jsCancelled_Trip");
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_BOOKING) {
                    $scope.showEndButton = true;
                    $scope.tripStateString = T.T("book_detail.jsTrip_Not_Started");
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_RUN) {
                    $scope.showEndButton = false;
                    switch ($scope.book.trip_state) {
                        case OrderTripState.TRIP_STATE_DRIVE_TO_PICK_UP: {
                            $scope.tripStateString = T.T("book_detail.jsOnRoute_To_Passenger");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_WAITING_CUSTOMER: {
                            $scope.tripStateString = T.T("book_detail.jsWaiting_Passenger");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_GO_TO_DROP_OFF: {
                            $scope.tripStateString = T.T("book_detail.jsOn_Trip");
                            $scope.showEndButton = false;
                        }
                            break;
                        default : {
                            $scope.tripStateString = "Unknown";
                        }
                            break;
                    }
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_DONE) {
                    $scope.showEndButton = false;
                    switch ($scope.book.trip_state) {
                        case OrderTripState.TRIP_STATE_WAITING_DRIVER_DETERMINE: {
                            $scope.tripStateString = T.T("book_detail.jsDriver_Confirm_Price");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_WAITING_TO_SETTLE: {
                            $scope.tripStateString = T.T("book_detail.jsWaiting_Settle");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_SETTLING: {
                            $scope.tripStateString = T.T("book_detail.jsSettling");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_SETTLE_DONE: {
                            $scope.tripStateString = T.T("book_detail.jsTrip_Ended");
                            $scope.showEndButton = false;
                        }
                            break;
                        default : {
                            $scope.tripStateString = "Unknown";
                        }
                            break;
                    }
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_WAIT_DETERMINE) {
                    $scope.tripStateString = T.T("book_detail.jsWaiting_passenger_approval");
                    $scope.showEndButton = false;
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_SETTLE_ERROR) {
                    $scope.showEndButton = false;
                    $scope.isTirp = false;
                    $scope.tripStateString = T.T("book_detail.jsSettle_Error");
                }
                else {
                    $scope.tripStateString = "Unknown";
                }

                if ($scope.showEndButton
                    && ($scope.book.exe_com_id != $scope.book.company_id)
                    && ($rootScope.loginUser.company_id != $scope.book.company_id)) {
                    $scope.showEndButton = false;
                }
                console.log("send back is ", $scope.showSendBack);

                console.log("show end button ", $scope.showEndButton);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("book_detail.jsGet_detail_fail"), "error");
                }
            });
            // console.log($scope.hasSentBack);
        }

        $scope.editStartTrip = function () {
            if ($scope.isStart == true) {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("book_detail.jsDo_you_start_trip"), function (isConfirm) {
                    if (isConfirm) {
                        $scope.state = 3;
                        BookBS.editTripState($stateParams.data.bookingId, $scope.state).then(function (result) {
                            MessageBox.hideLoading();
                            MessageBox.toast(T.T("book_detail.jsStart_Trip_Successfully"), "Success");
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel(1);
                            }
                        }, function (error) {
                            if (error.response.data.code == '7009') {
                                MessageBox.toast(T.T("book_detail.jsDriver_has_running_trip"), "error");
                            } else {
                                MessageBox.toast(T.T("book_detail.jsStart_Trip_Failed"), "error");
                            }
                        })
                    }
                })
            } else {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("book_detail.jsDo_you_end_trip"), function (isConfirm) {
                    if (isConfirm) {
                        $scope.state = 4;
                        BookBS.editTripState($stateParams.data.bookingId, $scope.state).then(function (result) {
                            // console.log(result);
                            MessageBox.hideLoading();
                            MessageBox.toast(T.T("book_detail.jsEnd_Trip_Successfully"), "Success");
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel(2,result.data.result.order_state,result.data.result.trip_state);
                            }
                        }, function (error) {
                            MessageBox.toast(T.T("book_detail.jsEnd_Trip_Failed"), "error");
                        })
                    }
                })
            }
        };
        $scope.sendEmail = function () {
            MessageBox.showLoading();
            BookBS.sendEmail($stateParams.data.bookingId).then(function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("book_detail.jsItinerary_email_success"), "Success");
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("book_detail.jsSend_email_fail"), "error");
                }
            })
        };

        loadDetail($stateParams.data.bookingId);

        $scope.sendBackBooking = function () {
            var sendingBooking = T.T("book_detail.jsSending_Booking");
            var company_name = /\{company_name\}/g;
            var company_phone = /\{company_phone\}/g;
            var company_email = /\{company_email\}/g;
            var at = /\{at\}/g;
            var or = /\{or\}/g;
            if (!$scope.book.own_com_phone1 && !$scope.book.own_com_phone2 && !$scope.book.own_com_email) {
                sendingBooking = sendingBooking.replace(at, '');
            }else {
                sendingBooking = sendingBooking.replace(at, T.T("book_detail.jsAt"));
            }
            if ($scope.book.own_com_phone1) {
                sendingBooking = sendingBooking.replace(company_phone, $scope.book.own_com_phone1);
            } else {
                if ($scope.book.own_com_phone2) {
                    sendingBooking = sendingBooking.replace(company_phone, $scope.book.own_com_phone2);
                } else {
                    sendingBooking = sendingBooking.replace(company_phone, '');
                    sendingBooking = sendingBooking.replace(or, '');
                }
            }
            if ($scope.book.own_com_email) {
                sendingBooking = sendingBooking.replace(or,  T.T("book_detail.jsOr"));
                sendingBooking = sendingBooking.replace(company_email, $scope.book.own_com_email);
            } else {
                sendingBooking = sendingBooking.replace(or, '');
                sendingBooking = sendingBooking.replace(company_email, '');
            }

            sendingBooking = sendingBooking.replace(company_name, $scope.book.own_com_name);
            MessageBox.confirm(T.T("alertTitle.warning"), sendingBooking, function (isConfirm) {
                if (isConfirm) {
                    BookBS.sendBackBooking($stateParams.data.bookingId).then(function () {
                        $scope.hasSentBack = true;
                        $scope.showSendBack = false;
                        $scope.showEditButton = false;
                        $stateParams.event.hasSentBack();
                        MessageBox.toast(T.T("book_detail.jsBooking_sent_successfully"), 'info');

                    }, function () {
                        MessageBox.toast(T.T("book_detail.jsBooking_sent_failed"), 'error');
                    })
                }
            }, T.T('alertTitle.alert_button_Send_Back'));

        };


        $scope.editCars = function () {
            var now = (new Date().getTime() + "").substring(0, 10) * 1;
            if ($scope.book.appointed_at - now < 300) {
                MessageBox.toast(T.T("book_detail.jsOrder_Cannot_Modified"), "error");
            } else {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("book_detail.jsWant_edit_Vehicles_Driver"), function (isConfirm) {
                    if (isConfirm) {
                        MessageBox.showLoading();
                        BookBS.getEditBookingCars($stateParams.data.bookingId, $scope.bookType).then(function (result) {
                            if (result.data.code == 2100) {
                                MessageBox.hideLoading();
                                MessageBox.toast(T.T("book_detail.jsOffer_not_matched"), "info");
                            } else {
                                var totalData = result.data.result;

                                var initCategory = function (data) {
                                    var categories = [];

                                    //循环遍历offer
                                    for (var i = 0; i < data.length; i++) {

                                        //循环遍历offer 中的car_categories
                                        for (var k = 0; k < data[i].car_categories.length; k++) {

                                            var isNewCategory = true;

                                            //循环对比category类型 如果是已知类型，直接在此类型下添加数据，如果未知类型，创建此新类型。
                                            for (var j = 0; j < categories.length; j++) {
                                                if (categories[j].category_id == data[i].car_categories[k].category_id) {
                                                    for (var m = 0; m < data[i].car_categories[k].cars.length; m++) {
                                                        data[i].car_categories[k].cars[m].offer = data[i];
                                                    }
                                                    categories[j].cars = categories[j].cars.concat(data[i].car_categories[k].cars);
                                                    isNewCategory = false;
                                                }
                                            }

                                            if (isNewCategory) {
                                                var category = {
                                                    category: "",
                                                    category_id: "",
                                                    cars: [],
                                                    options: [],
                                                    offer: "",
                                                    isSelect: false
                                                };
                                                category.category_id = data[i].car_categories[k].category_id;
                                                category.category = data[i].car_categories[k].category;
                                                category.cars = data[i].car_categories[k].cars;
                                                for (var m = 0; m < category.cars.length; m++) {
                                                    category.cars[m].offer = data[i];
                                                    category.cars[m].isSelect = false;
                                                    for (var n = 0; n < category.cars[m].drivers.length; n++) {
                                                        category.cars[m].drivers[n].isSelect = false;
                                                    }
                                                }
                                                categories.push(category);
                                            }
                                        }
                                    }
                                    var noRepeatCategories = categories;

                                    // 对生成的car 增加序号
                                    for (var i = 0; i < noRepeatCategories.length; i++) {
                                        for (var j = 0; j < noRepeatCategories[i].cars.length; j++) {
                                            noRepeatCategories[i].cars[j].index = j;
                                        }
                                    }
                                    return noRepeatCategories;
                                };

                                var modalInstance = $uibModal.open({
                                    templateUrl: 'templates/dashboard/calendar-selectcars.html',
                                    controller: 'calendarSelectCarsCtrl',
                                    size: 'md',
                                    backdrop: 'static',
                                    keyboard: false,
                                    resolve: {
                                        $stateParams: {
                                            data: $scope.book,
                                            bookId: $stateParams.data.bookingId,
                                            event: {
                                                totalCarsData: initCategory(totalData),
                                                getCarsMessages: function (carsMessages) {
                                                    $scope.book.car_data = JSON.parse(carsMessages.car_data);
                                                    $scope.book.driver_data = JSON.parse(carsMessages.driver_data);
                                                },
                                                getDriverNameToCalendar: $stateParams.event.driverName,
                                                editSuccess: function (companyInfo) {
                                                    loadDetail($stateParams.data.bookingId);
                                                    $stateParams.event.displayStatus(companyInfo)
                                                    modalInstance.dismiss();
                                                },
                                                cancel: function () {
                                                    modalInstance.dismiss();
                                                }
                                            }
                                        }
                                    }
                                });
                                MessageBox.hideLoading();
                            }

                        }, function (error) {
                            MessageBox.hideLoading();
                            if (error.treated) {
                            }
                            else {
                                setTimeout(function () {
                                    MessageBox.alertView(T.T("alertTitle.warning"), T.T("book_detail.jsNo_vehicles_drivers_info"), function (isAlertView) {
                                        if (isAlertView) {
                                            $stateParams.event.cancel();
                                        }
                                    })
                                }, 800);
                            }
                        })
                    }
                });
            }
        }
    });
//--- this end

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('BookInvoiceDetailCtrl', function ($log, $sce,$scope, $rootScope, $state, $stateParams, MessageBox, BookBS, $uibModal) {
        var token = $rootScope.loginUser.token;
        var bookingId = $stateParams.data.bookingId;
        var url = ApiServer.serverUrl + ApiServer.version+"/companies/bookings/"+bookingId+"/invoice/html?token="+token;
        $scope.invoiceUrl = $sce.trustAsResourceUrl(url);
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

    });

angular.module('KARL.Controllers')
    .controller('BookSelectDriverCtrl', function ($scope, $stateParams,$timeout) {

        $timeout(function () {
            angular.element('#selectDriverForm').validator();
        },0);

        $scope.drivers = $stateParams.data.drivers;
        $scope.input = {};
        angular.forEach($scope.drivers,function (driver,index) {
            if(driver.isSelect){
                $scope.input.selectedIndex = index;
            }
        });

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onSaveButtonClick = function (valid) {
            if(!valid){
                return;
            }
            if ($stateParams.event.ok) {
                $stateParams.event.ok($scope.drivers[$scope.input.selectedIndex]);
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('BookCtrl', function ($scope, $rootScope, $state, $http, $uibModal, $q, $log, BookBS, MessageBox, $timeout, CustomerBS, CardBS, MapTool, MapBS, PaymentBS, AddressTool, AirLineTool, T) {

            if (!$rootScope.loginUser || !window.localStorage.companyCurrency) {
                return;
            }
            var nWatchedModelChangeCount = 0;
            var book = {};
            book.drivers = undefined;
            book.type = 1;
            $scope.promo_code_shown = false;
            $scope.bookType = 1;
            $scope.selectedCard = undefined;
            $scope.isGetOffer = false;
            $scope.customTva = 0;
            $scope.customCost = 0;
            $scope.customDetermine = 0;
            $scope.hourlyDate = 2;
            $scope.maxBags = ['N/A'];
            $scope.selectedMaxBags = 'N/A';
            $scope.maxPassengers = ['N/A'];
            $scope.selectedMaxPassengers = 'N/A';
            $scope.passengers = [];
            $scope.bookTime = {};
            $scope.bookAddress = {};
            $scope.creditCardType = angular.copy(CreditCardType);
            $scope.airPort = false;
            $scope.reAirPort = false;
            $scope.airLineMessage = null;
            $scope.airLineCompanyFs = null;
            $scope.airLineMessageNum = null;
            $scope.reAirLineMessage = null;
            $scope.reAirLineCompanyFs = null;
            $scope.reAirLineMessageNum = null;
            $scope.bookingMsg = {msg: ""};
            $scope.optionsPrice = 0;
            $scope.haveAirline = false;
            $scope.haveDropAirline = false;
            $scope.isAirport = false;
            $scope.isDropAirport = false;
            $scope.isDropMarkedWords = false;
            $scope.isPickMarkedWords = false;
            $scope.amountOff = 0;
            $scope.percent_off = 0;
            $scope.finalCustomCost = 0;
            $scope.distanceUnit = localStorage.getItem('distanceunit');
            $scope.langStyle = localStorage.getItem('lang');
            $scope.flight = function () {
                $scope.airPort = !$scope.airPort;
                if (!$scope.airPort) {
                    $scope.airLineMessage = null;
                    $scope.airLineCompanyFs = null;
                    $scope.airLineMessageNum = null;
                }
            };

            $scope.reflight = function () {
                $scope.reAirPort = !$scope.reAirPort;
                if (!$scope.reAirPort) {
                    $scope.reAirLineMessage = null;
                    $scope.reAirLineCompanyFs = null;
                    $scope.reAirLineMessageNum = null;
                }
            };

            $scope.selectLocationOnMap = function (type) {
                var locationData = 0;
                if (type == 1) {
                    if (book.pickup) {
                        locationData = angular.copy(book.pickup);
                    }
                } else if (type == 2) {
                    if (book.dropoff) {
                        locationData = angular.copy(book.dropoff);
                    }
                } else {
                    if (book.hourlyPickup) {
                        locationData = angular.copy(book.hourlyPickup);
                    }
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
                                    if (type == 1) {
                                        console.log("return data is ", data);
                                        book.pickup = angular.copy(data);
                                        book.pickup.geometry.location = {
                                            lat: book.pickup.latlng.lat,
                                            lng: book.pickup.latlng.lng
                                        };
                                        $scope.bookPickUpAddress = book.pickup.formatted_address
                                        // MapTool.geocoderAddress(data.geometry.location.lat(), data.geometry.location.lng(), function (result) {
                                        //     $timeout(function () {
                                        //         book.pickup = result;
                                        //         book.pickup.geometry.location = {
                                        //             lat: book.pickup.geometry.location.lat(),
                                        //             lng: book.pickup.geometry.location.lng()
                                        //         };
                                        //         $scope.bookPickUpAddress = result.formatted_address;
                                        //     }, 0);
                                        // }, function (error) {
                                        // });
                                    } else if (type == 2) {
                                        book.dropoff = angular.copy(data);
                                        book.dropoff.geometry.location = {
                                            lat: book.dropoff.latlng.lat,
                                            lng: book.dropoff.latlng.lng
                                        };
                                        $scope.bookDropOffAddress = book.dropoff.formatted_address;

                                        // MapTool.geocoderAddress(data.geometry.location.lat(), data.geometry.location.lng(), function (result) {
                                        //     $timeout(function () {
                                        //         book.dropoff = result;
                                        //         book.dropoff.geometry.location = {
                                        //             lat: book.dropoff.geometry.location.lat(),
                                        //             lng: book.dropoff.geometry.location.lng()
                                        //         };
                                        //         $scope.bookDropOffAddress = result.formatted_address
                                        //     }, 0)
                                        // }, function (error) {
                                        // });
                                    } else {
                                        book.hourlyPickup = angular.copy(data);
                                        book.hourlyPickup.geometry.location = {
                                            lat: book.hourlyPickup.latlng.lat,
                                            lng: book.hourlyPickup.latlng.lng
                                        };
                                        if (book.type == 2) {
                                            $scope.bookHourlyAddress = book.hourlyPickup.formatted_address;
                                        } else {
                                            $scope.bookCustomAddress = book.hourlyPickup.formatted_address;
                                        }
                                        // MapTool.geocoderAddress(data.geometry.location.lat(), data.geometry.location.lng(), function (result) {
                                        //     $timeout(function () {
                                        //         book.hourlyPickup = result;
                                        //         book.hourlyPickup.geometry.location = {
                                        //             lat: book.hourlyPickup.geometry.location.lat(),
                                        //             lng: book.hourlyPickup.geometry.location.lng()
                                        //         };
                                        //         if (book.type == 2) {
                                        //             $scope.bookHourlyAddress = result.formatted_address;
                                        //         } else {
                                        //             $scope.bookCustomAddress = result.formatted_address;
                                        //         }
                                        //     }, 0);
                                        // }, function (error) {
                                        // });
                                    }
                                }
                                modalInstance.dismiss();
                            }
                        }
                    }
                });
            };

            $scope.onChangePassengerCount = function () {
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
            };

            // 滚动到车辆
            var scrollPositions = function () {
                $timeout(function () {
                    var position = angular.element($('#scrollPosition'));
                    $("html,body").animate({scrollTop: position[0].offsetTop}, "slow");
                }, 0);
            };

            $scope.onCheckP2pOffers = function ($event) {
                if (!$scope.bookPickUpAddress) {
                    MessageBox.toast(T.T("booking.jsinput_pickup_address"), "error");
                    return;
                }
                if (!book.pickup) {
                    MessageBox.toast(T.T("booking.jsinput_valid_pickup_address"), "error");
                    return;
                }
                if (!$scope.bookDropOffAddress) {
                    MessageBox.toast(T.T("booking.jsinput_drop_off_address"), "error");
                    return;
                }
                if (!book.dropoff) {
                    MessageBox.toast(T.T("booking.jsinput_valid_drop_off_address"), "error");
                    return;
                }
                var directionsService = new google.maps.DirectionsService;
                MapTool.calculateAndDisplayRoute(
                    directionsService,
                    {
                        placeId: book.pickup.place_id
                    },
                    {
                        placeId: book.dropoff.place_id
                    },
                    (new Date(book.p2pDatetime).valueOf() + "").substr(0, 10),
                    function (response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            var result = {
                                "distance": response.routes[0].legs[0].distance.value,
                                "duration": response.routes[0].legs[0].duration.value
                            };
                            book.estimate = result;
                            $scope.matrixDistance = result;
                            getOffersByRemote($event);
                        }
                    }
                )
                ;
            };

            $scope.onCheckHourlyOffers = function ($event) {
                if (!$scope.bookHourlyAddress) {
                    MessageBox.toast(T.T("booking.jsinput_pickup_address"), "error");
                    return;
                }
                if (!book.hourlyPickup) {
                    MessageBox.toast(T.T("booking.jsinput_valid_pickup_address"), "error");
                    return;
                }

                if (!$scope.hourlyDate) {
                    MessageBox.toast(T.T("booking.jsinput_hourly_date"), "error");
                    return;
                }

                var hourlyLadda = Ladda.create($event.target);
                hourlyLadda.start();
                book.hourlyDatetime = $('.datetimepicker2').data("DateTimePicker").date()._d;
                //MessageBox.toast(T.T(book.hourlyDatetime));
                // console.log('MF: ' + book.hourlyDatetime);
                // console.log('MF2: ' + book.hourlyDatetime.getTimezoneOffset());
                // console.log('MF3: ' + $scope.bookHourlyAddress);
                // console.log('MF4: ' + book.hourlyPickup);
                // MapBS.getTimezone(book.hourlyPickup.geometry.location.lat,
                //     book.hourlyPickup.geometry.location.lng)
                //     .then(function (result) {
                //         console.log('MF5: ' + result);
                //
                //         // if (result.data.code == '2100' || result.data.code == '3001') {
                //     //     MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                //     //     $scope.isGetOffer = false;
                //     //     $scope.options = undefined;
                //     //     hourlyLadda.stop();
                //     // } else if (typeof result.data == "string" || result.data.length < 1) {
                //     //     MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                //     //     hourlyLadda.stop();
                //     // } else {
                //     //     $scope.isGetOffer = true;
                //     //     $scope.bookTime.hourlyPickupTime = book.hourlyDatetime.valueOf();
                //     //     $scope.bookAddress.hourlyPickup = book.hourlyPickup;
                //     //     $scope.bookAddress.hourlyPickup.final_address = AddressTool.finalAddress(book.hourlyPickup);
                //     //     $scope.bookTime.hourlyDate = $scope.hourlyDate * 60;
                //     //     hourlyLadda.stop();
                //     //     $scope.initOption(result);
                //     //     scrollPositions();
                //     // }
                // }, function (error) {
                //         console.log('MF6: ' + error);
                // hourlyLadda.stop();
                // if (error.treated) {
                // }
                // else {
                //     MessageBox.toast(T.T("booking.jsoffer_not_found"), "error");
                // }
                // });
                // return;
                BookBS.getOffersHourly(
                    book.type,
                    book.hourlyPickup,
                    $scope.hourlyDate * 60,
                    book.hourlyDatetime,
                    $scope.airPort,
                    $scope.distanceUnit
                ).then(function (result) {
                    if (result.data.code == '2100' || result.data.code == '3001') {
                        MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                        $scope.isGetOffer = false;
                        $scope.options = undefined;
                        hourlyLadda.stop();
                    } else if (typeof result.data == "string" || result.data.length < 1) {
                        MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                        hourlyLadda.stop();
                    } else {
                        $scope.isGetOffer = true;
                        $scope.bookTime.hourlyPickupTime = book.hourlyDatetime.valueOf();
                        $scope.bookAddress.hourlyPickup = book.hourlyPickup;
                        $scope.bookAddress.hourlyPickup.final_address = AddressTool.finalAddress(book.hourlyPickup);
                        $scope.bookTime.hourlyDate = $scope.hourlyDate * 60;
                        hourlyLadda.stop();
                        $scope.initOption(result);
                        scrollPositions();
                    }
                }, function (error) {
                    //MessageBox.toast(T.T(result.data.code));
                    hourlyLadda.stop();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("booking.jsoffer_not_found"), "error");
                    }
                });
            };

            $scope.onCheckCustomOffers = function ($event) {
                book.customStartDateTime = $('.datetimepicker3').data("DateTimePicker").date()._d;
                var appointed_time = parseInt((book.customStartDateTime.valueOf() + "").substr(0, 10));
                book.customEndDateTime = $('.datetimepicker4').data("DateTimePicker").date()._d;
                var end_time = parseInt((book.customEndDateTime.valueOf() + "").substr(0, 10));
                if (end_time <= appointed_time) {
                    MessageBox.toast(T.T("booking.jscheck_start_end_time"));
                    return;
                }
                if (!$scope.bookCustomAddress) {
                    MessageBox.toast(T.T("booking.jsinput_pick_up_location"), 'error');
                    return;
                }
                if (!book.hourlyPickup) {
                    MessageBox.toast(T.T("booking.jsinput_valid_pickup_address"), "error");
                    return;
                }
                var lat = book.hourlyPickup.geometry.location.lat;
                var lng = book.hourlyPickup.geometry.location.lng;
                var duration_time = (end_time - appointed_time) / 60;

                var hourlyLadda = Ladda.create($event.target);
                hourlyLadda.start();
                BookBS.getCustomQuote(
                    duration_time,
                    appointed_time,
                    lat,
                    lng,
                    $scope.airPort,
                    $scope.distanceUnit
                ).then(
                    function (result) {
                        hourlyLadda.stop();
                        $scope.categories = result.date;
                        $scope.categories[0].isSelect = true;
                        $scope.categories[0].cars[0].isSelect = true;
                        $scope.categories[0].cars[0].drivers[0].isSelect = true;
                        $scope.carSelected = $scope.categories[0].cars[0];
                        $scope.initBagCountAndPassengerCount($scope.carSelected);
                        $scope.driverSelected = $scope.categories[0].cars[0].drivers[0];
                        $scope.priceFormat = window.localStorage.companyCurrency.toLowerCase();
                        $timeout(function () {
                            if (firstLoad) {
                                $(".accordion").accordion({
                                    header: 'h3.myselect',
                                    active: false,
                                    collapsible: true,
                                    heightStyle: "content"
                                });
                            } else {
                                $(".accordion").accordion("refresh");
                                $(".accordion").accordion("option", "active", false);
                            }
                            firstLoad = false;
                        }, 0);

                        $scope.isGetOffer = true;
                        $scope.bookTime.customStartTime = book.customStartDateTime.valueOf();
                        $scope.bookTime.customEndTime = book.customEndDateTime.valueOf();
                        $scope.bookAddress.hourlyPickup = book.hourlyPickup;
                        $scope.bookAddress.hourlyPickup.final_address = AddressTool.finalAddress(book.hourlyPickup);
                        $scope.bookTime.hourlyDate = $scope.hourlyDate * 60;
                        scrollPositions();
                    }, function (error) {
                        hourlyLadda.stop();
                        $scope.isGetOffer = false;
                        if (error.response.data.code == '3804') {
                            MessageBox.toast(T.T("booking.jsno_car_provide_service"), 'info');
                            return;
                        }
                        if (error.response.data.code == '3805') {
                            MessageBox.toast(T.T("booking.jsno_driver_provide_service"), 'info');
                            return;
                        }
                    }
                );
            };

            $scope.searchCurrentCustomers = function (key) {
                return CustomerBS.searchCurrentCustomers(key).then(function (result) {
                    return result.data.customers;
                }, function (error) {
                    $log.error(error);
                    if (error.treated) {
                    }
                    else {
                    }
                });
            };

            $scope.searchDriver = function (key) {
                var drivers = new Array();
                for (var i in book.drivers) {
                    var driver = book.drivers[i];
                    var matchKey = driver.first_name.toString().toLowerCase().indexOf(key.toLowerCase());
                    if (matchKey >= 0) {
                        drivers.push(driver);
                        continue;
                    }
                    matchKey = driver.last_name.toString().toLowerCase().indexOf(key.toLowerCase());
                    if (matchKey >= 0) {
                        drivers.push(driver);
                        continue;
                    }
                    matchKey = driver.email.toString().indexOf(key.toLowerCase());
                    if (matchKey >= 0) {
                        drivers.push(driver);
                        continue;
                    }
                    matchKey = driver.mobile.toString().indexOf(key.toLowerCase());
                    if (matchKey >= 0) {
                        drivers.push(driver);
                        continue;
                    }
                    matchKey = driver.license_number.toString().indexOf(key.toLowerCase());

                    if (matchKey >= 0) {
                        drivers.push(driver);
                    }
                }
                return drivers;
            };

            // 根据时间获取offer ------- end --------------
            //--------- book ----start ---------
            $scope.onBookButtonClick = function ($event) {
                if (book.type == 1) {
                    if (!$scope.options) {
                        MessageBox.toast(T.T("booking.jsclick_next"), "error");
                        return;
                    }
                    $scope.onP2PBook($event);
                } else if (book.type == 2) {
                    if (!$scope.options) {
                        MessageBox.toast(T.T("booking.jsclick_next"), "error");
                        return;
                    }
                    $scope.onHourlyBook($event);
                } else if (book.type == 3) {
                    $scope.onCustomQuoteBook($event);
                }
            };

            $scope.onP2PBook = function ($event) {
                if (!$scope.customerSelected) {
                    MessageBox.toast(T.T("booking.jsselect_client"), "error");
                    return;
                } else if (!$scope.selectedCard) {
                    MessageBox.toast(T.T("booking.jsselect_credit_card"), "error");
                    return;
                }

                var passengerNames = [];
                angular.forEach($scope.passengers, function (passenger) {
                    passengerNames.push(passenger.name);
                });
                var passengerCount = 0;
                if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                    passengerCount = 0;
                } else {
                    passengerCount = $scope.selectedMaxPassengers;
                }

                var bagCount = 0;
                if ($scope.selectedMaxBags == $scope.maxBags[0]) {
                    bagCount = 0;
                } else {
                    bagCount = $scope.selectedMaxBags;
                }

                var cost;
                if ($scope.airPort) {
                    if ($scope.reAirPort) {
                        cost = Math.round(($scope.totalPrice + $scope.offer.a_port_price + $scope.offer.d_port_price) * (1 + $scope.offer.tva / 100) * 100) / 100;
                    } else {
                        cost = Math.round(($scope.totalPrice + $scope.offer.d_port_price) * (1 + $scope.offer.tva / 100) * 100) / 100;
                    }
                } else {
                    if ($scope.reAirPort) {
                        cost = Math.round(($scope.totalPrice + $scope.offer.a_port_price) * (1 + $scope.offer.tva / 100) * 100) / 100;
                    } else {
                        cost = Math.round($scope.totalPrice * (1 + $scope.offer.tva / 100) * 100) / 100;
                    }
                }
                // cost = Math.round($scope.totalPrice * (1 + $scope.offer.tva / 100) * 100) / 100;
                if (cost > 0 && cost < 1) {
                    cost = 1;
                }

                //console.log(book.p2pDatetime);

                var realTime = ((new Date(book.p2pDatetime)).getYear() + 1900) + "-";

                var month = (new Date(book.p2pDatetime)).getMonth() + 1 ;

                if(month < 10)
                {
                    month = "0" + month;
                }

                realTime = realTime + month + "-";

                var day = (new Date(book.p2pDatetime)).getDate();

                if(day < 10)
                {
                    day = "0" + day;
                }

                realTime = realTime + day + " ";

                var hour = (new Date(book.p2pDatetime)).getHours();

                if(hour < 10)
                {
                    hour = "0" + hour;
                }

                realTime = realTime + hour + ":";

                var minute = (new Date(book.p2pDatetime)).getMinutes();

                if(minute < 10)
                {
                    minute = "0" + minute;
                }

                realTime = realTime + minute + ":00";

                var param = {
                    d_lat: book.pickup.geometry.location.lat,
                    d_lng: book.pickup.geometry.location.lng,
                    d_address: JSON.stringify(book.pickup),
                    type: book.type,
                    a_lat: book.dropoff.geometry.location.lat,
                    a_lng: book.dropoff.geometry.location.lng,
                    a_address: JSON.stringify(book.dropoff),
                    cost: cost,
                    appointed_time: parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10)),
                    real_time:realTime,
                    estimate_duration: book.estimate.duration / 60,
                    estimate_distance: book.estimate.distance / 1000,
                    car_id: $scope.carSelected.car_id,
                    offer_id: $scope.offer.offer_id,
                    options: $scope.options.selectOption,
                    driver_id: $scope.driverSelected.driver_id,
                    note: $scope.bookingMsg.msg,
                    passenger_names: passengerNames.join(','),
                    passenger_count: passengerCount,
                    bag_count: bagCount,
                    card_token: $scope.selectedCard.card_token,
                    // d_airline: $scope.airLineMessage,
                    d_airline: {name: $scope.airLineMessage, icao: $scope.airLineCompanyFs},
                    d_flight: $scope.airLineMessageNum,
                    a_airline: {name: $scope.reAirLineMessage, icao: $scope.reAirLineCompanyFs},
                    // a_airline: $scope.reAirLineMessage,
                    a_flight: $scope.reAirLineMessageNum,
                    d_is_airport: $scope.airPort ? 1 : 0,
                    a_is_airport: $scope.reAirPort ? 1 : 0,
                    coupon: $scope.couponCode,
                    unit: 2
                };

                
                var bookLadda = Ladda.create($event.target);
                bookLadda.start();

                if (!$scope.customerSelected.customer_id) {
                    BookBS.book(JSON.stringify(param), $scope.data.customer_id).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickOneWay();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                } else {
                    BookBS.book(JSON.stringify(param), $scope.customerSelected.customer_id).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickOneWay();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                }
            };

            $scope.onHourlyBook = function ($event) {
                if (!book.hourlyPickup) {
                    MessageBox.toast(T.T("booking.jsinput_pickup_address"), "error");
                    return;
                } else if (!$scope.customerSelected) {
                    MessageBox.toast(T.T("booking.jsselect_client"), "error");
                    return;
                } else if (!$scope.selectedCard) {
                    MessageBox.toast(T.T("booking.jsselect_credit_card"), "error");
                    return;
                }

                var passengerNames = [];
                angular.forEach($scope.passengers, function (passenger) {
                    passengerNames.push(passenger.name);
                });
                var passengerCount = 0;
                if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                    passengerCount = 0;
                } else {
                    passengerCount = $scope.selectedMaxPassengers;
                }

                var bagCount = 0;
                if ($scope.selectedMaxBags == $scope.maxBags[0]) {
                    bagCount = 0;
                } else {
                    bagCount = $scope.selectedMaxBags;
                }

                var cost;
                if ($scope.airPort) {
                    cost = Math.round(($scope.totalPrice + $scope.offer.d_port_price) * (1 + $scope.offer.tva / 100) * 100) / 100;
                } else {
                    cost = Math.round($scope.totalPrice * (1 + $scope.offer.tva / 100) * 100) / 100;
                }
                if (cost > 0 && cost < 1) {
                    cost = 1;
                }
                var param = {
                    d_lat: book.hourlyPickup.geometry.location.lat,
                    d_lng: book.hourlyPickup.geometry.location.lng,
                    d_address: JSON.stringify(book.hourlyPickup),
                    type: book.type,
                    cost: cost,
                    appointed_time: parseInt((book.hourlyDatetime.valueOf() + "").substr(0, 10)),
                    estimate_duration: $scope.hourlyDate * 60,
                    car_id: $scope.carSelected.car_id,
                    offer_id: $scope.offer.offer_id,
                    options: $scope.options.selectOption,
                    driver_id: $scope.driverSelected.driver_id,
                    note: $scope.bookingMsg.msg,
                    passenger_names: passengerNames.join(','),
                    passenger_count: passengerCount,
                    bag_count: bagCount,
                    card_token: $scope.selectedCard.card_token,
                    // d_airline: $scope.airLineMessage,
                    d_airline: {name: $scope.airLineMessage, icao: $scope.airLineCompanyFs},
                    d_flight: $scope.airLineMessageNum,
                    d_is_airport: $scope.airPort ? 1 : 0,
                    coupon: $scope.couponCode,
                    unit: 2
                };

                var bookLadda = Ladda.create($event.target);
                bookLadda.start();
                if (!$scope.customerSelected.customer_id) {
                    BookBS.book(JSON.stringify(param), $scope.data.customer_id).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickHourly();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        $log.error(error);
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                } else {
                    BookBS.book(JSON.stringify(param), $scope.customerSelected.customer_id).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickHourly();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        $log.error(error);
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                }
            };

            $scope.onCustomQuoteBook = function ($event) {
                var appointed_time = parseInt((book.customStartDateTime.valueOf() + "").substr(0, 10));
                var end_time = parseInt((book.customEndDateTime.valueOf() + "").substr(0, 10));
                if (end_time <= appointed_time) {
                    MessageBox.toast(T.T("booking.jsCheck_start_end_time"));
                    return;
                }
                var duration_time = (end_time - appointed_time) / 60;

                var passengerNames = [];
                angular.forEach($scope.passengers, function (passenger) {
                    passengerNames.push(passenger.name);
                });
                var passengerCount = 0;
                if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                    passengerCount = 0;
                } else {
                    passengerCount = $scope.selectedMaxPassengers;
                }

                var bagCount = 0;
                if ($scope.selectedMaxBags == $scope.maxBags[0]) {
                    bagCount = 0;
                } else {
                    bagCount = $scope.selectedMaxBags;
                }
                var param = {
                    d_lat: book.hourlyPickup.geometry.location.lat,
                    d_lng: book.hourlyPickup.geometry.location.lng,
                    d_address: JSON.stringify(book.hourlyPickup),
                    cost: $scope.customCost,
                    appointed_time: appointed_time,
                    estimate_duration: duration_time,
                    car_id: $scope.carSelected.car_id,
                    driver_id: $scope.driverSelected.driver_id,
                    note: $scope.bookingMsg.msg,
                    tva: $scope.customTva,
                    passenger_names: passengerNames.join(','),
                    passenger_count: passengerCount,
                    bag_count: bagCount,
                    card_token: $scope.selectedCard.card_token,
                    // d_airline: $scope.airLineMessage,
                    d_airline: {name: $scope.airLineMessage, icao: $scope.airLineCompanyFs},
                    d_flight: $scope.airLineMessageNum,
                    d_is_airport: $scope.airPort ? 1 : 0,
                    coupon: $scope.couponCode,
                    unit: 2
                };
                var bookLadda = Ladda.create($event.target);
                bookLadda.start();
                if (!$scope.customerSelected.customer_id) {
                    BookBS.bookCustomQuote(
                        $scope.data.customer_id,
                        JSON.stringify(param),
                        $scope.customDetermine
                    ).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickCustomQuote();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                } else {
                    BookBS.bookCustomQuote(
                        $scope.customerSelected.customer_id,
                        JSON.stringify(param),
                        $scope.customDetermine
                    ).then(function (result) {
                        MessageBox.toast(T.T("booking.jsBooking_success"), "success");
                        $scope.clickCustomQuote();
                        clearData();
                        bookLadda.stop();
                        $state.go('calendar');
                    }, function (error) {
                        bookLadda.stop();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T("booking.jsBook_fail"), "error");
                        }
                    });
                }

            };

            var clearData = function () {
                $scope.bookPickUpAddress = "";
                $scope.bookDropOffAddress = "";
                $scope.bookHourlyAddress = "";
                $scope.bookCustomAddress = "";
                book.pickup = undefined;
                book.dropoff = undefined;
                book.hourlyPickup = undefined;
                $scope.customerSelected = undefined;
                $scope.carSelected = undefined;
                $scope.driverSelected = undefined;
                $scope.customTva = 0;
                $scope.customCost = 0;
                $scope.customDetermine = 0;
                $scope.hourlyDate = 2;
                $scope.selectedCard = undefined;
                $scope.isGetOffer = false;
                $scope.selectedMaxBags = 'N/A';
                $scope.maxBags = ['N/A'];
                $scope.maxPassengers = ['N/A'];
                $scope.selectedMaxPassengers = 'N/A';
                $scope.passengers = [];
                $scope.bookTime = {};
                $scope.bookAddress = {};
                $scope.bookingMsg.msg = "";
                $scope.airPort = false;
                $scope.reAirPort = false;
                $scope.airLineMessage = null;
                $scope.airLineCompanyFs = null;
                $scope.airLineMessageNum = null;
                $scope.reAirLineMessage = null;
                $scope.reAirLineCompanyFs = null;
                $scope.reAirLineMessageNum = null;
                $scope.isAirport = false;
                $scope.isDropAirport = false;
            };

            //--------- book ----end---------
            //--------------预估价计算-----------start--------
            $scope.accountingPrice = function () {
              
                if ($scope.offer.company_id == $rootScope.loginUser.company_id) {
                    $scope.showCoupon = true;
                } else {
                    $scope.showCoupon = false;
                    resetCouponCode();
                }
                if ($scope.options.length == 0) {
                    $scope.totalPrice = $scope.offer.basic_cost;
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

                $scope.totalPrice = $scope.offer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
                $scope.optionsPrice = checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
            };
            //--------------预估价计算-----------end--------

            $scope.getOfferBookingPrice = function () {
                if ($scope.offer) {
                    var testPrice = angular.copy($scope.totalPrice);
                    if ($scope.airPort) {
                        testPrice = $scope.offer.d_port_price + $scope.totalPrice;
                    }
                    if ($scope.reAirPort) {
                        testPrice = $scope.offer.a_port_price + $scope.totalPrice;
                    }
                    if ($scope.reAirPort && $scope.airPort) {
                        testPrice = $scope.offer.a_port_price + $scope.offer.d_port_price + $scope.totalPrice;
                    }
                    var price = testPrice * (1 + $scope.offer.tva / 100);
                    if (price > 0 && price < 1) {
                        price = 1;
                    }
                }
                if (price - $scope.amountOff - $scope.percent_off / 100 * (price - $scope.amountOff) < 0) {
                    return 0;
                } else if (price - $scope.amountOff - $scope.percent_off / 100 * (price - $scope.amountOff) > 0 && price - $scope.amountOff - $scope.percent_off / 100 * (price - $scope.amountOff) < 1) {
                    return 1;
                } else {
                    return price - $scope.amountOff - $scope.percent_off / 100 * (price - $scope.amountOff);
                }
            };


            $scope.onEnableOption = function (option) {
                if (option.enable) {
                    option.count = 1;
                } else {
                    option.count = 0;
                }
                $scope.accountingPrice();
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
                $scope.accountingPrice();
            };

            //---------- 获取 Offer --- start -------------
            var getOffersByRemote = function ($event) {

                console.log(book.estimate.distance)
                var hourlyLadda = Ladda.create($event.target);
                hourlyLadda.start();
                book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                BookBS.getOffersP2P(
                    book.type,
                    book.pickup,
                    book.dropoff,
                    book.estimate.distance / 1000,
                    book.estimate.duration / 60,
                    book.p2pDatetime,
                    $scope.airPort,
                    $scope.reAirPort,
                    2
                ).then(function (result) {
                    console.log(result)
                    if (result.data.code == '2100' || result.data.code == '3001') {
                        MessageBox.toast(T.T("booking.jsoffer_not_matched"), "info");
                        $scope.isGetOffer = false;
                        hourlyLadda.stop();
                        $scope.options = undefined;
                    } else if (typeof result.data == "string" || result.data.length < 1) {
                        $scope.isGetOffer = false;
                        MessageBox.toast(result.data, 'error');
                        hourlyLadda.stop();
                    } else {
                        $scope.isGetOffer = true;
                        $scope.bookTime.p2pPickupTime = book.p2pDatetime.valueOf();
                        $scope.bookAddress.p2pPickup = book.pickup;
                        $scope.bookAddress.p2pPickup.final_address = AddressTool.finalAddress(book.pickup);
                        $scope.bookAddress.p2pDropoff = book.dropoff;
                        $scope.bookAddress.p2pDropoff.final_address = AddressTool.finalAddress(book.dropoff);
                        hourlyLadda.stop();
                        $scope.initOption(result);
                        scrollPositions();
                    }
                }, function (error) {
                    $scope.isGetOffer = false;
                    hourlyLadda.stop();
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "3808") {
                            MessageBox.toast(T.T("booking.jsoffer_not_found"), 'error');
                        } else if (error.response.data.code == "3809") {
                            MessageBox.toast(T.T("booking.jsVehicles_not_found"), 'error');
                        } else if (error.response.data.code == "3810") {
                            MessageBox.toast(T.T("booking.jsDriver_not_found"), 'error');
                        } else {
                            MessageBox.toast(T.T("booking.jsoffer_not_found"), "error");
                        }

                    }
                });
            };
            //---------- 获取 Offer --- end -------------

            //------------- category ,car , driver , option 解析  start-------------

            // 1.从数据中解析出 category 所有类型

            var initCategory = function (data) {
                var categories = [];

                //循环遍历offer
                for (var i = 0; i < data.data.length; i++) {

                    //循环遍历offer 中的car_categories
                    for (var k = 0; k < data.data[i].car_categories.length; k++) {

                        var isNewCategory = true;

                        //循环对比category类型 如果是已知类型，直接在此类型下添加数据，如果未知类型，创建此新类型。
                        for (var j = 0; j < categories.length; j++) {
                            if (categories[j].category_id == data.data[i].car_categories[k].category_id) {
                                for (var m = 0; m < data.data[i].car_categories[k].cars.length; m++) {
                                    var option = $scope.initOptionData(data.data[i].options);
                                    data.data[i].car_categories[k].cars[m].options = jQuery.extend(true, {}, option);
                                    data.data[i].car_categories[k].cars[m].offer = data.data[i];
                                }
                                categories[j].cars = categories[j].cars.concat(data.data[i].car_categories[k].cars);
                                isNewCategory = false;
                            }
                        }

                        if (isNewCategory) {
                            var category = {
                                category: "",
                                category_id: "",
                                cars: [],
                                options: [],
                                offer: "",
                                isSelect: false
                            };
                            category.category_id = data.data[i].car_categories[k].category_id;
                            category.category = data.data[i].car_categories[k].category;
                            category.cars = data.data[i].car_categories[k].cars;
                            for (var m = 0; m < category.cars.length; m++) {
                                var option = $scope.initOptionData(data.data[i].options);
                                category.cars[m].options = jQuery.extend(true, {}, option);
                                category.cars[m].offer = data.data[i];
                                category.cars[m].isSelect = false;
                                for (var n = 0; n < category.cars[m].drivers.length; n++) {
                                    category.cars[m].drivers[n].isSelect = false;
                                    category.cars[m].drivers[n].an_offer = category.cars[m].offer.an_offer;
                                }
                            }
                            categories.push(category);
                        }
                    }
                }
                var noRepeatCategories = categories;

                // 对生成的car 增加序号
                for (var i = 0; i < noRepeatCategories.length; i++) {
                    for (var j = 0; j < noRepeatCategories[i].cars.length; j++) {
                        noRepeatCategories[i].cars[j].index = j;
                    }
                }
                return noRepeatCategories;
            };

            var firstLoad = true;
            $scope.initOption = function (data) {
                $scope.categories = [];
                $scope.book = book;
                $scope.categories = initCategory(data);
                $scope.categories[0].isSelect = true;
                $scope.categories[0].cars[0].isSelect = true;
                $scope.categories[0].cars[0].drivers[0].isSelect = true;
                $scope.carSelected = $scope.categories[0].cars[0];
                $scope.initBagCountAndPassengerCount($scope.carSelected);
                $scope.driverSelected = $scope.categories[0].cars[0].drivers[0];
                $scope.initDriversAndOptions();

                $timeout(function () {
                    if (firstLoad) {
                        $(".accordion").accordion({
                            header: 'h3.myselect',
                            active: false,
                            collapsible: true,
                            heightStyle: "content"
                        });
                    } else {
                        $(".accordion").accordion("refresh");
                        $(".accordion").accordion("option", "active", false);
                    }
                    firstLoad = false;
                }, 0);
            };

            $scope.initDriversAndOptions = function () {
                $scope.options = $scope.carSelected.options;
                $scope.offer = $scope.carSelected.offer;
                $scope.priceFormat = $scope.offer.ccy;
                $scope.accountingPrice();
            };

            $scope.onCarCardClick = function (category, car) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/book-selectdriver.html',
                    controller: 'BookSelectDriverCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: {
                                drivers: car.drivers
                            },
                            event: {
                                ok: function (selectDriver) {
                                    $scope.selectedDriverChange(category, car, selectDriver);
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

            $scope.initBagCountAndPassengerCount = function (selectCar) {
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
            };

            $scope.selectedDriverChange = function (selectCategory, selectCar, selectDriver) {
                angular.forEach($scope.categories, function (category) {
                    if (category.category_id == selectCategory.category_id) {
                        category.isSelect = true;
                        angular.forEach(category.cars, function (car) {
                            if (car.car_id == selectCar.car_id) {
                                if ($scope.bookType == 1 || $scope.bookType == 2) {
                                    if (car.offer.offer_id == selectCar.offer.offer_id) {
                                        car.isSelect = true;
                                        angular.forEach(car.drivers, function (driver) {
                                            if (driver.driver_id == selectDriver.driver_id) {
                                                driver.isSelect = true;
                                            } else {
                                                driver.isSelect = false;
                                            }
                                        })
                                    } else {
                                        car.isSelect = false;
                                        angular.forEach(car.drivers, function (driver) {
                                            driver.isSelect = false;
                                        })
                                    }
                                } else {
                                    car.isSelect = true;
                                    angular.forEach(car.drivers, function (driver) {
                                        if (driver.driver_id == selectDriver.driver_id) {
                                            driver.isSelect = true;
                                        } else {
                                            driver.isSelect = false;
                                        }
                                    })
                                }
                            } else {
                                car.isSelect = false;
                                angular.forEach(car.drivers, function (driver) {
                                    driver.isSelect = false;
                                })
                            }
                        })
                    } else {
                        category.isSelect = false;
                        angular.forEach(category.cars, function (car) {
                            car.isSelect = false;
                            angular.forEach(car.drivers, function (driver) {
                                driver.isSelect = false;
                            })
                        })
                    }
                });

                if ($scope.carSelected.car_id != selectCar.car_id) {
                    $scope.initBagCountAndPassengerCount(selectCar);
                }
                $scope.carSelected = selectCar;
                $scope.driverSelected = selectDriver;
                if ($scope.bookType == 1 || $scope.bookType == 2) {
                    $scope.initDriversAndOptions();
                }
            };

            $scope.initOptionData = function (options) {

                var formatOptions = {number: [], checkBox: [], radioGroup: [], checkBoxGroup: [], numberGroup: []};
                for (var i = 0; i < options.length; i++) {
                    var option = options[i];
                    if (option.type == "NUMBER") {
                        option.count = 0;
                        option.enable = false;
                        if (option.add_max > 1) {
                            formatOptions.number.push(option);
                        } else {
                            formatOptions.checkBox.push(option);
                        }
                    } else if (option.type == "CHECKBOX") {
                        option.count = 0;
                        option.enable = false;
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

            //-------------category ,car , driver , option  解析  end-------------
            //初始化页面控件
            $scope.init = function () {
                //init 选项卡
                $scope.clickOneWay = function () {
                    $scope.options = undefined;
                    book.type = 1;
                    $scope.bookType = 1;
                    $scope.isGetOffer = false;
                    $scope.bookPickUpAddress = '';
                    $scope.bookDropOffAddress = '';
                    $scope.airPort = false;
                    $scope.reAirPort = false;
                    $scope.FlightsList = '';
                    $scope.airlineCompanyMessage = '';
                    $scope.airLineMessage = null;
                    $scope.airLineCompanyFs = null;
                    $scope.airLineMessageNum = null;
                    $scope.reAirLineMessage = null;
                    $scope.reAirLineCompanyFs = null;
                    $scope.reAirLineMessageNum = null;
                    $scope.dropFlightsList = '';
                    $scope.isAirport = false;
                    $scope.isDropAirport = false;
                    $scope.isPickMarkedWords = false;
                    $scope.isDropMarkedWords = false;
                    resetCouponCode();
                };
                $scope.clickHourly = function () {
                    $scope.options = undefined;
                    book.type = 2;
                    $scope.bookType = 2;
                    $scope.isGetOffer = false;
                    $scope.airPort = false;
                    $scope.reAirPort = false;
                    $scope.airLineMessage = null;
                    $scope.airLineCompanyFs = null;
                    $scope.airLineMessageNum = null;
                    $scope.reAirLineMessage = null;
                    $scope.reAirLineCompanyFs = null;
                    $scope.reAirLineMessageNum = null;
                    $scope.bookHourlyAddress = '';
                    $scope.FlightsList = '';
                    $scope.airlineCompanyMessage = '';
                    $scope.dropFlightsList = '';
                    $scope.isAirport = false;
                    $scope.isDropAirport = false;
                    $scope.isPickMarkedWords = false;
                    $scope.isDropMarkedWords = false;
                    resetCouponCode();
                };
                $scope.clickCustomQuote = function () {
                    $scope.options = undefined;
                    book.type = 3;
                    $scope.bookType = 3;
                    $scope.isGetOffer = false;
                    $scope.airPort = false;
                    $scope.reAirPort = false;
                    $scope.airLineMessage = null;
                    $scope.airLineCompanyFs = null;
                    $scope.airLineMessageNum = null;
                    $scope.reAirLineMessage = null;
                    $scope.reAirLineCompanyFs = null;
                    $scope.reAirLineMessageNum = null;
                    $scope.bookCustomAddress = '';
                    $scope.FlightsList = '';
                    $scope.airlineCompanyMessage = '';
                    $scope.dropFlightsList = '';
                    $scope.isAirport = false;
                    $scope.isDropAirport = false;
                    $scope.isPickMarkedWords = false;
                    $scope.isDropMarkedWords = false;
                    resetCouponCode();
                };

                //init datetimepicker
                var date = new Date();
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                book.p2pDatetime = new Date((tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear() + ' ' + "12:00 PM");
                $('.datetimepicker').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: date,
                    defaultDate: book.p2pDatetime,
                    sideBySide: true,
                    locale: $scope.langStyle
                });

                book.hourlyDatetime = new Date((tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear() + ' ' + "12:00 PM");
                $('.datetimepicker2').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: date,
                    defaultDate: book.hourlyDatetime,
                    sideBySide: true,
                    locale: $scope.langStyle
                });

                book.customStartDateTime = new Date((tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear() + ' ' + "12:00 PM");
                $('.datetimepicker3').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: date,
                    defaultDate: book.customStartDateTime,
                    sideBySide: true,
                    locale: $scope.langStyle
                });

                book.customEndDateTime = new Date((tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear() + ' ' + "01:00 PM");
                $('.datetimepicker4').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: date,
                    defaultDate: book.customEndDateTime,
                    sideBySide: true,
                    locale: $scope.langStyle
                });

                //init  mapselect
                $scope.getLocation = function (val) {

                    if ($scope.airPort) {
                        $scope.airPort = false;
                        $scope.FlightsList = '';
                        $scope.airlineCompanyMessage = '';
                        $scope.airLineMessage = null;
                        $scope.airLineCompanyFs = null;
                        $scope.airLineMessageNum = null;
                    }
                    resetCouponCode();
                    $scope.isPickMarkedWords = false;
                    return MapTool.getSearchLocations(val);
                };
                $scope.getDropLocation = function (val) {
                    if ($scope.reAirPort) {
                        $scope.reAirPort = false;
                        $scope.dropFlightsList = '';
                        $scope.airDroplineCompanyMessage = '';
                        $scope.reAirLineMessage = null;
                        $scope.reAirLineCompanyFs = null;
                        $scope.reAirLineMessageNum = null;
                    }
                    resetCouponCode();
                    $scope.isDropMarkedWords = false;
                    return MapTool.getSearchLocations(val);
                };

                $scope.getAirlineCompany = function (val) {
                    if ($scope.haveAirline) {
                        return AirLineTool.matchingAirlineCompany(val, $scope.FlightsList);
                    } else {
                        $scope.airLineMessage = val;
                        $scope.airLineCompanyFs = val;
                    }
                };
                $scope.getDropAirlineCompany = function (val) {
                    if ($scope.haveDropAirline) {
                        return AirLineTool.matchingAirlineCompany(val, $scope.dropFlightsList);
                    } else {
                        $scope.reAirLineMessage = val;
                        $scope.reAirLineCompanyFs = val;
                    }
                };

                $scope.onAirlineCompanySearchSelect = function ($item) {
                    $scope.airlineCompanyMessage = $item;
                    $scope.airLineCompanyFs = $item.fs;
                    $scope.airLineMessage = $item.name;
                };

                $scope.onDropAirlineCompanySearchSelect = function ($item) {
                    $scope.airDroplineCompanyMessage = $item;
                    $scope.reAirLineCompanyFs = $item.fs;
                    $scope.reAirLineMessage = $item.name;
                };

                $scope.getAirlineNumber = function (val) {
                    if ($scope.haveAirline) {
                        return AirLineTool.matchingAirlineNumber(val, $scope.airlineCompanyMessage)
                    } else {
                        $scope.airLineMessageNum = val;
                    }
                };

                $scope.getDropAirlineNumber = function (val) {
                    if ($scope.haveDropAirline) {
                        return AirLineTool.matchingAirlineNumber(val, $scope.airDroplineCompanyMessage)
                    } else {
                        $scope.reAirLineMessageNum = val;
                    }
                };

                $scope.onAirlineNumberSearchSelect = function ($item) {
                    $scope.airLineMessageNum = $item.flightNumber;
                };

                $scope.onDropAirlineNumberSearchSelect = function ($item) {
                    $scope.reAirLineMessageNum = $item.flightNumber;
                };

                $scope.onPickUpSearchSelect = function ($item, $model, $label, $event) {

                    $scope.airPort = $item.isAirport;
                    if ($item.isAirport) {
                        $scope.isAirport = true;
                        var pickUpLocation = $item.geometry.location;
                        book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                        var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                        $scope.getFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 0, p2pDatetime);
                    } else {
                        $scope.isAirport = false;
                    }
                    book.pickup = $item;
                    book.pickup.geometry.location = {
                        lat: book.pickup.geometry.location.lat(),
                        lng: book.pickup.geometry.location.lng()
                    };
                    $scope.bookPickUpAddress = $item.formatted_address;
                    $scope.PickUpAddress = $item.formatted_address;

                    // MapTool.geocoderAddress(book.pickup.geometry.location.lat, book.pickup.geometry.location.lng, function (result) {
                    //     $timeout(function () {
                    //         $scope.airPort = result.isAirport;
                    //         if (result.isAirport) {
                    //             $scope.isAirport = true;
                    //             var pickUpLocation = result.geometry.location;
                    //             book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                    //             var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                    //             $scope.getFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 0, p2pDatetime);
                    //         } else {
                    //             $scope.isAirport = false;
                    //         }
                    //         book.pickup = result;
                    //         book.pickup.geometry.location = {
                    //             lat: book.pickup.geometry.location.lat(),
                    //             lng: book.pickup.geometry.location.lng()
                    //         };
                    //         $scope.bookPickUpAddress = result.formatted_address;
                    //         $scope.PickUpAddress = result.formatted_address;
                    //
                    //     }, 0);
                    // }, function (error) {
                    // });
                };

                $(".datetimepicker").on('dp.change', function () {
                    $timeout(function () {
                        if ($scope.isAirport) {
                            $scope.isPickMarkedWords = true;
                            $scope.airPort = true;
                            $scope.FlightsList = '';
                            $scope.airlineCompanyMessage = '';
                            $scope.airLineMessage = null;
                            $scope.airLineCompanyFs = null;
                            $scope.airLineMessageNum = null;
                            book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                            var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                            $scope.getFlightsList(book.pickup.geometry.location.lat, book.pickup.geometry.location.lng, 0, p2pDatetime);
                        }
                        if ($scope.isDropAirport) {
                            $scope.isDropMarkedWords = true;
                            $scope.reAirPort = true;
                            $scope.dropFlightsList = '';
                            $scope.airDroplineCompanyMessage = '';
                            $scope.reAirLineMessage = null;
                            $scope.reAirLineCompanyFs = null;
                            $scope.reAirLineMessageNum = null;
                            book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                            var p2pDropDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                            $scope.getDropFlightsList(book.dropoff.geometry.location.lat, book.dropoff.geometry.location.lng, 1, p2pDropDatetime);
                        }
                    }, 0);
                });

                $scope.onDropOffSearchSelect = function ($item, $model, $label, $event) {
                    book.dropoff = $item;
                    book.dropoff.geometry.location = {
                        lat: book.dropoff.geometry.location.lat(),
                        lng: book.dropoff.geometry.location.lng()
                    };

                    $scope.reAirPort = $item.isAirport;
                    if ($item.isAirport) {
                        $scope.isDropAirport = true;
                        var pickUpLocation = $item.geometry.location;
                        book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                        var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                        $scope.getDropFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 1, p2pDatetime);
                    } else {
                        $scope.isDropAirport = false;
                    }

                    $scope.bookDropOffAddress = $item.formatted_address;

                    // MapTool.geocoderAddress(book.dropoff.geometry.location.lat, book.dropoff.geometry.location.lng, function (result) {
                    //     $timeout(function () {
                    //         $scope.reAirPort = result.isAirport;
                    //         if (result.isAirport) {
                    //             $scope.isDropAirport = true;
                    //             var pickUpLocation = result.geometry.location;
                    //             book.p2pDatetime = $('.datetimepicker').data("DateTimePicker").date()._d;
                    //             var p2pDatetime = parseInt((new Date(book.p2pDatetime).valueOf() + "").substr(0, 10));
                    //             $scope.getDropFlightsList(pickUpLocation.lat(), pickUpLocation.lng(), 1, p2pDatetime);
                    //         } else {
                    //             $scope.isDropAirport = false;
                    //         }
                    //         book.dropoff = result;
                    //         book.dropoff.geometry.location = {
                    //             lat: book.dropoff.geometry.location.lat(),
                    //             lng: book.dropoff.geometry.location.lng()
                    //         };
                    //         $scope.bookDropOffAddress = result.formatted_address;
                    //     }, 0)
                    // }, function (error) {
                    // });
                };

                $scope.onHourlySearchSelect = function ($item, $model, $label, $event) {
                    $timeout(function () {
                        $scope.airPort = $item.isAirport;
                        book.hourlyPickup = $item;
                        book.hourlyPickup.geometry.location = {
                            lat: book.hourlyPickup.geometry.location.lat(),
                            lng: book.hourlyPickup.geometry.location.lng()
                        };
                        if (book.type == 2) {
                            if ($item.isAirport) {
                                $scope.isAirport = true;
                                var pickUpLocation = $item.geometry.location;
                                book.hourlyDatetime = $('.datetimepicker2').data("DateTimePicker").date()._d;
                                var hourlyDatetime = parseInt((new Date(book.hourlyDatetime).valueOf() + "").substr(0, 10));
                                $scope.getFlightsList(pickUpLocation.lat, pickUpLocation.lng, 0, hourlyDatetime);
                            } else {
                                $scope.isAirport = false;
                            }
                            $scope.bookHourlyAddress = $item.formatted_address;
                            $(".datetimepicker2").on('dp.change', function () {
                                $timeout(function () {
                                    if ($scope.isAirport) {
                                        $scope.isPickMarkedWords = true;
                                        $scope.airPort = true;
                                        $scope.FlightsList = '';
                                        $scope.airlineCompanyMessage = '';
                                        $scope.airLineMessage = null;
                                        $scope.airLineCompanyFs = null;
                                        $scope.airLineMessageNum = null;
                                        book.hourlyDatetime = $('.datetimepicker2').data("DateTimePicker").date()._d;
                                        hourlyDatetime = parseInt((new Date(book.hourlyDatetime).valueOf() + "").substr(0, 10));
                                        $scope.getFlightsList(pickUpLocation.lat, pickUpLocation.lng, 0, hourlyDatetime);
                                    }
                                }, 0);
                            });
                        } else {
                            if ($item.isAirport) {
                                $scope.isAirport = true;
                                var pickUpLocation = $item.geometry.location;
                                book.customStartDateTime = $('.datetimepicker3').data("DateTimePicker").date()._d;
                                var appointed_time = parseInt((book.customStartDateTime.valueOf() + "").substr(0, 10));
                                $scope.getFlightsList(pickUpLocation.lat, pickUpLocation.lng, 0, appointed_time);
                            } else {
                                $scope.isAirport = false;
                            }
                            $scope.bookCustomAddress = $item.formatted_address;
                            $(".datetimepicker3").on('dp.change', function () {
                                $timeout(function () {
                                    if ($scope.isAirport) {
                                        $scope.isPickMarkedWords = true;
                                        $scope.airPort = true;
                                        $scope.FlightsList = '';
                                        $scope.airlineCompanyMessage = '';
                                        $scope.airLineMessage = null;
                                        $scope.airLineCompanyFs = null;
                                        $scope.airLineMessageNum = null;
                                        book.customStartDateTime = $('.datetimepicker3').data("DateTimePicker").date()._d;
                                        appointed_time = parseInt((new Date(book.customStartDateTime).valueOf() + "").substr(0, 10));
                                        $scope.getFlightsList(pickUpLocation.lat, pickUpLocation.lng, 0, appointed_time);
                                    }
                                }, 0);
                            });
                        }
                    }, 0);

                };
            };

            $scope.init();

            //user
            $scope.onSearchSelect = function (client) {
                $scope.cards = [];
                CardBS.getFromCurrentUser(client.customer_id).then(function (result) {
                    if (typeof result.data == "string") {
                    } else {
                        angular.forEach(result.data, function (card, index) {
                            if (index == 0) {
                                card.isSelect = true;
                            } else {
                                card.isSelect = false;
                            }
                        });
                        $scope.cards = result.data;
                        $scope.selectedCard = $scope.cards[0];
                    }

                    $timeout(function () {
                        $(".pay-more").click(function () {
                            $(this).nextUntil(1).fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".payment-active").click(function () {
                            $(this).parent().find(".pay-act-panel").fadeIn(200);
                        });
                        $(".card-del-cancel").click(function () {
                            $(this).parents(".pay-act-panel").fadeOut(200);
                        });
                        $(".card-del-ok").click(function () {
                            $(this).parents(".pay-act-panel").fadeOut(200);
                        });
                    }, 0);
                }, function (error) {
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("booking.jsPull_up_payment_info_error"), "error");
                    }
                });
            };

            $scope.onDeleteCardButtonClick = function (index) {
                PaymentBS.deleteCardByClient($scope.customerSelected.customer_id, $scope.cards[index].card_token).then(function (result) {
                    MessageBox.hideLoading();
                    $scope.onSearchSelect($scope.customerSelected);
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast("Delete Failed", "error");
                    }
                });
            };

            $scope.onSelectedCard = function (selectIndex) {
                $timeout(function () {
                    var tempCard = angular.copy($scope.cards);
                    angular.forEach(tempCard, function (card, index) {
                        if (index == selectIndex) {
                            card.isSelect = true;
                        } else {
                            card.isSelect = false;
                        }
                    });

                    $scope.cards = tempCard;
                    $scope.selectedCard = $scope.cards[selectIndex];
                    $scope.$apply();

                    $(".pay-more").click(function () {
                        $(this).nextUntil(1).fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".payment-active").click(function () {
                        $(this).parent().find(".pay-act-panel").fadeIn(200);
                    });
                    $(".card-del-cancel").click(function () {
                        $(this).parents(".pay-act-panel").fadeOut(200);
                    });
                    $(".card-del-ok").click(function () {
                        $(this).parents(".pay-act-panel").fadeOut(200);
                    });
                }, 0);
            };

            $scope.onAddCardClick = function () {
                if (!$scope.customerSelected.customer_id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'templates/dashboard/credit-card-add.html',
                        controller: 'CreditCardAddCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            $stateParams: {
                                data: {
                                    customerId: $scope.data.customer_id
                                },
                                event: {
                                    addSuccess: function () {
                                        modalInstance.dismiss();
                                        $scope.onSearchSelect($scope.data);
                                    },
                                    cancel: function () {
                                        modalInstance.dismiss();
                                    }
                                }
                            }
                        }
                    });
                } else {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'templates/dashboard/credit-card-add.html',
                        controller: 'CreditCardAddCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            $stateParams: {
                                data: {
                                    customerId: $scope.customerSelected.customer_id
                                },
                                event: {
                                    addSuccess: function () {
                                        modalInstance.dismiss();
                                        $scope.onSearchSelect($scope.customerSelected);
                                    },
                                    cancel: function () {
                                        modalInstance.dismiss();
                                    }
                                }
                            }
                        }
                    });
                }

            };

            $scope.getCardType = function (typeId) {
                switch (typeId) {
                    case "1":
                        return "Visa";
                    case "2":
                        return "MasterCard";
                    case "3":
                        return "AmericanExpress";
                    case "4":
                        return "Discover";
                    default:
                        return "";
                }
            };

            $scope.customPriceChanged = function () {
                // resetCouponCode();
                if ($scope.customCost > 0 && $scope.customCost < 1) {
                    $scope.customCost = 1;
                }
                $scope.finalCustomCost = $scope.customCost - $scope.amountOff - $scope.percent_off / 100 * ($scope.customCost - $scope.amountOff);
                if ($scope.finalCustomCost < 0) {
                    $scope.finalCustomCost = 0;
                }
                if ($scope.finalCustomCost > 0 && $scope.finalCustomCost < 1) {
                    $scope.finalCustomCost = 1;
                }
            };

            $scope.onRequestCustomerApprovalChanged = function () {
                if ($scope.customDetermine == 1) {
                    $scope.customDetermine = 0;
                } else {
                    $scope.customDetermine = 1;
                }
            };

            $scope.onAddButtonClick = function () {
                addClient();
            };

            var addClient = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/client-add.html',
                    controller: 'ClientAddCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            event: {
                                addSuccess: function () {
                                    modalInstance.dismiss();
                                    loadData();
                                },
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }
                    }
                });
            };


            $scope.$watchGroup(['bookPickUpAddress', 'bookDropOffAddress',
                    'bookHourlyAddress', 'hourlyDate', 'bookCustomAddress'],
                function (n, o) {
                    nWatchedModelChangeCount++;
                });

            $scope.$on('$locationChangeStart', function (event, newUrl) {
                if (nWatchedModelChangeCount <= 1) return;
                event.preventDefault();
                MessageBox.confirm(T.T('alertTitle.warning'), T.T('booking.jsExit_easy_book_warning'), function (isConfirm) {
                    if (isConfirm) {
                        $timeout(function () {
                            var index = newUrl.toString().indexOf('#/');
                            if (index > -1) {
                                var state = newUrl.toString().substring(index + 2);
                                $state.go(state);
                            }
                        }, 10);
                    }
                });
            });
            $scope.onAddClientClick = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/client-add.html',
                    controller: 'ClientAddCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            event: {
                                addSuccess: function (data) {
                                    modalInstance.dismiss();
                                },
                                cancel: function () {
                                    modalInstance.dismiss();
                                },
                                Data: function (data) {
                                    $scope.data = {customer_id: ''};
                                    $scope.customerSelected = data.data.first_name + ' ' + data.data.last_name;
                                    $scope.data.customer_id = data.data.customer_id;
                                    $scope.onSearchSelect($scope.data);

                                }
                            }
                        }
                    }
                });
            };
            $scope.getFlightsList = function (lat, lng, type, time) {
                AirLineTool.getFlightsList(lat, lng, type, time).then(function (result) {
                    if (result.data.code == '2100') {
                        $scope.haveAirline = false;
                    } else {
                        $scope.haveAirline = true;
                        $scope.FlightsList = result.data.result;
                    }
                }, function (error) {
                    console.log(error);
                });
            };

            $scope.getDropFlightsList = function (lat, lng, type, time) {
                AirLineTool.getFlightsList(lat, lng, type, time).then(function (result) {
                    if (result.data.code == '2100') {
                        $scope.haveDropAirline = false;
                    } else {
                        $scope.haveDropAirline = true;
                        $scope.dropFlightsList = result.data.result;
                    }
                }, function (error) {
                    console.log(error);
                });
            };

            function resetCouponCode() {
                $scope.promo_code_shown = false;
                $scope.checkingCode = true;
                $scope.couponCode = '';
                $scope.amountOff = 0;
                $scope.percent_off = 0;
                $scope.finalCustomCost = 0;
                $scope.haveVerifyCode = false;
            }

            //Created by pham 3/22/2018
            function make_dateTime_from_timeStamp(timeStamp) {

                var dateTime = (timeStamp.getYear() + 1900) + "-";

                var month = timeStamp.getMonth() + 1 ;

                if(month < 10)
                {
                    month = "0" + month;
                }

                dateTime = dateTime + month + "-";

                var day = timeStamp.getDate();

                if(day < 10)
                {
                    day = "0" + day;
                }

                dateTime = dateTime + day;

                return dateTime;
            }

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


            //Modifed by pham 3/22/2018
            $scope.getCouponCode = function ($event) {

                var timeStamp = new Date(book.p2pDatetime.valueOf());

                var appointedTime = make_dateTime_from_timeStamp(timeStamp);

                
                if ($scope.checkingCode) {
                    return;
                }
                $scope.checkingCode = true;

                if ($scope.couponCode == null || $scope.couponCode == undefined || $scope.couponCode.trim(' ') == '') {
                    $scope.checkingCode = false;
                    MessageBox.toast(T.T('booking.jsPromo_Code_Not_Null'), 'error');
                    return;
                }
                
                var ladda = Ladda.create($event.target);
                ladda.start();

                if (!$scope.customerSelected) {
                    MessageBox.toast(T.T("booking.jsselect_client"), "error");
                    $scope.checkingCode = false;
                    ladda.stop();
                    return;
                }


                BookBS.verifyCoupon_self($rootScope.loginUser.company_id, $scope.couponCode, appointedTime, $scope.customerSelected.customer_id).then(
                    function (result) {
                        /*if (!result.data.valid) {
                            MessageBox.toast(T.T('alertTitle.error'), T.T('booking.jsCode_Used'), 'error');
                        } else {*/
                            if (result.data[0].discount_type == 1) {
                                $scope.percent_off = result.data[0].discount_amount;
                                $scope.amountOff = 0;
                            } else {
                                $scope.percent_off = 0;
                                $scope.amountOff = result.data[0].discount_amount;
                            }
                            $scope.haveVerifyCode = true;
                            if ($scope.bookType !== 3) {
                                $scope.accountingPrice();
                            } else {
                                $scope.finalCustomCost = $scope.customCost - $scope.amountOff - $scope.percent_off / 100 * ($scope.customCost - $scope.amountOff);
                            }
                        //}
                        $scope.checkingCode = false;
                        ladda.stop();
                    }, function (error) {
                        $scope.checkingCode = false;
                        ladda.stop();
                        MessageBox.toast(T.T('booking.jsCoupon_Not_Valid'), 'error');
                    }
                );
            };
        }
    );

/**
 * Created by jian on 17-1-6.
 */
angular.module('KARL.Controllers')
    .controller('calendarSelectCarsCtrl', function ($scope, $stateParams, $timeout, $uibModal, BookBS, MessageBox,T) {
        $scope.initCars = $stateParams.data.car_data;
        console.log($stateParams.data)
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.initOption = function (data) {
            $scope.categories = [];
            $scope.categories = data;

            angular.forEach($scope.categories, function (category) {
                if (category.category_id == $scope.initCars.car_category_id) {
                    category.isSelect = true;
                    angular.forEach(category.cars, function (car) {
                        if (car.car_id == $scope.initCars.car_id) {
                            $scope.initCarId = car.car_id;
                            if (car.offer.offer_id == $stateParams.data.offer_data.offer_id) {
                                $scope.initOfferId = car.offer.offer_id;
                                car.isSelect = true;
                                angular.forEach(car.drivers, function (driver) {
                                    if (driver.driver_id == $stateParams.data.driver_data.driver_id) {
                                        driver.isSelect = true;
                                        $scope.driverSelected = driver;
                                        console.log($scope.driverSelected)
                                    } else {
                                        driver.isSelect = false;
                                    }
                                })
                            } else {
                                car.isSelect = false;
                                angular.forEach(car.drivers, function (driver) {
                                    driver.isSelect = false;
                                })
                            }
                        } else {
                            car.isSelect = false;
                            angular.forEach(car.drivers, function (driver) {
                                driver.isSelect = false;
                            })
                        }
                    })
                } else {
                    category.isSelect = false;
                    angular.forEach(category.cars, function (car) {
                        car.isSelect = false;
                        angular.forEach(car.drivers, function (driver) {
                            driver.isSelect = false;
                        })
                    })
                }
            });

            var firstLoad = true;
            $timeout(function () {
                if (firstLoad) {
                    $(".accordion").accordion({
                        header: 'h3.myselect',
                        active: false,
                        collapsible: true,
                        heightStyle: "content"
                    });
                } else {
                    $(".accordion").accordion("refresh");
                    $(".accordion").accordion("option", "active", false);
                }
                firstLoad = false;
            }, 0);
        };

        $scope.initOption($stateParams.event.totalCarsData);


        $scope.selectedDriverChange = function (selectCategory, selectCar, selectDriver) {
            $scope.editcarsId = selectCar.car_id;
            $scope.editDriverId = selectDriver.driver_id;
            $scope.editOfferId = selectCar.offer.offer_id;
            $scope.editFreeFee = (selectCar.offer.basic_cost - $stateParams.data.base_cost).toFixed(2);
            angular.forEach($scope.categories, function (category) {
                if (category.category_id == selectCategory.category_id) {
                    category.isSelect = true;
                    angular.forEach(category.cars, function (car) {
                        if (car.car_id == selectCar.car_id) {
                            if (car.offer.offer_id == selectCar.offer.offer_id) {
                                car.isSelect = true;
                                angular.forEach(car.drivers, function (driver) {
                                    if (driver.driver_id == selectDriver.driver_id) {
                                        driver.isSelect = true;
                                    } else {
                                        driver.isSelect = false;
                                    }
                                })
                            } else {
                                car.isSelect = false;
                                angular.forEach(car.drivers, function (driver) {
                                    driver.isSelect = false;
                                })
                            }

                        } else {
                            car.isSelect = false;
                            angular.forEach(car.drivers, function (driver) {
                                driver.isSelect = false;
                            })
                        }
                    })
                } else {
                    category.isSelect = false;
                    angular.forEach(category.cars, function (car) {
                        car.isSelect = false;
                        angular.forEach(car.drivers, function (driver) {
                            driver.isSelect = false;
                        })
                    })
                }
            });

            $scope.carSelected = selectCar;
            $scope.driverSelected = selectDriver;
        };

        $scope.onCarCardClick = function (category, car) {
            if(car.in_an) {
                $scope.selectedDriverChange(category, car, car.drivers[0]);
            }else{
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/calendar-selectdrivers.html',
                    controller: 'calendarSelectDriversCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: {
                                drivers: car.drivers
                                // initDrivers:$stateParams.data.driver_data
                            },
                            event: {
                                ok: function (selectDriver) {
                                    $scope.selectedDriverChange(category, car, selectDriver);
                                    modalInstance.dismiss();
                                },
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }
                    }
                });
            }
        };


        $scope.onEditButtonClick = function ($event) {
            if(!$scope.editOfferId||!$scope.editcarsId||!$scope.editDriverId){
                MessageBox.toast(T.T('calendar_selectcars.jsSelect_The_Driver'), "error");
            }else {
                var param = {
                    type: $stateParams.data.type,
                    offer_id: $scope.editOfferId,
                    car_id: $scope.editcarsId,
                    driver_id: $scope.editDriverId,
                    appointed_time: $stateParams.data.appointed_at,
                    estimate_duration: $stateParams.data.estimate_time,
                    d_lat: $stateParams.data.d_lat,
                    d_lng: $stateParams.data.d_lng,
                    estimate_distance: $stateParams.data.estimate_distance,
                    d_address: $stateParams.data.d_address,
                    a_lat: $stateParams.data.a_lat,
                    a_lng: $stateParams.data.a_lng,
                    a_address: $stateParams.data.a_address,
                    free_fee: $scope.editFreeFee
                };
                MessageBox.showLoading();
                var editLadda = Ladda.create($event.target);
                editLadda.start();
                BookBS.editBookingCars(
                    $stateParams.bookId,
                    JSON.stringify(param)
                ).then(
                    function (result) {
                        MessageBox.hideLoading();
                        $stateParams.event.getCarsMessages(result.data.result);
                        $stateParams.event.getDriverNameToCalendar(result.data.result.driver_data);
                        MessageBox.toast(T.T('calendar_selectcars.jsEdit_Booking_Successfully'), "Success");
                        $stateParams.event.editSuccess(result.data.result);
                        editLadda.stop();
                    }, function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                        }
                        else {
                            MessageBox.toast(T.T('calendar_selectcars.jsEdit_Booking_Failed'), "error");
                        }
                        editLadda.stop();
                    }
                )
            }

        }

    });
/**
 * Created by jian on 17-1-10.
 */
angular.module('KARL.Controllers')
    .controller('calendarSelectDriversCtrl', function ($scope, $stateParams,$timeout) {
console.log($stateParams);
        $scope.initDriver=$stateParams.data.initDrivers;
        $timeout(function () {
            angular.element('#selectDriverForm').validator();
        },0);

        $scope.drivers = $stateParams.data.drivers;
        $scope.input = {};
        angular.forEach($scope.drivers,function (driver,index) {
            if(driver.isSelect){
                $scope.input.selectedIndex = index;
            }
        });

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onSaveButtonClick = function (valid) {
            if(!valid){
                return;
            }
            if ($stateParams.event.ok) {
                $stateParams.event.ok($scope.drivers[$scope.input.selectedIndex]);
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('CalendarCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $stateParams, $timeout, $filter, uiCalendarConfig, MessageBox, BookBS, OfferBS,T) {
        if(!$rootScope.loginUser){
            return;
        }
        var dayGroupEvents = {};
        var companyId = $rootScope.loginUser.company_id;
        $scope.events = [];
        $scope.eventSources = [$scope.events];
        $scope.bookings = [];
        $scope.showSearchResult = false;
        $scope.showNoRatesView = false;
        $scope.showCalendarView = false;
        $scope.saveDate='';
        $scope.currentPage = 1;
        $scope.pagePerCount = 30;
        var preDayCell;
        var lastSelect;
        //加载数据标记
        var initData = true;

        /* alert on eventClick */
        $scope.onEventClick = function (event, jsEvent, view) {
            if (initData) {
                return;
            }
            initData = true;
            $scope.bookings = [];
            $scope.bookingTotalCount = 0;

            var newDate = event.start._d;
            $scope.selectedDay = newDate;

            var day = $filter('date')(newDate, "yyyy-MM-dd");
            lastSelect = day;
            angular.element(preDayCell).css('background-color', '');
            angular.element(".fc-" + lastSelect).css('background-color', '#3c7ace');
            preDayCell = angular.element(".fc-" + lastSelect);

            if (dayGroupEvents[$filter('date')(newDate, "yyyy-MM-dd")]) {
                MessageBox.showLoading();
                BookBS.ratesInOneDayFromCurrentCompany(newDate).then(function (detailResult) {
                    MessageBox.hideLoading();
                    $scope.pageTotalItems = detailResult.total;
                    $scope.saveDate=newDate;
                    var onedayBookings = [];
                    var bookings = detailResult.data;
                    if (bookings && bookings.length > 0) {
                        for (var i = 0; i < bookings.length; i++) {
                            bookings[i].driver_data = JSON.parse(bookings[i].driver_data);
                            bookings[i].car_data = JSON.parse(bookings[i].car_data);
                            onedayBookings.push(bookings[i]);
                        }
                    }
                    $scope.bookings = integrationBookingInOnedayByHourly(onedayBookings);
                    $scope.bookingTotalCount = onedayBookings.length;

                    $timeout(function () {
                        originalBookings = onedayBookings;
                        if (searchText && $scope.showSearchResult) {
                            $scope.searchResult = getSearchBookingResult(originalBookings, searchText);
                        } else {
                            $scope.searchResult = originalBookings;
                        }
                        $scope.$apply();
                    }, 0);
                    initData = false;
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("calendar.jsGet_list_fail"), "error");
                    }
                    initData = false;
                });
            }
        };
        $scope.onDayClick = function (date, jsEvent, view) {
            if(!jsEvent.target.className){
                return
            }
            //加载中返回
            if (initData) {
                return;
            }
            initData = true;
            $scope.bookings = [];
            $scope.bookingTotalCount = 0;

            var longDay = Date.parse(date._d);
            longDay = longDay + date._d.getTimezoneOffset() * 60 * 1000;
            var newDate = new Date(longDay);

            $scope.selectedDay = newDate;

            var day = $filter('date')(newDate, "yyyy-MM-dd");
            lastSelect = day;
            angular.element(preDayCell).css('background-color', '');
            angular.element(this).css('background-color', '#3c7ace');
            preDayCell = this;

            if (dayGroupEvents[$filter('date')(newDate, "yyyy-MM-dd")]) {
                MessageBox.showLoading();
                BookBS.ratesInOneDayFromCurrentCompany(newDate).then(function (detailResult) {
                    MessageBox.hideLoading();
                    $scope.pageTotalItems = detailResult.total;
                    $scope.saveDate=newDate;
                    var onedayBookings = [];
                    var bookings = detailResult.data;
                    if (bookings && bookings.length > 0) {
                        for (var i = 0; i < bookings.length; i++) {
                            bookings[i].driver_data = JSON.parse(bookings[i].driver_data);
                            bookings[i].car_data = JSON.parse(bookings[i].car_data);
                            onedayBookings.push(bookings[i]);
                        }
                    }
                    $scope.bookings = integrationBookingInOnedayByHourly(onedayBookings);
                    $scope.bookingTotalCount = onedayBookings.length;

                    $timeout(function () {
                        originalBookings = onedayBookings;
                        if (searchText && $scope.showSearchResult) {
                            $scope.searchResult = getSearchBookingResult(originalBookings, searchText);
                        } else {
                            $scope.searchResult = originalBookings;
                        }
                        $scope.$apply();
                    }, 0);
                    initData = false;
                }, function (error) {
                    MessageBox.hideLoading();
                    initData = false;
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("calendar.jsGet_list_fail"), "error");
                    }
                });
            } else {
                //不加载数据
                initData = false;
            }
        };

        $scope.onBookRowClick = function (booking) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/book-detail.html',
                controller: 'BookDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            bookingId: booking.id,
                            appointedTime: booking.appointed_at
                        },
                        event: {
                            driverName: function (driverData) {
                                booking.driver_data.first_name = JSON.parse(driverData).first_name;
                                booking.driver_data.last_name = JSON.parse(driverData).last_name;
                            },
                            cancel: function (isSuspended,order_state,trip_state) {
                                modalInstance.dismiss();
                                if (isSuspended == 0) {
                                    booking.condition = 1;
                                    booking.tripStateString = T.T('calendar.jsTrip_Suspended');
                                    if (booking.showState == 3) {
                                        if (companyId == booking.own_company_id && companyId != booking.exe_company_id) {
                                            booking.showState = 1
                                        } else if (companyId != booking.own_company_id && companyId == booking.exe_company_id) {
                                            booking.showState = 2
                                        }
                                    }
                                } else if (isSuspended == 1) {
                                    booking.condition = 3;
                                    booking.tripStateString = T.T('calendar.jsEn_Route');
                                } else if (isSuspended == 2) {
                                    console.log(order_state)
                                    console.log(trip_state)
                                    // booking.condition = 4;
                                    // booking.tripStateString = T.T('calendar.jsTrip_Ended');
                                    if (order_state == OrderOrderState.ORDER_STATE_DONE) {
                                        switch (trip_state) {
                                            case OrderTripState.TRIP_STATE_WAITING_DRIVER_DETERMINE: {
                                                booking.tripStateString = T.T('calendar.jsEn_Route');
                                                booking.condition = 3
                                            }
                                                break;
                                            case OrderTripState.TRIP_STATE_WAITING_TO_SETTLE: {
                                                booking.tripStateString = T.T('calendar.jsEn_Route');
                                                booking.condition = 3
                                            }
                                                break;
                                            case OrderTripState.TRIP_STATE_SETTLING: {
                                                booking.tripStateString = T.T('calendar.jsEn_Route');
                                                booking.condition = 3
                                            }
                                                break;
                                            case OrderTripState.TRIP_STATE_SETTLE_DONE: {
                                                booking.tripStateString = T.T('calendar.jsTrip_Ended');
                                                booking.condition = 4
                                            }
                                                break;
                                            default : {
                                                booking.tripStateString = "Unknown";
                                            }
                                                break;
                                        }
                                    }
                                }
                            },
                            hasSentBack: function () {
                                booking.showState = 3
                            },
                            displayStatus: function (companyInfo) {
                                if (companyId == companyInfo.company_id && companyId != companyInfo.exe_com_id) {
                                    booking.showState = 1
                                } else if (companyId != companyInfo.company_id && companyId == companyInfo.exe_com_id) {
                                    booking.showState = 2
                                } else {
                                    booking.showState = false;
                                }
                            }
                        }
                    }
                }
            });
        };

        /* config object */
        $scope.uiConfig = {
            calendar: {
                contentHeight: 350,
                editable: false,
                timeFormat: ' ',
                timezone: 'local',
                lang: localStorage.getItem('lang'),
                header: {
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                },
                eventClick: $scope.onEventClick,
                dayClick: $scope.onDayClick,
                nextChange: function (date) {
                    $timeout(function () {
                            var hiddenDate =  angular.element($('.fc-other-month'));
                        hiddenDate.css('visibility','hidden');
                        loadData(date._d)
                    }, 0);
                }
            }
        };

        // Function
        var loadRates = function () {
            $timeout(function () {
                var hiddenDate =  angular.element($('.fc-other-month'));
                hiddenDate.css('visibility','hidden');
            },0);
            MessageBox.showLoading();
            OfferBS.getCurrentOfferAll().then(function (result) {
                MessageBox.hideLoading();
                if (result.data.length > 0) {
                    $scope.showCalendarView = true;
                    loadData(new Date());
                } else {
                    $scope.showNoRatesView = true;
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("calendar.jsGet_offer_fail"), "error");
                }
            });
        };

        var originalBookings = [];

        function loadData(date) {
            $scope.bookings = [];
            $scope.bookingTotalCount = 0;
            $scope.selectedDay = date;

            MessageBox.showLoading();
            BookBS.ratesCountsFromCurrentCompany(date).then(function (result) {
                BookBS.ratesInOneDayFromCurrentCompany(date).then(function (detailResult) {

                    var timeZone_offset = (new Date()).getTimezoneOffset();
                    // + timeZone_offset * 60

                    MessageBox.hideLoading();
                    $scope.pageTotalItems = detailResult.total;
                    $scope.saveDate=date;
                    dayGroupEvents = {};
                    angular.forEach(result.data, function (item) {
                        if (item.counts > 0) {
                            
                            var startTime = new Date((item.start_time) * 1000);
                            var day = $filter('date')(startTime, "yyyy-MM-dd");
                            dayGroupEvents[day] = item;
                        }
                    });
                    $scope.eventSources = [];
                    angular.forEach(dayGroupEvents, function (value, key) {
                        $scope.events.push({
                            id: key,
                            title: "",
                            start: new Date((value.start_time) * 1000)
                        });
                    });

                    var onedayBookings = [];
                    var bookings = detailResult.data;
                    if (bookings && bookings.length > 0) {
                        for (var i = 0; i < bookings.length; i++) {
                            bookings[i].driver_data = JSON.parse(bookings[i].driver_data);
                            bookings[i].car_data = JSON.parse(bookings[i].car_data);
                            onedayBookings.push(bookings[i]);
                        }
                    }
                    $scope.bookings = integrationBookingInOnedayByHourly(onedayBookings);
                    $scope.bookingTotalCount = onedayBookings.length;

                    $timeout(function () {
                        originalBookings = onedayBookings;
                        if (searchText && $scope.showSearchResult) {
                            $scope.searchResult = getSearchBookingResult(originalBookings, searchText);
                        } else {
                            $scope.searchResult = originalBookings;
                        }
                        $scope.$apply();
                    }, 0);

                    $scope.selectedDay = date;
                    var day = $filter('date')(date, "yyyy-MM-dd");
                    lastSelect = day;

                    var now = new Date();
                    if (date.getYear() == now.getYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) {
                        angular.element(".fc-today").css('background-color', '#3c7ace');
                        preDayCell = angular.element(".fc-today");
                    } else {
                        angular.element(preDayCell).css('background-color', '');
                        angular.element(".fc-" + lastSelect).css('background-color', '#3c7ace');
                        preDayCell = angular.element(".fc-" + lastSelect);
                    }
                    //数据加载成功
                    initData = false;

                }, function (error) {
                    //数据加载失败
                    initData = false;
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T('calendar.jsGet_list_fail'), "error");
                    }
                });
            }, function (error) {
                //数据加载失败
                initData = false;
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T('calendar.jsGet_list_fail'), "error");
                }
            });
        }

        //按小时为单位,整合一天的booking
        var integrationBookingInOnedayByHourly = function (bookings) {
            var bookingGroup = [];
            for (var i = 0; i < bookings.length; i++) {
                var hour = $filter('date')(bookings[i].appointed_at * 1000, 'h a');
                if (companyId == bookings[i].own_company_id && companyId != bookings[i].exe_company_id) {
                    bookings[i].showState = 1;
                } else if (companyId != bookings[i].own_company_id && companyId == bookings[i].exe_company_id) {
                    bookings[i].showState = 2
                }

                if (bookings[i].reject == 1) {
                    bookings[i].showState = 3
                }

                if (
                    bookings[i].order_state == OrderOrderState.ORDER_STATE_ADMIN_CANCEL ||
                    bookings[i].order_state == OrderOrderState.ORDER_STATE_SUPER_ADMIN_CANCEL ||
                    bookings[i].order_state == OrderOrderState.ORDER_STATE_PASSENGER_CANCEL ||
                    bookings[i].order_state == OrderOrderState.ORDER_STATE_TIMES_UP_CANCEL
                ) {
                    bookings[i].tripStateString = T.T('calendar.jsTrip_Suspended');
                    bookings[i].condition = 1
                    if (bookings[i].showState == 3) {
                        if (companyId == bookings[i].own_company_id && companyId != bookings[i].exe_company_id) {
                            bookings[i].showState = 1;
                        } else if (companyId != bookings[i].own_company_id && companyId == bookings[i].exe_company_id) {
                            bookings[i].showState = 2
                        }
                    }
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_BOOKING) {
                    bookings[i].tripStateString = T.T('calendar.jsTrip_not_started');
                    bookings[i].condition = 2
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_RUN) {
                    switch (bookings[i].trip_state) {
                        case OrderTripState.TRIP_STATE_WAIT_TO_DEPARTURE: {
                            bookings[i].tripStateString = T.T('calendar.jsTrip_not_started');
                            bookings[i].condition = 2
                        }
                            break;
                        case OrderTripState.TRIP_STATE_DRIVE_TO_PICK_UP: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_WAITING_CUSTOMER: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_GO_TO_DROP_OFF: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        default : {
                            bookings[i].tripStateString = "Unknown";
                        }
                            break;
                    }
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_DONE) {
                    switch (bookings[i].trip_state) {
                        case OrderTripState.TRIP_STATE_WAITING_DRIVER_DETERMINE: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_WAITING_TO_SETTLE: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_SETTLING: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_SETTLE_DONE: {
                            bookings[i].tripStateString = T.T('calendar.jsTrip_Ended');
                            bookings[i].condition = 4
                        }
                            break;
                        default : {
                            bookings[i].tripStateString = "Unknown";
                        }
                            break;
                    }
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_WAIT_DETERMINE) {
                    bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                    bookings[i].condition = 3
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_SETTLE_ERROR) {
                    bookings[i].tripStateString = T.T("book_detail.jsSettle_Error");
                    bookings[i].condition = 4
                }
                else {
                    bookings[i].tripStateString = "Unknown";
                }

                if (bookingGroup.length == 0) {
                    bookingGroup.push({bookingList: [bookings[i]], bookingCount: 1})
                } else {
                    var find = false;
                    for (var j = 0; j < bookingGroup.length; j++) {
                        var header = $filter('date')(bookingGroup[j].bookingList[0].appointed_at * 1000, 'h a');
                        if (hour == header) {
                            find = true;
                            bookingGroup[j].bookingList.push(bookings[i]);
                            bookingGroup[j].bookingCount++;
                        }
                    }
                    if (!find) {
                        bookingGroup.push({bookingList: [bookings[i]], bookingCount: 1});
                    }
                }
            }
            return bookingGroup;
        };

        //先判断有没有rates,如果没有,显示提示界面,如果有,请求booking数据
        loadRates();


        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                if (!word) {
                    $scope.showSearchResult = false;
                    searchText = undefined;
                } else {
                    $scope.showSearchResult = true;
                    searchText = word;
                    $scope.searchResult = [];
                    $scope.$apply();

                    $scope.searchResult = getSearchBookingResult(originalBookings, word);
                    $scope.$apply();
                }
            }, 100);
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchBookingResult = function (originalBookings, searchText) {
            var tempSearch = [];
            angular.forEach(originalBookings, function (booking) {
                if (booking.c_email.toString().indexOf(searchText.toString()) > -1
                    || booking.c_first_name.toString().indexOf(searchText.toString()) > -1
                    || booking.c_last_name.toString().indexOf(searchText.toString()) > -1
                    || booking.c_mobile.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.email.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.license_number.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.mobile.toString().indexOf(searchText.toString()) > -1
                    || booking.car_data.brand.toString().indexOf(searchText.toString()) > -1
                    || booking.car_data.license_plate.toString().indexOf(searchText.toString()) > -1
                    || booking.car_data.model.toString().indexOf(searchText.toString()) > -1) {
                    tempSearch.push(booking);
                }
            });
            return tempSearch;
        };

        function PageChangeAndSearch() {
            console.log( $scope.saveDate);
            MessageBox.showLoading();
            BookBS.ratesInOneDayFromCurrentCompany($scope.saveDate, $scope.currentPage,$scope.pagePerCount).then(function (detailResult) {
                MessageBox.hideLoading();
                var onedayBookings = [];
                $scope.pageTotalItems = detailResult.total;
                var bookings = detailResult.data;
                if (bookings && bookings.length > 0) {
                    for (var i = 0; i < bookings.length; i++) {
                        bookings[i].driver_data = JSON.parse(bookings[i].driver_data);
                        bookings[i].car_data = JSON.parse(bookings[i].car_data);
                        onedayBookings.push(bookings[i]);
                    }
                }
                $scope.bookings = integrationBookingInOnedayByHourly(onedayBookings);
                $scope.bookingTotalCount = onedayBookings.length;

                $timeout(function () {
                    originalBookings = onedayBookings;
                    if (searchText && $scope.showSearchResult) {
                        $scope.searchResult = getSearchBookingResult(originalBookings, searchText);
                    } else {
                        $scope.searchResult = originalBookings;
                    }
                    $scope.$apply();
                }, 0);
                initData = false;
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("calendar.jsGet_list_fail"), "error");
                }
                initData = false;
            });
        }

        $scope.onPageChange=function () {
            PageChangeAndSearch();
        };

        $scope.finalAddress = function (arr) {
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < arr[i].bookingList.length; j++) {
                        arr[i].bookingList[j].d_final_address = [];
                        var d_line_a = '';
                        var d_line_b = '';
                        if (arr[i].bookingList[j].d_address.address_components) {
                            if (arr[i].bookingList[j].d_address.address_components[arr[i].bookingList[j].d_address.address_components.length - 1].types[0] == 'postal_code') {
                                var postal_code = arr[i].bookingList[j].d_address.address_components[arr[i].bookingList[j].d_address.address_components.length - 1].long_name;
                                arr[i].bookingList[j].d_address.address_components.reverse().shift();
                                arr[i].bookingList[j].d_address.address_components.reverse();
                                for (var y = 0; y < (arr[i].bookingList[j].d_address.address_components.length) - 3; y++) {
                                    if (y == (arr[i].bookingList[j].d_address.address_components.length) - 4) {
                                        d_line_a += arr[i].bookingList[j].d_address.address_components[y].long_name;
                                    } else {
                                        d_line_a += arr[i].bookingList[j].d_address.address_components[y].long_name + ' ';
                                    }
                                }
                                arr[i].bookingList[j].d_address.address_components.reverse().shift();
                                for (var z = 0; z < 2; z++) {
                                    if (z == 1) {
                                        d_line_b += arr[i].bookingList[j].d_address.address_components[z].long_name;
                                    } else {
                                        d_line_b += arr[i].bookingList[j].d_address.address_components[z].long_name + ',';
                                    }
                                }
                                d_line_b = d_line_b + ',' + postal_code;
                                arr[i].bookingList[j].d_final_address.push(d_line_a);
                                arr[i].bookingList[j].d_final_address.push(d_line_b);
                            } else {
                                for (var y = 0; y < (arr[i].bookingList[j].d_address.address_components.length) - 3; y++) {
                                    if (y == (arr[i].bookingList[j].d_address.address_components.length) - 4) {
                                        d_line_a += arr[i].bookingList[j].d_address.address_components[y].long_name;
                                    } else {
                                        d_line_a += arr[i].bookingList[j].d_address.address_components[y].long_name + ' ';
                                    }
                                }
                                arr[i].bookingList[j].d_address.address_components.reverse().shift();
                                for (var z = 0; z < 2; z++) {
                                    if (z == 1) {
                                        d_line_b += arr[i].bookingList[j].d_address.address_components[z].long_name;
                                    } else {
                                        d_line_b += arr[i].bookingList[j].d_address.address_components[z].long_name + ',';
                                    }
                                }
                                arr[i].bookingList[j].d_final_address.push(d_line_a);
                                arr[i].bookingList[j].d_final_address.push(d_line_b);
                            }
                        } else {
                            arr[i].bookingList[j].d_final_address.push(arr[i].bookingList[j].d_address);
                        }
                    }
                }
            }
        };
    });


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
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('ClientCreditCardCtrl', function ($scope, $stateParams) {
        $scope.card = $stateParams.data.card;

        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };
    });

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
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('ClientsCtrl', function ($log ,$scope, $rootScope, $state, $uibModal, $timeout, MessageBox, CustomerBS, T) {
        if (!$rootScope.loginUser) {
            return;
        }
        $scope.currentPage = 1;
        $scope.pageTotalItems = 1;
        $scope.pagePreCount = 12;
        $scope.input = {
            searchText:undefined
        };
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/client-add.html',
                controller: 'ClientAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            },
                            Data:function () {

                            }
                        }
                    }
                }
            });
        };

        $scope.onEditButtonClick = function (customer) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/client-edit.html',
                controller: 'ClientEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            customer: customer
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onPageChange = function () {
            loadData();
        };

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        // Function
        var loadData = function () {
            MessageBox.showLoading();
            if (!$rootScope.loginUser.superadmin) {
                CustomerBS.getFromCurrentUser($scope.currentPage, $scope.pagePreCount, $scope.input.searchText).then(function (result) {
                    MessageBox.hideLoading();
                    angular.forEach(result.data, function (item, index) {
                        item.mouse = false;
                        if (item.cards.length > 0) {
                            if (item.cards[0].card_type == 1) {
                                item.cardTypeImg = 'img/dashboard/card-visa.png';
                            } else if (item.cards[0].card_type == 2) {
                                item.cardTypeImg = 'img/dashboard/card-mastercard.png';
                            } else if (item.cards[0].card_type == 3) {
                                item.cardTypeImg = 'img/dashboard/card-american-express.png';
                            } else if (item.cards[0].card_type == 4) {
                                item.cardTypeImg = 'img/dashboard/card-discover.png';
                            }
                            if (item.cards[0].card_number) {
                                item.cardNumber = ' ****' + item.cards[0].card_number.replace(/x/g, '');
                            } else {
                                item.cardNumber = '';
                            }
                            if (item.cards.length == 1) {
                                item.cardCount = '';
                            } else {
                                item.cardCount = '+' + (item.cards.length - 1).toString() + ' Payments';
                            }
                        } else {
                            item.cardNumber = 'No Card';
                            item.cardCount = '';
                        }
                    });
                    
                    $scope.listData = result.data;
                    $scope.pageTotalItems = result.total;
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T('client.jsGet_client_fail'), "error");
                    }
                });
            }
            else {
                // TODO: 处理SuperAdmin情况
            }
        };

        // Init
        loadData();

        var deleteFinalDetermine = function (customerId) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("comment.jsDetermine_to_delete"), function (isConfirm) {
                if (isConfirm) {
                    CustomerBS.deleteFromCurrentUser(customerId).then(function (result) {
                        MessageBox.hideLoading();
                        MessageBox.toast(T.T("comment.jsDelete_passenger_success"));
                        loadData();
                    }, function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                        }
                        else {
                            if(error.response.data.code == "3604"){
                                MessageBox.toast(T.T("client.jsPassenger_has_booking"), "error");
                            }else{
                                MessageBox.toast(T.T("client.jsDelete_passenger_fault"), "error");
                            }
                        }
                    });
                }
            })
        };

        $scope.deleteCustomer = function (customerId) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("client.jsDelete_customer"), function (isConfirm) {
                MessageBox.hideLoading();
                if (isConfirm) {
                    setTimeout(function(){
                        deleteFinalDetermine(customerId)
                    },100);

                }
            });
        };

        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                $scope.currentPage = 1;
                loadData();
            }, 10);
        });


    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('CompaniesCtrl', function ($log, $scope, $rootScope, $state, $uibModal, MessageBox, CompanyBS, T) {
        if (!$rootScope.loginUser) {
            return;
        }

        $scope.currentPage = 1;
        $scope.pageTotalItems = 1;
        $scope.pagePreCount = 12;

        $scope.onPageChange = function () {
            loadData();
        };

        // Event
        $scope.onAddButtonClick = function () {
            addCompany();
        };

        $scope.onEditButtonClick = function (id) {
            checkCompany(id);
        };

        // Function
        var loadData = function () {
            MessageBox.showLoading();
            if ($rootScope.loginUser.superadmin) {
                CompanyBS.getAllCompanies($scope.currentPage, $scope.pagePreCount).then(function (result) {
                    MessageBox.hideLoading();
                    console.log(result);
                    angular.forEach(result.data.companies, function (item) {
                        if (item.address.indexOf('address_components') > 0) {
                            item.address = JSON.parse(item.address);
                        } else {
                            item.address = {"formatted_address": item.address};
                        }
                    });
                    $scope.listData = result.data.companies;
                    $scope.pageTotalItems = result.data.total;
                    console.log($scope.listData);
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("companies.jsGet_companies_fail"), "error");
                    }
                });
            }
            else {
                // assert(1);
            }
        };

        var addCompany = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/company-add.html',
                controller: 'CompanyAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        var checkCompany = function (companyId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/company-detail.html',
                controller: 'CompanyDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            companyId: companyId
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        // Init
        loadData();
    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('CompanyAddCtrl', function ($log, $scope, $state, $stateParams, $http, $timeout, MessageBox, CompanyBS,MapTool,T) {
        $scope.gender = '2';
        $timeout(function () {
            angular.element('#addCompanyForm').validator();
        }, 0);

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.getLocation = function (val) {
            return MapTool.getSearchLocations(val);
        };

        $scope.onSubmitButtonClick = function (valid) {
            if (!valid) {
                return;
            }
            addCompany();
        };

        var addCompany = function () {
            MessageBox.showLoading();

            $scope.admin.address = $scope.company.address;
            $scope.admin.address_number = $scope.company.address_number;
            $scope.admin.address_code_postal = $scope.company.address_code_postal;
            $scope.admin.gender = $scope.gender;


            //TODO 待修改
            $scope.charge.pay_type =1;
            var company_param = JSON.stringify($scope.company);
            var admin_param = JSON.stringify($scope.admin);
            var payment_param = JSON.stringify($scope.payment);
            var charge_param = JSON.stringify($scope.charge);
            CompanyBS.createCompany(company_param, admin_param, payment_param, charge_param)
                .then(function (result) {
                    MessageBox.hideLoading();
                    if ($stateParams.event.addSuccess) {
                        $stateParams.event.addSuccess();
                    }
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("vehicle_add.jsAdd_fail"), "error");
                    }
                });
        };

        $scope.companyLocation = function ($item, $model, $label, $event) {
            var address = jQuery.extend(true, {}, $item);
            address.formatted_address = $item.vicinity+' '+$item.name;
            MapTool.geocoderAddress($item.geometry.location.lat(),$item.geometry.location.lng(),function (result) {
                address.formatted_address = result.formatted_address;
                address.address_components = result.address_components;
                $('#companyAddressID').val(address.formatted_address);
                $timeout(function () {
                    $scope.company.address = address.formatted_address;
                    $scope.company.lat = address.geometry.location.lat();
                    $scope.company.lng = address.geometry.location.lng();
                    angular.forEach(address.address_components, function (item, index) {
                        if(item.types[0] == 'postal_code') {
                            $scope.company.address_code_postal = item.long_name;
                        }
                    });
                },100);
            },function (error) {});

            $scope.company.address = address.formatted_address;
            $scope.company.lat = address.geometry.location.lat();
            $scope.company.lng = address.geometry.location.lng();
        };

    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event editSuccess
 */
angular.module('KARL.Controllers')
    .controller('CompanyDetailCtrl', function ($timeout, $log, $scope, $state, $stateParams, MessageBox, CompanyBS,T) {

        $scope.company_id = $stateParams.data.companyId;
        var company;

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        // $timeout(function () {
        //     angular.element('#companyEditForm').validator();
        // }, 0);


        var loadData = function () {
            MessageBox.showLoading();
            CompanyBS.getCompanyDetails($scope.company_id).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                if (result.data.address.indexOf('address_components') > 0) {
                    $scope.address = JSON.parse(result.data.address).formatted_address;
                } else {
                    $scope.address = result.data.address
                }
                company = result.data;
                $scope.name = company.name;
                $scope.rate = company.rate;
                $scope.customer_count = company.customer_count;
                $scope.car_count = company.car_count;
                $scope.driver_count = company.driver_count;
                $scope.offer_count = company.offer_count;
                $scope.option_count = company.option_count;
                $scope.pushProfile = company.push_profile;
                $scope.pushToken = company.push_api_token;
                $scope.gmt = company.gmt;
                $scope.address_number = company.address_number;
                $scope.address_code_postal = company.address_code_postal;
                $scope.domain = company.domain;
                $scope.img = company.img;
                $scope.an_locked = company.an_locked;
                $scope.configId = company.push_config_id;
                $scope.androidApp = company.android_app;
                $scope.androidPkgName = company.pkg_name;
                $scope.iosApp = company.ios_app;
                $scope.iosId = company.ios_id;
                $scope.pushConfigId = company.push_config_id;
                $scope.salesRepName=company.sale_name;
                if(company.sale_id&&company.sale_name){
                    $scope.saleRepId=company.sale_id;
                    $scope.saleRep=company.sale_name + " " +company.sale_id ;
                }else {
                    $scope.saleRep='No Select'
                }

                if(company.asst_id&&company.asst_name){
                    $scope.saleAssistant=company.asst_name + " " +company.asst_id ;
                }else {
                    $scope.saleAssistant='No Select'
                }

            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsGet_detail_fail"), "error");
                }
            });
        };

        loadData();

        $scope.saveButtonClick = function () {
            if(!$scope.rate){
                MessageBox.toast(T.T("company_detail.jsInput_company_rate"), "error");
                return;
            }
            MessageBox.showLoading();
            CompanyBS.companyDetailRate($scope.rate, $scope.company_id).then(function (result) {
                MessageBox.hideLoading();
                $stateParams.event.cancel();
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsModify_rate_fail"), "error");
                }
            })
        };


        $scope.isShowConfig=function () {
            $scope.showConfig=!$scope.showConfig
        };


        $scope.savePushClick=function ($event) {
            if(!$scope.pushProfile){
                MessageBox.toast(T.T("company_detail.jsInput_push_profile"), "error");
                return;
            }
            if(!$scope.pushToken){
                MessageBox.toast(T.T("company_detail.jsInput_push_token"), "error");
                return;
            }
            var ladda = Ladda.create($event.target);
            ladda.start();
            if ($scope.pushConfigId==null) {
                addConfigPush(ladda)
            }else {
                modifyConfigPush(ladda);
            }
        };


        $scope.saveAppClick=function ($event) {
            if(!$scope.androidApp){
                MessageBox.toast(T.T("company_detail.jsInput_android_url"), "error");
                return;
            }
            if(!$scope.androidPkgName){
                MessageBox.toast(T.T("company_detail.jsInput_Android_package_name"), "error");
                return;
            }
            if(!$scope.iosApp){
                MessageBox.toast(T.T("company_detail.jsInput_ios_url"), "error");
                return;
            }
            if(!$scope.iosId){
                MessageBox.toast(T.T("company_detail.jsInput_IOS_App_Id"), "error");
                return;
            }
            var ladda = Ladda.create($event.target);
            ladda.start();
            modifyCompanyApp(ladda)
        };


        var addConfigPush = function (ladda) {
            CompanyBS.addCompanyPush($scope.pushProfile, $scope.pushToken, $scope.company_id).then(function (result) {
                MessageBox.toast(T.T("company_detail.jsAdd_push_config_success"), "success");
                ladda.stop();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsAdd_push_config_fail"), "error");
                }
                ladda.stop();
            })
        };


        var modifyConfigPush = function (ladda) {
            CompanyBS.modifyCompanyPush($scope.pushProfile, $scope.pushToken, $scope.configId).then(function (result) {
                MessageBox.toast(T.T("company_detail.jsModify_push_config_success"), "success");
                console.log(result);
                ladda.stop();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsModify_push_config_fail"), "error");
                }
                ladda.stop();
            })
        };

        var modifyCompanyApp = function (ladda) {
            CompanyBS.modifyCompanyApp(
                $scope.androidApp,
                $scope.androidPkgName,
                $scope.iosApp,
                $scope.iosId,
                $scope.company_id).then(function (result) {
                console.log(result);
                MessageBox.toast(T.T("company_detail.jsModify_passenger_app_success"), "success");
                ladda.stop();
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsModify_passenger_app_fail"), "error");
                }
                ladda.stop();
            })
        };


        $scope.lockSwitchAn = function (an_locked) {
            if(an_locked == AnLocked.Locked){
                an_locked = AnLocked.Unlocked
            }else{
                an_locked = AnLocked.Locked
            }
            CompanyBS.changeCompanyAnSettingLock($scope.company_id,an_locked)
                .then(function (result) {
                    MessageBox.toast("Change company "+$scope.name+" AN setting success", "success");
                    $scope.an_locked = an_locked;
                },function (error) {
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast("Change company "+$scope.name+" AN setting Field", "error");
                    }
                })


        }
    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('CreditCardAddCtrl', function ($log, $scope, $state, $uibModal, MapTool, $stateParams, $timeout, MessageBox, CarBS, PaymentBS, T) {

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

        // $scope.address = angular.copy($stateParams.data.address);
        $timeout(function () {
            angular.element('#addCreditCardForm').validator();
        }, 0);

        $scope.charge = {
            card_type: 1
        };

        $scope.onChangesCardType = function () {
            $timeout(function () {
                angular.element('#addCreditCardForm').validator();
            }, 0);
        };

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.addCreditCard = function (valid, $event) {
            if (!valid) {
                return;
            }
            var cvv2Reg;
            var cvv2ResultArray;
            if ($scope.charge.card_type != 3) {
                cvv2Reg = /^[0-9]{3}$/g;
            } else {
                cvv2Reg = /^[0-9]{4}$/g;
            }
            cvv2ResultArray = $scope.charge.cvv2.match(cvv2Reg);
            if (!cvv2ResultArray || cvv2ResultArray != $scope.charge.cvv2) {
                MessageBox.toast(T.T("credit_card_add.jsFormat_cvc_warning"), 'error');
                return;
            }
            // if(!$scope.address){
            //     MessageBox.toast(T.T("credit_card_add.jsFill_Billing_address"), 'error');
            // }
            // $scope.charge.address = JSON.stringify($scope.address);
            MessageBox.showLoading();
            var nextLadda = Ladda.create($event.target);
            nextLadda.start();
            PaymentBS.addCardByClient($stateParams.data.customerId, $scope.charge)
                .then(function (result) {
                    MessageBox.hideLoading();
                    nextLadda.stop();
                    $stateParams.event.addSuccess();
                }, function (error) {
                    MessageBox.hideLoading();
                    nextLadda.stop();
                    console.log(error);
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("credit_card_add.jsCard_error_or_used"), "error");
                    }
                });
        };

        // $scope.getLocation = function (val) {
        //     return MapTool.getSearchLocations(val);
        // };
        // $scope.selectLocationOnMap = function () {
        //     var locationData = 0;
        //     if ($scope.address) {
        //         console.log('address is here ',$scope.address);
        //         locationData = angular.copy($scope.address);
        //         locationData.geometry.location = {
        //             lat: locationData.geometry.location.lat,
        //             lng: locationData.geometry.location.lng
        //         };
        //     }
        //     var modalInstance = $uibModal.open({
        //         templateUrl: 'templates/common/location-select.html',
        //         controller: 'LocationSelectCtrl',
        //         size: 'md',
        //         resolve: {
        //             data: function () {
        //                 return locationData;
        //             },
        //             event: {
        //                 okHandler: function (data) {
        //                     if (data != undefined) {
        //                         $scope.address = JSON.parse(JSON.stringify(angular.copy(data)));
        //                     }
        //                     modalInstance.dismiss();
        //                 }
        //             }
        //         }
        //     });
        // };
        // $scope.onAddressSelect = function ($item, $model, $label, $event) {
        //     MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
        //         $timeout(function () {
        //             $scope.address = JSON.parse(JSON.stringify(result));
        //         }, 0);
        //     }, function (error) {
        //     });
        //     $scope.address = JSON.parse(JSON.stringify(angular.copy($item)));
        // };
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('CurrencyAcctCtrl', function ($log, $scope, $rootScope, $state, $stateParams, CompanyBS, $filter,MessageBox,T) {

        if($rootScope.loginUser == null){
            $state.go('login');
            return;
        }
        $scope.currentCcy="";
        $scope.defaultCurrency = angular.copy(defaultCurrency);

        $scope.onOkButtonClick = function () {
            if($scope.currentCcy === ""){
                MessageBox.toast(T.T("currency.jsEmptyMsg"));
                return;
            }
            CompanyBS.setCompanyCcy($scope.currentCcy).
            then(function (result) {
                window.localStorage.companyCurrency = $scope.currentCcy;
                MessageBox.toast(T.T("currency.jsSetSuccess"));
                console.log("result",result);
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel();
                }
            },function (error) {
                console.log("error",error);
                MessageBox.toast(T.T("currency.jsSetFail"));
            });
        };
    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('CustomerCreditCardAddCtrl', function ($log, $scope, $state, $stateParams, $timeout, MessageBox, FlowBS) {

        $timeout(function () {
            angular.element('#addCreditCardForm').validator();
        }, 0);

        $scope.charge =  {
            card_type:1
        };

        // Event
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.addCreditCard = function (valid, $event) {
            if (!valid) {
                return;
            }
            MessageBox.showLoading();
            FlowBS.addCard($stateParams.data.customerId, $scope.charge)
                .then(function (result)
                {
                    MessageBox.hideLoading();
                    $stateParams.event.addSuccess(result);
                }, function (error)
                {
                    MessageBox.hideLoading();
                    if (error.treated)
                    {
                    }
                    else
                    {
                        MessageBox.toast("Add Fail","error");
                    }
                });
        };

    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('DriverAddCtrl', function ($log, $scope, $state, $stateParams, $http, $timeout, MessageBox, DriverBS, CarBS, MapTool, $uibModal, T,$rootScope,$filter) {

        var nWatchedModelChangeCount = 0;
        $scope.allTime = [1, 2, 3, 4, 5, 6, 7, 8, 24, 48];
        $scope.$watchCollection("selectedCars", function (newVal, oldVal) {
            nWatchedModelChangeCount++;
        });
        $scope.cars = [];
        $scope.genders = [{name: T.T('comment.jsMr') + '.', value: 2}, {name: T.T('comment.jsMrs') + '.', value: 1}];
        $scope.driver = {"gender": 2};
        $scope.delayTime = 1;
        $scope.categories = [];
        $scope.selectedCars = [];
        $scope.country=$rootScope.loginUser.admin.location.country;
        console.log($rootScope.loginUser)
        if (localStorage.getItem('lang') === 'fr') {
            $scope.timeClock = angular.copy(frTimeClock);
        } else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.routine = angular.copy(RoutineDefault);
        $scope.hasRoutine = true;
        $scope.lastNameHidden = false;

        $timeout(function () {
            angular.element('#driverForm').validator();
        }, 0);

        $scope.image = "img/dashboard/default-avatar.png";
        $scope.file;

        $scope.routineData = [];

        // Event
        $scope.upload = function (files) {
            if (!files) {
                return;
            }
            $scope.image = files.$ngfBlobUrl;
            $scope.file = files;
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.driverForm.$dirty || nWatchedModelChangeCount > 1) {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("driver_add.jsExit_warning"), function (isConfirm) {
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

        $scope.setLastNameHidden = function () {
            $scope.lastNameHidden = !$scope.lastNameHidden;
        };

        $scope.onRoutineWeekChange = function (tabIndex) {
            angular.forEach($scope.routine, function (item, index) {
                if (tabIndex == 0) {
                    //Weekdays
                    if (index == 0 || index == 6) {
                        item.work = false;
                    } else {
                        item.work = true;
                    }
                } else if (tabIndex == 1) {
                    //Weekends
                    if (index == 0 || index == 6) {
                        item.work = true;
                    } else {
                        item.work = false;
                    }
                } else {
                    //allweek
                    item.work = true;
                }
            });
        };

        $scope.checkDayChanged = function (index) {
            $scope.routine[index].work = !$scope.routine[index].work;
            var find = false;
            var keepGoing = true;
            angular.forEach($scope.routine, function (item) {
                if (keepGoing) {
                    if (item.work) {
                        find = true;
                        keepGoing = false;
                    }
                }
            });
            $scope.hasRoutine = find;
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

        $scope.onCategorySelect = function (category) {
            if (category.selectedCount == category.cars.length) {
                category.selectedCount = 0;
                for (var i = 0; i < category.cars.length; i++) {
                    category.cars[i].isSelect = false;
                    for (var k = 0; k < $scope.selectedCars.length; k++) {
                        if ($scope.selectedCars[k].id == category.cars[i].id) {
                            $scope.selectedCars.splice(k, 1);
                            k--;
                        }
                    }
                }
            } else {
                category.selectedCount = category.cars.length;
                for (var i = 0; i < category.cars.length; i++) {
                    category.cars[i].isSelect = true;
                    var find = false;
                    for (var k = 0; k < $scope.selectedCars.length; k++) {
                        if ($scope.selectedCars[k].id == category.cars[i].id) {
                            find = true;
                            break;
                        }
                    }
                    if (!find) {
                        $scope.selectedCars.push(angular.copy(category.cars[i]));
                    }
                }
            }
        };

        $scope.onCarSelect = function (category, car) {
            if (car.isSelect) {
                var find = false;
                for (var i = 0; i < $scope.selectedCars.length; i++) {
                    if ($scope.selectedCars[i].id == car.id) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    $scope.selectedCars.push(angular.copy(car));
                    category.selectedCount++;
                }
            } else {
                for (var i = 0; i < $scope.selectedCars.length; i++) {
                    if ($scope.selectedCars[i].id == car.id) {
                        $scope.selectedCars.splice(i, 1);
                        i--;
                        category.selectedCount--;
                    }
                }
            }
        };


        var loadCars = function () {
            MessageBox.showLoading();
            CarBS.getCurrentUserAll().then(function (result) {
                MessageBox.hideLoading();
                if (result.data.cars.length == 0) {
                    MessageBox.alertView(T.T('alertTitle.warning'), T.T('driver_add.jsCompany_not_have_vehicles'), function (isAlertView) {
                        if (isAlertView) {
                            $stateParams.event.cancel();
                            $state.go('vehicles');
                        }
                    })
                }
                $scope.categories = integrationCarInCategory(result.data.cars);

                $timeout(function () {
                    $(function () {
                        $("#rates-vehicle-accordion").accordion({
                            header: 'h3.rates-select',
                            active: true,
                            alwaysOpen: false,
                            animated: false,
                            collapsible: true,
                            heightStyle: "content"
                        });
                    });
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicles.jsGet_car_failed"), "error");
                }
            });
        };

        //以category整合车辆数据
        var integrationCarInCategory = function (cars) {
            var tempCategorys = [];
            angular.forEach(cars, function (car) {
                car.isSelect = false;
                var findCategory = false;
                for (var i = 0; i < tempCategorys.length; i++) {
                    if (tempCategorys[i].categoryId == car.category_id) {
                        findCategory = true;
                        var findCar = false;
                        for (var j = 0; j < tempCategorys[i].cars.length; j++) {
                            if (tempCategorys[i].cars[j].id == car.id) {
                                findCar = true;
                                break;
                            }
                        }
                        if (!findCar) {
                            tempCategorys[i].cars.push(car);
                        }
                        break;
                    }
                }
                if (!findCategory) {
                    var category = {
                        "categoryId": car.category_id,
                        "categoryName": car.category,
                        "cars": [car],
                        "selectedCount": 0
                    };
                    tempCategorys.push(category);
                }
            });
            return tempCategorys;
        };

        // Init
        $scope.gender = "2";
        loadCars();

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
                    $scope.formatted_address = result.formatted_address;
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
            $scope.formatted_address = $item.vicinity + ' ' + $item.name;
            $scope.lat = $item.geometry.location.lat();
            $scope.lng = $item.geometry.location.lng();
        };

        $scope.selectLocationOnMap = function () {
            var locationData = 0;
            if ($scope.address) {
                locationData = angular.copy($scope.address);
            }
            console.log("address is ",locationData);
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
                                $scope.formatted_address = data.formatted_address;
                                $scope.lat = data.latlng.lat;
                                $scope.lng = data.latlng.lng;
                            }
                            modalInstance.dismiss();
                        }
                    }
                }
            });
        };

        var commit = function (param, l) {
            DriverBS.addToCurrentUser(param)
                .then(function (result) {
                    //Up image
                    if ($scope.file) {
                        DriverBS.changeDriverImage(result.data.driver_id, $scope.file).then(function (result) {
                            MessageBox.hideLoading();
                            l.stop();
                            if ($stateParams.event.addSuccess) {
                                $stateParams.event.addSuccess();
                            }
                        }, function (error) {
                            MessageBox.hideLoading();
                            l.stop();
                            if (error.treated) {
                            }
                            else {
                                MessageBox.toast(T.T("driver_add.jsUpload_avatar_fail"), "error");
                            }
                        });
                    } else {
                        MessageBox.hideLoading();
                        l.stop();
                        if ($stateParams.event.addSuccess) {
                            $stateParams.event.addSuccess();
                        }
                    }
                }, function (error) {
                    MessageBox.hideLoading();
                    l.stop();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("driver_add.jsAdd_driver_fail"), "error");
                    }
                });
        };

        var checkRouteHasNoWork = function (routines) {
            var check = true;
            angular.forEach(routines, function (routine) {
                check = check && routine.match("^(1){48}");
            });
            return check;
        };
        var emptyRouteDataWarming = function (param, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("driver_add.jsDriver_routine_not_work"), function (isConfirm) {
                if (isConfirm) {
                    commit(param, la);
                } else {
                    la.stop();
                }
            });
        };
        var emptyCarDataWarming = function (param, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("driver_add.jsDriver_car_not_work"), function (isConfirm) {
                if (isConfirm) {
                    commit(param, la);
                } else {
                    la.stop();
                }
            });
        };

        $scope.onSubmitButtonClick = function (valid, $event) {
            if (!valid) {
                return;
            }
            var selectCarIds = [];
            var driverLang;
            var mobile = $scope.mobile.replace(/\s/g, "");
            var tleReg = new RegExp("^[0-9]{5,18}$");
            if(!tleReg.test(mobile)){
                MessageBox.toast(T.T("driver_add.jsEnter_valid_digits"), "error")
                return
            }
            for (var i = 0; i < $scope.selectedCars.length; i++) {
                selectCarIds.push($scope.selectedCars[i].id);
            }

            if($rootScope.loginUser.email===$scope.email&&$rootScope.loginUser.mobile==mobile){
                driverLang=localStorage.getItem('lang')
            }else {
                driverLang=localStorage.getItem('companyLang')
            }

            var param = {
                first_name: $scope.firstName,
                last_name: $scope.lastName,
                gender: $scope.driver.gender,
                mobile: mobile,
                email: $scope.email,
                calendar: DriverBS.routineConversionsFromLocToISO($scope.routine),
                delay_time: $scope.delayTime * 60,
                cars: selectCarIds.join(','),
                lang:driverLang
            };
            if ($scope.lastNameHidden) {
                param.hidden_last = 1;
            } else {
                param.hidden_last = 0;
            }
            if ($scope.license && $scope.license.length > 0) {
                param.license_number = $scope.license;
            }
            if ($scope.formatted_address && $scope.address && $scope.lat && $scope.lng) {
                param.address = JSON.stringify($scope.address);
                param.lat = $scope.lat;
                param.lng = $scope.lng;
            }

            MessageBox.showLoading();
            var l = Ladda.create($event.target);
            l.start();
            if (checkRouteHasNoWork(param.calendar)) {
                emptyRouteDataWarming(param, l);
                return;
            }
            if (param.cars == '') {
                emptyCarDataWarming(param, l);
                return;
            }
            commit(param, l);
        };


        $scope.formatPhone=function () {
            $scope.mobile = $filter('phoneNumFormatter')($scope.mobile,$scope.country);
        }
    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event editSuccess
 */
angular.module('KARL.Controllers')
    .controller('DriverEditCtrl', function ($log, $scope, $state, $rootScope, $stateParams, $timeout, $http, MessageBox, DriverBS, UserCacheBS, EventBS, MapTool, $uibModal, T,$filter) {


        var nWatchedModelChangeCount = 0;
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.allTime = [1, 2, 3, 4, 5, 6, 7, 8, 24, 48];
        var enableDatePicker = function () {
            $timeout(function () {
                //init datetimepicker
                var date = new Date();
                date.setHours(date.getHours() + 1);
                var mon;
                var dat;
                var hour;
                if ((date.getMonth() + 1) >= 10) {
                    mon = date.getMonth() + 1;
                }
                else {
                    mon = "0" + (date.getMonth() + 1);
                }
                if (date.getDate() >= 10) {
                    dat = date.getDate();
                }
                else {
                    dat = "0" + date.getDate();
                }
                if (date.getHours() >= 10) {
                    hour = date.getHours();
                }
                else {
                    hour = "0" + date.getHours();
                }

                $scope.datetimeStart = new Date(date.getFullYear() + '/' + mon + '/' + dat + ' ' + hour + ':00');
                $('.datetimeStart').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: $scope.datetimeStart,
                    sideBySide: true,
                    locale: T.T('fullCalendar_lang')
                });

                var date2 = new Date();
                date2.setHours(date2.getHours() + 2);
                var mon1;
                var dat1;
                var hour1;
                if ((date2.getMonth() + 1) >= 10) {
                    mon1 = date2.getMonth() + 1;
                }
                else {
                    mon1 = "0" + (date2.getMonth() + 1);
                }
                if (date2.getDate() >= 10) {
                    dat1 = date2.getDate();
                }
                else {
                    dat1 = "0" + date2.getDate();
                }
                if (date2.getHours() >= 10) {
                    hour1 = date2.getHours();
                }
                else {
                    hour1 = "0" + date2.getHours();
                }

                $scope.datetimeEnd = new Date(date2.getFullYear() + '/' + mon + '/' + dat1 + ' ' + hour1 + ':00');
                $('.datetimeEnd').datetimepicker({
                    inline: true,
                    stepping: 15,
                    minDate: $scope.datetimeEnd,
                    sideBySide: true,
                    locale: T.T('fullCalendar_lang')
                });
            }, 0);
        };

        $timeout(function () {
            angular.element('#driverForm').validator();
            // /************* 左右滑动tab ************* /
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
            // /************* / 左右滑动tab ************* /
        }, 0);

        $scope.input = {"gender": 2};
        $scope.genders = [{name: T.T('comment.jsMr') + '.', value: 2}, {name: T.T('comment.jsMrs') + '.', value: 1}];
        $scope.langStyle=localStorage.getItem('lang');
        if(localStorage.getItem('lang')==='fr'){
            $scope.timeClock = angular.copy(frTimeClock);
        }else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.categories = [];
        $scope.selectedCars = [];
        $scope.showDriver = true;
        $scope.file = undefined;
        $scope.isAdmin = false;

        // Init
        var driverId = $stateParams.data.driverId;
        var driver;

        // Event
        $scope.upload = function (files) {
            if ($scope.isAdmin) {
                return;
            }
            if (!files) {
                return;
            }
            $scope.image = files.$ngfBlobUrl;
            $scope.file = files;
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.driverForm.$dirty || nWatchedModelChangeCount > 0) {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("driver_add.jsExit_warning"), function (isConfirm) {
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

        $scope.changeTabs = function (tabIndex) {
            if (tabIndex == 0) {
                $scope.showDriver = true;
            } else {
                $scope.showDriver = false;
            }
        };

        //以category整合车辆数据
        var integrationCarInCategory = function (cars) {
            var tempCategorys = [];
            angular.forEach(cars, function (car) {
                if (parseInt(car.selected) === 0) {
                    car.isSelect = false;
                } else {
                    car.isSelect = true;
                    $scope.selectedCars.push(angular.copy(car));
                }
                var findCategory = false;
                for (var i = 0; i < tempCategorys.length; i++) {
                    if (tempCategorys[i].categoryName == car.category) {
                        findCategory = true;
                        var findCar = false;
                        for (var j = 0; j < tempCategorys[i].cars.length; j++) {
                            if (tempCategorys[i].cars[j].id == car.id) {
                                findCar = true;
                                break;
                            }
                        }
                        if (!findCar) {
                            tempCategorys[i].cars.push(car);
                            if (car.isSelect) {
                                tempCategorys[i].selectedCount++;
                            }
                        }
                        break;
                    }
                }
                if (!findCategory) {
                    var selectedCount = 0;
                    if (car.isSelect) {
                        selectedCount++;
                    }
                    var category = {
                        "categoryName": car.category,
                        "cars": [car],
                        "selectedCount": selectedCount
                    };
                    tempCategorys.push(category);
                }
            });
            return tempCategorys;
        };

        //转时区获得正确的routine
        var routineConversionsFromISOToLoc = function (routineArray) {
            var finalWeekRoutine = routineArray.join('');
            //获取时区
            var timeZone = (new Date().getTimezoneOffset() / 60) * (-1) * 2;
            var locRoutineDataString = "";
            if (timeZone > 0) {
                //后面拼到前面
                var tempStart = finalWeekRoutine.substring(48 * 7 - timeZone);
                var tempSpell = finalWeekRoutine.substring(0, 48 * 7 - timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else if (timeZone < 0) {
                //前面拼到后面
                var tempStart = finalWeekRoutine.substring(-timeZone);
                var tempSpell = finalWeekRoutine.substring(0, -timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else {
                locRoutineDataString = finalWeekRoutine;
            }

            //通过locRoutineDataString得到出勤情况
            var routineArray = undefined;
            for (var i = 0; i < 7; i++) {
                var routinePerDay = locRoutineDataString.substring(i * 48, (i + 1) * 48) + "";
                var day;
                var index = 0;
                while (routinePerDay.substring(index, index + 1) == '1') {
                    index++;
                }
                if (index >= 48) {
                    //全天不工作
                    day = {start: 0, end: 24, work: false};
                } else {
                    var index2 = index;
                    while (routinePerDay.substring(index2, index2 + 1) == '0') {
                        index2++;
                    }
                    //有工作
                    day = {start: index / 2, end: index2 / 2, work: true};
                    $scope.hasRoutine = true;
                }
                angular.forEach(RoutineDefault, function (item, index3) {
                    if (i == index3) {
                        day.name = item.name;
                    }
                });

                if (routineArray == undefined) {
                    routineArray = new Array(day);
                } else {
                    routineArray.push(day);

                }
            }
            return routineArray;
        };

        $scope.setLastNameHidden = function () {
            $scope.lastNameHidden = !$scope.lastNameHidden;
        };

        $scope.onRoutineWeekChange = function (tabIndex) {
            angular.forEach($scope.routine, function (item, index) {
                if (tabIndex == 0) {
                    //Weekdays
                    if (index == 0 || index == 6) {
                        item.work = false;
                    } else {
                        item.work = true;
                    }
                } else if (tabIndex == 1) {
                    //Weekends
                    if (index == 0 || index == 6) {
                        item.work = true;
                    } else {
                        item.work = false;
                    }
                } else {
                    //allweek
                    item.work = true;
                }
            });
        };

        $scope.checkDayChanged = function (index) {
            $scope.routine[index].work = !$scope.routine[index].work;
            var find = false;
            var keepGoing = true;
            angular.forEach($scope.routine, function (item) {
                if (keepGoing) {
                    if (item.work) {
                        find = true;
                        keepGoing = false;
                    }
                }
            });
            $scope.hasRoutine = find;
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

        $scope.onCategorySelect = function (category) {
            nWatchedModelChangeCount++;
            if (category.selectedCount == category.cars.length) {
                category.selectedCount = 0;
                for (var i = 0; i < category.cars.length; i++) {
                    category.cars[i].isSelect = false;
                    for (var k = 0; k < $scope.selectedCars.length; k++) {
                        if ($scope.selectedCars[k].id == category.cars[i].id) {
                            $scope.selectedCars.splice(k, 1);
                            k--;
                        }
                    }
                }
            } else {
                category.selectedCount = category.cars.length;
                for (var i = 0; i < category.cars.length; i++) {
                    category.cars[i].isSelect = true;
                    var find = false;
                    for (var k = 0; k < $scope.selectedCars.length; k++) {
                        if ($scope.selectedCars[k].id == category.cars[i].id) {
                            find = true;
                            break;
                        }
                    }
                    if (!find) {
                        $scope.selectedCars.push(angular.copy(category.cars[i]));
                    }
                }
            }
        };

        $scope.onCarSelect = function (category, car) {
            nWatchedModelChangeCount++;
            if (car.isSelect) {
                var find = false;
                for (var i = 0; i < $scope.selectedCars.length; i++) {
                    if ($scope.selectedCars[i].id == car.id) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    $scope.selectedCars.push(angular.copy(car));
                    category.selectedCount++;
                }
            } else {
                for (var i = 0; i < $scope.selectedCars.length; i++) {
                    if ($scope.selectedCars[i].id == car.id) {
                        $scope.selectedCars.splice(i, 1);
                        i--;
                        category.selectedCount--;
                    }
                }
            }
        };

        $scope.onShowAddEventClick = function () {
            $scope.showAddEvent = !$scope.showAddEvent;
            if ($scope.showAddEvent) {
                $scope.event = {"content": "", "repeatType": "", "repeatDays": ""};
                enableDatePicker();
            }
        };

        $scope.onAddEventDone = function () {
            if (!$scope.event.content) {
                return;
            }
            if ($scope.event.content.length == 0) {
                return;
            }

            $scope.datetimeStart = $('.datetimeStart').data("DateTimePicker").date()._d;
            var startTime = parseInt(($scope.datetimeStart.valueOf() + "").substr(0, 10));
            $scope.datetimeEnd = $('.datetimeEnd').data("DateTimePicker").date()._d;
            var endTime = parseInt(($scope.datetimeEnd.valueOf() + "").substr(0, 10));
            if (endTime <= startTime) {
                MessageBox.toast(T.T("vehicle_edit.jsEnd_Time_After_Start_Time"));
                return;
            }

            if ($scope.event.repeatType == 1) {
                $scope.event.repeatDays = $scope.datetimeStart.getDay() + 1;
            } else {
                $scope.event.repeatDays = "";
            }
            MessageBox.showLoading();
            EventBS.addToCalendar(
                parseInt(($scope.datetimeStart.valueOf() + "").substr(0, 10)),
                parseInt(($scope.datetimeEnd.valueOf() + "").substr(0, 10)),
                $scope.event.content,
                1,
                driverId,
                $scope.event.repeatType,
                $scope.event.repeatDays
            )
                .then(function (result) {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("vehicle_edit.jsAdd_event_success"), "success");
                    $scope.showAddEvent = false;
                    loadEventData();
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("vehicle_edit.jsAdd_event_fail"), "error");
                    }
                });
        };

        $scope.onDeleteEventClick = function (event, repeat) {
            EventBS.deleteCalendarEvent(event.id, repeat).then(function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("vehicle_edit.jsDelete_success"), "Success");
                loadEventData();
            }, function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("vehicle_edit.jsDelete_fail"), "error");
            });
        };

        $scope.onAddEventCancel = function () {
            $scope.showAddEvent = false;
        };

        var loadEventData = function () {
            MessageBox.showLoading();
            EventBS.eventsFromCurrentCompany(1, driverId).then(function (result) {
                MessageBox.hideLoading();
                $scope.carEvents = result.data;

                $timeout(function () {
                    $(".eventcard-more").click(function () {
                        $(this).next().fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".gen").click(function () {
                        $(this).parent().find(".gen-panel").fadeIn(200);
                    });
                    $(".gen-cancel").click(function () {
                        $(this).parents(".gen-panel").fadeOut(200);
                    });
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {

                }
                else {
                    MessageBox.toast(T.T("vehicle_edit.jsGet_list_fail"), "error");
                }
            });
        };

        var loadData = function () {
            MessageBox.showLoading();
            DriverBS.getDetailFromCurrentUser(driverId).then(function (result) {
                MessageBox.hideLoading();
                if (result.data.cars.length == 0) {
                    MessageBox.alertView(T.T('alertTitle.warning'), T.T('driver_add.jsCompany_not_have_vehicles'), function (isAlertView) {
                        if (isAlertView) {
                            $stateParams.event.cancel();
                            $state.go('vehicles');
                        }
                    })
                }
                driver = result.data;
                if (driver.avatar_url != "") {
                    $scope.image = driver.avatar_url;
                }
                else {
                    $scope.image = "img/dashboard/default-avatar.png";
                }
                if(driver.lat){
                    driver.lat = parseFloat(driver.lat)
                }
                if(driver.lng){
                    driver.lng = parseFloat(driver.lng)
                }

                driver.mobile = driver.mobile.replace(new RegExp("-", 'g'),"");

                $scope.isAdmin = driver.is_admin == 1 ? true : false;
                $scope.input.firstName = driver.first_name;
                $scope.input.lastName = driver.last_name;
                $scope.input.email = driver.email;
                // $scope.input.mobile = driver.mobile;
                $scope.input.mobile = $filter('phoneNumFormatter')(driver.mobile,$scope.country);
                $scope.input.gender = driver.gender;
                $scope.input.license = driver.license_number;
                $scope.input.delayTime = driver.delay_time / 60;

                if ($scope.input.delayTime < 1) {
                    $scope.input.delayTime = 1;
                } else if (1 <= $scope.input.delayTime <= 48) {
                    for (var i = 0; i < $scope.allTime.length; i++) {
                        if ($scope.input.delayTime != $scope.allTime[i]) {
                            if ($scope.input.delayTime > $scope.allTime[i] && $scope.input.delayTime < $scope.allTime[i + 1]) {
                                $scope.input.delayTime = $scope.allTime[i + 1];
                            }
                        }
                    }
                } else if ($scope.input.delayTime > 48) {
                    $scope.input.delayTime = 48;
                }

                $scope.routine = routineConversionsFromISOToLoc(JSON.parse(driver.calendar));
                $scope.categories = integrationCarInCategory(driver.cars);
                console.log($scope.categories)
                if (driver.hidden_last == 1) {
                    $scope.lastNameHidden = true;
                } else {
                    $scope.lastNameHidden = false;
                }

                if (driver.address == "") {
                    $scope.address = undefined;
                } else if (driver.address.indexOf('address_components') > 0) {
                    $scope.address = JSON.parse(driver.address);
                    if(!$scope.address.latlng) {
                        $scope.address.latlng = {
                            lat: $scope.address.geometry.location.lat,
                            lng: $scope.address.geometry.location.lng
                        }
                    }
                    $scope.input.formatted_address = $scope.address.formatted_address;
                    $scope.lat = driver.lat;
                    $scope.lng = driver.lng;
                } else {
                    $scope.input.formatted_address = driver.address;
                }

                loadEventData();
                $timeout(function () {
                    angular.element('#driverForm').validator();
                    $(function () {
                        $("#rates-vehicle-accordion").accordion({
                            header: 'h3.rates-select',
                            active: true,
                            alwaysOpen: false,
                            animated: false,
                            collapsible: true,
                            heightStyle: "content"
                        });
                    });
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("ClientEdit.jsGet_detail_fail"), "error");
                }
            });
        };

        loadData();

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
                    $scope.input.formatted_address = result.formatted_address;
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
            $scope.input.formatted_address = $item.vicinity + ' ' + $item.name;
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
                                $scope.input.formatted_address = data.formatted_address;
                                $scope.lat = data.latlng.lat;
                                $scope.lng = data.latlng.lng;
                            }
                            modalInstance.dismiss();
                        }
                    }
                }
            });
        };

        var save = function (driverId, param, l) {
            DriverBS.updateToCurrentUser(driverId, param)
                .then(function (result) {
                    if ($rootScope.loginUser.id == result.data.user_id) {
                        $rootScope.loginUser.first_name = result.data.first_name;
                        $rootScope.loginUser.last_name = result.data.last_name;
                        $rootScope.loginUser.gender = result.data.gender;
                        $rootScope.loginUser.mobile = result.data.mobile;
                        $rootScope.loginUser.email = result.data.email;
                        if (result.data.address != "" && result.data.lat !== 0 && result.data.lng !== 0) {
                            $rootScope.loginUser.address = JSON.parse(result.data.address);
                        } else {
                            $rootScope.loginUser.address = "";
                        }
                        UserCacheBS.cache($rootScope.loginUser);
                    }
                    //上传头像
                    if ($scope.file) {
                        DriverBS.changeDriverImage(driverId, $scope.file).then(function (result) {
                            MessageBox.hideLoading();
                            l.stop();
                            if ($stateParams.event.editSuccess) {
                                $stateParams.event.editSuccess();
                            }
                            if ($rootScope.loginUser.id == driver.user_id) {
                                $rootScope.loginUser.avatar_url = result.data;
                                UserCacheBS.cache($rootScope.loginUser);
                            }
                        }, function (error) {
                            MessageBox.hideLoading();
                            l.stop();
                            if ($stateParams.event.editSuccess) {
                                $stateParams.event.editSuccess();
                            }
                            if (error.treated) {
                            }
                            else {
                                MessageBox.toast(T.T("driver_edit.jsEdit_driver_warning"), "error");
                            }
                        });
                    } else {
                        MessageBox.hideLoading();
                        l.stop();
                        if ($stateParams.event.editSuccess) {
                            $stateParams.event.editSuccess();
                        }
                    }
                }, function (error) {
                    MessageBox.hideLoading();
                    l.stop();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("vehicle_edit.jsUpdate_fail"), "error");
                    }
                });
        };

        var checkRouteHasNoWork = function (routines) {
            var check = true;
            angular.forEach(routines, function (routine) {
                check = check && routine.match("^(1){48}");
            });
            return check;
        };
        var emptyRouteDataWarming = function (driverId, param, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("driver_add.jsDriver_routine_not_work"), function (isConfirm) {
                if (isConfirm) {
                    save(driverId, param, la);
                } else {
                    la.stop();
                }
            });
        };
        var emptyCarDataWarming = function (driverId, param, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("driver_add.jsDriver_car_not_work"), function (isConfirm) {
                if (isConfirm) {
                    save(driverId, param, la);
                } else {
                    la.stop();
                }
            });
        };
        $scope.onSubmitButtonClick = function ($event) {
            if (!$scope.input.firstName
                || !$scope.input.lastName
                || !$scope.input.gender
                || !$scope.input.mobile
                || !$scope.input.email
                || (!$scope.input.delayTime && $scope.input.delayTime != 0)
            ) {
                MessageBox.toast(T.T("driver_edit.jsValue_format_error"), 'error');
                return;
            }

            if ($scope.input.password) {
                if ($scope.input.password.length < 6 || $scope.input.password.length > 16) {
                    MessageBox.toast(T.T("driver_edit.jsPassword_limited_characters"), "error");
                    return;
                }
                if ($scope.input.password != $scope.input.rePassword) {
                    MessageBox.toast(T.T("driver_edit.jsNew_password_error"), "error");
                    return;
                }
            }
            console.log($scope.input.mobile)
            var mobile = $scope.input.mobile.replace(/\s/g, "");
            var tleReg = new RegExp("^[0-9]{5,18}$");
            if(!tleReg.test(mobile)){
                MessageBox.toast(T.T("driver_add.jsEnter_valid_digits"), "error")
                return
            }
            var selectCarIds = [];
            for (var i = 0; i < $scope.selectedCars.length; i++) {
                selectCarIds.push($scope.selectedCars[i].id);
            }

            var param = {
                first_name: $scope.input.firstName,
                last_name: $scope.input.lastName,
                gender: $scope.input.gender,
                mobile: mobile,
                email: $scope.input.email,
                license_number: $scope.input.license,
                calendar: DriverBS.routineConversionsFromLocToISO($scope.routine),
                delay_time: $scope.input.delayTime * 60,
                cars: selectCarIds.join(',')
            };
            if ($scope.input.password) {
                param.pwd = $scope.input.password;
            }
            if ($scope.lastNameHidden) {
                param.hidden_last = 1;
            } else {
                param.hidden_last = 0;
            }
            if ($scope.input.formatted_address && $scope.address && $scope.lat && $scope.lng) {
                param.address = JSON.stringify($scope.address);
                param.lat = JSON.stringify($scope.lat);
                param.lng = JSON.stringify($scope.lng);
            } else {
                param.address = "";
            }
            MessageBox.showLoading();
            var l = Ladda.create($event.target);
            l.start();
            if (checkRouteHasNoWork(param.calendar)) {
                emptyRouteDataWarming(driverId, param, l);
                return;
            }
            if (param.cars == '') {
                emptyCarDataWarming(driverId, param, l);
                return;
            }
            save(driverId, param, l);
        };

        $scope.allowUploadAvatar = function () {
            if ($scope.isAdmin) {
                MessageBox.toast(T.T("driver_edit.jsAdminIsDriver_upload_Avatar"));
            }
        };

        $scope.modifyPassType = function (num) {
            $timeout(function () {
                var pass;
                if (num === 1) {
                    pass = angular.element($('#passOne'));
                } else {
                    pass = angular.element($('#passTwo'));
                }
                pass[0].type = 'password';
                console.log(pass)
            })

        };

        $scope.formatPhone=function () {
            $scope.input.mobile = $filter('phoneNumFormatter')($scope.input.mobile,$scope.country);
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('DriversCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $timeout, MessageBox, DriverBS, UserCacheBS,T,$filter) {

        if(!$rootScope.loginUser){
            return;
        }
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/driver-add.html',
                controller: 'DriverAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onEditButtonClick = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/driver-edit.html',
                controller: 'DriverEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            driverId: id
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onDeleteButtonClick = function (id,user_id) {
            MessageBox.showLoading();
            DriverBS.deleteFromCurrentUser(id).then(function (result) {
                MessageBox.hideLoading();
                if($rootScope.loginUser.admin.is_driver){
                    if($rootScope.loginUser.id == user_id){
                        $rootScope.loginUser.admin.is_driver = 0;
                        UserCacheBS.cache($rootScope.loginUser);
                    }
                }
                for (var i=0;i<originalDrivers.length;i++){
                    if(originalDrivers[i].driver_id == id){
                        originalDrivers.splice(i,1);
                        i--
                    }
                }
                for (var i=0;i<$scope.listData.length;i++){
                    if($scope.listData[i].driver_id == id){
                        $scope.listData.splice(i,1);
                        i--
                    }
                }
            }, function (error) {
                console.log(error);
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == "3603")
                    {
                        $timeout(function ()
                        {
                            MessageBox.confirm(T.T('alertTitle.warning'), $filter('translate')('drivers.jsDelete_driver_warning', {length: error.response.data.result.length}), function (isConfirm)
                            {
                                if (isConfirm)
                                {
                                    //$state.go("calendar");
                                    $state.go("calendar",{data:{bookId: error.response.data.result[0].id}});
                                }
                            });
                        }, 500);
                    }
                    else {
                        MessageBox.toast(T.T("comment.jsDelete_fail"), "error");
                    }
                }
            });
        };
        
        // Function
        var originalDrivers = [];
        var loadData = function () {
            MessageBox.showLoading();
            DriverBS.getCurrentUserAll().then(function (result) {
                MessageBox.hideLoading();
                originalDrivers = result.data;
                angular.forEach(originalDrivers,function (item) {
                    if(item.routine){
                        item.workStates = routineConversionsFromISOToLoc(JSON.parse(item.routine))
                    }
                });

                if(searchText){
                    $scope.listData = getSearchDriversResult(originalDrivers,searchText);
                }else {
                    $scope.listData = angular.copy(originalDrivers);
                }
                $scope.timeConvert($scope.listData);
                $timeout(function () {
                    $( function() {
                        $(".card-more").click(function(){
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function(){
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function(){
                            $(this).parents(".gen-panel").fadeOut(200);
                        });
                    });
                },0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated)
                {
                }
                else
                {
                    MessageBox.toast(T.T("drivers.jsGet_driver_fail"),"error");
                }
            });
        };

        //转时区获得正确的routine
        var routineConversionsFromISOToLoc = function (routineArray) {
            var finalWeekRoutine = routineArray.join('');
            //获取时区
            var timeZone = (new Date().getTimezoneOffset() / 60) * (-1) * 2;
            var locRoutineDataString = "";
            if (timeZone > 0) {
                //后面拼到前面
                var tempStart = finalWeekRoutine.substring(48*7-timeZone);
                var tempSpell = finalWeekRoutine.substring(0, 48*7-timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else if (timeZone < 0) {
                //前面拼到后面
                var tempStart = finalWeekRoutine.substring(-timeZone);
                var tempSpell = finalWeekRoutine.substring(0, -timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else {
                locRoutineDataString = finalWeekRoutine;
            }

            //通过locRoutineDataString得到出勤情况
            var routineArray = undefined;
            for (var i = 0; i < 7; i++) {
                var routinePerDay = locRoutineDataString.substring(i * 48, (i + 1) * 48) + "";
                var work = true;
                if(routinePerDay.indexOf('0') == -1){
                    work = false;
                }
                if (routineArray == undefined) {
                    routineArray = new Array(work);
                } else {
                    routineArray.push(work);

                }
            }
            return routineArray;
        };

        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                $scope.timeConvert(originalDrivers);
                if (!word) {
                    searchText = undefined;
                    $scope.listData = angular.copy(originalDrivers);
                }else {
                    $scope.listData = [];
                    $scope.$apply();

                    searchText = word;
                    $scope.listData = getSearchDriversResult(originalDrivers,word);
                }
                $scope.$apply();
                $( function() {
                    $(".card-more").click(function(){
                        $(this).next().fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".gen").click(function(){
                        $(this).parent().find(".gen-panel").fadeIn(200);
                    });
                    $(".gen-cancel").click(function(){
                        $(this).parents(".gen-panel").fadeOut(200);
                    });
                });
            }, 100);
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchDriversResult = function (originalDrivers,searchText) {
            var tempSearch = [];
            angular.forEach(originalDrivers,function (driver) {
                if(driver.first_name.toString().indexOf(searchText.toString()) > -1
                    || driver.last_name.toString().indexOf(searchText.toString()) > -1
                    || driver.mobile.toString().indexOf(searchText.toString()) > -1
                    || driver.email.toString().indexOf(searchText.toString()) > -1
                    || driver.license_number.toString().indexOf(searchText.toString()) > -1){
                    tempSearch.push(driver);
                }
            });
            return tempSearch;
        };

        $scope.timeConvert = function (data) {
            var allTime = [1, 2, 3, 4, 5, 6, 7, 8, 24, 48];
            for(var j = 0; j < data.length;j++){
                data[j].delayTime = data[j].delay_time / 60;
                if (data[j].delayTime < 1) {
                    data[j].delayTime = 1;
                } else if (1 <= data[j].delayTime <= 48) {
                    for (var i = 0; i < allTime.length; i++) {
                        if (data[j].delayTime != allTime[i]) {
                            if (data[j].delayTime > allTime[i] && data[j].delayTime < allTime[i + 1]) {
                                data[j].delayTime = allTime[i + 1];
                            }
                        }
                    }
                } else if (data[j].delayTime > 48) {
                    data[j].delayTime = 48;
                }
            }
        }

        // Init
        loadData();
    });


/**
 * 
 * Created by Pham Chen on 3/18/18.
 */
angular.module('KARL.Controllers')
    .controller('CouponsCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $timeout, MessageBox, CouponBS, UserCacheBS,T,$filter) {

        $scope.companyCurrency = window.localStorage.companyCurrency.toLowerCase();

        if(!$rootScope.loginUser){
            return;
        }

        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.onChange_state = function (id, originalState) {
            MessageBox.showLoading();
            var changedState = originalState == 1 ? 0 : 1;
            CouponBS.change_state(id, changedState).then(function (result) {
                MessageBox.hideLoading();
                loadData();
            }, function (error) {
                console.log(error);
                MessageBox.hideLoading();
            });
        }

        $scope.onEditButtonClick = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/coupon-form.html',
                controller: 'CouponEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            couponId: id
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };



        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            CouponBS.deleteCoupon(id).then(function (result) {
                MessageBox.hideLoading();
                loadData();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    
                }
            });
        };
        
        // Function
        var originalCoupons = [];
        var loadData = function () {
            MessageBox.showLoading();
            CouponBS.getCouponsAll().then(function (result) {
                MessageBox.hideLoading();
                originalCoupons = result.data;
                
                if(searchText){
                    $scope.listData = getSearchCouponsResult(originalCoupons,searchText);
                }else {
                    $scope.listData = angular.copy(originalCoupons);
                }

                $scope.timeConvert($scope.listData);
                $timeout(function () {
                    $( function() {
                        $(".card-more").click(function(){
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function(){
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function(){
                            $(this).parents(".gen-panel").fadeOut(200);
                        });
                        $(".genState").click(function(){
                            $(this).parents(".coupon-card-area").find(".genState_panel").fadeIn(200);
                            
                        });
                        $(".genState_cancel").click(function(){
                            $(this).parents(".genState_panel").fadeOut(200);
                        });
                    });
                },0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated)
                {
                }
                else
                {
                    MessageBox.toast(T.T("coupons.jsGet_coupon_fail"),"error");
                }
            });
        };

        //转时区获得正确的routine
        var routineConversionsFromISOToLoc = function (routineArray) {
            var finalWeekRoutine = routineArray.join('');
            //获取时区
            var timeZone = (new Date().getTimezoneOffset() / 60) * (-1) * 2;
            var locRoutineDataString = "";
            if (timeZone > 0) {
                //后面拼到前面
                var tempStart = finalWeekRoutine.substring(48*7-timeZone);
                var tempSpell = finalWeekRoutine.substring(0, 48*7-timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else if (timeZone < 0) {
                //前面拼到后面
                var tempStart = finalWeekRoutine.substring(-timeZone);
                var tempSpell = finalWeekRoutine.substring(0, -timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else {
                locRoutineDataString = finalWeekRoutine;
            }

            //通过locRoutineDataString得到出勤情况
            var routineArray = undefined;
            for (var i = 0; i < 7; i++) {
                var routinePerDay = locRoutineDataString.substring(i * 48, (i + 1) * 48) + "";
                var work = true;
                if(routinePerDay.indexOf('0') == -1){
                    work = false;
                }
                if (routineArray == undefined) {
                    routineArray = new Array(work);
                } else {
                    routineArray.push(work);

                }
            }
            return routineArray;
        };

        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                $scope.timeConvert(originalCoupons);
                if (!word) {
                    searchText = undefined;
                    $scope.listData = angular.copy(originalCoupons);
                }else {
                    $scope.listData = [];
                    $scope.$apply();

                    searchText = word;
                    $scope.listData = getSearchCouponsResult(originalCoupons,word);
                }
                $scope.$apply();
                $( function() {
                    $(".card-more").click(function(){
                        $(this).next().fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".gen").click(function(){
                        $(this).parent().find(".gen-panel").fadeIn(200);
                    });
                    $(".gen-cancel").click(function(){
                        $(this).parents(".gen-panel").fadeOut(200);
                    });
                    $(".genState").click(function(){
                        $(this).parents(".coupon-card-area").find(".genState_panel").fadeIn(200);
                        
                    });
                    $(".genState_cancel").click(function(){
                        $(this).parents(".genState_panel").fadeOut(200);
                    });
                });
            }, 100);
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchCouponsResult = function (originalCoupons,searchText) {
            var tempSearch = [];
            angular.forEach(originalCoupons,function (coupon) {
                if(coupon.title.toString().indexOf(searchText.toString()) > -1
                    || coupon.code.toString().indexOf(searchText.toString()) > -1){
                    tempSearch.push(coupon);
                }
            });
            return tempSearch;
        };

        $scope.timeConvert = function (data) {
            var allTime = [1, 2, 3, 4, 5, 6, 7, 8, 24, 48];
            for(var j = 0; j < data.length;j++){
                data[j].delayTime = data[j].delay_time / 60;
                if (data[j].delayTime < 1) {
                    data[j].delayTime = 1;
                } else if (1 <= data[j].delayTime <= 48) {
                    for (var i = 0; i < allTime.length; i++) {
                        if (data[j].delayTime != allTime[i]) {
                            if (data[j].delayTime > allTime[i] && data[j].delayTime < allTime[i + 1]) {
                                data[j].delayTime = allTime[i + 1];
                            }
                        }
                    }
                } else if (data[j].delayTime > 48) {
                    data[j].delayTime = 48;
                }
            }
        }

        // Init
        loadData();
    });



/**

 * Created by Pham on 3/18/18.
 *
 * @event editSuccess
 * @event cancel
 */
angular.module('KARL.Controllers')
    .controller('CouponEditCtrl', function ($log, $scope, $rootScope,$state, $stateParams, $http, $uibModal, $timeout, MessageBox, CouponBS, T) {
        
        $timeout(function () {
            angular.element('#couponForm').validator();
            // /************* 左右滑动tab ************* /
            $(".nav-slider li").click(function (e) {
                var mywhidth = $(this).width();
                $(this).addClass("act-tab");
                $(this).siblings().removeClass("act-tab");

                // make sure we cannot click the slider
                if ($(this).hasClass('slider')) {
                    return;
                }

                // Add the slider movement 

                // what tab was pressed
                var whatTab = $(this).index();

                // Work out how far the slider needs to go
                var howFar = mywhidth * whatTab;

                $(".slider").css({
                    left: howFar + "px"
                });
            });
            // /************* / 左右滑动tab ************* /
        }, 0);

        var couponId = $stateParams.data.couponId;
        var lang;
        var nWatchedModelChangeCount = 0;

        var initialize = function () {
            if (window.localStorage.lang) {
                lang = window.localStorage.lang;
            } else {
                lang = navigator.language.toLocaleLowerCase();
            }
            if (lang == 'zh') {
                $scope.unitconversion= 0
            }else if(lang == 'eur'||lang=='fr'){
                $scope.unitconversion= 1
            }else {
                $scope.unitconversion=2
            }
        };

        var loadCoupon = function (couponId) {
            
            $scope.couponId = couponId;

            if(couponId == "0") { //Add
                $scope.code = '';
                $scope.discount_amount = '';
                $scope.discount_type = 0;
                $scope.is_onetime = false;
                $scope.title = '';
                $scope.starting_date = '';
                $scope.end_date = '';
                $scope.is_permanent = false;
                $scope.turn_state = 1;
            }
            else { //Edit
                MessageBox.showLoading();
                initialize();

                CouponBS.getDetail(couponId).then(function (result) {
                    MessageBox.hideLoading();
                    $scope.code = result.data[0].code;
                    $scope.discount_amount = result.data[0].discount_amount;
                    $scope.discount_type = result.data[0].discount_type;
                    $scope.is_onetime = result.data[0].is_onetime == 1 ? true : false;
                    $scope.title = result.data[0].title;
                    $scope.starting_date = result.data[0].starting_date;
                    $scope.end_date = result.data[0].end_date;
                    console.log(result.data[0].end_date);
                    $scope.is_permanent = result.data[0].is_permanent == 1 ? true : false;
                    $scope.turn_state = result.data[0].turn_state;
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("coupon_form.jsGet_detail_fail"), "error");
                    }
                    $timeout(function () {
                        angular.element('#couponForm').validator();
                    }, 100);
                });

            }
        };

        
        // Init data
        loadCoupon(couponId);

        var save = function (param, l) {

            CouponBS.createOrUpdate(param).then(function (result) {
                MessageBox.hideLoading();
                l.stop();
                if ($stateParams.event.editSuccess) {
                    $stateParams.event.editSuccess();
                }
            }, function (error) {
                MessageBox.hideLoading();
                l.stop();
                if (error.treated) {
                }
                else {
                    console.log(error);
                    MessageBox.toast(T.T(error.response.data.result), "error");
                }
            });
        };

        $scope.codekeyDown = function (event) {
            const pattern = /\S+/;
            let inputChar = String.fromCharCode(event.keyCode);
            if (!pattern.test(inputChar)) {
                event.preventDefault();
            }
        };

        $scope.starting_date_keyDown = function (event) {
            /*event.preventDefault();
            console.log()*/
        };

        $scope.end_date_keyDown = function (event) {
            //event.preventDefault();
        };

        $scope.starting_date_changed = function () {
            if(Date.parse($scope.end_date) < Date.parse($scope.starting_date))
                $scope.end_date = $scope.starting_date;
        };

        $scope.end_date_changed = function () {
            if($scope.is_permanent){
                $scope.end_date = '';
                return;
            }
            if(Date.parse($scope.end_date) < Date.parse($scope.starting_date))
                $scope.starting_date = $scope.end_date;
        };

        $scope.onPermanentClick = function () {
            $scope.end_date = '';
            $scope.is_permanent = !$scope.is_permanent;
        };

        // Event
        $scope.onTypeChanged = function (type) {
            $scope.discount_type = type;
            if(type == 1) {
                if($scope.discount_amount > 99)
                    $scope.discount_amount = 0;
            }

            $timeout(function () {
                angular.element('#couponForm').validator();
            }, 100);
        };

        $scope.onDiscount_amount_changed = function () {
            if($scope.discount_type == 1)
                if($scope.discount_amount > 99)
                    $scope.discount_amount = 0;
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.couponForm.$dirty || nWatchedModelChangeCount > 0) {
                MessageBox.confirm(T.T("alertTitle.warning"),T.T("coupon_form.jsExit_warning"), function (isConfirm) {
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

        $scope.onSubmitButtonClick = function (valid, $event) {
            if (!valid) {
                return;
            }
            

            var param = {
                id: couponId,
                company_id: $rootScope.loginUser.company_id,
                code: $scope.code,
                discount_amount: $scope.discount_amount,
                discount_type: $scope.discount_type,
                is_onetime: $scope.is_onetime == false ? 0 : 1,
                title: $scope.title,
                starting_date: $scope.starting_date,
                end_date: $scope.end_date,
                is_permanent: $scope.is_permanent == false ? 0 : 1,
                turn_state: $scope.turn_state
            };
            
            MessageBox.showLoading();
            var l = Ladda.create($event.target);
            l.start();
            
            save(param, l);
        };


    });


/**
 * Created by wanghui on 16-11-15.
 */
angular.module('KARL.Controllers')
    .controller('financeSelectTimeCtrl', function ($log, $scope, $state, MessageBox, OptionBS, $stateParams, $timeout,T) {

        console.log($stateParams);
        $scope.showState=$stateParams.type;
        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();

        };

        $scope.onDoneButtonClick = function () {
            $scope.datetime = $('.datetime').data("DateTimePicker").date()._d;
            $stateParams.event.setTime($scope.datetime);
            $stateParams.event.cancel();
        };


        //init datetimepicker
        var initDatePicker = function () {
            $timeout(function () {
                var time = $stateParams.time;
                var minDate = new Date((time.getFullYear()-1) + '/' + (time.getMonth()+1) + '/' + time.getDate());
                $scope.datetime = time;
                $('.datetime').datetimepicker({
                    inline: true,
                    stepping:15,
                    minDate:minDate,
                    sideBySide:true,
                    defaultDate:time,
                    locale:T.T('fullCalendar_lang')
                });
            }, 0);
        };

        initDatePicker();
    });


/**
 * Created by jian on 17-2-10.
 */
angular.module('KARL.Controllers')
    .controller('financeSendEmail',function ($scope,$stateParams,TransactionBS,MessageBox,$timeout,T) {
        $timeout(function () {
            angular.element('#sendEmails').validator();
        }, 0);
        $scope.email=$stateParams.data.customerData.email;
        $scope.choiceArchive=false;
        $scope.onCancelButtonClick=function () {
            $stateParams.event.cancel(false);
        };

        $scope.archiveClick = function () {
            $scope.choiceArchive = !$scope.choiceArchive
        };

        $scope.submitSendEmail=function ($valid) {
            if (!$valid) {
                return;
            }
            MessageBox.showLoading();
            TransactionBS.sendInvoiceEmail($stateParams.data.bookingId,$scope.email).then(function (result) {
                if($scope.choiceArchive){
                    TransactionBS.editArchive($stateParams.data.bookingId,1).then(function (result) {
                        $stateParams.event.cancel(true);
                        MessageBox.hideLoading();
                        MessageBox.toast(T.T("finance_send_email.jsArchive_invoice_success"), "success");
                    },function () {
                        MessageBox.hideLoading();
                        if (error.treated) {
                        } else {
                            MessageBox.toast(T.T("finance_send_email.jsArchive_invoice_fail"), "error");
                        }
                    })
                }else {
                    $stateParams.event.cancel(false);
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("finance_send_email.jsSend_invoice_email_success"), "success");
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    if (error.response.data.code == "7007") {
                        MessageBox.toast(T.T("finance_send_email.jsThis_Order_Not_Finished"), 'error');
                    }else {
                        MessageBox.toast(T.T("finance_send_email.jsSend_invoice_email_fail"), "error");
                    }
                }
            })

        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('FinanceCtrl', function ($scope, $timeout, $state, $uibModal, $rootScope, $log, $filter, MessageBox, TransactionBS, T) {
        if (!$rootScope.loginUser) {
            return;
        }

        $scope.showSearchResult = false;

        $scope.currentPage1 = 1;
        $scope.pageTotalItems1 = 1;

        $scope.currentPage2 = 1;
        $scope.pageTotalItems2 = 1;

        $scope.currentPage3 = 1;
        $scope.pageTotalItems3 = 1;

        $scope.archivePaging = {};

        $scope.pagePerCount = 12;

        $scope.input = {
            searchText: undefined
        };

        var ciOriginalList = [];
        $scope.clientInvoiceList = [];
        var kbOriginalList = [];
        $scope.karlBillList = [];
        var anOriginalList = [];
        $scope.anList = [];

        $scope.onPageChange = function () {
            loadData(false);
        };

        $scope.onInvoiceDetailClick = function (invoice) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/invoice-detail.html',
                controller: 'invoiceDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: invoice,
                        showEmailButton: 1,
                        event: {
                            cancel: function () {
                                modalInstance.dismiss();
                            },
                            archive: function () {
                                loadData(true);
                            }
                        }
                    }

                }
            });
        };

        $scope.onBillDetailClick = function (invoice) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/bill-detail.html',
                controller: 'billDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: invoice,
                        event: {
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onAnDetailClick = function (invoice) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/an-detail.html',
                controller: 'anDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: invoice,
                        showEmailButton: 1,
                        event: {
                            cancel: function () {
                                modalInstance.dismiss();
                            },
                            archive: function () {
                                loadData(true);
                            }
                        }
                    }
                }
            });
        };

        $scope.selectTimeButton = function (type) {
            var time;
            if (type == 0) {
                time = $scope.startTime
            } else {
                time = $scope.endTime;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/finance-selectTime.html',
                controller: 'financeSelectTimeCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        time: time,
                        type: type,
                        event: {
                            setTime: function (date) {
                                if (type == 0) {
                                    $scope.startTime = date;
                                    if ($scope.startTime.getTime() >= $scope.endTime.getTime()) {
                                        $scope.endTime = new Date($scope.startTime.getTime() + 24 * 3600000);
                                    }
                                } else {
                                    $scope.endTime = date;
                                    if ($scope.startTime.getTime() >= $scope.endTime.getTime()) {
                                        $scope.startTime = new Date($scope.endTime.getTime() - 24 * 3600000);
                                    }
                                }
                                loadData(true);
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }

                }
            });
        };

        $scope.onTabChanged = function (tabIndex) {
            $scope.totleArchive = [];
            $scope.tab = tabIndex;
            loadData(true);
        };

        var init = function () {
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            $scope.startTime = new Date((yesterday.getMonth() + 1) + '/' + yesterday.getDate() + '/' + yesterday.getFullYear() + ' ' + "00:00 AM");
            $scope.endTime = new Date();
            $scope.tab = 0;
            $timeout(function () {
                // /************* 左右滑动tab ************* /
                $(".nav-slider li").click(function (e) {
                    var mywhidth = $(this).width();
                    $(this).addClass("act-tab1");
                    $(this).siblings().removeClass("act-tab1");

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
                // /************* / 左右滑动tab ************* /
            }, 0);
        };

        var firstLoad = true;
        var loadData = function (withTimeOrTabChange) {
            MessageBox.showLoading();
            var tempPage;
            var filter;
            var archive;
            if ($scope.tab == 0) {
                if (withTimeOrTabChange) {
                    tempPage = 1;
                } else {
                    tempPage = $scope.currentPage1;
                }
                filter = 3;
                archive = 0;
            } else if ($scope.tab == 1) {
                if (withTimeOrTabChange) {
                    tempPage = 1;
                } else {
                    tempPage = $scope.currentPage2;
                }
                filter = 3;
                archive = 0;
            } else if ($scope.tab == 2) {
                if (withTimeOrTabChange) {
                    tempPage = 1;
                } else {
                    tempPage = $scope.currentPage3;
                }
                filter = 4;
                archive = 0;
            } else {
                if (withTimeOrTabChange) {
                    tempPage = 1;
                }
                $scope.archivePaging.archiveCurrentPage1 = 1;
                $scope.archivePageTotalItems1 = 1;
                $scope.archivePaging.archiveCurrentPage2 = 1;
                $scope.archivePageTotalItems2 = 1;
                $scope.archivePaging.archiveCurrentPage3 = 1;
                $scope.archivePageTotalItems3 = 1;
                filter = 3;
                archive = 1;
                $scope.totleArchive = [];
            }
            TransactionBS.getTransactions($scope.startTime, $scope.endTime,
                tempPage, $scope.pagePerCount, $scope.input.searchText, filter, archive).then(function (result) {
                for (var i = 0; i < result.data.transactions.length; i++) {
                    result.data.transactions[i].duration = formartDuration(result.data.transactions[i].duration);
                    result.data.transactions[i].customer_data = JSON.parse(result.data.transactions[i].customer_data);
                    result.data.transactions[i].driver_data = JSON.parse(result.data.transactions[i].driver_data);
                    result.data.transactions[i].offer_data = JSON.parse(result.data.transactions[i].offer_data);
                    try {
                        result.data.transactions[i].d_address = JSON.parse(result.data.transactions[i].d_address);
                        if (result.data.transactions[i].d_address.formatted_address) {
                            result.data.transactions[i].d_address = result.data.transactions[i].d_address.formatted_address
                        }
                    } catch (e) {
                    }
                    if (result.data.transactions[i].a_address) {
                        try {
                            result.data.transactions[i].a_address = JSON.parse(result.data.transactions[i].a_address);
                            if (result.data.transactions[i].a_address.formatted_address) {
                                result.data.transactions[i].a_address = result.data.transactions[i].a_address.formatted_address
                            }
                        } catch (e) {
                        }
                    }
                    if (result.data.transactions[i].offer_data.prices) {   //...计算rate
                        result.data.transactions[i].offer_data.prices = JSON.parse(result.data.transactions[i].offer_data.prices);
                        var item = result.data.transactions[i].offer_data.prices;
                        if (result.data.transactions[i].type == 1) {
                            if (result.data.transactions[i].distance <= item[0].invl_end) {
                                result.data.transactions[i].rate = item[0].price
                            } else if (result.data.transactions[i].distance > item[item.length - 1].invl_start) {
                                result.data.transactions[i].rate = item[item.length - 1].price
                            } else {
                                for (var n = 0; n < item.length; n++) {
                                    if (result.data.transactions[i].distance <= item[n].invl_end) {
                                        result.data.transactions[i].rate = item[n].price
                                    }
                                }
                            }
                        } else {
                            result.data.transactions[i].rate = result.data.transactions[i].offer_data.prices[0].price
                        }
                    } else {
                        result.data.transactions[i].rate = result.data.transactions[i].offer_data.price
                    }
                }
                console.log(result.data);
                var clientInvoice = angular.copy(result.data);
                clientInvoice.name = T.T('finance.jsClient_Invoices');
                clientInvoice.id = 1;
                var KarlBill = angular.copy(result.data);
                KarlBill.name = T.T('finance.jsKarl_Bill');
                KarlBill.id = 2;
                $timeout(function () {
                    if ($scope.tab == 0 || $scope.tab == 1 || $scope.tab == 2) {
                        $timeout(function () {
                            $(function () {
                                $(".card-more").click(function () {
                                    $(this).next().fadeToggle();
                                    $(this).fadeToggle(
                                        $(this).children("i").toggleClass("fa-ellipsis-v")
                                    );
                                });
                                $(".gen").click(function () {
                                    $(this).parent().find(".gen-panel").fadeIn(200);
                                });
                                $(".gen-cancel").click(function () {
                                    $(this).parents(".gen-panel").fadeOut(200);
                                });
                            });
                        }, 0);
                    }

                    var tempSearch;
                    if ($scope.tab == 0) {
                        MessageBox.hideLoading();
                        if (withTimeOrTabChange) {
                            $scope.currentPage1 = 1;

                        }
                        $scope.pageTotalItems1 = result.data.total;
                        ciOriginalList = result.data.transactions;
                        if (searchText) {
                            tempSearch = getSearchInvoiceResult(ciOriginalList, searchText);
                            $scope.clientInvoiceList = getClientInvoiceList(tempSearch);
                        } else {
                            $scope.clientInvoiceList = getClientInvoiceList(ciOriginalList);
                        }
                        console.log($scope.clientInvoiceList)
                    } else if ($scope.tab == 1) {
                        MessageBox.hideLoading();
                        if (withTimeOrTabChange) {
                            $scope.currentPage2 = 1;
                        }
                        $scope.pageTotalItems2 = result.data.total;
                        kbOriginalList = result.data.transactions;
                        if (searchText) {
                            tempSearch = getSearchInvoiceResult(kbOriginalList, searchText);
                            $scope.karlBillList = getKarlBillList(tempSearch);
                        } else {
                            $scope.karlBillList = getKarlBillList(kbOriginalList);
                        }
                    } else if ($scope.tab == 2) {
                        MessageBox.hideLoading();
                        if (withTimeOrTabChange) {
                            $scope.currentPage3 = 1;
                        }
                        $scope.pageTotalItems3 = result.data.total;
                        anOriginalList = result.data.transactions;
                        if (searchText) {
                            tempSearch = getSearchInvoiceResult(anOriginalList, searchText);
                            $scope.anList = getAnList(tempSearch);
                        } else {
                            $scope.anList = getAnList(anOriginalList);
                        }
                    } else {
                        // AN archive
                        TransactionBS.getTransactions($scope.startTime, $scope.endTime,
                            tempPage, $scope.pagePerCount, $scope.input.searchText, 4, 1).then(function (result) {
                            $scope.totleArchive = [];
                            $timeout(function () {
                                var anList = {};
                                anList.name = T.T('finance.jsAffiliate_Network');
                                anList.total = result.data.total;
                                anList.id = 3;
                                anList.transactions = [];
                                var AInvoice = [];
                                var BInvoice = [];
                                var myCompayId = $rootScope.loginUser.company_id;
                                for (var i = 0; i < result.data.transactions.length; i++) {
                                    result.data.transactions[i].customer_data = JSON.parse(result.data.transactions[i].customer_data);
                                    result.data.transactions[i].driver_data = JSON.parse(result.data.transactions[i].driver_data);
                                    if (myCompayId == result.data.transactions[i].own_com_id) {
                                        AInvoice.push(result.data.transactions[i])
                                    } else {
                                        BInvoice.push(result.data.transactions[i])
                                    }
                                }
                                anList.transactions.push(AInvoice, BInvoice);
                                $scope.totleArchive.push(clientInvoice, KarlBill, anList);
                                $scope.archivePageTotalItems1 = $scope.totleArchive[0].total;
                                $scope.archivePageTotalItems2 = $scope.totleArchive[1].total;
                                $scope.archivePageTotalItems3 = $scope.totleArchive[2].total;
                                $timeout(function () {
                                    $(".card-more").click(function () {
                                        $(this).next().fadeToggle();
                                        $(this).fadeToggle(
                                            $(this).children("i").toggleClass("fa-ellipsis-v")
                                        );
                                    });
                                    $(".gen").click(function () {
                                        $(this).parent().find(".gen-panel").fadeIn(200);
                                    });
                                    $(".gen-cancel").click(function () {
                                        $(this).parents(".gen-panel").fadeOut(200);
                                    });

                                    if (firstLoad) {
                                        $("#karl-accordion").accordion({
                                            header: 'h3.myselect',
                                            active: false,
                                            collapsible: true,
                                            heightStyle: "content"
                                        });
                                    } else {
                                        $("#karl-accordion").accordion("refresh");
                                        $("#karl-accordion").accordion("option", "active", false);
                                        $("#karl-accordion").accordion("option", "animate", false);
                                    }
                                    firstLoad = false;
                                }, 0);
                                MessageBox.hideLoading();
                            }, 0)

                        }, function (error) {
                            MessageBox.hideLoading();
                            if (error.treated) {
                            } else {
                                MessageBox.toast(T.T("finance.jsGet_accounting_fail"), "error");
                            }
                        })
                    }
                    $scope.$apply();
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    MessageBox.toast(T.T("finance.jsGet_accounting_fail"), "error");
                }
            });
        };

        function formartDuration(s) {
            var t;
            if (s > -1) {
                var hour = Math.floor(s / 60) % 60;
                var min = s % 60;
                t = hour + ":";

                if (min < 10) {
                    t += "0";
                }
                t += min;
            }
            return t;
        }

        var getClientInvoiceList = function (orList) {
            console.log(orList)
            var dayGroup = [];
            for (var i = 0; i < orList.length; i++) {
                var day = $filter('date')(orList[i].settle_time * 1000, 'longDate');
                if (dayGroup.length == 0) {
                    dayGroup.push({invoiceList: [orList[i]], invoiceCount: 1})
                } else {
                    var find = false;
                    for (var j = 0; j < dayGroup.length; j++) {
                        var header = $filter('date')(dayGroup[j].invoiceList[0].settle_time * 1000, 'longDate');
                        if (day == header) {
                            find = true;
                            dayGroup[j].invoiceList.push(orList[i]);
                            dayGroup[j].invoiceCount++;
                        }
                    }
                    if (!find) {
                        dayGroup.push({invoiceList: [orList[i]], invoiceCount: 1});
                    }
                }
            }
            return dayGroup;
        };

        var getKarlBillList = function (orList) {
            return getClientInvoiceList(orList);
        };

        var getAnList = function (orList) {
            var dayGroup = [];
            var myCompayId = $rootScope.loginUser.company_id;
            for (var i = 0; i < orList.length; i++) {
                var day = $filter('date')(orList[i].settle_time * 1000, 'longDate');
                console.log(day);
                if (dayGroup.length == 0) {
                    var AInvoice;
                    var BInvoice;
                    if (myCompayId == orList[i].own_com_id) {
                        //A单
                        AInvoice = {invoiceList: [orList[i]], invoiceCount: 1};
                        BInvoice = {invoiceList: [], invoiceCount: 0};
                    } else {
                        //B单
                        AInvoice = {invoiceList: [], invoiceCount: 0};
                        BInvoice = {invoiceList: [orList[i]], invoiceCount: 1};
                    }
                    dayGroup.push({time: orList[i].settle_time, AInvoice: AInvoice, BInvoice: BInvoice});
                } else {
                    var find = false;
                    for (var j = 0; j < dayGroup.length; j++) {
                        var header = $filter('date')(dayGroup[j].time * 1000, 'longDate');
                        console.log(header);
                        if (day == header) {
                            find = true;
                            if (myCompayId == orList[i].own_com_id) {
                                //A单
                                dayGroup[j].AInvoice.invoiceList.push(orList[i]);
                                dayGroup[j].AInvoice.invoiceCount++;
                            } else {
                                //B单
                                dayGroup[j].BInvoice.invoiceList.push(orList[i]);
                                dayGroup[j].BInvoice.invoiceCount++;
                            }
                        }
                    }
                    if (!find) {
                        var AInvoice;
                        var BInvoice;
                        if (myCompayId == orList[i].own_com_id) {
                            //A单
                            AInvoice = {invoiceList: [orList[i]], invoiceCount: 1};
                            BInvoice = {invoiceList: [], invoiceCount: 0};
                        } else {
                            //B单
                            AInvoice = {invoiceList: [], invoiceCount: 0};
                            BInvoice = {invoiceList: [orList[i]], invoiceCount: 1};
                        }
                        dayGroup.push({time: orList[i].settle_time, AInvoice: AInvoice, BInvoice: BInvoice});
                    }
                }
            }
            console.log(dayGroup)
            return dayGroup;
        };

        init();
        loadData(false);

        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            if ($scope.tab == 3) {
                $timeout(function () {
                    loadData(true);
                }, 10);
            } else {
                $timeout(function () {
                    if (!word) {
                        searchText = undefined;
                        $scope.showSearchResult = false;
                        $timeout(function () {
                            $(".card-more").click(function () {
                                $(this).next().fadeToggle();
                                $(this).fadeToggle(
                                    $(this).children("i").toggleClass("fa-ellipsis-v")
                                );
                            });
                            $(".gen").click(function () {
                                $(this).parent().find(".gen-panel").fadeIn(200);
                            });
                            $(".gen-cancel").click(function () {
                                $(this).parents(".gen-panel").fadeOut(200);
                            });
                        }, 0);
                        if ($scope.tab == 0) {
                            $scope.clientInvoiceList = [];
                            $scope.$apply();

                            $scope.clientInvoiceList = getClientInvoiceList(ciOriginalList);
                        } else if ($scope.tab == 1) {
                            $scope.karlBillList = [];
                            $scope.$apply();

                            $scope.karlBillList = getKarlBillList(kbOriginalList);
                        } else {
                            $scope.anList = [];
                            $scope.$apply();

                            $scope.anList = getAnList(anOriginalList);
                        }
                    } else {
                        searchText = word;
                        $scope.showSearchResult = true;
                        var tempSearch;
                        $timeout(function () {
                            $(".card-more").click(function () {
                                $(this).next().fadeToggle();
                                $(this).fadeToggle(
                                    $(this).children("i").toggleClass("fa-ellipsis-v")
                                );
                            });
                            $(".gen").click(function () {
                                $(this).parent().find(".gen-panel").fadeIn(200);
                            });
                            $(".gen-cancel").click(function () {
                                $(this).parents(".gen-panel").fadeOut(200);
                            });
                        }, 0);
                        if ($scope.tab == 0) {
                            $scope.clientInvoiceList = [];
                            $scope.$apply();

                            tempSearch = getSearchInvoiceResult(ciOriginalList, word);
                            $scope.clientInvoiceList = getClientInvoiceList(tempSearch);
                        } else if ($scope.tab == 1) {
                            $scope.clientInvoiceList = [];
                            $scope.$apply();

                            tempSearch = getSearchInvoiceResult(kbOriginalList, word);
                            $scope.karlBillList = getKarlBillList(tempSearch);
                        } else {
                            $scope.clientInvoiceList = [];
                            $scope.$apply();

                            tempSearch = getSearchInvoiceResult(anOriginalList, word);
                            $scope.anList = getAnList(tempSearch);
                        }
                    }
                    $scope.$apply();
                }, 100);
            }

        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchInvoiceResult = function (orlList, searchText) {
            var tempSearch = [];
            angular.forEach(orlList, function (invoice) {
                if (invoice.customer_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || invoice.customer_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || invoice.customer_data.email.toString().indexOf(searchText.toString()) > -1
                    || invoice.customer_data.mobile.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.mobile.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.email.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.license_number.toString().indexOf(searchText.toString()) > -1) {
                    tempSearch.push(invoice);
                }
            });
            return tempSearch;
        };


        $scope.onArchiveButtonClick = function (archiveId, bookingId) {
            MessageBox.showLoading();
            TransactionBS.editArchive(bookingId, archiveId).then(function (result) {
                MessageBox.hideLoading();
                loadData(true);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    MessageBox.toast(T.T("finance.jsArchive_Failed"), "error");
                }
            })
        };


        $scope.onArchiveDetailClick = function (item, index) {
            if (index == 1) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/invoice-detail.html',
                    controller: 'invoiceDetailCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: item,
                            event: {
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }

                    }
                });
            } else if (index == 2) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/bill-detail.html',
                    controller: 'billDetailCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: item,
                            event: {
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }
                    }
                });
            } else {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/an-detail.html',
                    controller: 'anDetailCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: item,
                            event: {
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }
                    }
                });
            }
        };

        $scope.onArchivePageChange = function (index) {
            if (index == 1 || index == 2) {
                var tempPage;
                if (index == 1) {
                    tempPage = $scope.archivePaging.archiveCurrentPage1
                } else if (index == 2) {
                    tempPage = $scope.archivePaging.archiveCurrentPage2
                }
                MessageBox.showLoading();
                TransactionBS.getTransactions($scope.startTime, $scope.endTime,
                    tempPage, $scope.pagePerCount, $scope.input.searchText, 3, 1).then(function (result) {
                    $timeout(function () {
                        $(".card-more").click(function () {
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function () {
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function () {
                            $(this).parents(".gen-panel").fadeOut(200);
                        });

                        $("#karl-accordion").accordion("refresh");
                        $("#karl-accordion").accordion("option", "active", index - 1);
                        $("#karl-accordion").accordion("option", "animate", false);

                    }, 0);
                    for (var i = 0; i < result.data.transactions.length; i++) {
                        result.data.transactions[i].customer_data = JSON.parse(result.data.transactions[i].customer_data);
                        result.data.transactions[i].driver_data = JSON.parse(result.data.transactions[i].driver_data);
                    }
                    if (index == 1) {
                        var clientInvoice = angular.copy(result.data);
                        clientInvoice.name = T.T('finance.jsClient_Invoices');
                        clientInvoice.id = 1;
                        $scope.totleArchive[0] = clientInvoice;
                        $scope.archivePageTotalItems1 = $scope.totleArchive[0].total;
                    } else if (index == 2) {
                        var KarlBill = angular.copy(result.data);
                        KarlBill.name = T.T('finance.jsKarl_Bill');
                        KarlBill.id = 2;
                        $scope.totleArchive[1] = KarlBill;
                        $scope.archivePageTotalItems2 = $scope.totleArchive[1].total;
                    }
                    MessageBox.hideLoading();
                }, function () {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    } else {
                        MessageBox.toast(T.T("finance.jsGet_accounting_fail"), "error");
                    }
                })
            } else {
                MessageBox.showLoading();
                TransactionBS.getTransactions($scope.startTime, $scope.endTime,
                    $scope.archivePaging.archiveCurrentPage3, $scope.pagePerCount, $scope.input.searchText, 4, 1).then(function (result) {
                    $timeout(function () {
                        $(".card-more").click(function () {
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function () {
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function () {
                            $(this).parents(".gen-panel").fadeOut(200);
                        });

                        $("#karl-accordion").accordion("refresh");
                        $("#karl-accordion").accordion("option", "active", index - 1);
                        $("#karl-accordion").accordion("option", "animate", false);

                    }, 0);

                    var anList = {};
                    anList.name = T.T('finance.jsAffiliate_Network');
                    anList.total = result.data.total;
                    anList.id = 3;
                    anList.transactions = [];
                    var AInvoice = [];
                    var BInvoice = [];
                    var myCompayId = $rootScope.loginUser.company_id;
                    for (var i = 0; i < result.data.transactions.length; i++) {
                        result.data.transactions[i].customer_data = JSON.parse(result.data.transactions[i].customer_data);
                        result.data.transactions[i].driver_data = JSON.parse(result.data.transactions[i].driver_data);
                        if (myCompayId == result.data.transactions[i].own_com_id) {
                            AInvoice.push(result.data.transactions[i])
                        } else {
                            BInvoice.push(result.data.transactions[i])
                        }
                    }
                    anList.transactions.push(AInvoice, BInvoice);
                    $scope.totleArchive[2] = anList;
                    $scope.archivePageTotalItems3 = $scope.totleArchive[2].total;
                    MessageBox.hideLoading();
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    } else {
                        MessageBox.toast(T.T("finance.jsGet_accounting_fail"), "error");
                    }
                })
            }
        }

    });

/**
 * Created by lqh on 2016/11/9.
 */
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('ForgotPwdCtrl', function ($log, $scope,$stateParams, MessageBox,UserBS,T) {
        $scope.email='';
        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };
        $scope.commitEmail = function (valid) {
            if (!valid) {
                return;
            }
            UserBS.forgotPassword($scope.email).then(
                function () {
                    $scope.email=null;
                    MessageBox.toast(T.T("forgot_password.jsCheck_email_admin"));
                    $stateParams.event.cancel();
                },function () {
                    MessageBox.toast(T.T("forgot_password.jsEmail_not_found"),"error");
                });
        }
    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('HomeCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, $filter, MessageBox, UserBS, OrderBS, BookBS, LocationService, CompanyBS,T) {
        if(!$rootScope.loginUser){
            return
        }
        var companyId = $rootScope.loginUser.company_id;
        var map = undefined;
        var markerArray = [];
        var lastOriginalOrderList = [];
        var tempOrderListBeforeSelectOneVehicle = [];
        $scope.timeStateActionIsShow = false;
        $scope.selectedTimeState = 0;
        $scope.showSearchResult = false;
        $scope.isDisplayOneVehicleOnTrip = false;
        $scope.distanceUnit=localStorage.getItem('distanceunit');
        $scope.showLoading=false;
       //todo
       //  var lang='en';
        var lang;
        var initialize = function () {
            if (window.localStorage.lang) {
                lang = window.localStorage.lang;
            } else {
                lang = navigator.language.toLocaleLowerCase();
            }
            if ( lang == 'zh') {
                $scope.disclaimerTranslate = 0
            }else if(lang == 'eur'||lang == 'fr'){
                $scope.disclaimerTranslate = 1
            }else {
                $scope.disclaimerTranslate = 2
            }
        };

        var initMap = function (pos) {
            map = new google.maps.Map(document.getElementById('carMap'), {
                zoom: 12,
                center: pos,
                mapTypeControl: false,
                streetViewControl: false
            });
        };

        var initCompanyAddress = function () {
            CompanyBS.getCurrentCompanies().then(function (result) {
                $scope.company = angular.copy(result.data);
                if (result.data.address.indexOf('address_components') > 0) {
                    $scope.company.address = JSON.parse(result.data.address);
                } else {
                    $scope.company.address = {
                        geometry: {
                            location: {lat: result.data.lat, lng: result.data.lng}
                        }
                    };
                }
                $scope.pos = {
                    lat: $scope.company.address.geometry.location.lat,
                    lng: $scope.company.address.geometry.location.lng
                };
                map.setCenter($scope.pos, 12);
            }, function (error) {

            })
        };


        var getTodayActiveOrders = function () {
            initialize();
            if ($location.$$url != "/home") {
                return;
            }

            OrderBS.getHomeOrders().then(function (data) {
                console.log(data)
                var todayOrders = [];
                if (data.code == 2000 && data.result && data.result.length > 0) {
                    for (var i = 0; i < data.result.length; i++) {
                        data.result[i].driver_data = JSON.parse(data.result[i].driver_data);
                        data.result[i].car_data = JSON.parse(data.result[i].car_data);
                        data.result[i].customer_data = JSON.parse(data.result[i].customer_data);
                        data.result[i].option_data = JSON.parse(data.result[i].option_data);
                        data.result[i].isShowDriverAndVehicle = false;
                        if (data.result[i].type == 1) {
                            if (data.result[i].estimate_distance.toString().indexOf('.') > -1 && data.result[i].estimate_distance.toString().length > data.result[i].estimate_distance.toString().indexOf('.') + 3) {
                                data.result[i].estimate_distance = data.result[i].estimate_distance.toString().substring(0, data.result[i].estimate_distance.toString().indexOf('.') + 3);
                            }
                        }
                        //判断订单是否迟到
                        //time_state
                        //0:on time, 1:action required, 2:late, 3:idle
                        if (data.result[i].trip_state == 0) {
                            if (parseInt((new Date().valueOf() + "").substr(0, 10)) > parseInt(data.result[i].appointed_at)) {
                                //迟到
                                data.result[i].time_state = 2;
                            } else {
                                data.result[i].time_state = 3;
                                data.result[i].timeToPickup = Math.floor((data.result[i].appointed_at - new Date().getTime() / 1000) / 60);
                            }
                        } else if (data.result[i].trip_state == 1) {
                            if (parseInt((new Date().valueOf() + "").substr(0, 10)) > parseInt(data.result[i].appointed_at)) {
                                //迟到
                                data.result[i].time_state = 2;
                                getMapMatrixDistance(data.result[i], data.result[i].last_report_lat, data.result[i].last_report_lng, data.result[i].d_lat, data.result[i].d_lng);
                            } else {
                                getMapMatrixDistance(data.result[i], data.result[i].last_report_lat, data.result[i].last_report_lng, data.result[i].d_lat, data.result[i].d_lng);
                            }
                        } else if (data.result[i].trip_state >= 2) {
                            data.result[i].time_state = 0;
                            if (data.result[i].trip_state == 3) {
                                if (data.result[i].type == 1) {
                                    getMapMatrixDistance(data.result[i], data.result[i].last_report_lat, data.result[i].last_report_lng, data.result[i].a_lat, data.result[i].a_lng);
                                } else {
                                    data.result[i].last = Math.floor((new Date().getTime() / 1000 - data.result[i].start_time) / 60);
                                }
                            }
                        }
                        //还原面板打开状态
                        for (var j = 0; j < lastOriginalOrderList.length; j++) {
                            if (data.result[i].id == lastOriginalOrderList[j].id) {
                                data.result[i].isShowDriverAndVehicle = lastOriginalOrderList[j].isShowDriverAndVehicle;
                                break;
                            }
                        }
                        todayOrders.push(data.result[i]);
                    }
                    lastOriginalOrderList = todayOrders;

                    var tempResult;
                    if (!$scope.showSearchResult) {
                        tempResult = lastOriginalOrderList;
                    } else {
                        tempResult = getSearchOrderResult(lastOriginalOrderList, $scope.input.searchText);
                    }

                    var selectTimeStateOrderList = [];
                    if ($scope.selectedTimeState == 0) {
                        //all
                        selectTimeStateOrderList = tempResult;
                    } else if ($scope.selectedTimeState == 1) {
                        //on time
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 0) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 2) {
                        //action required
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 1) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 3) {
                        //late
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 2) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 4) {
                        //idle
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 3) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    }

                    initVehiclePop(selectTimeStateOrderList);
                    $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);
                } else {
                    for (var i = 0; i < markerArray.length; i++) {
                        markerArray[i].setMap(null);
                    }
                }
                $scope.showLoading=false;
            }, function (error) {
                $scope.showLoading=false;
                for (var i = 0; i < markerArray.length; i++) {
                    markerArray[i].setMap(null);
                }
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("home.jsGet_order_fail"), "error");
                }
            });
            if (map) {
                map.setCenter($scope.pos);
                map.setZoom(12)
            }

        };
        getTodayActiveOrders();

        // 手动刷新
        $scope.refreshClick = function () {
            $scope.isDisplayOneVehicleOnTrip = false;
            $scope.showLoading=true;
            getTodayActiveOrders()
        };

        //定位方法
        // LocationService.getCurrentPosition(function (position) {
        //     $scope.pos = {lat: position.location.lat, lng: position.location.lng};
        //     initMap($scope.pos);
        //     initCompanyAddress();
        // }, function () {
        //     $scope.pos = $rootScope.loginUser.admin.location;
        //     initMap($scope.pos);
        //     initCompanyAddress();
        // });

        $timeout(function () {
            console.log($rootScope.loginUser)
            if ($rootScope.loginUser.admin.location.lat && $rootScope.loginUser.admin.location.lng) {
                $scope.pos = {
                    lat:parseFloat($rootScope.loginUser.admin.location.lat),
                    lng:parseFloat($rootScope.loginUser.admin.location.lng),
                };
                initMap($scope.pos);
            } else {
                LocationService.getCurrentPosition(function (position) {
                    $scope.pos = {lat: position.location.lat, lng: position.location.lng};
                    initMap($scope.pos);
                },function () {

                })
            }
        });


        //按小时为单位,整合一天的booking
        var integrationTodayOrdersByHourly = function (orders) {
            var bookingGroup = [];
            for (var i = 0; i < orders.length; i++) {
                if (companyId == orders[i].own_company_id && companyId != orders[i].exe_company_id) {
                    orders[i].showState = 1;
                    orders[i].driver_data.mobile = orders[i].exe_company_phone1;
                } else if (companyId != orders[i].own_company_id && companyId == orders[i].exe_company_id) {
                    orders[i].showState = 2;
                }
                if (orders[i].reject == 1) {
                    orders[i].showReject = true;
                    if (orders[i].showState == 2) {
                        orders[i].showState = false
                    }
                } else {
                    orders[i].showReject = false
                }
                var hour = $filter('date')(orders[i].appointed_at * 1000, 'h a');
                if (bookingGroup.length == 0) {
                    bookingGroup.push({bookingList: [orders[i]], bookingCount: 1})
                } else {
                    var find = false;
                    for (var j = 0; j < bookingGroup.length; j++) {
                        var header = $filter('date')(bookingGroup[j].bookingList[0].appointed_at * 1000, 'h a');
                        if (hour == header) {
                            find = true;
                            bookingGroup[j].bookingList.push(orders[i]);
                            bookingGroup[j].bookingCount++;
                        }
                    }
                    if (!find) {
                        bookingGroup.push({bookingList: [orders[i]], bookingCount: 1});
                    }
                }
            }
            return bookingGroup;
        };

        //显示地图上的车辆
        var initVehiclePop = function (orders) {
            if (!map) {
                return;
            }

            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < markerArray.length; i++) {
                markerArray[i].setMap(null);
            }

            for (var i = 0; i < orders.length; i++) {
                var order = orders[i];
                if (order.trip_state < 1 || order.trip_state > 4) {
                    continue;
                }
                if (!order.last_report_lat || !order.last_report_lng) {
                    continue;
                }

                var url = "";
                if (order.time_state != undefined) {
                    if (order.time_state == 0) {
                        //on time
                        url = "img/dashboard/car_green.png";
                    } else if (order.time_state == 1) {
                        //action required
                        url = "img/dashboard/car_yellow.png";
                    } else if (order.time_state == 2) {
                        //late
                        url = "img/dashboard/car_red.png";
                    }
                    setAndDisplayMarker(order, url, bounds);
                }
            }
        };


        var setAndDisplayMarker = function (order, markerIcon, bounds) {
            var image = {
                url: markerIcon,
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(39, 41),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 31)
            };

            var latLng = new google.maps.LatLng({
                lat: order.last_report_lat,
                lng: order.last_report_lng
            });
            bounds.extend(latLng);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: image,
                visible: false
            });
            google.maps.event.addListener(marker, "click", function () {
                onVehicleMarkerClick(order);

            });
            markerArray.push(marker);
            marker.setVisible(true);
        };

        var onVehicleMarkerClick = function (order) {
            if (!$scope.isDisplayOneVehicleOnTrip) {
                tempOrderListBeforeSelectOneVehicle = angular.copy($scope.todayBookingGroup);
            }
            var selectTimeStateOrderList = [order];
            $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);
            $scope.isDisplayOneVehicleOnTrip = true;
            $scope.$apply();

            $scope.showHomePanel();
        };


        $scope.onCancelDisplayOneVehicleOnTrip = function () {
            $scope.isDisplayOneVehicleOnTrip = false;
            $scope.todayBookingGroup = angular.copy(tempOrderListBeforeSelectOneVehicle);
        };

        //自动调整高度
        $scope.resizeFix = function () {
            if ($(window).width() > 768) {
                angular.element($("#carMap")).css("height", window.screen.availHeight + "px");
            }
            if ($(window).width() <= 768) {
                angular.element($("#carMap")).css("height", window.screen.availHeight + "px");
            }
        };
        $scope.resizeFix();
        window.onresize = function () {
            $scope.resizeFix()
        };


        $scope.showTimeStateAction = function () {
            $scope.timeStateActionIsShow = !$scope.timeStateActionIsShow;
        };

        $scope.onChangeTimeState = function (index) {
            $scope.isDisplayOneVehicleOnTrip = false;
            $scope.timeStateActionIsShow = false;
            if ($scope.selectedTimeState == index) {
                return;
            }
            $scope.selectedTimeState = index;

            var tempResult;
            if (!$scope.showSearchResult) {
                tempResult = lastOriginalOrderList;
            } else {
                tempResult = getSearchOrderResult(lastOriginalOrderList, $scope.input.searchText);
            }

            var selectTimeStateOrderList = [];
            if ($scope.selectedTimeState == 0) {
                //all
                selectTimeStateOrderList = tempResult;
            } else if ($scope.selectedTimeState == 1) {
                //on time
                angular.forEach(tempResult, function (order) {
                    if (order.time_state == 0) {
                        selectTimeStateOrderList.push(order);
                    }
                });
            } else if ($scope.selectedTimeState == 2) {
                //action required
                angular.forEach(tempResult, function (order) {
                    if (order.time_state == 1) {
                        selectTimeStateOrderList.push(order);
                    }
                });
            } else if ($scope.selectedTimeState == 3) {
                //late
                angular.forEach(tempResult, function (order) {
                    if (order.time_state == 2) {
                        selectTimeStateOrderList.push(order);
                    }
                });
            } else if ($scope.selectedTimeState == 4) {
                //idle
                angular.forEach(tempResult, function (order) {
                    if (order.time_state == 3) {
                        selectTimeStateOrderList.push(order);
                    }
                });
            }
            initVehiclePop(selectTimeStateOrderList);
            $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);
        };

        $scope.showHomePanel = function () {
            $('.home-panel').show();
            $('.home-today').hide();
        };

        $scope.showDriverAndVehicle = function (orderId) {
            var find = false;
            for (var i = 0; i < $scope.todayBookingGroup.length; i++) {
                for (var j = 0; j < $scope.todayBookingGroup[i].bookingList.length; j++) {
                    if ($scope.todayBookingGroup[i].bookingList[j].id == orderId) {
                        $scope.todayBookingGroup[i].bookingList[j].isShowDriverAndVehicle = !$scope.todayBookingGroup[i].bookingList[j].isShowDriverAndVehicle;
                        find = true;
                        break;
                    }
                }
                if (find) {
                    break;
                }
            }
        };

        //获取两点距离和预计开车时长
        var getMapMatrixDistance = function (order, originLat, originlng, destinationLat, destinationLng) {
            var origins = [{lat: originLat, lng: originlng}];
            var destinations = [{lat: destinationLat, lng: destinationLng}];
            var travelMode = "DRIVING";
            var distanceMatrixService = new google.maps.DistanceMatrixService;
            distanceMatrixService.getDistanceMatrix({
                origins: origins,
                destinations: destinations,
                travelMode: google.maps.TravelMode[travelMode],
                // unitSystem: google.maps.UnitSystem.IMPERIAL
                unitSystem:  $scope.distanceUnit==1?google.maps.UnitSystem.IMPERIAL:google.maps.UnitSystem.METRIC
            }, function (response, status) {
                $timeout(function () {
                    if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                        if (order.trip_state == 1) {
                            if (parseInt((new Date().valueOf() + "").substr(0, 10)) > parseInt(order.appointed_at)) {
                                //迟到
                                order.time_state = 2;
                                if($scope.distanceUnit==1){
                                    order.distanceToClient = Math.floor(response.rows[0].elements[0].distance.value * 0.62 / 1000);
                                }else {
                                    order.distanceToClient = Math.floor(response.rows[0].elements[0].distance.value / 1000);
                                }
                                order.timeToClient = Math.floor(response.rows[0].elements[0].duration.value / 60);
                            } else {
                                if($scope.distanceUnit==1){
                                    order.distanceToClient = Math.floor(response.rows[0].elements[0].distance.value * 0.62 / 1000);
                                }else {
                                    order.distanceToClient = Math.floor(response.rows[0].elements[0].distance.value / 1000);
                                }
                                var duration = response.rows[0].elements[0].duration.value;
                                order.timeToClient = Math.floor(duration / 60);
                                if (parseInt((new Date().valueOf() + "").substr(0, 10)) + duration > parseInt(order.appointed_at)) {
                                    order.time_state = 1;
                                } else {
                                    order.time_state = 0;
                                }
                            }
                        } else if (order.trip_state == 3) {
                            if (order.type == 1) {
                                if($scope.distanceUnit==1){
                                    order.distanceToDes = Math.floor(response.rows[0].elements[0].distance.value * 0.62 / 1000);
                                }else {
                                    order.distanceToDes = Math.floor(response.rows[0].elements[0].distance.value / 1000);
                                }

                                order.timeToDes = Math.floor(response.rows[0].elements[0].duration.value / 60);
                            }
                        }
                    } else {
                        if (order.trip_state == 1) {
                            order.time_state = 0;
                            order.distanceToClient = '';
                            order.timeToClient = '';
                        } else if (order.trip_state == 3) {
                            if (order.type == 1) {
                                order.distanceToDes = '';
                                order.timeToDes = '';
                            }
                        }
                    }

                    var tempResult;
                    if (!$scope.showSearchResult) {
                        tempResult = lastOriginalOrderList;
                    } else {
                        tempResult = getSearchOrderResult(lastOriginalOrderList, $scope.input.searchText);
                    }

                    var selectTimeStateOrderList = [];
                    if ($scope.selectedTimeState == 0) {
                        //all
                        selectTimeStateOrderList = tempResult;
                    } else if ($scope.selectedTimeState == 1) {
                        //on time
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 0) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 2) {
                        //action required
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 1) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 3) {
                        //late
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 2) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    } else if ($scope.selectedTimeState == 4) {
                        //idle
                        angular.forEach(tempResult, function (order) {
                            if (order.time_state == 3) {
                                selectTimeStateOrderList.push(order);
                            }
                        });
                    }

                    initVehiclePop(selectTimeStateOrderList);
                    $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);

                    $scope.$apply();
                }, 0);
            });
        };

        $scope.onSearchButtonClick = function () {
            $timeout(function () {
                $scope.isDisplayOneVehicleOnTrip = false;
                var tempResult;
                if (!$scope.input.searchText || $scope.input.searchText.length == 0) {
                    tempResult = lastOriginalOrderList;
                    $scope.showSearchResult = false;
                } else {
                    tempResult = getSearchOrderResult(lastOriginalOrderList, $scope.input.searchText);
                    $scope.showSearchResult = true;
                }

                var selectTimeStateOrderList = [];
                if ($scope.selectedTimeState == 0) {
                    //all
                    selectTimeStateOrderList = tempResult;
                } else if ($scope.selectedTimeState == 1) {
                    //on time
                    angular.forEach(tempResult, function (order) {
                        if (order.time_state == 0) {
                            selectTimeStateOrderList.push(order);
                        }
                    });
                } else if ($scope.selectedTimeState == 2) {
                    //action required
                    angular.forEach(tempResult, function (order) {
                        if (order.time_state == 1) {
                            selectTimeStateOrderList.push(order);
                        }
                    });
                } else if ($scope.selectedTimeState == 3) {
                    //late
                    angular.forEach(tempResult, function (order) {
                        if (order.time_state == 2) {
                            selectTimeStateOrderList.push(order);
                        }
                    });
                } else if ($scope.selectedTimeState == 4) {
                    //idle
                    angular.forEach(tempResult, function (order) {
                        if (order.time_state == 3) {
                            selectTimeStateOrderList.push(order);
                        }
                    });
                }

                initVehiclePop(selectTimeStateOrderList);
                $scope.todayBookingGroup = integrationTodayOrdersByHourly(selectTimeStateOrderList);
                $scope.$apply();
            }, 10);
        };

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
            $scope.onSearchButtonClick();
        };

        var getSearchOrderResult = function (originalOrders, searchText) {
            var tempSearch = [];
            angular.forEach(originalOrders, function (order) {
                if (order.c_email.toString().indexOf(searchText.toString()) > -1
                    || order.customer_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || order.customer_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || order.driver_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || order.driver_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || order.car_data.brand.toString().indexOf(searchText.toString()) > -1
                    || order.car_data.license_plate.toString().indexOf(searchText.toString()) > -1
                    || order.car_data.model.toString().indexOf(searchText.toString()) > -1) {
                    tempSearch.push(order);
                }
            });
            return tempSearch;
        };
    });

angular.module('KARL.Controllers')
    .controller('invoiceDetailCtrl', function ($uibModal,TransactionBS, $log, $scope, $state, MessageBox, OptionBS, $stateParams, $timeout,$rootScope) {
        $scope.listDataDetail = $stateParams.data;
        $scope.customerDetail = $stateParams.data.customer_data;
        $scope.driverDetail = $stateParams.data.driver_data;
        $scope.showEditButton = $stateParams.showEmailButton;
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.csvPage=1;
        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };

        $scope.sendEmail = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/finance-send-email.html',
                controller: 'financeSendEmail',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            customerData: $scope.customerDetail,
                            bookingId:$scope.listDataDetail.booking_id
                        },
                        event: {
                            cancel: function (close) {
                                if(close){
                                    modalInstance.dismiss();
                                    $stateParams.event.cancel();
                                    $stateParams.event.archive()
                                }else {
                                    modalInstance.dismiss();
                                }

                            }
                        }
                    }

                }
            });
        };


        $scope.showInvoiceHtml = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/book-invoice-detail.html',
                controller: 'BookInvoiceDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            bookingId:$scope.listDataDetail.booking_id
                        },
                        event: {
                            cancel: function (close) {
                                if(close){
                                    modalInstance.dismiss();
                                    $stateParams.event.cancel();
                                    $stateParams.event.archive()
                                }else {
                                    modalInstance.dismiss();
                                }

                            }
                        }
                    }

                }
            });
        }

    });
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
                

                //Added by Pham 3/24/2018
                console.log( '-----------' , result );
  
                var data = {
                    app_id: 'e5bs52ge',
                    name : $rootScope.loginUser.first_name + "" + $rootScope.loginUser.last_name ,
                    email: $rootScope.loginUser.email,
                    user_hash : result.data.user_hash,
                    created_at : result.data.create_date,
                    "Vehicles" : result.data.no_of_cars,
                    "Rates" : result.data.no_of_rates,
                    "Active Cars" : result.data.no_of_active_case_in_30,
                    "Rides Last 30 Days" : result.data.no_of_rides_in_30,
                    "Drivers" : result.data.no_of_drivers,
                    "Total Rides" : result.data.no_of_rides,
                    "Logo" : result.data.company_logo ? true : false,
                };

                console.log( '----------' , data );

                window.Intercom( 'boot' , data );

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

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('MailChimpCtrl', function ($log, $scope, $state, $stateParams, CompanyBS, MessageBox, T) {
        console.log($stateParams.data());
        $scope.groupSetting = false;
        $scope.mailChimp = angular.copy($stateParams.data());
        $scope.newMailChimp = angular.copy($stateParams.data());
        $scope.mailType = 1;
        $scope.mailisDelete = false;
        $scope.mailState=$scope.mailChimp.state;
        $scope.unitconversion = window.localStorage.lang;
        $scope.vipTypeValue={
            vipCost:'',
            vipRides:''
        };

        $scope.langStyle=localStorage.getItem('lang');
       var synchronizationState=function () {
           $scope.groupSetting = true;
           $scope.mailChimpGroupList=$scope.mailChimp.groups;
           $scope.sortType = $scope.mailChimp.sort;
           $scope.mailChimpList=$scope.mailChimp.groups;
           console.log($scope.mailChimpList)
           for(var i=0;i<$scope.mailChimpList.length;i++){
               $scope.mailChimpList[i].id=$scope.mailChimpList[i].outer_id
           }
           if($scope.mailChimpGroupList.length>2){
               if($scope.mailChimpGroupList[2].type==2){
                   $scope.vipTypeValue={
                       vipCost:$scope.mailChimpGroupList[2].section_start,
                       vipRides:''
                   }
               }else if($scope.mailChimpGroupList[2].type==1){
                   $scope.vipTypeValue={
                       vipCost:'',
                       vipRides:$scope.mailChimpGroupList[2].section_start
                   }
               }
               $scope.isAddGroup=1
           }else {
               $scope.isAddGroup=0
           }
       };

        var initGroupData = function () {
            $scope.isAddGroup = 0;
            $scope.mailChimpGroupList = [
                {
                    outer_id: '',
                    section_start: 0,
                    section_end: 99999999,
                    type:1,
                    priority:''
                }
            ];
            $scope.sortType = 1;
            $scope.vipTypeValue={
                vipCost:'',
                vipRides:''
            };
        };
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                if ($scope.mailisDelete) {
                    $stateParams.event.cancel('');
                } else {
                    $stateParams.event.cancel($scope.newMailChimp);
                }
            }
        };

        $scope.tipsMsg = "";
        $scope.mailChimpList = undefined;
        var checkButtonText = function () {
            if ($scope.mailChimp) {
                if ($scope.mailChimp.outer_key.match(/^[0-9a-zA-z]{32}\-us[0-9]{1,2}$/g)) {
                    getChimpList($scope.mailChimp.outer_key);
                }
            }
        };

        $scope.$watch("mailChimp.outer_key", function (newValue, oldValue) {
            // if($scope.mailState==1){
            //     synchronizationState()
            // }else {
                $scope.groupSetting = false;
                checkButtonText();
            // }
        });


        $scope.updateMailChimp = function (type) {
            $scope.mailChimpGroupList.forEach(function (item) {
                for (var i = 0; i < $scope.mailChimpList.length; i++) {
                    if (item.outer_id == $scope.mailChimpList[i].id) {
                        item.name = $scope.mailChimpList[i].name
                    }
                }
            });
            if($scope.mailChimpGroupList.length==3){
                if($scope.mailChimpGroupList[2].type==2){
                    $scope.mailChimpGroupList[2].section_start=$scope.vipTypeValue.vipCost;
                }else if($scope.mailChimpGroupList[2].type==1){
                    $scope.mailChimpGroupList[2].section_start=$scope.vipTypeValue.vipRides;
                }
            }
            for (var i = 0; i < $scope.mailChimpGroupList.length; i++) {
                if (!$scope.mailChimpGroupList[i].name) {
                    MessageBox.toast(T.T('mail_chimp_pop.jsSelect_group_name'), "error");
                    return;
                }

                if (!$scope.mailChimpGroupList[i].type) {
                    MessageBox.toast(T.T('mail_chimp_pop.jsMust_choose_condition'), "error");
                    return;
                }
                if ($scope.mailChimpGroupList[i].section_start==='') {
                    MessageBox.toast(T.T('mail_chimp_pop.jsMust_input_value'), "error");
                    return;
                }
                // if ($scope.mailChimpGroupList[0].section_end <= 0) {
                //     MessageBox.toast(T.T('mail_chimp_pop.jsValid_number_not_than_zero'), "error");
                //     return;
                // }

                if ($scope.mailChimpGroupList[i].section_end > 99999999 || $scope.mailChimpGroupList[i].section_start > 99999999) {
                    MessageBox.toast(T.T('mail_chimp_pop.jsNot_greater'), "error");
                    return;
                }

                // if (i < $scope.mailChimpGroupList.length - 1 && ($scope.mailChimpGroupList[i].section_end != $scope.mailChimpGroupList[i + 1].section_start)) {
                //     MessageBox.toast(T.T('mail_chimp_pop.jsSame_number'), "error");
                //     return;
                // }

                // if (parseInt($scope.mailChimpGroupList[i].section_start) != $scope.mailChimpGroupList[i].section_start) {
                //     MessageBox.toast(T.T('mail_chimp_pop.jsPositive_integer'), "error");
                //     return;
                // }

                // if (parseInt($scope.mailChimpGroupList[i].section_end) != $scope.mailChimpGroupList[i].section_end) {
                //     MessageBox.toast(T.T('mail_chimp_pop.jsPositive_integer'), "error");
                //     return;
                // }
            }
            if ($scope.mailChimp.outer_key === "") {
                setTimeout(function () {
                    MessageBox.confirm(T.T('alertTitle.warning'), T.T('mail_chimp_pop.jsNot_input_MailChimp'),
                        function (isConfirm) {
                            if (isConfirm) {
                                updateKey(type);
                            }
                        });
                }, 200);
            } else {
                updateKey(type);
            }
        };

        var updateKey = function (type) {
            var param = angular.toJson($scope.mailChimpGroupList);
            if(type==1){
                MessageBox.showLoading();
                CompanyBS.setGroupSetting($scope.mailType, $scope.sortType, $scope.mailChimp.outer_key, param).then(function (result) {
                        MessageBox.hideLoading();
                        MessageBox.toast(T.T('mail_chimp_pop.jsUpdate_Mail_Chimp_Success'),'success');

                        $stateParams.event.success(result.data.result);
                    },
                    function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                            MessageBox.toast(T.T('mail_chimp_pop.jsUpload_setting_fault'));
                        } else {
                            if(error.response.data.code == "3300"){
                                MessageBox.toast(T.T('mail_chimp_pop.jsState_change_reload'),'error')
                            }else if (error.response.data.code == "8900") {
                                MessageBox.toast(T.T('mail_chimp_pop.jsGet_list_error'));
                            } else {
                                MessageBox.toast(T.T('mail_chimp_pop.jsUpload_setting_fault'));
                            }
                        }
                    });
            }else {
                            MessageBox.showLoading();
                            CompanyBS.modifyGroupSetting($scope.mailType, $scope.sortType, $scope.mailChimp.outer_key, param).then(function (result) {
                                console.log(result);
                                MessageBox.hideLoading();
                                MessageBox.toast(T.T('mail_chimp_pop.jsUpdate_Mail_Chimp_Success'),'success');
                                $stateParams.event.success(result.data.result);
                            }, function (error) {
                                MessageBox.hideLoading();
                                MessageBox.toast( T.T('mail_chimp_pop.jsModify_error'), "error");
                            });
            }
        };

        var getChimpList = function (key) {
            if (key.match(/^[0-9a-zA-z]{32}\-us[0-9]{1,2}$/g)) {
                $scope.tipsMsg = T.T('mail_chimp_pop.jsChecking');
                MessageBox.showLoading();
                CompanyBS.checkOutGroupList(key).then(
                    function (result) {
                        var code = result.data.code;
                        if (code == 2000) {
                            $scope.mailChimpList = result.data.result;
                            CompanyBS.getMailChimpSetting().then(function (results) {
                                MessageBox.hideLoading();
                                $scope.groupSetting = true;
                                $scope.newMailChimp=results.data.result;
                                $scope.mailChimpGroupList = results.data.result.groups;
                                if($scope.mailChimpGroupList&&$scope.mailChimpGroupList.length>0){
                                    for(var i=0;i<$scope.mailChimpGroupList.length;i++){
                                        delete $scope.mailChimpGroupList[i].company_id;
                                        delete $scope.mailChimpGroupList[i].count;
                                        delete $scope.mailChimpGroupList[i].id
                                    }
                                }
                                $scope.sortType = $scope.mailChimp.sort;
                                $scope.mailState=results.data.result.state;
                                if (!$scope.mailChimpGroupList) {
                                    initGroupData();
                                } else {
                                    if($scope.mailChimpGroupList.length>2){
                                        if($scope.mailChimpGroupList[2].type==2){
                                            $scope.vipTypeValue={
                                                vipCost:$scope.mailChimpGroupList[2].section_start,
                                                vipRides:''
                                            }
                                        }else if($scope.mailChimpGroupList[2].type==1){
                                            $scope.vipTypeValue={
                                                vipCost:'',
                                                vipRides:$scope.mailChimpGroupList[2].section_start
                                            }
                                        }
                                        $scope.isAddGroup=1
                                    }else {
                                        $scope.isAddGroup=0
                                    }
                                }
                                $scope.tipsMsg = "";
                            },function (error) {
                                $scope.tipsMsg = T.T("Profile.jsLoading_error");
                            })

                        } else {
                            $scope.tipsMsg = T.T('mail_chimp_pop.jsNo_Lists');
                        }
                    }, function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                            MessageBox.toast(T.T('mail_chimp_pop.jsUpload_setting_fault'));
                        } else {
                            if (error.response.data.code == "8901") {
                                $scope.tipsMsg = T.T('mail_chimp_pop.jsError_Api_Key');
                            }
                        }
                    }
                );
            }
        };

        $scope.addGroupClick = function () {
            $scope.isAddGroup++;
            if ($scope.isAddGroup<2) {
                $scope.mailChimpGroupList.push(
                    {
                        outer_id: '',
                        section_start: 0,
                        section_end: 99999999,
                        type:1,
                        priority:''
                    },
                    {
                        outer_id: '',
                        section_start: 0,
                        section_end: 99999999,
                        type:'',
                        priority:''
                    }
                );
            }
        };

        $scope.clickGropeWay = function (type) {
            if ($scope.mailState == 0) {
                return
            } else {
                    $scope.mailChimpGroupList[2].type=type;
            }
        };

        $scope.$watch('mailChimpGroupList', function (newValue, oldValue) {
            if(newValue){
                $scope.mailChimpGroupList = newValue;
                if($scope.mailChimpGroupList.length>1){
                    $scope.mailChimpGroupList[0].section_end=1;
                    for (var i = 0; i < $scope.mailChimpGroupList.length-1; i++) {
                        $scope.mailChimpGroupList[1].section_start=$scope.mailChimpGroupList[0].section_end
                    }
                }
                for (var k = 0; k < $scope.mailChimpGroupList.length; k++) {
                    $scope.mailChimpGroupList[k].priority=k+1
                }
            }
        }, true);



        $scope.removeGroup = function (index) {
            if($scope.isAddGroup>0){
                $scope.mailChimpGroupList.splice($scope.mailChimpGroupList.length-2, 2);
                $scope.isAddGroup=0;
                if($scope.mailChimpGroupList.length==1){
                    $scope.mailChimpGroupList[0].section_end=99999999
                }
            }
        };

        $scope.reset = function () {
            initGroupData();
        };

        $scope.reloadGroup = function () {
            $scope.groupSetting = false;
            if($scope.mailChimp){
                getChimpList($scope.mailChimp.outer_key);
            }
        };

        // $scope.deleteMailChimp = function () {
        //     var param = angular.toJson($scope.mailChimpGroupList);
        //     console.log(param);
        //     console.log($scope.mailType);
        //     console.log($scope.sortType);
        //     console.log($scope.mailChimp.outer_key);
        //     MessageBox.confirm(T.T('alertTitle.warning'), T.T('mail_chimp_pop.jsSure_delete'),
        //         function (isConfirm) {
        //             if (isConfirm) {
        //                 MessageBox.showLoading();
        //                 CompanyBS.deleteGroupSetting($scope.mailType, $scope.sortType, $scope.mailChimp.outer_key, param).then(function (result) {
        //                     MessageBox.hideLoading();
        //                     // $scope.reset();
        //                     // $scope.mailChimp.outer_key = '';
        //                     // $scope.mailState = 0;
        //                     // $scope.mailisDelete = true;
        //                     MessageBox.toast(T.T('mail_chimp_pop.jsUpdate_Mail_Chimp_Success'),'success');
        //                     $stateParams.event.success(result.data.result);
        //                 }, function (error) {
        //                     MessageBox.hideLoading();
        //                     MessageBox.toast( T.T('mail_chimp_pop.jsDelete_error'), "error");
        //                 })
        //             }
        //         });
        // }
    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 */
angular.module('KARL.Controllers')
    .controller('MgrMCCtrl', function ($log, $scope, $state, MessageBox, CustomerBS, T,$stateParams, $timeout) {

        $timeout(function () {
            angular.element('#optionForm').validator();
        }, 0);

        var email = $stateParams.data.email;
        $scope.companyMCList = [];
        var getMCList = function () {
            CustomerBS.getCustomerMCList(email).then(
                function (result) {
                    $scope.companyMCList = result.data.result;
                }, function (error) {
                    if (error.treated) {
                    } else {
                        if(error.response.data.code == "8902"){
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel();
                            }
                            MessageBox.toast(T.T("mgrCustomerToMc.notSetApi"));
                        }else{
                            MessageBox.toast(T.T("mgrCustomerToMc.getMcListFault"));
                        }
                    }
                }
            )
        };
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.changeMCList = function (item) {
            var checked = item.checked === 1 ? 0 : 1;
            CustomerBS.changeCustomerMCList({
                email:email,
                list_id: item.id,
                change: checked
            }).then(function (result) {
                item.checked = checked;
            }, function (error) {
                if (checked === 1) {
                    MessageBox.toast(T.T("mgrCustomerToMc.addMcListFault"));
                } else {
                    MessageBox.toast(T.T("mgrCustomerToMc.rmMcListFault"));
                }
            });
        };
        getMCList();
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 */
angular.module('KARL.Controllers')
    .controller('OptionAddCtrl', function ($log, $scope, $state, MessageBox, OptionBS, $stateParams, $timeout,T) {

        $timeout(function () {
            angular.element('#optionForm').validator();
        }, 0);
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();
        $scope.onCreateOption = function (valid, $event) {
            if (!valid) {
                return;
            }
            var param = $scope.numberData;

            MessageBox.showLoading();
            OptionBS.addCurrentOption("[" + JSON.stringify(param) + "]").then(function (result) {
                MessageBox.hideLoading();
                $stateParams.event.addSuccess();
            }, function (result) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("option_add.jsAdd_fail"), "error");
                }
            });
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.optionForm.$dirty) {
                MessageBox.confirm(T.T("alertTitle.warning"),T.T("option_add.jsExit_warning"), function (isConfirm) {
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

        $scope.init = function () {
            $scope.option = {type: 2};
            //init 选项卡
            $scope.checkBoxType = function () {
                $scope.option.type = 1;
            };
            $scope.numberType = function () {
                $scope.option.type = 2;
            };
            $scope.radioGroupType = function () {
                $scope.option.type = 3;
            };
            $scope.checkBoxGroupType = function () {
                $scope.option.type = 4;
            };
            $scope.numberGroupType = function () {
                $scope.option.type = 5;
            };
            $scope.numberType();
            //初始化checkBox 数据 以及事件
            $scope.checkBoxData = {
                "title": "",
                "type": "CHECKBOX",
                "desc": "",
                "add_max": 0,
                "price": 0
            };

            //初始化number 数据 以及事件
            $scope.numberData = {
                "title": "",
                "type": "NUMBER",
                "desc": "",
                "add_max": 1,
                "price": 0
            };

            //初始化RadioGroup 数据 以及事件
            $scope.radioGroupData = {
                "title": "",
                "type": "GROUP",
                "desc": "",
                "add_max": 0,
                "price": 0,
                "group": [{
                    "title": "",
                    "type": "RADIO",
                    "desc": "",
                    "add_max": 0,
                    "price": 0
                }]
            };

            //初始化CheckGroup 数据 以及事件
            $scope.checkBoxGroupData = {
                "title": "",
                "type": "GROUP",
                "desc": "",
                "add_max": 0,
                "price": 0,
                "group": [{
                    "title": "",
                    "type": "CHECKBOX",
                    "desc": "",
                    "add_max": 0,
                    "price": 0
                }]
            };

            //初始化NumberGroup 数据 以及事件
            $scope.numberGroupData = {
                "title": "",
                "type": "GROUP",
                "desc": "",
                "add_max": 0,
                "price": 0,
                "group": [{
                    "title": "",
                    "type": "NUMBER",
                    "desc": "",
                    "add_max": 0,
                    "price": 0
                }]
            };
        };
        $scope.init();
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 */
angular.module('KARL.Controllers')
    .controller('OptionEditCtrl', function ($log, $scope, $state, MessageBox, OptionBS, $stateParams, $timeout,T) {

        $timeout(function () {
            angular.element('#optionForm').validator();
        }, 0);

        $scope.optionData = $stateParams.data().option;
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();

        $scope.onCreateOption = function (valid, $event) {
            if (!valid) {
                return;
            }
            var param;
            if ($scope.option.type == 1) {
                param = $scope.checkBoxData;
            } else if ($scope.option.type == 2) {
                param = $scope.numberData;
            } else if ($scope.option.type == 3) {
                param = $scope.radioGroupData;
            } else if ($scope.option.type == 4) {
                param = $scope.checkBoxGroupData;
            } else if ($scope.option.type == 5) {
                param = $scope.numberGroupData;
            }
            MessageBox.showLoading();
            OptionBS.updateFromCurrentOption(param.id, JSON.stringify(param)).then(function (result) {
                MessageBox.hideLoading();
                $stateParams.event.addSuccess();
            }, function (result) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("option_edit.jsUpdate_fail"), "error");
                }
            });
        };

        $scope.onCancelButtonClick = function () {
            console.log($scope.optionForm);
            if ($scope.optionForm.$dirty) {
                MessageBox.confirm(T.T("alertTitle.warning"),T.T("option_add.jsExit_warning"), function (isConfirm) {
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
        $scope.init = function () {
            $scope.option = {type: 1};
            //init 选项卡
            $scope.checkBoxType = function () {
                $scope.option.type = 1;
            };
            $scope.numberType = function () {
                $scope.option.type = 2;
            };
            $scope.radioGroupType = function () {
                $scope.option.type = 3;
            };
            $scope.checkBoxGroupType = function () {
                $scope.option.type = 4;
            };
            $scope.numberGroupType = function () {
                $scope.option.type = 5;
            };

            //初始化checkBox 数据 以及事件
            $scope.checkBoxData = {
                "title": "",
                "type": "CHECKBOX",
                "desc": "",
                "add_max": 0,
                "price": 0
            };
            //初始化number 数据 以及事件
            $scope.numberData = {
                "title": "",
                "type": "NUMBER",
                "desc": "",
                "add_max": 0,
                "price": 0
            };

            //初始化RadioGroup 数据 以及事件
            $scope.radioGroupData = {
                "title": "",
                "type": "GROUP",
                "desc": "",
                "add_max": 0,
                "price": 0,
                "group": [{
                    "title": "",
                    "type": "RADIO",
                    "desc": "",
                    "add_max": 0,
                    "price": 0
                }]
            };

            //初始化CheckGroup 数据 以及事件
            $scope.checkBoxGroupData = {
                "title": "",
                "type": "GROUP",
                "desc": "",
                "add_max": "",
                "price": 0,
                "group": [{
                    "title": "",
                    "type": "CHECKBOX",
                    "desc": "",
                    "add_max": 0,
                    "price": 0
                }]
            };

            //初始化NumberGroup 数据 以及事件
            $scope.numberGroupData = {
                "title": "",
                "type": "GROUP",
                "desc": "",
                "add_max": 0,
                "price": 0,
                "group": [{
                    "title": "",
                    "type": "NUMBER",
                    "desc": "",
                    "add_max": 0,
                    "price": 0
                }]
            };

            $timeout(function () {
                if ($stateParams.data().option.loc_type_id == 0) {
                    $scope.checkBoxType();
                    $scope.checkBoxData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == 1) {
                    $scope.numberType();
                    $scope.numberData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == 2) {
                    $scope.checkBoxGroupType();
                    $scope.checkBoxGroupData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == 3) {
                    $scope.numberGroupType();
                    $scope.numberGroupData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == 4) {
                    $scope.radioGroupType();
                    $scope.radioGroupData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == -1) {
                    $scope.numberGroupType();
                    $scope.numberGroupData = $stateParams.data().option;
                }
            }, 50);


        };
        $scope.init();
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('OptionCtrl', function ($log, $scope, $state, $uibModal, MessageBox, OptionBS, $rootScope, $timeout,T) {
        if(!$rootScope.loginUser){
            return;
        }

        console.log(window.localStorage.companyCurrency);
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();
        $scope.showOptionsView = false;
        $scope.showNoOptionsView = false;

        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/option-add.html',
                controller: 'OptionAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }

                }
            });
        };

        $scope.onEditButtonClick = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/option-edit.html',
                controller: 'OptionEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: function () {
                            for (var i = 0; i < $scope.listData.length; i++) {
                                if ($scope.listData[i].id == id) {
                                    return {
                                        option: jQuery.extend(true, {}, $scope.listData[i])
                                    };
                                }
                            }
                        },
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                                loadData(true);
                            }
                        }
                    }

                }
            });
        };

        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            OptionBS.deleteFromCurrentOption(id).then(function (result) {
                MessageBox.hideLoading();
                loadData();
            }, function (result) {
                MessageBox.hideLoading();
                if (error.treated)
                {
                }
                else
                {
                    MessageBox.toast(T.T("comment.jsDelete_fail"),"error");
                }
            });
        };

        $scope.onPageChange = function () {
            loadData();
        };

        // Function
        var initOptionType = function (items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].type == "CHECKBOX") {
                    items[i].loc_type = "Checkbox";
                    items[i].loc_type_id = 0;
                } else if (items[i].type == "NUMBER") {
                    items[i].loc_type = "Number";
                    items[i].loc_type_id = 1;
                } else if (items[i].group.length > 0 && items[i].type == "GROUP") {
                    if (items[i].group[0].type == "CHECKBOX") {
                        items[i].loc_type = "Checkbox Group";
                        items[i].loc_type_id = 2;
                    } else if (items[i].group[0].type == "NUMBER") {
                        items[i].loc_type = "Number Group";
                        items[i].loc_type_id = 3;
                    } else if (items[i].group[0].type == "RADIO") {
                        items[i].loc_type = "Radio Group";
                        items[i].loc_type_id = 4;
                    } else {
                        items[i].loc_type = "Others";
                        items[i].loc_type_id = -1;
                    }
                } else {
                    items[i].loc_type = "Others";
                    items[i].loc_type_id = -1;
                }
            }
            return items;
        };

        var loadData = function (isShow) {
            if (!isShow){
                MessageBox.showLoading();
            }
            OptionBS.getCurrentOptionAll().then(function (result) {
                MessageBox.hideLoading();
                
                if(result.data.length > 0){
                    $scope.showOptionsView = true;
                    $scope.showNoOptionsView = false;

                    $scope.listData = initOptionType(result.data);
                    $timeout(function () {
                        $( function() {
                            $(".card-more").click(function(){
                                $(this).next().fadeToggle();
                                $(this).fadeToggle(
                                    $(this).children("i").toggleClass("fa-ellipsis-v")
                                );
                            });
                            $(".gen").click(function(){
                                $(this).parent().find(".gen-panel").fadeIn(200);
                            });
                            $(".gen-cancel").click(function(){
                                $(this).parents(".gen-panel").fadeOut(200);
                            });
                        });
                    },0);
                }else {
                    $scope.showOptionsView = false;
                    $scope.showNoOptionsView = true;
                }
            }, function (error)
            {
                MessageBox.hideLoading();
                if (error.treated)
                {
                }
                else
                {
                    MessageBox.toast(T.T("option.jsGet_option_fail"),"error");
                }
            });
        };

        // Init
        loadData();
    });

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

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 * @event cancel
 */
angular.module('KARL.Controllers')
    .controller('RateAddCtrl', function ($scope, $rootScope,$state, $stateParams, $http, $uibModal, $timeout, MessageBox, DriverBS, CarBS, OptionBS, OfferBS, MapTool, T) {

        $timeout(function () {
            angular.element('#rateForm').validator();
        }, 0);

        var nWatchedModelChangeCount = 0;
        $scope.$watchCollection("selectedCars", function (newVal, oldVal) {
            nWatchedModelChangeCount++;
        });
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.distanceUnit=localStorage.getItem('distanceunit');
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();
        $scope.RateType = angular.copy(RateType);

        $scope.type = RateType.LONG;
        $scope.selectedCars = [];
        $scope.options = [];
        $scope.tva = 0;
        $scope.costMin = 0;
        $scope.price = 0;
        $scope.showRate = true;
        $scope.setPickupRadius = true;
        $scope.setDropoffRadius = true;
        $scope.description = {txt: ""};
        $scope.dPort = {
            is_port: false,
            value: 0.00
        };
        $scope.aPort = {
            is_port: false,
            value: 0.00
        };

        $scope.time = {
            minTime: 1,
            maxTime: 8
        };

        $scope.priceZones = [
            {
                zoneValue: '',
                priceValue: ''
            }
        ];

        $scope.pickupSlider = {
            value: 5,
            options: {
                floor: 1,
                ceil: 1000,
                translate: function (value) {
                    return value + ' Miles';
                }
            }
        };

        $scope.dropoffSlider = {
            value: 5,
            options: {
                floor: 1,
                ceil: 1000,
                translate: function (value) {
                    return value + ' Miles';
                }
            }
        };

        $scope.distanceMinSlider = {
            value: 1
        };

        $scope.distanceMaxSlider = {
            value: 99999999
        };

        if(localStorage.getItem('lang')==='fr'){
            $scope.timeClock = angular.copy(frTimeClock);
        }else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.routine = angular.copy(RoutineDefault);
        $scope.hasRoutine = true;


        //todo
        // var lang='en';
        var lang;
        var initialize = function () {
            if (window.localStorage.lang) {
                lang = window.localStorage.lang;
            } else {
                lang = navigator.language.toLocaleLowerCase();
            }
            console.log(lang);
            if (lang == 'zh') {
                $scope.unitconversion= 0
            }else if(lang == 'eur'||lang=='fr'){
                $scope.unitconversion= 1
            }else {
                $scope.unitconversion=2
            }
            console.log($scope.unitconversion)
        };

        // Event
        $scope.onCancelButtonClick = function () {
            if ($scope.rateForm.$dirty || nWatchedModelChangeCount > 2) {
                MessageBox.confirm(T.T("alertTitle.warning"),T.T("driver_add.jsExit_warning"), function (isConfirm) {
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

        $scope.onTypeChanged = function (type) {
            if (type == RateType.LONG) {
                //Long Haul Distance
            } else if (type == RateType.TRAN) {
                //Transfers
            } else {
                //Hourly
                $scope.time = {
                    minTime: 1,
                    maxTime: 8
                }
            }
            $scope.type = type;
        };

        $scope.onSetPickupRadius = function () {
            $scope.setPickupRadius = !$scope.setPickupRadius;
        };

        $scope.onSetDropoffRadius = function () {
            $scope.setDropoffRadius = !$scope.setDropoffRadius;
        };

        $scope.selectLocationOnMap = function (type) {
            var locationData = 0;
            if (type == 1) {
                if ($scope.pickupLocation && $scope.pickupLocation.geometry) {
                    console.log($scope.pickupLocation);
                    locationData = angular.copy($scope.pickupLocation);
                    locationData.geometry.location = {
                        lat: locationData.latlng.lat,
                        lng: locationData.latlng.lng
                    };
                }
            } else {
                if ($scope.dropoffLocation && $scope.dropoffLocation.geometry) {
                    locationData = angular.copy($scope.dropoffLocation);
                    locationData.geometry.location = {
                        lat: locationData.latlng.lat,
                        lng: locationData.latlng.lng
                    };
                }
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
                                if (type == 1) {
                                    $scope.pickupLocation = data;
                                } else if (type == 2) {
                                    $scope.dropoffLocation = data;
                                }
                            }
                            modalInstance.dismiss();
                        }
                    }
                }
            });
        };

        $scope.getLocation = function (val) {
            return MapTool.getSearchLocations(val);
        };

        $scope.onSearchSelect = function (loc, type) {
            if (type == 1) {
                $scope.pickupLocation = jQuery.extend(true, {}, loc);
                if (!$scope.pickupLocation.formatted_address) {
                    $scope.pickupLocation.formatted_address = loc.vicinity + ' ' + loc.name;
                    MapTool.geocoderAddress(loc.geometry.location.lat(), loc.geometry.location.lng(), function (result) {
                        $timeout(function () {
                            $scope.pickupLocation.formatted_address = result.formatted_address;
                            $scope.$apply();
                        }, 0);
                    }, function (error) {
                    });
                }
            } else {
                $scope.dropoffLocation = jQuery.extend(true, {}, loc);
                if (!$scope.dropoffLocation.formatted_address) {
                    $scope.dropoffLocation.formatted_address = loc.vicinity + ' ' + loc.name;
                    MapTool.geocoderAddress(loc.geometry.location.lat(), loc.geometry.location.lng(), function (result) {
                        $timeout(function () {
                            $scope.dropoffLocation.formatted_address = result.formatted_address;
                            $scope.$apply();
                        }, 0);
                    }, function (error) {
                    });
                }
            }
        };

        $scope.addZone = function () {
            $scope.priceZones.push({
                zoneValue: '',
                priceValue: ''
            })
        };

        $scope.removeZone = function (index) {
            $scope.priceZones.splice(index, 1);
        };

        //Create an Add-On
        $scope.onCreateAddOn = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/option-add.html',
                controller: 'OptionAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadOptions();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }

                }
            });
        };

        $scope.onRoutineWeekChange = function (tabIndex) {
            angular.forEach($scope.routine, function (item, index) {
                if (tabIndex == 0) {
                    //Weekdays
                    if (index == 0 || index == 6) {
                        item.work = false;
                    } else {
                        item.work = true;
                    }
                } else if (tabIndex == 1) {
                    //Weekends
                    if (index == 0 || index == 6) {
                        item.work = true;
                    } else {
                        item.work = false;
                    }
                } else {
                    //allweek
                    item.work = true;
                }
            });
        };

        $scope.checkDayChanged = function (index) {
            $scope.routine[index].work = !$scope.routine[index].work;
            var find = false;
            var keepGoing = true;
            angular.forEach($scope.routine, function (item) {
                if (keepGoing) {
                    if (item.work) {
                        find = true;
                        keepGoing = false;
                    }
                }
            });
            $scope.hasRoutine = find;
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

        $scope.onCategorySelect = function (category) {
            if (category.selectedCount == category.cars.length) {
                category.selectedCount = 0;
                for (var i = 0; i < category.cars.length; i++) {
                    category.cars[i].isSelect = false;
                    for (var j = 0; j < category.cars[i].drivers.length; j++) {
                        category.cars[i].drivers[j].isSelect = false;
                    }
                    for (var k = 0; k < $scope.selectedCars.length; k++) {
                        if ($scope.selectedCars[k].car_id == category.cars[i].car_id) {
                            $scope.selectedCars.splice(k, 1);
                            k--;
                        }
                    }
                }
            } else {
                category.selectedCount = category.cars.length;
                for (var i = 0; i < category.cars.length; i++) {
                    category.cars[i].isSelect = true;
                    for (var j = 0; j < category.cars[i].drivers.length; j++) {
                        category.cars[i].drivers[j].isSelect = true;
                    }
                    var find = false;
                    for (var k = 0; k < $scope.selectedCars.length; k++) {
                        if ($scope.selectedCars[k].car_id == category.cars[i].car_id) {
                            find = true;
                            break;
                        }
                    }
                    if (!find) {
                        $scope.selectedCars.push(angular.copy(category.cars[i]));
                    }
                }
            }
        };

        $scope.onCarSelect = function (category, car) {
            if (car.isSelect) {
                for (var i = 0; i < car.drivers.length; i++) {
                    car.drivers[i].isSelect = true;
                }
                var find = false;
                for (var i = 0; i < $scope.selectedCars.length; i++) {
                    if ($scope.selectedCars[i].car_id == car.car_id) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    $scope.selectedCars.push(angular.copy(car));
                    category.selectedCount++;
                }
            } else {
                for (var i = 0; i < car.drivers.length; i++) {
                    car.drivers[i].isSelect = false;
                }
                for (var i = 0; i < $scope.selectedCars.length; i++) {
                    if ($scope.selectedCars[i].car_id == car.car_id) {
                        $scope.selectedCars.splice(i, 1);
                        i--;
                        category.selectedCount--;
                    }
                }
            }
        };

        $scope.onDriverSelect = function (car, driver) {
            angular.forEach($scope.selectedCars, function (carItem) {
                if (car.car_id == carItem.car_id) {
                    angular.forEach(carItem.drivers, function (driverItem) {
                        if (driver.driver_id == driverItem.driver_id) {
                            driverItem.isSelect = driver.isSelect;
                        }
                    })
                }
            });
        };


        // Load car & drivers
        var loadCars = function () {
            initialize();
            CarBS.getCurrentUserAllAndDriver().then(function (result) {
                if (result.data.length == 0) {
                    MessageBox.alertView(T.T('alertTitle.warning'), T.T('driver_add.jsCompany_not_have_vehicles'), function (isAlertView) {
                        if (isAlertView) {
                            $stateParams.event.cancel();
                            $state.go('vehicles');
                        }
                    })
                } else {
                    var driverNumber = 0;
                    for (var i = 0; i < result.data.length; i++) {
                        for (var j = 0; j < result.data[i].cars.length; j++) {
                            driverNumber = driverNumber + result.data[i].cars[j].drivers.length
                        }
                    }
                    if (driverNumber == 0) {
                        MessageBox.alertView(T.T("alertTitle.warning"),T.T("rate_add.jsCompany_no_matching_driver"), function (isAlertView) {
                            if (isAlertView) {
                                $stateParams.event.cancel();
                                $state.go('drivers');
                            }
                        })
                    }
                }
                //默认第1个category的car、driver(除了AdvancedNotice小于rates的AdvancedNotice的driver)都被选中
                for (var k = 0; k < result.data.length; k++) {
                    if (k == 0) {
                        result.data[k].selectedCount = result.data[k].cars.length;
                        for (var i = 0; i < result.data[k].cars.length; i++) {
                            result.data[k].cars[i].isSelect = true;
                            for (var j = 0; j < result.data[k].cars[i].drivers.length; j++) {
                                result.data[k].cars[i].drivers[j].canShow = true;
                                result.data[k].cars[i].drivers[j].isSelect = true;
                            }
                        }
                    } else {
                        result.data[k].selectedCount = 0;
                        for (var i = 0; i < result.data[k].cars.length; i++) {
                            result.data[k].cars[i].isSelect = false;
                            for (var j = 0; j < result.data[k].cars[i].drivers.length; j++) {
                                result.data[k].cars[i].drivers[j].canShow = true;
                            }
                        }
                    }
                }

                $scope.categories = result.data;
                if ($scope.categories.length == 0) {
                    return
                } else {
                    $scope.selectedCars = angular.copy($scope.categories[0].cars);
                }

                $timeout(function () {
                    $(function () {
                        $("#rates-vehicle-accordion").accordion({
                            header: 'h3.rates-select',
                            active: true,
                            alwaysOpen: false,
                            animated: false,
                            collapsible: true,
                            heightStyle: "content",
                            beforeActivate: function (event, ui) {
                                $(".rates-sub-accordion").accordion({
                                    header: 'div.rates-sub',
                                    active: true,
                                    alwaysOpen: false,
                                    animated: false,
                                    collapsible: true,
                                    heightStyle: "content"
                                });
                            }
                        });
                    });
                }, 0);

            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicles.jsGet_car_failed"), "error");
                }
            });
        };

        // Load options
        var loadOptions = function () {
            OptionBS.getCurrentOptionAll().then(function (result) {
                angular.forEach(result.data, function (item) {
                    angular.forEach($scope.options, function (option) {
                        if (item.id == option.id) {
                            item.isSelect = option.isSelect;
                        }
                    });
                });
                $scope.options = result.data;
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("rate_add.jsGet_option_fail"), "error");
                }
            });
        };

        // Init data\
        loadCars();
        loadOptions();

        var checkRouteHasNoWork = function (routines) {
            var check = true;
            angular.forEach(routines, function (routine) {
                check = check && routine.match("^(1){48}");
            });
            return check;
        };
        var checkOfferCar = function (cars) {
            return cars.length == 0;
        };
        var checkOfferDriver = function (cars) {
            var check = true;
            angular.forEach(cars, function (car) {
                check = car.drivers == '' && check;
            });
            return check;
        };
        var commit = function (param, l) {
            console.log(param)
            OfferBS.addToCurrentUser(param).then(function (result) {
                console.log(param)
                MessageBox.hideLoading();
                l.stop();
                if ($stateParams.event.addSuccess) {
                    $stateParams.event.addSuccess();
                }
            }, function (error) {
                MessageBox.hideLoading();
                l.stop();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("rate_add.jsAdd_fail"), "error");
                }
            });
        };

        var commitAndCreateReturnService = function (param) {
            console.log(param)
            OfferBS.addToCurrentUser(param).then(function (result) {
                console.log(result)
                // Add return service rate
                param.name = "Return Service of " + $scope.title;
                if ($scope.description.txt) {
                    param.description = param.name + ": " + $scope.description.txt;
                } else {
                    param.description = param.name;
                }
                var tAddress = param.dAddress;
                var tLat = param.dLat;
                var tLng = param.dLng;
                var tRadius = param.dRadius;
                param.dAddress = param.aAddress;
                param.dLat = param.aLat;
                param.dLng = param.aLng;
                param.dRadius = param.aRadius;
                param.dIsPort = $scope.aPort.is_port ? 1 : 0;
                param.dPortPrice = $scope.aPort.price;
                param.aAddress = tAddress;
                param.aLat = tLat;
                param.aLng = tLng;
                param.aRadius = tRadius;
                param.aIsPort = $scope.dPort.is_port ? 1 : 0;
                param.aPortPrice = $scope.dPort.price;
                OfferBS.addToCurrentUser(param).then(function (result) {
                    MessageBox.hideLoading();
                    if ($stateParams.event.addSuccess) {
                        $stateParams.event.addSuccess();
                    }
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("rate_add.jsReturn_service_add_fail"), "error");
                    }
                    if ($stateParams.event.addSuccess) {
                        $stateParams.event.addSuccess();
                    }
                });
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("rate_add.jsAdd_fail"), "error");
                }
            });
        };

        var emptyRouteDataWarming = function (param, la, createReturn) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("rate_add.jsRate_routine_not_work"), function (isConfirm) {
                if (isConfirm) {
                    if (createReturn) {
                        commitAndCreateReturnService(param)
                    } else {
                        commit(param, la);
                    }
                } else {
                    if (la) {
                        la.stop();
                    }
                }
            });
        };
        var emptyCarDataWarming = function (param, la, createReturn) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("rate_add.jsRate_car_not_work"), function (isConfirm) {
                if (isConfirm) {
                    if (createReturn) {
                        commitAndCreateReturnService(param)
                    } else {
                        commit(param, la);
                    }
                } else {
                    if (la) {
                        la.stop();
                    }
                }
            });
        };
        var emptyDriverDataWarming = function (param, la, createReturn) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("rate_add.jsRate_driver_not_work"), function (isConfirm) {
                if (isConfirm) {
                    if (createReturn) {
                        commitAndCreateReturnService(param)
                    } else {
                        commit(param, la);
                    }
                } else {
                    if (la) {
                        la.stop();
                    }
                }
            });
        };

        $scope.onSubmitButtonClick = function (valid, $event) {
            if (!valid) {
                return;
            }

            if ($scope.type == RateType.TRAN) {
                for (var i = 0; i < $scope.priceZones.length; i++) {
                    if ($scope.priceZones[i].zoneValue.length == 0) {
                        MessageBox.toast(T.T("rate_add.jsZone_format_error"), "error");
                        return;
                    }
                    if (Number($scope.priceZones[i].zoneValue).toString() == NaN.toString()) {
                        MessageBox.toast(T.T("rate_add.jsZone_format_error"), "error");
                        return;
                    }
                    if ($scope.priceZones[i].priceValue.length == 0) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_format_error"), "error");
                        return;
                    }
                    if (Number($scope.priceZones[i].priceValue).toString() == NaN.toString()) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_format_error"), "error");
                        return;
                    }
                    if(!/^\d+(\.\d{1,2})?$/.test($scope.priceZones[i].zoneValue)){
                        MessageBox.toast(T.T("rate_edit.jsZone_error"), "error");
                        return;
                    }
                    if (i > 0 && $scope.priceZones[i].zoneValue <= $scope.priceZones[i - 1].zoneValue) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_error"), "error");
                        return;
                    }
                }
                if ($scope.priceZones[0].zoneValue <= $scope.distanceMinSlider.value) {
                    MessageBox.toast(T.T("rate_add.jsMinimum_distance_error"), "error");
                    return;
                }
            }

            var optionIds = [];
            angular.forEach($scope.options, function (option) {
                if (option.isSelect) {
                    optionIds.push(option.id);
                }
            });
            var cars = [];
            angular.forEach($scope.selectedCars, function (car) {
                var driverIds = [];
                angular.forEach(car.drivers, function (driver) {
                    if (driver.isSelect && driver.canShow) {
                        driverIds.push(driver.driver_id);
                    }
                });
                cars.push({"car_id": car.car_id, "drivers": driverIds.toString()});
            });

            var param = {};
            param.name = $scope.title;
            param.description = $scope.description.txt;
            param.type = $scope.type;
            param.dAddress = $scope.pickupLocation.formatted_address;
            param.dIsPort = $scope.dPort.is_port ? 1 : 0;
            param.dPortPrice = $scope.dPort.price;
            param.dLat = $scope.pickupLocation.geometry.location.lat();
            param.dLng = $scope.pickupLocation.geometry.location.lng();
            if ($scope.setPickupRadius) {
                param.dRadius = $scope.pickupSlider.value;
            } else {
                param.dRadius = 0.5;
            }
            
            //param.costMin = $scope.costMin;
            if (param.type != RateType.LONG) {  // 04/06/2018 chan
                param.costMin = $scope.costMin;
            }
            
            var prices = [];
            if ($scope.type == RateType.LONG || $scope.type == RateType.HOUR) {
                if ($scope.distanceMinSlider.value > $scope.distanceMaxSlider.value || $scope.time.minTime > $scope.time.maxTime) {
                    MessageBox.toast(T.T("rate_add.jsMinimum_value_greater_than_maximum_value"), "error");
                    return;
                } else {
                    prices.push({
                        invl_start: $scope.type == RateType.LONG ? $scope.distanceMinSlider.value : $scope.time.minTime * 60,
                        invl_end: $scope.type == RateType.LONG ? $scope.distanceMaxSlider.value : $scope.time.maxTime * 60,
                        price: $scope.price
                    });
                }
            } else {
                $scope.priceZones.forEach(function (priceZone, index) {
                    prices.push({
                        invl_start: index == 0 ? $scope.distanceMinSlider.value : $scope.priceZones[index - 1].zoneValue,
                        invl_end: priceZone.zoneValue,
                        price: priceZone.priceValue
                    });
                });
            } 
            param.prices = prices;
            param.tva = $scope.tva;
            if ($scope.type == RateType.LONG) {
                param.aAddress = $scope.dropoffLocation.formatted_address;
                param.aIsPort = $scope.aPort.is_port ? 1 : 0;
                param.aPortPrice = $scope.aPort.price;
                param.aLat = $scope.dropoffLocation.geometry.location.lat();
                param.aLng = $scope.dropoffLocation.geometry.location.lng();
                if ($scope.setDropoffRadius) {
                    param.aRadius = $scope.dropoffSlider.value;
                } else {
                    param.aRadius = 0.5;
                }
            }
            if ($scope.type == RateType.TRAN) {
                param.aIsPort = $scope.aPort.is_port ? 1 : 0;
                param.aPortPrice = $scope.aPort.price;
            }

            if ( $scope.type == RateType.HOUR ) {   // 04/06/2018 chan 
                if ( $scope.costMin < $scope.price ) {
                    MessageBox.toast(T.T("rate_edit.jsMinimum_price_value_greater_than_calculation_method"), "error");
                    return;
                }
            }

            param.cars = cars;
            param.options = optionIds.toString();
            param.calendar = OfferBS.routineConversionsFromLocToISO($scope.routine);
            MessageBox.showLoading();
            var l = Ladda.create($event.target);
            l.start();
            if (checkRouteHasNoWork(param.calendar)) {
                emptyRouteDataWarming(param, l, false);
                return;
            }
            if (checkOfferCar(param.cars)) {
                emptyCarDataWarming(param, l, false);
                return;
            }
            if (checkOfferDriver(param.cars)) {
                emptyDriverDataWarming(param, l, false);
                return;
            }
            commit(param, l)
        };


        $scope.onSubmitAndReturnButtonClick = function (valid, $event) {
            if (!valid) {
                return;
            }
            if ($scope.type == RateType.TRAN) {
                for (var i = 0; i < $scope.priceZones.length; i++) {
                    if ($scope.priceZones[i].zoneValue.length == 0) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_format_error"), "error");
                        return;
                    }
                    if (Number($scope.priceZones[i].zoneValue).toString() == NaN.toString()) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_format_error"), "error");
                        return;
                    }
                    if ($scope.priceZones[i].priceValue.length == 0) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_format_error"), "error");
                        return;
                    }
                    if (Number($scope.priceZones[i].priceValue).toString() == NaN.toString()) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_format_error"), "error");
                        return;
                    }
                    if (i > 0 && $scope.priceZones[i].zoneValue <= $scope.priceZones[i - 1].zoneValue) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_error"), "error");
                        return;
                    }
                }
                if ($scope.priceZones[0].zoneValue <= $scope.distanceMinSlider.value) {
                    MessageBox.toast(T.T("rate_add.jsMinimum_distance_error"), "error");
                    return;
                }
            }


            if ($scope.type == RateType.LONG || $scope.type == RateType.HOUR) {
                if ($scope.distanceMinSlider.value > $scope.distanceMaxSlider.value || $scope.time.minTime > $scope.time.maxTime) {
                    MessageBox.toast(T.T("rate_add.jsMinimum_value_greater_than_maximum_value"), "error");
                    return;
                }
            }

            MessageBox.confirm(T.T("rate_add.jsCreate_addition_rate"),'', function (isConfirm) {
                if (isConfirm) {
                    MessageBox.showLoading();
                    var optionIds = [];
                    angular.forEach($scope.options, function (option) {
                        if (option.isSelect) {
                            optionIds.push(option.id);
                        }
                    });
                    var cars = [];
                    angular.forEach($scope.selectedCars, function (car) {
                        var driverIds = [];
                        angular.forEach(car.drivers, function (driver) {
                            if (driver.isSelect && driver.canShow) {
                                driverIds.push(driver.driver_id);
                            }
                        });
                        cars.push({"car_id": car.car_id, "drivers": driverIds.toString()});
                    });
                    var param = {};
                    param.name = $scope.title;
                    param.description = $scope.description.txt;
                    param.type = RateType.LONG;
                    param.dAddress = $scope.pickupLocation.formatted_address;
                    param.dIsPort = $scope.dPort.is_port ? 1 : 0;
                    param.dPortPrice = $scope.dPort.price;
                    param.dLat = $scope.pickupLocation.geometry.location.lat();
                    param.dLng = $scope.pickupLocation.geometry.location.lng();
                    if ($scope.setPickupRadius) {
                        param.dRadius = $scope.pickupSlider.value;
                    } else {
                        param.dRadius = 0.5;
                    }
                    param.aAddress = $scope.dropoffLocation.formatted_address;
                    param.aIsPort = $scope.aPort.is_port ? 1 : 0;
                    param.aPortPrice = $scope.aPort.price;
                    param.aLat = $scope.dropoffLocation.geometry.location.lat();
                    param.aLng = $scope.dropoffLocation.geometry.location.lng();
                    if ($scope.setDropoffRadius) {
                        param.aRadius = $scope.dropoffSlider.value;
                    } else {
                        param.aRadius = 0.5;
                    }
                    param.costMin = 0;
                    if (param.type == RateType.TRAN) {
                        param.costMin = $scope.costMin;
                    }
                    param.prices = [{
                        invl_start: $scope.distanceMinSlider.value,
                        invl_end: $scope.distanceMaxSlider.value,
                        price: $scope.price
                    }];
                    param.tva = $scope.tva;
                    param.cars = cars;
                    param.options = optionIds.toString();
                    param.calendar = OfferBS.routineConversionsFromLocToISO($scope.routine);
                    MessageBox.showLoading();
                    setTimeout(function () {
                        if (checkRouteHasNoWork(param.calendar)) {
                            emptyRouteDataWarming(param, null, true);
                            return;
                        }
                        if (checkOfferCar(param.cars)) {
                            emptyCarDataWarming(param, null, true);
                            return;
                        }
                        if (checkOfferDriver(param.cars)) {
                            emptyDriverDataWarming(param, null, true);
                            return;
                        }
                        commitAndCreateReturnService(param)
                    }, 100);

                }
            });
        };

    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event editSuccess
 * @event cancel
 */
angular.module('KARL.Controllers')
    .controller('RateEditCtrl', function ($scope, $rootScope,$state, $stateParams, $http, $uibModal, $timeout, MessageBox, DriverBS, CarBS, OptionBS, OfferBS, MapTool, T) {

        $timeout(function () {
            // /************* 左右滑动tab ************* /
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
            // /************* / 左右滑动tab ************* /
        }, 0);

        $scope.RateType = angular.copy(RateType);
        $scope.country=$rootScope.loginUser.admin.location.country;
        var offerId = $stateParams.data.offerId;
        var offer;
        var nWatchedModelChangeCount = 0;
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();
        $scope.showVehicles = false;
        $scope.type = RateType.LONG;
        $scope.drivers = [];
        $scope.selectedDrivers = [];
        $scope.selectedCars = [];
        $scope.options = [];
        $scope.selectedOptions = [];
        $scope.routine = [];
        if(localStorage.getItem('lang')==='fr'){
            $scope.timeClock = angular.copy(frTimeClock);
        }else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.costMin = 0;
        $scope.price = 0;
        $scope.preTime = 30;
        $scope.description = {txt: ""};
        $scope.aPort = {
            is_port: false,
            price: 0.00
        };
        $scope.dPort = {
            is_port: false,
            price: 0.00
        };


        //todo
        // var lang='en';
        var lang;
        var initialize = function () {
            if (window.localStorage.lang) {
                lang = window.localStorage.lang;
            } else {
                lang = navigator.language.toLocaleLowerCase();
            }
            console.log(lang);
            if (lang == 'zh') {
                $scope.unitconversion= 0
            }else if(lang == 'eur'||lang=='fr'){
                $scope.unitconversion= 1
            }else {
                $scope.unitconversion=2
            }
            console.log($scope.unitconversion)
        };

        $scope.pickupSlider = {
            value: 0,
            options: {
                floor: 1,
                ceil: 1000,
                translate: function (value) {
                    return value + ' Miles';
                }
            }
        };

        $scope.dropoffSlider = {
            value: 0,
            options: {
                floor: 1,
                ceil: 1000,
                translate: function (value) {
                    return value + ' Miles';
                }
            }
        };

        $scope.distanceMinSlider = {
            value: 1
        };

        $scope.distanceMaxSlider = {
            value: 99999999
        };

        $scope.priceZones = [
            {
                zoneValue: '',
                priceValue: ''
            }
        ];

        $scope.time = {
            minTime: 1,
            maxTime: 8
        };

        // Event
        $scope.onTypeChanged = function (type) {
            console.log("type is " + type);
            $scope.type = type;

            $timeout(function () {
                angular.element('#rateForm').validator();
            }, 100);
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.rateForm.$dirty || nWatchedModelChangeCount > 0) {
                MessageBox.confirm(T.T("alertTitle.warning"),T.T("driver_add.jsExit_warning"), function (isConfirm) {
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

        $scope.changeTabs = function (tabIndex) {
            if (tabIndex == 0) {
                $scope.showVehicles = false;
            } else {
                $scope.showVehicles = true;
            }
        };

        $scope.onSetPickupRadius = function () {
            $scope.setPickupRadius = !$scope.setPickupRadius;
        };

        $scope.onSetDropoffRadius = function () {
            $scope.setDropoffRadius = !$scope.setDropoffRadius;
        };

        //Create an Add-On
        $scope.onCreateAddOn = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/option-add.html',
                controller: 'OptionAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadOptions(true);
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }

                }
            });
        };


        $scope.selectLocationOnMap = function (type) {
            var locationData = 0;
            if (type == 1) {
                if ($scope.pickupLocation) {
                    locationData = angular.copy($scope.pickupLocation);
                    locationData.geometry.location = {
                        lat: locationData.latlng.lat,
                        lng: locationData.latlng.lng
                    };
                }
            } else {
                if ($scope.dropoffLocation) {
                    locationData = angular.copy($scope.dropoffLocation);
                    locationData.geometry.location = {
                        lat: locationData.latlng.lat,
                        lng: locationData.latlng.lng
                    };
                }
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
                                if (type == 1) {
                                    $scope.pickupLocation = data;
                                } else if (type == 2) {
                                    $scope.dropoffLocation = data;
                                }
                            }
                            modalInstance.dismiss();
                        }
                    }
                }
            });
        };

        $scope.getLocation = function (val) {
            return MapTool.getSearchLocations(val);
        };

        $scope.onSearchSelect = function (loc, type) {
            if (type == 1) {
                $scope.pickupLocation = jQuery.extend(true, {}, loc);
                if (!$scope.pickupLocation.formatted_address) {
                    $scope.pickupLocation.formatted_address = loc.vicinity + ' ' + loc.name;
                    MapTool.geocoderAddress(loc.geometry.location.lat(), loc.geometry.location.lng(), function (result) {
                        $timeout(function () {
                            $scope.pickupLocation.formatted_address = result.formatted_address;
                            $scope.$apply();
                        }, 0);
                    }, function (error) {
                    });
                }
            } else {
                $scope.dropoffLocation = jQuery.extend(true, {}, loc);
                if (!$scope.dropoffLocation.formatted_address) {
                    $scope.dropoffLocation.formatted_address = loc.vicinity + ' ' + loc.name;
                    MapTool.geocoderAddress(loc.geometry.location.lat(), loc.geometry.location.lng(), function (result) {
                        $timeout(function () {
                            $scope.dropoffLocation.formatted_address = result.formatted_address;
                            $scope.$apply();
                        }, 0);
                    }, function (error) {
                    });
                }
            }
        };

        $scope.addZone = function () {
            $scope.priceZones.push({
                zoneValue: '',
                priceValue: ''
            })
        };

        $scope.removeZone = function (index) {
            $scope.priceZones.splice(index, 1);
        };

        var loadOffer = function () {
            MessageBox.showLoading();
            initialize();
            OfferBS.getDetailFromCurrentUser(offerId).then(function (result) {
                console.log(result)
                MessageBox.hideLoading();
                if (result.data.car_categories.length == 0) {
                    MessageBox.alertView(T.T('alertTitle.warning'), T.T('driver_add.jsCompany_not_have_vehicles'), function (isAlertView) {
                        if(isAlertView){
                            $stateParams.event.cancel();
                            $state.go('vehicles');
                        }
                    })
                } else {
                    var driverNumber = 0;
                    for (var i = 0; i < result.data.car_categories.length; i++) {
                        for (var j = 0; j < result.data.car_categories[i].cars.length; j++) {
                            driverNumber = driverNumber + result.data.car_categories[i].cars[j].drivers.length
                        }
                    }
                    if (driverNumber == 0) {
                        MessageBox.alertView(T.T("alertTitle.warning"),T.T("rate_add.jsCompany_no_matching_driver"), function (isAlertView) {
                           if(isAlertView){
                               $stateParams.event.cancel();
                               $state.go('drivers');
                           }
                        })
                    }
                }

                offer = result.data;
                $scope.distanceUnit=result.data.distance_unit;
                offer.delay_time = offer.delay_time / 60;
                $scope.title = offer.name;
                $scope.description.txt = offer.description;
                // pickup
                $scope.pickupLocation = {};
                $scope.pickupLocation.formatted_address = offer.d_address;
                $scope.pickupAddress = offer.d_address;
                $scope.pickupLocation.latlng={
                    lat:offer.d_lat,
                    lng:offer.d_lng
                };
                $scope.pickupLocation.geometry = {};
                $scope.pickupLocation.geometry.location = {};
                $scope.pickupLocation.geometry.location.lat = function () {
                    return offer.d_lat;
                };
                $scope.pickupLocation.geometry.location.lng = function () {
                    return offer.d_lng;
                };
                if (offer.d_radius < 1) {
                    $scope.pickupSlider.value = 1;
                    $scope.setPickupRadius = false;
                } else {
                    $scope.pickupSlider.value = offer.d_radius;
                    $scope.setPickupRadius = true;
                }
                // dropoff
                $scope.dropoffLocation = {};
                $scope.dropoffLocation.formatted_address = offer.a_address;
                $scope.dropoffLocation.latlng={
                    lat:offer.a_lat ? offer.a_lat : offer.d_lat,
                    lng:offer.a_lng ? offer.a_lng : offer.d_lng
                };
                $scope.dropoffLocation.geometry = {};
                $scope.dropoffLocation.geometry.location = {};
                $scope.dropoffLocation.geometry.location.lat = function () {
                    return offer.a_lat ? offer.a_lat : offer.d_lat;
                };
                $scope.dropoffLocation.geometry.location.lng = function () {

                    return offer.a_lng ? offer.a_lng : offer.d_lng;
                };
                if (offer.a_radius < 1) {
                    $scope.dropoffSlider.value = 1;
                    $scope.setDropoffRadius = false;
                } else {
                    $scope.dropoffSlider.value = offer.a_radius;
                    $scope.setDropoffRadius = true;
                }
                $scope.dPort.is_port = offer.d_is_port == 1;
                $scope.dPort.price = offer.d_port_price;
                $scope.aPort.is_port = offer.a_is_port == 1;
                $scope.aPort.price = offer.a_port_price;
                $scope.preTime = offer.pre_time;
                $scope.costMin = offer.cost_min;
                $scope.type = offer.type;

                if (offer.type == RateType.LONG) {
                    $scope.distanceMinSlider = {
                        value: offer.prices[0].invl_start
                    };
                    $scope.distanceMaxSlider = {
                        value: offer.prices[0].invl_end
                    };
                } else if (offer.type == RateType.TRAN) {
                    $scope.distanceMinSlider = {
                        value: offer.prices[0].invl_start
                    };
                    $scope.distanceMaxSlider = {
                        value: offer.prices[offer.prices.length - 1].invl_end
                    };
                    $scope.priceZones = [];
                    offer.prices.forEach(function (item) {
                        $scope.priceZones.push(
                            {
                                zoneValue: item.invl_end,
                                priceValue: item.price
                            }
                        )
                    });
                } else {
                    var invlEnd;
                    var invlEnds;
                    if(typeof offer.prices[0].invl_end=='string'){
                        invlEnd= offer.prices[0].invl_end.split(',');
                        for(var i=0;i<invlEnd.length-1;i++){
                            invlEnds=invlEnd[i]+invlEnd[i+1]
                        }
                        console.log(parseInt(invlEnds));
                        offer.prices[0].invl_end=parseInt(invlEnds);
                    }
                    $scope.time = {
                        minTime: offer.prices[0].invl_start / 60,
                        maxTime: offer.prices[0].invl_end / 60
                    };
                }

                $scope.price = offer.prices[0].price;
                $scope.tva = offer.tva;
                $scope.routine = routineConversionsFromISOToLoc(JSON.parse(offer.calendar.routine));
                loadCars(offer.car_categories);
                loadOptions(false);
                $timeout(function () {
                    angular.element('#rateForm').validator();
                }, 100);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("rate_edit.jsGet_detail_fail"), "error");
                }
                $timeout(function () {
                    angular.element('#rateForm').validator();
                }, 100);
            });
        };

        // Load car & drivers
        var loadCars = function (data) {
            var result = {data: ""};
            result.data = data;
            for (var k = 0; k < result.data.length; k++) {
                result.data[k].selectedCount = 0;
                for (var i = 0; i < result.data[k].cars.length; i++) {
                    for (var j = 0; j < result.data[k].cars[i].drivers.length; j++) {
                        if (result.data[k].cars[i].drivers[j].selected == 0) {
                            result.data[k].cars[i].drivers[j].isSelect = false;
                        } else {
                            result.data[k].cars[i].drivers[j].isSelect = true;
                        }
                        result.data[k].cars[i].drivers[j].canShow = true;
                    }
                    if (result.data[k].cars[i].selected == 1) {
                        result.data[k].cars[i].isSelect = true;
                        result.data[k].selectedCount++;
                        $scope.selectedCars.push(angular.copy(result.data[k].cars[i]));
                    } else {
                        result.data[k].cars[i].isSelect = false;
                    }
                }
            }
            $scope.categories = result.data;

            $timeout(function () {
                $(function () {
                    $("#rates-vehicle-accordion").accordion({
                        header: 'h3.rates-select',
                        active: true,
                        alwaysOpen: false,
                        animated: false,
                        collapsible: true,
                        heightStyle: "content",
                        beforeActivate: function (event, ui) {
                            $(".rates-sub-accordion").accordion({
                                header: 'div.rates-sub',
                                active: true,
                                alwaysOpen: false,
                                animated: false,
                                collapsible: true,
                                heightStyle: "content"
                            });
                        }
                    });
                });
            }, 0);
        };


        //转时区获得正确的routine
        var routineConversionsFromISOToLoc = function (routineArray) {
            var finalWeekRoutine = routineArray.join('');
            //获取时区
            var timeZone = (new Date().getTimezoneOffset() / 60) * (-1) * 2;
            var locRoutineDataString = "";
            if (timeZone > 0) {
                //后面拼到前面
                var tempStart = finalWeekRoutine.substring(48 * 7 - timeZone);
                var tempSpell = finalWeekRoutine.substring(0, 48 * 7 - timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else if (timeZone < 0) {
                //前面拼到后面
                var tempStart = finalWeekRoutine.substring(-timeZone);
                var tempSpell = finalWeekRoutine.substring(0, -timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else {
                locRoutineDataString = finalWeekRoutine;
            }

            //通过locRoutineDataString得到出勤情况
            var routineArray = undefined;
            for (var i = 0; i < 7; i++) {
                var routinePerDay = locRoutineDataString.substring(i * 48, (i + 1) * 48) + "";
                var day;
                var index = 0;
                while (routinePerDay.substring(index, index + 1) == '1') {
                    index++;
                }
                if (index >= 48) {
                    //全天不工作
                    day = {start: 0, end: 24, work: false};
                } else {
                    var index2 = index;
                    while (routinePerDay.substring(index2, index2 + 1) == '0') {
                        index2++;
                    }
                    //有工作
                    day = {start: index / 2, end: index2 / 2, work: true};
                    $scope.hasRoutine = true;
                }
                angular.forEach(RoutineDefault, function (item, index3) {
                    if (i == index3) {
                        day.name = item.name;
                    }
                });

                if (routineArray == undefined) {
                    routineArray = new Array(day);
                } else {
                    routineArray.push(day);

                }
            }
            return routineArray;
        };

        $scope.onRoutineWeekChange = function (tabIndex) {
            angular.forEach($scope.routine, function (item, index) {
                if (tabIndex == 0) {
                    //Weekdays
                    if (index == 0 || index == 6) {
                        item.work = false;
                    } else {
                        item.work = true;
                    }
                } else if (tabIndex == 1) {
                    //Weekends
                    if (index == 0 || index == 6) {
                        item.work = true;
                    } else {
                        item.work = false;
                    }
                } else {
                    //allweek
                    item.work = true;
                }
            });
        };

        $scope.checkDayChanged = function (index) {
            $scope.routine[index].work = !$scope.routine[index].work;
            var find = false;
            var keepGoing = true;
            angular.forEach($scope.routine, function (item) {
                if (keepGoing) {
                    if (item.work) {
                        find = true;
                        keepGoing = false;
                    }
                }
            });
            $scope.hasRoutine = find;
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

        $scope.onCategorySelect = function (category) {
            nWatchedModelChangeCount++;
            if (category.selectedCount == category.cars.length) {
                category.selectedCount = 0;
                for (var i = 0; i < category.cars.length; i++) {
                    category.cars[i].isSelect = false;
                    for (var j = 0; j < category.cars[i].drivers.length; j++) {
                        category.cars[i].drivers[j].isSelect = false;
                    }
                    for (var k = 0; k < $scope.selectedCars.length; k++) {
                        if ($scope.selectedCars[k].car_id == category.cars[i].car_id) {
                            $scope.selectedCars.splice(k, 1);
                            k--;
                        }
                    }
                }
            } else {
                category.selectedCount = category.cars.length;
                for (var i = 0; i < category.cars.length; i++) {
                    category.cars[i].isSelect = true;
                    for (var j = 0; j < category.cars[i].drivers.length; j++) {
                        category.cars[i].drivers[j].isSelect = true;
                    }
                    var find = false;
                    for (var k = 0; k < $scope.selectedCars.length; k++) {
                        if ($scope.selectedCars[k].car_id == category.cars[i].car_id) {
                            find = true;
                            break;
                        }
                    }
                    if (!find) {
                        $scope.selectedCars.push(angular.copy(category.cars[i]));
                    }
                }
            }
        };

        $scope.onCarSelect = function (category, car) {
            nWatchedModelChangeCount++;
            if (car.isSelect) {
                for (var i = 0; i < car.drivers.length; i++) {
                    car.drivers[i].isSelect = true;
                }
                var find = false;
                for (var i = 0; i < $scope.selectedCars.length; i++) {
                    if ($scope.selectedCars[i].car_id == car.car_id) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    $scope.selectedCars.push(angular.copy(car));
                    category.selectedCount++;
                }
            } else {
                for (var i = 0; i < car.drivers.length; i++) {
                    car.drivers[i].isSelect = false;
                }
                for (var i = 0; i < $scope.selectedCars.length; i++) {
                    if ($scope.selectedCars[i].car_id == car.car_id) {
                        $scope.selectedCars.splice(i, 1);
                        i--;
                        category.selectedCount--;
                    }
                }
            }
        };

        $scope.onDriverSelect = function (car, driver) {
            angular.forEach($scope.selectedCars, function (carItem) {
                if (car.car_id == carItem.car_id) {
                    angular.forEach(carItem.drivers, function (driverItem) {
                        if (driver.driver_id == driverItem.driver_id) {
                            driverItem.isSelect = driver.isSelect;
                        }
                    })
                }
            });
        };

        // Load options
        var loadOptions = function (afterAddOns) {
            OptionBS.getCurrentOptionAll().then(function (result) {
                //设置已选择的option
                angular.forEach(result.data, function (option1) {
                    if (afterAddOns) {
                        angular.forEach($scope.options, function (option2) {
                            if (option1.id == option2.id) {
                                option1.isSelect = option2.isSelect;
                            }
                        });
                    } else {
                        angular.forEach(offer.options, function (option3) {
                            if (option1.id == option3.option_id) {
                                option1.isSelect = true;
                            }
                        });
                    }
                });
                $scope.options = result.data;
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("rate_add.jsGet_option_fail"), "error");
                }
            });
        };

        // Init data
        loadOffer();

        var save = function (param, l) {
            OfferBS.updateToCurrentUser(param).then(function (result) {
                MessageBox.hideLoading();
                l.stop();
                if ($stateParams.event.editSuccess) {
                    $stateParams.event.editSuccess();
                }
            }, function (error) {
                MessageBox.hideLoading();
                l.stop();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("rate_edit.jsUpdate_fail"), "error");
                }
            });
        };

        var checkRouteHasNoWork = function (routines) {
            var check = true;
            angular.forEach(routines, function (routine) {
                // console.log("check " + routine + " is " + routine.match("^(1){48}"));
                check = check && routine.match("^(1){48}");
            });
            return check;
        };
        var checkOfferCar = function (cars) {
            return cars.length == 0;
        };
        var checkOfferDriver = function (cars) {
            var check = true;
            angular.forEach(cars, function (car) {
                check = car.drivers == '' && check;
            });
            return check;
        };

        var emptyRouteDataWarming = function (param, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("rate_add.jsRate_routine_not_work"), function (isConfirm) {
                if (isConfirm) {
                    save(param, la);
                } else {
                    la.stop();
                }
            });
        };
        var emptyCarDataWarming = function (param, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("rate_edit.jsRate_car_not_work_edit"), function (isConfirm) {
                if (isConfirm) {
                    save(param, la);
                } else {
                    la.stop();
                }
            });
        };
        var emptyDriverDataWarming = function (param, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("rate_edit.jsRate_driver_not_work_edit"), function (isConfirm) {
                if (isConfirm) {
                    save(param, la);
                } else {
                    la.stop();
                }
            });
        };


        $scope.onSubmitButtonClick = function (valid, $event) {

            if ($scope.type == RateType.TRAN) {
                for (var i = 0; i < $scope.priceZones.length; i++) {
                    if ($scope.priceZones[i].zoneValue.length == 0) {
                        MessageBox.toast(T.T("rate_add.jsZone_format_error"), "error");
                        return;
                    }
                    if (Number($scope.priceZones[i].zoneValue).toString() == NaN.toString()) {
                        MessageBox.toast(T.T("rate_add.jsZone_format_error"), "error");
                        return;
                    }

                    if(!/^\d+(\.\d{1,2})?$/.test($scope.priceZones[i].zoneValue)){
                        MessageBox.toast(T.T("rate_edit.jsZone_error"), "error");
                        return;
                    }
                    // if (Number($scope.priceZones[i].zoneValue).toString().indexOf('.') > 0) {
                    //     MessageBox.toast(T.T("rate_edit.jsZone_error"), "error");
                    //     return;
                    // }
                    if ($scope.priceZones[i].priceValue.length == 0) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_format_error"), "error");
                        return;
                    }
                    if (Number($scope.priceZones[i].priceValue).toString() == NaN.toString()) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_format_error"), "error");
                        return;
                    }
                    if (i > 0 && $scope.priceZones[i].zoneValue <= $scope.priceZones[i - 1].zoneValue) {
                        MessageBox.toast(T.T("rate_add.jsZone_price_error"), "error");
                        return;
                    }
                }
                if ($scope.priceZones[0].zoneValue <= $scope.distanceMinSlider.value) {
                    MessageBox.toast(T.T("rate_add.jsMinimum_distance_error"), "error");
                    return;
                }
            }

            var optionIds = [];
            angular.forEach($scope.options, function (option) {
                if (option.isSelect) {
                    optionIds.push(option.id);
                }
            });

            var cars = [];
            angular.forEach($scope.selectedCars, function (car) {
                var driverIds = [];
                angular.forEach(car.drivers, function (driver) {
                    if (driver.isSelect && driver.canShow) {
                        driverIds.push(driver.driver_id);
                    }
                });
                cars.push({"car_id": car.car_id, "drivers": driverIds.toString()});
            });
            var param = {};
            param.id = offerId;
            param.name = $scope.title;
            param.description = $scope.description.txt;
            param.type = $scope.type;
            param.dAddress = $scope.pickupLocation.formatted_address;
            param.dIsPort = $scope.dPort.is_port ? 1 : 0;
            param.dPortPrice = $scope.dPort.price;
            param.dLat = $scope.pickupLocation.latlng.lat;
            param.dLng = $scope.pickupLocation.latlng.lng;
            param.dRadius = $scope.pickupSlider.value;
            param.aRadius = $scope.dropoffSlider.value;
            param.preTime = $scope.preTime;
            
            //param.costMin = $scope.costMin;
            if ( $scope.type != RateType.LONG )     // 04/05/2018 chan
                 param.costMin = $scope.costMin;
            else param.costMin = 0;
            
            var prices = [];
            if ($scope.type == RateType.LONG || $scope.type == RateType.HOUR) {
                if ($scope.distanceMinSlider.value > $scope.distanceMaxSlider.value || $scope.time.minTime > $scope.time.maxTime) {
                    MessageBox.toast(T.T("rate_add.jsMinimum_value_greater_than_maximum_value"), "error");
                    return;
                } else {
                    prices.push({
                        invl_start: $scope.type == RateType.LONG ? $scope.distanceMinSlider.value : $scope.time.minTime * 60,
                        invl_end: $scope.type == RateType.LONG ? $scope.distanceMaxSlider.value : $scope.time.maxTime * 60,
                        price: $scope.price
                    });
                }
            } else {
                $scope.priceZones.forEach(function (priceZone, index) {
                    prices.push({
                        invl_start: index == 0 ? $scope.distanceMinSlider.value : $scope.priceZones[index - 1].zoneValue,
                        invl_end: priceZone.zoneValue,
                        price: priceZone.priceValue
                    });
                });
            }
            param.prices = prices;
            param.tva = $scope.tva;
            if ($scope.type == RateType.LONG) {
                param.aAddress = $scope.dropoffLocation.formatted_address;
                param.aIsPort = $scope.aPort.is_port ? 1 : 0;
                param.aPortPrice = $scope.aPort.price;
                param.aLat = $scope.dropoffLocation.latlng.lat;
                param.aLng = $scope.dropoffLocation.latlng.lng;
            }

            if ($scope.type == RateType.TRAN) {
                param.aIsPort = $scope.aPort.is_port ? 1 : 0;
                param.aPortPrice = $scope.aPort.price;
            }

            if ( $scope.type == RateType.HOUR ) {   // 04/06/2018 chan
                if ( $scope.costMin < $scope.price ) {
                    MessageBox.toast(T.T("rate_edit.jsMinimum_price_value_greater_than_calculation_method"), "error");
                    return;
                }
            }

            param.cars = cars;
            param.options = optionIds.toString();
            param.calendar = OfferBS.routineConversionsFromLocToISO($scope.routine);

            MessageBox.showLoading();
            var l = Ladda.create($event.target);
            l.start();
            if (checkRouteHasNoWork(param.calendar)) {
                emptyRouteDataWarming(param, l);
                return;
            }
            if (checkOfferCar(param.cars)) {
                emptyCarDataWarming(param, l);
                return;
            }
            if (checkOfferDriver(param.cars)) {
                emptyDriverDataWarming(param, l);
                return;
            }
            save(param, l);
        };


    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('RatesCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $timeout, MessageBox, OfferBS) {
        if (!$rootScope.loginUser) {
            return;
        }
        $scope.distanceUnit = localStorage.getItem('distanceunit');
        $scope.companyCurrency = window.localStorage.companyCurrency.toLowerCase();
        $scope.currentPage = 1;
        $scope.pageTotalItems = 1;
        $scope.pagePreCount = 10;

        $scope.showRatesView = false;
        $scope.showNoRatesView = false;
        if ($rootScope.loginUser == null) {
            $state.go('login');
            return;
        }

        if ($scope.companyCurrency == null ||
            $scope.companyCurrency == undefined ||
            $scope.companyCurrency.trim(' ') == '') {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/currency-alert-modal.html',
                controller: 'CurrencyAcctCtrl',
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

        // Event
        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/rate-add.html',
                controller: 'RateAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onEditButtonClick = function (id) {

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/rate-edit.html',
                controller: 'RateEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            offerId: id
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            OfferBS.deleteFromCurrentUser(id).then(function (result) {
                MessageBox.hideLoading();
                for (var i = 0; i < originalRates.length; i++) {
                    if (originalRates[i].offer_id == id) {
                        originalRates.splice(i, 1);
                        i--
                    }
                }
                for (var i = 0; i < $scope.listData.length; i++) {
                    if ($scope.listData[i].offer_id == id) {
                        $scope.listData.splice(i, 1);
                        i--
                    }
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("comment.jsDelete_fail"), "error", "error");
                }
            });
        };

        // Function
        var originalRates = [];
        var loadData = function () {
            MessageBox.showLoading();
            OfferBS.getCurrentOfferAll().then(function (result) {
                MessageBox.hideLoading();
                if (result.data.length > 0) {
                    $scope.showRatesView = true;
                    $scope.showNoRatesView = false;

                    originalRates = result.data;
                    $scope.pageTotalItems = 1;
                    angular.forEach(originalRates, function (item) {
                        item.workStates = routineConversionsFromISOToLoc(JSON.parse(item.routine));
                        item.prices = JSON.parse(item.prices)
                    });

                    if (searchText) {
                        $scope.listData = getSearchRatesResult(originalRates, searchText);
                    } else {
                        $scope.listData = angular.copy(originalRates);
                    }

                    console.log($scope.listData);

                    $timeout(function () {
                        $(function () {
                            $(".card-more").click(function () {
                                $(this).next().fadeToggle();
                                $(this).fadeToggle(
                                    $(this).children("i").toggleClass("fa-ellipsis-v")
                                );
                            });
                            $(".gen").click(function () {
                                $(this).parent().find(".gen-panel").fadeIn(200);
                            });
                            $(".gen-cancel").click(function () {
                                $(this).parents(".gen-panel").fadeOut(200);
                            });
                        });
                    }, 0);
                } else {
                    $scope.showRatesView = false;
                    $scope.showNoRatesView = true;
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("rates.jsGet_offer_fail"), "error");
                }
            });
        };

        //转时区获得正确的routine
        var routineConversionsFromISOToLoc = function (routineArray) {
            var finalWeekRoutine = routineArray.join('');
            //获取时区
            var timeZone = (new Date().getTimezoneOffset() / 60) * (-1) * 2;
            var locRoutineDataString = "";
            if (timeZone > 0) {
                //后面拼到前面
                var tempStart = finalWeekRoutine.substring(48 * 7 - timeZone);
                var tempSpell = finalWeekRoutine.substring(0, 48 * 7 - timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else if (timeZone < 0) {
                //前面拼到后面
                var tempStart = finalWeekRoutine.substring(-timeZone);
                var tempSpell = finalWeekRoutine.substring(0, -timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else {
                locRoutineDataString = finalWeekRoutine;
            }

            //通过locRoutineDataString得到出勤情况
            var routineArray = undefined;
            for (var i = 0; i < 7; i++) {
                var routinePerDay = locRoutineDataString.substring(i * 48, (i + 1) * 48) + "";
                var work = true;
                if (routinePerDay.indexOf('0') == -1) {
                    work = false;
                }
                if (routineArray == undefined) {
                    routineArray = new Array(work);
                } else {
                    routineArray.push(work);

                }
            }
            return routineArray;
        };

        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                if (!word) {
                    searchText = undefined;
                    $scope.listData = angular.copy(originalRates);
                } else {
                    $scope.listData = [];
                    $scope.$apply();

                    searchText = word;
                    $scope.listData = getSearchRatesResult(originalRates, word);
                }
                $scope.$apply();
                $(function () {
                    $(".card-more").click(function () {
                        $(this).next().fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".gen").click(function () {
                        $(this).parent().find(".gen-panel").fadeIn(200);
                    });
                    $(".gen-cancel").click(function () {
                        $(this).parents(".gen-panel").fadeOut(200);
                    });
                });
            }, 100);
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchRatesResult = function (originalRates, searchText) {
            var tempSearch = [];
            angular.forEach(originalRates, function (rate) {
                if (rate.offer_name.toString().indexOf(searchText.toString()) > -1) {
                    tempSearch.push(rate);
                }
            });
            return tempSearch;
        };

        // Init
        loadData();

    });

/**
 * Created by jian on 17-9-9.
 */
angular.module('KARL.Controllers')
    .controller('salesAssistantAddCtrl', function ($scope, $stateParams, $timeout, MessageBox, CompanyBS) {

        $timeout(function () {
            angular.element('#SalesAssistantForm').validator();
        }, 0);

        $scope.countrys = angular.copy(countrysCode);
        $scope.languages = [
            {
                name:'English',
                value:'en'
            },
            {
                name:'French',
                value:'fr'
            }
        ];

        $scope.salesAssistantInfo = {};

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onSubmitButtonClick = function (valid, $event) {
            if ($scope.salesAssistantInfo.password != $scope.salesAssistantInfo.confirmPassword) {
                MessageBox.toast('Password Verification Error', "error");
                return
            }
            console.log($scope.salesAssistantInfo);
            var ladda = Ladda.create($event.target);
            ladda.start();
            CompanyBS.createSalesAssistant($scope.salesAssistantInfo).then(function (result) {
                console.log(result)
                ladda.stop();
                MessageBox.toast("Sales Assistant created successfully!", "info");
                $stateParams.event.addSuccess();
            }, function (error) {
                ladda.stop();
                if (error.treated) {
                }
                else {
                    MessageBox.toast("Sorry, we couldn't add the Sales Assistant.", "error");
                }
            });

        }
    });

/**
 * Created by jian on 17-9-11.
 */

angular.module('KARL.Controllers')
    .controller('salesAssistantCompaniesCtrl', function (CompanyBS, $scope, $timeout, MessageBox) {
        var firstLoad = true;
        loadData();
        function loadData() {
            MessageBox.showLoading();
            CompanyBS.getAsstsCompaniesTotalsData().then(function (result) {
                MessageBox.hideLoading();
                $scope.companieList = result.data.result;
                $scope.salesList=integrationCompanyInSales(result.data.result);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("stats.jsGet_statistics_fail"), "error");
                }
            })
        }


        function integrationCompanyInSales(companies) {
            console.log(companies);
            var salesForCompanyArray = [];
            for (var i = 0; i < companies.length; i++) {
                var haveCompany=true;
                for (var k = 0; k < salesForCompanyArray.length; k++) {
                    if (salesForCompanyArray[k].salesId===companies[i].sale_id) {
                        haveCompany=false;
                        salesForCompanyArray[k].companiesCount++;
                        salesForCompanyArray[k].companies.push(companies[i])
                    }
                }
                if(haveCompany){
                    var item={
                        'salesId':companies[i].sale_id,
                        'salesName':companies[i].first_name+companies[i].last_name,
                        'companies':[companies[i]],
                        'companiesCount':1
                    };
                    salesForCompanyArray.push(item)
                }

            }

            $timeout(function () {
                $(function () {
                    $("#rates-vehicle-accordion").accordion({
                        header: 'h3.myselect',
                        active: true,
                        alwaysOpen: false,
                        animated: false,
                        collapsible: true,
                        heightStyle: "content",
                        beforeActivate: function (event, ui) {
                            $(".rates-sub-accordion").accordion({
                                header: 'div.rates-sub',
                                active: true,
                                alwaysOpen: false,
                                animated: false,
                                collapsible: true,
                                heightStyle: "content"
                            });
                        }
                    });
                });
            }, 0);
           return salesForCompanyArray
        }

        $scope.$watch('input.searchText', function (word) {
            if (word) {
                $scope.searchResult = search(word);
                $scope.showSearchResult = true;
            } else {
                $scope.showSearchResult = false;
            }
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        function search(searchKeyWord) {
            var searchList = [];
            angular.forEach($scope.companieList, function (item) {
                if (
                    item.name.toString().toLowerCase().indexOf(searchKeyWord.toString().toLowerCase()) >= 0
                ) {
                    searchList.push(item)
                }
            });
            $timeout( function() {
                if(firstLoad){
                    $(".rates-subs-accordion").accordion({
                        header: 'div.rates-sub',
                        active: true,
                        alwaysOpen: false,
                        animated: false,
                        collapsible: true,
                        heightStyle: "content"
                    });
                }else {
                    $(".rates-subs-accordion").accordion("refresh");
                    $(".rates-subs-accordion").accordion( "option", "active",false);
                }
                firstLoad = false;
            },0);
            return searchList
        }
    });
/**
 * Created by jian on 17-9-9.
 */
angular.module('KARL.Controllers')
    .controller('salesAssistantEditCtrl', function ($stateParams, $scope, MessageBox, CompanyBS, $timeout, T) {
        console.log($stateParams);

        $scope.showSalesAssistant = true;
        $scope.countrys = angular.copy(countrysCode);


        $timeout(function () {
            // /************* 左右滑动tab ************* /
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
            // /************* / 左右滑动tab ************* /
        }, 0);

        $scope.onCancelButtonClick = function () {
            if ($scope.SalesAssistantForm.$dirty) {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("driver_add.jsExit_warning"), function (isConfirm) {
                    if (isConfirm) {
                        if ($stateParams.event.cancel) {
                            $stateParams.event.cancel();
                        }
                    }
                });
            } else {
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel();
                }
            }
        };

        $scope.changeTabs = function (tabIndex) {
            if (tabIndex == 0) {
                $scope.showSalesAssistant = true;
            } else {
                $scope.showSalesAssistant = false;
            }
        };

        loadData();
        function loadData() {
            MessageBox.showLoading();
            CompanyBS.getEditSalesAssistantInfo($stateParams.data.saleId).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                $scope.salesAssistantInfo = angular.copy(result.data.result);
                var salesArray = [];

                for (var i = 0; i < $scope.salesAssistantInfo.sales.length; i++) {
                    $scope.salesAssistantInfo.sales[i].selected = parseInt($scope.salesAssistantInfo.sales[i].selected);
                    $scope.salesAssistantInfo.sales[i].marked = parseInt($scope.salesAssistantInfo.sales[i].marked);
                    if ($scope.salesAssistantInfo.sales[i].selected == 1||$scope.salesAssistantInfo.sales[i].marked==1) {
                        $scope.salesAssistantInfo.sales[i].isSelect = true
                    } else {
                        $scope.salesAssistantInfo.sales[i].isSelect = false
                    }
                    var haveSales = false;
                    for (var k = 0; k < salesArray.length; k++) {
                        if (salesArray[k].salesIds === $scope.salesAssistantInfo.sales[i].sale_id) {
                            haveSales = true;
                            if ($scope.salesAssistantInfo.sales[i].selected == 1&&$scope.salesAssistantInfo.sales[i].marked!=1) {
                                // $scope.salesAssistantInfo.sales[i].selectedCount++;
                                salesArray[k].selectedCount++
                            }
                            salesArray[k].salesArr.push($scope.salesAssistantInfo.sales[i]);
                            break;
                        }
                    }
                    if (!haveSales) {
                        var selectedCount = 0;
                        if ($scope.salesAssistantInfo.sales[i].selected == 1&&$scope.salesAssistantInfo.sales[i].marked!=1) {
                            selectedCount++;
                        }
                        var item = {
                            salesIds: $scope.salesAssistantInfo.sales[i].sale_id,
                            salesArr: $scope.salesAssistantInfo.sales[i].company_id === null ? [] : [$scope.salesAssistantInfo.sales[i]],
                            salesName: $scope.salesAssistantInfo.sales[i].first_name + $scope.salesAssistantInfo.sales[i].last_name,
                            "selectedCount": selectedCount
                        };
                        salesArray.push(item)
                    }
                }
                console.log(salesArray);
                $scope.salesArray = salesArray;
                $timeout(function () {
                    angular.element('#SalesAssistantForm').validator();
                    $(function () {
                        $("#salesAssistant-accordion").accordion({
                            header: 'h3.rates-select',
                            active: true,
                            alwaysOpen: false,
                            animated: false,
                            collapsible: true,
                            heightStyle: "content"
                        });
                    });
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("drivers.jsGet_driver_fail"), "error");
                }
            })
        }


        $scope.onSalesAssSelect = function (salesAss, company) {
            for(var i=0;i<salesAss.salesArr.length;i++){
                if(salesAss.salesArr[i].company_id===company.company_id){
                    console.log(salesAss.salesArr[i]);
                    if(company.isSelect){
                        salesAss.selectedCount++
                    }else {
                        salesAss.selectedCount--
                    }
                }
            }
        };


        $scope.onSubmitButtonClick = function (valid, event) {
            console.log($scope.salesAssistantInfo);
                if (!$scope.salesAssistantInfo.first_name
                    || !$scope.salesAssistantInfo.last_name
                    || !$scope.salesAssistantInfo.email
                    || !$scope.salesAssistantInfo.mobile
                    || !$scope.salesAssistantInfo.email
                ) {
                    MessageBox.toast(T.T("driver_edit.jsValue_format_error"), 'error');
                    return;
                }

                var selectCompanies = [];
                for (var i = 0; i < $scope.salesAssistantInfo.sales.length; i++) {
                    if ($scope.salesAssistantInfo.sales[i].isSelect && $scope.salesAssistantInfo.sales[i].marked == 0) {
                        var item={
                            id:$scope.salesAssistantInfo.sales[i].company_id,
                            sale_id:$scope.salesAssistantInfo.sales[i].sale_id
                        };
                        selectCompanies.push(item);
                    }
                }

                var params = {
                    first_name: $scope.salesAssistantInfo.first_name,
                    last_name: $scope.salesAssistantInfo.last_name,
                    email: $scope.salesAssistantInfo.email,
                    mobile: $scope.salesAssistantInfo.mobile,
                    country: $scope.salesAssistantInfo.country,
                    companies: selectCompanies
                };
                if ($scope.salesAssistantInfo.password) {
                    if ($scope.salesAssistantInfo.password.length < 6 || $scope.salesAssistantInfo.password.length > 16) {
                        MessageBox.toast(T.T("driver_edit.jsPassword_limited_characters"), "error");
                        return;
                    }
                    if ($scope.salesAssistantInfo.password != $scope.salesAssistantInfo.confirmPassword) {
                        MessageBox.toast(T.T("driver_edit.jsNew_password_error"), "error");
                        return;
                    }
                    params.pwd = $scope.salesAssistantInfo.password;
                }
                console.log(params);
                MessageBox.showLoading();
                CompanyBS.updateSalesAssistantInfo(params, $stateParams.data.saleId).then(function (result) {
                    MessageBox.hideLoading();
                    $stateParams.event.addSuccess()
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("vehicle_edit.jsUpdate_fail"), "error");
                    }
                })
        }

    });

/**
 * Created by jian on 17-9-11.
 */
angular.module('KARL.Controllers')
    .controller('salesAssistantHomeCtrl', function ($scope, $rootScope) {
        $scope.salesAssistantInfo = $rootScope.loginUser;
        var countrys = angular.copy(countrysCode);
        for (var i = 0; i < countrys.length; i++) {
            if ($scope.salesAssistantInfo.asst.country === countrys[i].countryCode) {
                $scope.countrys = countrys[i].name
            }
        }
    });

/**
 * Created by jian on 17-9-8.
 */
angular.module('KARL.Controllers')
    .controller('salesAssistantCtrl', function ($scope, $uibModal, MessageBox, CompanyBS, $timeout) {
        $scope.currentPage = 1;
        $scope.pagePerCount = 12;
        $scope.countrys = angular.copy(countrysCode);
        $scope.showSearchResult = false;
        $scope.input = {
            searchText: undefined
        };
        $scope.addSalesAssistant = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/sales-assistant-add.html',
                controller: 'salesAssistantAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadAssistant();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        loadAssistant();
        function loadAssistant() {
            MessageBox.showLoading();
            CompanyBS.getSalesAssistant($scope.currentPage, $scope.pagePerCount, $scope.input.searchText).then(function (result) {
                MessageBox.hideLoading();
                if ($scope.input.searchText) {
                        $scope.showSearchResult = true;
                } else {
                    $scope.showSearchResult = false;
                }
                $scope.pageTotalItems = result.data.result.total;
                $scope.salesAssistantList = result.data.result.sales;
                for (var i = 0; i < $scope.salesAssistantList.length; i++) {
                    for (var k = 0; k < $scope.countrys.length; k++) {
                        if ($scope.salesAssistantList[i].country === $scope.countrys[k].countryCode) {
                            $scope.salesAssistantList[i].countryName = $scope.countrys[k].name
                        }
                    }
                }
                console.log(result);
                $timeout(function () {
                    $(function () {
                        $(".card-more").click(function () {
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function () {
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function () {
                            $(this).parents(".gen-panel").fadeOut(200);
                        });
                    });
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("drivers.jsGet_driver_fail"), "error");
                }
            })
        }

        $scope.onPageChange = function () {
            loadAssistant();
        };

        $scope.onEditButtonClick = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/sales-assistant-edit.html',
                controller: 'salesAssistantEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            saleId: id
                        },
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadAssistant();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            CompanyBS.deleteSalesAssistantInfo(id).then(function (result) {
                MessageBox.hideLoading();
                loadAssistant()
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    MessageBox.toast(T.T("comment.jsDelete_fail"), "error");
                }
            })
        };

        $scope.$watch('input.searchText', function (word) {
            $scope.currentPage = 1;
            loadAssistant();
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

    });
/**
 * Created by jian on 17-8-8.
 */
angular.module('KARL.Controllers')
    .controller('salesRepAddCtrl', function ($scope, $stateParams, $timeout, MessageBox, CompanyBS) {

        $timeout(function () {
            angular.element('#SalesRepForm').validator();
        }, 0);

        $scope.countrys = angular.copy(countrysCode);
        $scope.languages = [
            {
                name:'English',
                value:'en'
            },
            {
                name:'French',
                value:'fr'
            }
        ];

        $scope.salesRepInfo = {};

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onSubmitButtonClick = function (valid, $event) {
            if ($scope.salesRepInfo.password != $scope.salesRepInfo.confirmPassword) {
                MessageBox.toast('Password Verification Error', "error");
                return
            }
            console.log($scope.salesRepInfo);
            var ladda = Ladda.create($event.target);
            ladda.start();
            CompanyBS.createSalesRep($scope.salesRepInfo).then(function (result) {
                ladda.stop();
                MessageBox.toast("Sales Rep created successfully!", "info");
                $stateParams.event.addSuccess();
            }, function (error) {
                ladda.stop();
                if (error.treated) {
                }
                else {
                    MessageBox.toast("Sorry, we couldn't add the Sales Rep.", "error");
                }
            });

        }
    });

/**
 * Created by jian on 17-8-9.
 */
angular.module('KARL.Controllers')
    .controller('salesRapCompaniesCtrl',function (CompanyBS,$scope,$timeout) {
        var firstLoad = true;
        $scope.showSearchResult = false;
        loadData();
        function loadData() {
            CompanyBS.getCompaniesTotalsData().then(function (result) {
                $timeout( function() {
                    console.log(result);
                    $scope.companieList=result.data.result;
                    $scope.$apply();
                    if(firstLoad){
                        $("#vehicle-accordion").accordion({
                            header: 'h3.myselect',
                            active: false,
                            collapsible:true,
                            heightStyle: "content"
                        });
                    }else {
                        $("#vehicle-accordion").accordion("refresh");
                        $("#vehicle-accordion").accordion( "option", "active",false);
                    }
                    firstLoad = false;
                });
            },function (error) {
                console.log(error)
            })
        }

        $scope.$watch('input.searchText', function (word) {
            console.log(word);
            if (word) {
                $scope.searchResult = search(word);
                $scope.showSearchResult = true;
            } else {
                $scope.showSearchResult = false;
            }
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        function search(searchKeyWord) {
            var searchList = [];
            angular.forEach($scope.companieList, function (item) {
                if (
                    item.name.toString().toLowerCase().indexOf(searchKeyWord.toString().toLowerCase()) >= 0
                ) {
                    searchList.push(item)
                }
            });
            $timeout( function() {
                if(firstLoad){
                    $("#vehicle-accordion").accordion({
                        header: 'h3.myselect',
                        active: false,
                        collapsible:true,
                        heightStyle: "content"
                    });
                }else {
                    $("#vehicle-accordion").accordion("refresh");
                    $("#vehicle-accordion").accordion( "option", "active",false);
                }
                firstLoad = false;
            },0);
            return searchList
        }
    });
/**
 * Created by jian on 17-8-9.
 */
angular.module('KARL.Controllers')
    .controller('salesRepEditCtrl', function ($stateParams, $scope, MessageBox, CompanyBS, $timeout, T) {
        console.log($stateParams);

        $scope.showSalesRep = true;
        $scope.countrys = angular.copy(countrysCode);


        $timeout(function () {
            // /************* 左右滑动tab ************* /
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
            // /************* / 左右滑动tab ************* /
        }, 0);

        $scope.onCancelButtonClick = function () {
            if ($scope.SalesRepForm.$dirty) {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("driver_add.jsExit_warning"), function (isConfirm) {
                    if (isConfirm) {
                        if ($stateParams.event.cancel) {
                            $stateParams.event.cancel();
                        }
                    }
                });
            } else {
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel();
                }
            }
        };

        $scope.changeTabs = function (tabIndex) {
            if (tabIndex == 0) {
                $scope.showSalesRep = true;
            } else {
                $scope.showSalesRep = false;
            }
        };

        loadData();
        function loadData() {
            MessageBox.showLoading();
            CompanyBS.getEditSalesRepInfo($stateParams.data.saleId).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                $scope.salesRepInfo = angular.copy(result.data.result);
                for (var i = 0; i < $scope.salesRepInfo.companies.length; i++) {
                    $scope.salesRepInfo.companies[i].selected = parseInt($scope.salesRepInfo.companies[i].selected);
                    $scope.salesRepInfo.companies[i].marked = parseInt($scope.salesRepInfo.companies[i].marked);
                    if ($scope.salesRepInfo.companies[i].selected === 1 || $scope.salesRepInfo.companies[i].marked === 1) {
                        $scope.salesRepInfo.companies[i].isSelect = true
                    } else {
                        $scope.salesRepInfo.companies[i].isSelect = false
                    }

                }
                console.log($scope.salesRepInfo)
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("drivers.jsGet_driver_fail"), "error");
                }
            })
        }


        $scope.onSubmitButtonClick = function (valid, event) {
            if (!$scope.salesRepInfo.first_name
                || !$scope.salesRepInfo.last_name
                || !$scope.salesRepInfo.email
                || !$scope.salesRepInfo.mobile
                || !$scope.salesRepInfo.email
            ) {
                MessageBox.toast(T.T("driver_edit.jsValue_format_error"), 'error');
                return;
            }

            var selectCompaniesIds = [];
            for (var i = 0; i < $scope.salesRepInfo.companies.length; i++) {
                if ($scope.salesRepInfo.companies[i].isSelect && $scope.salesRepInfo.companies[i].marked === 0) {
                    selectCompaniesIds.push($scope.salesRepInfo.companies[i].id);
                }
            }

            var params = {
                first_name: $scope.salesRepInfo.first_name,
                last_name: $scope.salesRepInfo.last_name,
                email: $scope.salesRepInfo.email,
                mobile: $scope.salesRepInfo.mobile,
                country: $scope.salesRepInfo.country,
                companies: selectCompaniesIds.join(',')
            };
            if ($scope.salesRepInfo.password) {
                if ($scope.salesRepInfo.password.length < 6 || $scope.salesRepInfo.password.length > 16) {
                    MessageBox.toast(T.T("driver_edit.jsPassword_limited_characters"), "error");
                    return;
                }
                if ($scope.salesRepInfo.password != $scope.salesRepInfo.confirmPassword) {
                    MessageBox.toast(T.T("driver_edit.jsNew_password_error"), "error");
                    return;
                }
                params.pwd = $scope.salesRepInfo.password;
            }
            console.log(params);
            MessageBox.showLoading();
            CompanyBS.updateSalesRepInfo(params, $stateParams.data.saleId).then(function (result) {
                MessageBox.hideLoading();
                $stateParams.event.addSuccess()
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicle_edit.jsUpdate_fail"), "error");
                }
            })
        }

    });

/**
 * Created by jian on 17-8-9.
 */
angular.module('KARL.Controllers')
    .controller('salesRapHomeCtrl', function ($scope, $rootScope) {
        $scope.salesRapInfo = $rootScope.loginUser;
        var countrys = angular.copy(countrysCode);
        for (var i = 0; i < countrys.length; i++) {
            if ($scope.salesRapInfo.sale.country === countrys[i].countryCode) {
                $scope.countrys = countrys[i].name
            }
        }
    });
/**
 * Created by jian on 17-8-9.
 */
angular.module('KARL.Controllers')
    .controller('SalesRapTotalsCtrl', function ($scope, $filter, $timeout, $uibModal,MessageBox, StatisticsBS) {
        $scope.companyCount = 0;
        $scope.vehicleCount = 0;
        $scope.activeVehicle = 0;
        $scope.ccyType = 'usd';
        var ccyStats =[];
        var dayDiv3;
        var weekDiv3;
        var monthDiv3;
        var allDivs = [];

        var dayViz3;
        var weekViz3;
        var monthViz3;
        var allVizs = [];
        $scope.companyCurrency = window.localStorage.companyCurrency.toLowerCase();
        $scope.today = {
            earningsTotal: 0
        };
        $scope.yesterday = {
            earningsTotal: 0
        };
        $scope.twoDaysAgo = {
            earningsTotal: 0
        };

        $scope.thisWeek = {
            earningsTotal: 0
        };
        $scope.lastWeek = {
            earningsTotal: 0
        };
        $scope.twoWeeksAgo = {
            earningsTotal: 0
        };

        $scope.thisMonth = {
            earningsTotal: 0
        };
        $scope.lastMonth = {
            earningsTotal: 0
        };
        $scope.twoMonthsAgo = {
            earningsTotal: 0
        };
        var selectDate;

        $scope.onTabChanged = function (tabIndex) {
            $scope.tab = tabIndex;
            perGetStats();
        };
        var init = function () {
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            selectDate = now;

            $scope.tab = 0;
            $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'statsDate');
            getStats();

            $timeout(function () {
                // /************* 左右滑动tab ************* /
                $(".nav-slider li").click(function (e) {
                    var mywhidth = $(this).width();
                    $(this).addClass("act-tab1");
                    $(this).siblings().removeClass("act-tab1");

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
                // /************* / 左右滑动tab ************* /

                initRadialProgress();
            }, 0);
        };
        var getStats = function () {
            MessageBox.showLoading();
            StatisticsBS.saleStatistics(selectDate, $scope.tab).then(function (result) {
                MessageBox.hideLoading();
                $timeout(function () {
                    //整理数据
                    $scope.companyCount = result.data.companies;
                    $scope.vehicleCount = result.data.cars;
                    $scope.activeVehicle = result.data.active_vehicle;
                    ccyStats = result.data.statistic;
                    switchCurrency('usd',ccyStats['usd'])
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("stats.jsGet_statistics_fail"), "error");
                }
            });
        };
        $scope.onSelectDateButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/stats-date-select-model.html',
                controller: 'StatsDateSelectModel',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            currentDate: selectDate,
                            type: $scope.tab
                        },
                        event: {
                            done: function (date) {
                                modalInstance.dismiss();
                                selectDate = date;
                                perGetStats();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        var perGetStats = function () {
            if ($scope.tab == 0) {
                $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'statsDate');
            } else if ($scope.tab == 1) {
                var firstDateOfWeek = angular.copy(selectDate);
                if (firstDateOfWeek.getDay() == 0) {
                    firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - 7);
                } else {
                    firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - firstDateOfWeek.getDay());
                }

                var lastDateOfWeek = angular.copy(selectDate);
                if (lastDateOfWeek.getDay() == 0) {
                    lastDateOfWeek.setDate(lastDateOfWeek.getDate());
                } else {
                    lastDateOfWeek.setDate(lastDateOfWeek.getDate() + 7 - lastDateOfWeek.getDay());
                }

                if (firstDateOfWeek.getMonth() == lastDateOfWeek.getMonth()) {
                    $scope.dateString = $filter('dateFormatter')(firstDateOfWeek.getTime(), 'statsShortFirstDate') +
                        '-' +
                        $filter('dateFormatter')(lastDateOfWeek.getTime(), 'statsShortLastDate');
                } else {
                    $scope.dateString = $filter('dateFormatter')(firstDateOfWeek.getTime(), 'shortDate') +
                        '-' +
                        $filter('dateFormatter')(lastDateOfWeek.getTime(), 'statsLongLastDate');
                }
            } else {
                $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'MMM,YYYY');
            }
            getStats();
        };


        var initRadialProgress = function () {
            //Here we use the three div tags from our HTML page to load the three components into.
            dayDiv3 = d3.select("#day-stats-3");

            weekDiv3 = d3.select("#week-stats-3");

            monthDiv3 = d3.select("#month-stats-3");

            allDivs = [dayDiv3, weekDiv3, monthDiv3];

            //Here we create our three radial progress components by passing in a parent DOM element (our div tags)
            dayViz3 = vizuly.component.radial_progress(document.getElementById("day-stats-3"));

            weekViz3 = vizuly.component.radial_progress(document.getElementById("week-stats-3"));

            monthViz3 = vizuly.component.radial_progress(document.getElementById("month-stats-3"));

            allVizs = [dayViz3, weekViz3, monthViz3];

            //Here we set some bases line properties for all three components.
            allVizs.forEach(function (viz, i) {
                viz.data(0)                                // Current value
                    .min(0)                                 // min value
                    .max(100)                               // max value
                    .capRadius(1)                           // Sets the curvature of the ends of the arc.
                    .startAngle(270)                        // Angle where progress bar starts
                    .endAngle(270)                          // Angle where the progress bar stops
                    .arcThickness(.08);                     // The thickness of the arc (ratio of radius)
                viz.label(function (d) {
                    var initViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(d),false,false,$scope.companyCurrency);
                    return initViz3Prince;
                });
                vizuly.theme.radial_progress(viz).skin('White');
            });

            allDivs.forEach(function (div, i) {
                div.style("width", 250 + 'px');
                allVizs[i].width(250).height(250).radius(250 / 2).update();
            });
        };

        init();
        $scope.changeCcy = function () {
            switchCurrency($scope.ccyType);
        };
       var switchCurrency = function (ccy) {
            $scope.companyCurrency = ccy;
            $scope.ccyType = ccy;
            console.log("ccy is ",$scope.companyCurrency);
            var stats = ccyStats[ccy];
            console.log("stats is ",stats);

           if(stats.length == 0){
                if($scope.tab == 0){
                    $scope.today.earningsTotal=0;
                    $scope.yesterday.earningsTotal=0;
                    $scope.twoDaysAgo.earningsTotal=0;
                    dayViz3.data(0).update();
                    dayViz3.label(function () {
                        var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return dayViz3Prince;
                    }).update();
                }else if($scope.tab == 1){
                    $scope.thisWeek.earningsTotal=0;
                    $scope.lastWeek.earningsTotal=0;
                    $scope.twoWeeksAgo.earningsTotal=0;
                    weekViz3.data(0).update();
                    weekViz3.label(function () {
                        var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return weekViz3Prince;
                    }).update();
                }else if($scope.tab == 2){
                    $scope.thisMonth.earningsTotal=0;
                    $scope.lastMonth.earningsTotal=0;
                    $scope.twoMonthsAgo.earningsTotal=0;
                    monthViz3.data(0).update();
                    monthViz3.label(function () {
                        var monViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return monViz3Prince;
                    }).update();
                }
            }else if(stats.length == 1){
                if($scope.tab == 0){
                    $scope.today.earningsTotal=stats[0]['total_income'];
                    $scope.yesterday.earningsTotal=0;
                    $scope.twoDaysAgo.earningsTotal=0;
                    dayViz3.data(0).update();
                    dayViz3.label(function () {
                        var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.today.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return dayViz3Prince;
                    }).update();
                }else if($scope.tab == 1){
                    $scope.thisWeek.earningsTotal=stats[0]['total_income'];
                    $scope.lastWeek.earningsTotal=0;
                    $scope.twoWeeksAgo.earningsTotal=0;
                    weekViz3.data(0).update();
                    weekViz3.label(function () {
                        var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisWeek.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return weekViz3Prince;
                    }).update();
                }else if($scope.tab == 2){
                    $scope.thisMonth.earningsTotal=stats[0]['total_income'];
                    $scope.lastMonth.earningsTotal=0;
                    $scope.twoMonthsAgo.earningsTotal=0;
                    monthViz3.data(0).update();
                    monthViz3.label(function () {
                        var monViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisMonth.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return monViz3Prince;
                    }).update();
                }
            }else if(stats.length == 2){
                if($scope.tab == 0){
                    $scope.today.earningsTotal=stats[0]['total_income'];
                    $scope.yesterday.earningsTotal=stats[1]['total_income'];
                    $scope.twoDaysAgo.earningsTotal=0;
                    dayViz3.data(0).update();
                    dayViz3.label(function () {
                        var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.today.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return dayViz3Prince;
                    }).update();
                }else if($scope.tab == 1){
                    $scope.thisWeek.earningsTotal=stats[0]['total_income'];
                    $scope.lastWeek.earningsTotal=stats[1]['total_income'];
                    $scope.twoWeeksAgo.earningsTotal=0;
                    weekViz3.data(0).update();
                    weekViz3.label(function () {
                        var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisWeek.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return weekViz3Prince;
                    }).update();
                }else if($scope.tab == 2){
                    $scope.thisMonth.earningsTotal=stats[0]['total_income'];
                    $scope.lastMonth.earningsTotal=stats[1]['total_income'];
                    $scope.twoMonthsAgo.earningsTotal=0;
                    monthViz3.data(0).update();
                    monthViz3.label(function () {
                        var monViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisMonth.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return monViz3Prince;
                    }).update();
                }
            }else if(stats.length == 3){
                if($scope.tab == 0){
                    $scope.today.earningsTotal=stats[0]['total_income'];
                    $scope.yesterday.earningsTotal=stats[1]['total_income'];
                    $scope.twoDaysAgo.earningsTotal=stats[2]['total_income'];
                    dayViz3.data(0).update();
                    dayViz3.label(function () {
                        var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.today.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return dayViz3Prince;
                    }).update();
                }else if($scope.tab == 1){
                    $scope.thisWeek.earningsTotal=stats[0]['total_income'];
                    $scope.lastWeek.earningsTotal=stats[1]['total_income'];
                    $scope.twoWeeksAgo.earningsTotal=stats[2]['total_income'];
                    weekViz3.data(0).update();
                    weekViz3.label(function () {
                        var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisWeek.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return weekViz3Prince;
                    }).update();
                }else if($scope.tab == 2){
                    $scope.thisMonth.earningsTotal=stats[0]['total_income'];
                    $scope.lastMonth.earningsTotal=stats[1]['total_income'];
                    $scope.twoMonthsAgo.earningsTotal=stats[2]['total_income'];
                    monthViz3.data(0).update();
                    monthViz3.label(function () {
                        var monViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisMonth.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return monViz3Prince;
                    }).update();
                }
            }
        }

    });

/**
 * Created by jian on 17-8-8.
 */
angular.module('KARL.Controllers')
    .controller('salesRepCtrl', function ($scope, $uibModal, MessageBox, CompanyBS, $timeout) {
        $scope.currentPage = 1;
        $scope.pagePerCount = 12;
        $scope.countrys = angular.copy(countrysCode);
        $scope.searchResult = [];
        $scope.showSearchResult = false;
        $scope.input = {
            searchText: undefined
        };
        $scope.addSalesRep = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/sales-rep-add.html',
                controller: 'salesRepAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadSales();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        loadSales();
        function loadSales() {
            MessageBox.showLoading();
            CompanyBS.getSalesRep($scope.currentPage, $scope.pagePerCount, $scope.input.searchText).then(function (result) {
                MessageBox.hideLoading();
                if (result.data.result.sales.length === 0 && $scope.input.searchText) {
                    $timeout(function () {
                        $scope.showSearchResult = true;
                    }, 0)
                } else {
                    $scope.showSearchResult = false;
                }
                $scope.pageTotalItems = result.data.result.total;
                $scope.salesRepList = result.data.result.sales;
                for (var i = 0; i < $scope.salesRepList.length; i++) {
                    for (var k = 0; k < $scope.countrys.length; k++) {
                        if ($scope.salesRepList[i].country === $scope.countrys[k].countryCode) {
                            $scope.salesRepList[i].countryName = $scope.countrys[k].name
                        }
                    }
                }
                console.log(result);
                $timeout(function () {
                    $(function () {
                        $(".card-more").click(function () {
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function () {
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function () {
                            $(this).parents(".gen-panel").fadeOut(200);
                        });
                    });
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("drivers.jsGet_driver_fail"), "error");
                }
            })
        }

        $scope.onPageChange = function () {
            loadSales();
        };

        $scope.onEditButtonClick = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/sales-rep-edit.html',
                controller: 'salesRepEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            saleId: id
                        },
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadSales();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            CompanyBS.deleteSalesRepInfo(id).then(function (result) {
                MessageBox.hideLoading();
                loadSales()
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    MessageBox.toast(T.T("comment.jsDelete_fail"), "error");
                }
            })
        };

        $scope.$watch('input.searchText', function (word) {
                $scope.currentPage = 1;
                loadSales();
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

    });

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
/**
 * Created by wangyaunzhi on 16/12/27.
 */
angular.module('KARL.Controllers')
    .controller('StatsDateSelectModel', function ($log, $scope, $state, $stateParams,$filter,$timeout,T) {
        var preDayCell;
        var lastDaySelect;
        var lastWeekDaysSelect = [];
        var preWeekDayCells = [];
        $scope.selectDate = angular.copy($stateParams.data.currentDate);
        $scope.type = 0;//0:day,1:week,2:month
        $scope.allMonths = [];

        var init = function () {
            $scope.events = [];
            $scope.eventSources = [$scope.events];
            $scope.type = $stateParams.data.type;
            $timeout(function () {
                var date = $stateParams.data.currentDate;
                if($scope.type == 0){
                    lastDaySelect = $filter('date')(date, "yyyy-MM-dd");
                    angular.element(".fc-" + lastDaySelect).css('background-color', 'red');
                    preDayCell = angular.element(".fc-" + lastDaySelect);
                }else if ($scope.type == 1){
                    var firstDateOfWeek = angular.copy(date);
                    if(firstDateOfWeek.getDay() == 0){
                        firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - 7);
                    }else {
                        firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - firstDateOfWeek.getDay());
                    }
                    lastWeekDaysSelect.push($filter('date')(firstDateOfWeek, "yyyy-MM-dd"));
                    for (var i=0;i<6;i++){
                        var day = new Date(firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1));
                        lastWeekDaysSelect.push($filter('date')(day, "yyyy-MM-dd"));
                    }
                    lastWeekDaysSelect.forEach(function (perDay) {
                        angular.element(".fc-" + perDay).css('background-color', 'red');
                        angular.element(".fc-" + perDay).css('border-radius', '0');
                        preWeekDayCells.push(angular.element(".fc-" + perDay));
                    });
                }else {
                    var year = $scope.selectDate.getFullYear();
                    var month = $scope.selectDate.getMonth()+1;
                    for (var i=1;i<13;i++){
                        var monthData = {};
                        var firstdate = year + '/' + i + '/01';
                        if(month == i){
                            monthData.date = $scope.selectDate;
                            monthData.isSelected = true;
                        }else {
                            monthData.date = new Date(firstdate);
                            monthData.isSelected = false;
                        }
                        $scope.allMonths.push(monthData);
                    }
                }
            },0);
        };

        var dayHasBeenChanged = function (date) {
            $scope.selectDate = date;

            $timeout(function () {
                if($scope.type == 0){
                    lastDaySelect = $filter('date')($scope.selectDate, "yyyy-MM-dd");
                    angular.element(preDayCell).css('background-color', '');
                    angular.element(".fc-" + lastDaySelect).css('background-color', 'red');
                    preDayCell = angular.element(".fc-" + lastDaySelect);
                }else {
                    preWeekDayCells.forEach(function (dayCell) {
                        angular.element(dayCell).css('background-color', '');
                        angular.element(dayCell).css('border-radius', '100%');
                    });
                    lastWeekDaysSelect = [];
                    preWeekDayCells = [];
                    var firstDateOfWeek = angular.copy($scope.selectDate);
                    if(firstDateOfWeek.getDay() == 0){
                        firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - 7);
                    }else {
                        firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - firstDateOfWeek.getDay());
                    }
                    lastWeekDaysSelect.push($filter('date')(firstDateOfWeek, "yyyy-MM-dd"));
                    for (var i=0;i<6;i++){
                        var day = new Date(firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1));
                        lastWeekDaysSelect.push($filter('date')(day, "yyyy-MM-dd"));
                    }
                    lastWeekDaysSelect.forEach(function (perDay) {
                        angular.element(".fc-" + perDay).css('background-color', 'red');
                        angular.element(".fc-" + perDay).css('border-radius', '0');
                        preWeekDayCells.push(angular.element(".fc-" + perDay));
                    });
                }
            },0);
        };

        $scope.onDayClick = function (date, jsEvent, view) {
            var longDay = Date.parse(date._d);
            longDay = longDay + date._d.getTimezoneOffset() * 60 * 1000;
            dayHasBeenChanged(new Date(longDay));
        };

        $scope.statsDate = {
            calendar: {
                contentHeight: 350,
                editable: false,
                timeFormat: ' ',
                firstDay:1,
                timezone: 'local',
                lang: T.T('fullCalendar_lang'),
                defaultDate: $stateParams.data.currentDate,
                header: {
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                },
                dayClick: $scope.onDayClick,
                nextChange: function (date) {
                    dayHasBeenChanged(date._d);
                }
            }
        };

        $scope.changeYear = function (add) {
            var year;
            if(add){
                year = $scope.selectDate.getFullYear()+1
            }else {
                year = $scope.selectDate.getFullYear()-1;
            }
            $scope.allMonths = [];
            for (var i=1;i<13;i++){
                var monthData = {};
                var firstdate = year + '/' + i + '/01';
                monthData.date = new Date(firstdate);
                if(i == 1){
                    monthData.isSelected = true;
                    $scope.selectDate = monthData.date;
                }else {
                    monthData.isSelected = false;
                }
                $scope.allMonths.push(monthData);
            }
        };

        $scope.changeMonth = function (selectIndex) {
            $scope.allMonths.forEach(function (monthData,index) {
                if(selectIndex == index){
                    monthData.isSelected = true;
                    $scope.selectDate = monthData.date;
                }else {
                    monthData.isSelected = false;
                }
            })
        };

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onSaveButtonClick = function () {
            if ($stateParams.event.done) {
                $stateParams.event.done(angular.copy($scope.selectDate));
            }
        };

        init();
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('StatsCtrl', function ($scope, $state, StatisticsBS, $timeout, $filter, $uibModal, MessageBox,T,$rootScope) {
        if(!$rootScope.loginUser){
            return;
        }
        var dayDiv1, dayDiv2, dayDiv3;
        var weekDiv1, weekDiv2, weekDiv3;
        var monthDiv1, monthDiv2, monthDiv3;
        var allDivs = [];

        var dayViz1, dayViz2, dayViz3;
        var weekViz1, weekViz2, weekViz3;
        var monthViz1, monthViz2, monthViz3;
        var allVizs = [];

        var selectDate;
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();
        $scope.today = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.yesterday = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.twoDaysAgo = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };

        $scope.thisWeek = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.lastWeek = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.twoWeeksAgo = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };

        $scope.thisMonth = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.lastMonth = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.twoMonthsAgo = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };

        $scope.onTabChanged = function (tabIndex) {
            $scope.tab = tabIndex;
            perGetStats();
        };

        $scope.onSelectDateButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/stats-date-select-model.html',
                controller: 'StatsDateSelectModel',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            currentDate: selectDate,
                            type: $scope.tab
                        },
                        event: {
                            done: function (date) {
                                modalInstance.dismiss();
                                selectDate = date;
                                perGetStats();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        var perGetStats = function () {
            if ($scope.tab == 0) {
                $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'statsDate');
            } else if ($scope.tab == 1) {
                var firstDateOfWeek = angular.copy(selectDate);
                if (firstDateOfWeek.getDay() == 0) {
                    firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - 7);
                } else {
                    firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - firstDateOfWeek.getDay());
                }

                var lastDateOfWeek = angular.copy(selectDate);
                if (lastDateOfWeek.getDay() == 0) {
                    lastDateOfWeek.setDate(lastDateOfWeek.getDate());
                } else {
                    lastDateOfWeek.setDate(lastDateOfWeek.getDate() + 7 - lastDateOfWeek.getDay());
                }

                if (firstDateOfWeek.getMonth() == lastDateOfWeek.getMonth()) {
                    $scope.dateString = $filter('dateFormatter')(firstDateOfWeek.getTime(), 'statsShortFirstDate') +
                        '-' +
                        $filter('dateFormatter')(lastDateOfWeek.getTime(), 'statsShortLastDate');
                } else {
                    $scope.dateString = $filter('dateFormatter')(firstDateOfWeek.getTime(), 'shortDate') +
                        '-' +
                        $filter('dateFormatter')(lastDateOfWeek.getTime(), 'statsLongLastDate') ;
                }
            } else {
                $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'MMM,YYYY');
            }
            getStats();
        };

        var getStats = function () {
            MessageBox.showLoading();
            StatisticsBS.statistics(selectDate, $scope.tab).then(function (result) {
                MessageBox.hideLoading();
                $timeout(function () {
                    //整理数据
                    if ($scope.tab == 0) {
                        if (result.data.length > 0) {
                            //订单完成数
                            $scope.today.completedBooksTotal = result.data[0].completed_bookings;
                            if (result.data[0].total_bookings > 0 && result.data[0].completed_bookings > 0) {
                                dayViz1.data(parseInt(result.data[0].completed_bookings / result.data[0].total_bookings * 100)).update();
                                dayViz1.label(function () {
                                    return d3.format(".0f")(result.data[0].completed_bookings);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(result.data[0].completed_bookings),false,false,$scope.companyCurrency);
                                }).update();
                            } else {
                                dayViz1.data(0).update();
                                dayViz1.label(function () {
                                    return d3.format(".0f")(0);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                                }).update();
                            }
                            //准时率
                            if (result.data[0].completed_bookings > 0 && result.data[0].on_time > 0) {
                                $scope.today.driverOntimeRate = result.data[0].on_time / result.data[0].completed_bookings * 100;
                                dayViz2.data(parseInt(result.data[0].on_time / result.data[0].completed_bookings * 100)).update();
                            } else {
                                $scope.today.driverOntimeRate = 0;
                                dayViz2.data(0).update();
                            }
                            //收入
                            $scope.today.earningsTotal = result.data[0].total_income;
                            if (result.data[0].total_est_amount > 0 && result.data[0].total_income > 0) {
                                dayViz3.data(parseInt(result.data[0].total_income / result.data[0].total_est_amount * 100)).update();
                                dayViz3.label(function () {
                                    var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(result.data[0].total_income),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(result.data[0].total_income);
                                    return dayViz3Prince;
                                }).update();
                            } else {
                                dayViz3.data(0).update();
                                dayViz3.label(function () {
                                    var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(0);
                                    return dayViz3Prince;
                                }).update();
                            }
                        } else {
                            $scope.today.completedBooksTotal = 0;
                            dayViz1.data(0).update();
                            dayViz1.label(function () {
                                return d3.format(".0f")(0);
                                // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                            }).update();
                            $scope.today.driverOntimeRate = 0;
                            dayViz2.data(0).update();
                            $scope.today.earningsTotal = 0;
                            dayViz3.data(0).update();
                            dayViz3.label(function () {
                                // return d3.format("$,.2f")(0);
                                return $filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency) ;
                            }).update();
                        }

                        if (result.data.length > 1) {
                            //订单完成数
                            $scope.yesterday.completedBooksTotal = result.data[1].completed_bookings;
                            //准时率
                            if (result.data[1].completed_bookings > 0 && result.data[1].on_time > 0) {
                                $scope.yesterday.driverOntimeRate = result.data[1].on_time / result.data[1].completed_bookings * 100;
                            } else {
                                $scope.yesterday.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.yesterday.earningsTotal = result.data[1].total_income;
                        } else {
                            $scope.yesterday.completedBooksTotal = 0;
                            $scope.yesterday.driverOntimeRate = 0;
                            $scope.yesterday.earningsTotal = 0;
                        }

                        if (result.data.length > 2) {
                            //订单完成数
                            $scope.twoDaysAgo.completedBooksTotal = result.data[2].completed_bookings;
                            //准时率
                            if (result.data[2].completed_bookings > 0 && result.data[2].on_time > 0) {
                                $scope.twoDaysAgo.driverOntimeRate = result.data[2].on_time / result.data[2].completed_bookings * 100;
                            } else {
                                $scope.twoDaysAgo.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.twoDaysAgo.earningsTotal = result.data[2].total_income;
                        } else {
                            $scope.twoDaysAgo.completedBooksTotal = 0;
                            $scope.twoDaysAgo.driverOntimeRate = 0;
                            $scope.twoDaysAgo.earningsTotal = 0;
                        }
                    } else if ($scope.tab == 1) {
                        if (result.data.length > 0) {
                            //订单完成数
                            $scope.thisWeek.completedBooksTotal = result.data[0].completed_bookings;
                            if (result.data[0].total_bookings > 0 && result.data[0].completed_bookings > 0) {
                                weekViz1.data(parseInt(result.data[0].completed_bookings / result.data[0].total_bookings * 100)).update();
                                weekViz1.label(function () {
                                    return d3.format(".0f")(result.data[0].completed_bookings);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(result.data[0].completed_bookings),false,false,$scope.companyCurrency);
                                }).update();
                            } else {
                                weekViz1.data(0).update();
                                weekViz1.label(function () {
                                    return d3.format(".0f")(0);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                                }).update();
                            }
                            //准时率
                            if (result.data[0].completed_bookings > 0 && result.data[0].on_time > 0) {
                                $scope.thisWeek.driverOntimeRate = result.data[0].on_time / result.data[0].completed_bookings * 100;
                                weekViz2.data(parseInt(result.data[0].on_time / result.data[0].completed_bookings * 100)).update();
                            } else {
                                $scope.thisWeek.driverOntimeRate = 0;
                                weekViz2.data(0).update();
                            }
                            //收入
                            $scope.thisWeek.earningsTotal = result.data[0].total_income;
                            if (result.data[0].total_est_amount > 0 && result.data[0].total_income > 0) {
                                weekViz3.data(parseInt(result.data[0].total_income / result.data[0].total_est_amount * 100)).update();
                                weekViz3.label(function () {
                                    var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(result.data[0].total_income),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(result.data[0].total_income);
                                    return weekViz3Prince;
                                }).update();
                            } else {
                                weekViz3.data(0).update();
                                weekViz3.label(function () {
                                    var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(0);
                                    return weekViz3Prince;
                                }).update();
                            }
                        } else {
                            $scope.thisWeek.completedBooksTotal = 0;
                            weekViz1.data(0).update();
                            weekViz1.label(function () {
                                return d3.format(".0f")(0);
                                // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                            }).update();
                            $scope.thisWeek.driverOntimeRate = 0;
                            weekViz2.data(0).update();
                            $scope.thisWeek.earningsTotal = 0;
                            weekViz3.data(0).update();
                            weekViz3.label(function () {
                                var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                return weekViz3Prince;
                            }).update();
                        }

                        if (result.data.length > 1) {
                            //订单完成数
                            $scope.lastWeek.completedBooksTotal = result.data[1].completed_bookings;
                            //准时率
                            if (result.data[1].completed_bookings > 0 && result.data[1].on_time > 0) {
                                $scope.lastWeek.driverOntimeRate = result.data[1].on_time / result.data[1].completed_bookings * 100;
                            } else {
                                $scope.lastWeek.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.lastWeek.earningsTotal = result.data[1].total_income;
                        } else {
                            $scope.lastWeek.completedBooksTotal = 0;
                            $scope.lastWeek.driverOntimeRate = 0;
                            $scope.lastWeek.earningsTotal = 0;
                        }

                        if (result.data.length > 2) {
                            //订单完成数
                            $scope.twoWeeksAgo.completedBooksTotal = result.data[2].completed_bookings;
                            //准时率
                            if (result.data[2].completed_bookings > 0 && result.data[2].on_time > 0) {
                                $scope.twoWeeksAgo.driverOntimeRate = result.data[2].on_time / result.data[2].completed_bookings * 100;
                            } else {
                                $scope.twoWeeksAgo.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.twoWeeksAgo.earningsTotal = result.data[2].total_income;
                        } else {
                            $scope.twoWeeksAgo.completedBooksTotal = 0;
                            $scope.twoWeeksAgo.driverOntimeRate = 0;
                            $scope.twoWeeksAgo.earningsTotal = 0;
                        }
                    } else {
                        if (result.data.length > 0) {
                            //订单完成数
                            $scope.thisMonth.completedBooksTotal = result.data[0].completed_bookings;
                            if (result.data[0].total_bookings > 0 && result.data[0].completed_bookings > 0) {
                                monthViz1.data(parseInt(result.data[0].completed_bookings / result.data[0].total_bookings * 100)).update();
                                monthViz1.label(function () {
                                    return d3.format(".0f")(result.data[0].completed_bookings);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(result.data[0].completed_bookings),false,false,$scope.companyCurrency);
                                }).update();
                            } else {
                                monthViz1.data(0).update();
                                monthViz1.label(function () {
                                    return d3.format(".0f")(0);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                                }).update();
                            }
                            //准时率
                            if (result.data[0].completed_bookings > 0 && result.data[0].on_time > 0) {
                                $scope.thisMonth.driverOntimeRate = result.data[0].on_time / result.data[0].completed_bookings * 100;
                                monthViz2.data(result.data[0].on_time / result.data[0].completed_bookings * 100).update();
                            } else {
                                $scope.thisMonth.driverOntimeRate = 0;
                                monthViz2.data(0).update();
                            }
                            //收入
                            $scope.thisMonth.earningsTotal = result.data[0].total_income;
                            if (result.data[0].total_est_amount > 0 && result.data[0].total_income > 0) {
                                monthViz3.data(parseInt(result.data[0].total_income / result.data[0].total_est_amount * 100)).update();
                                monthViz3.label(function () {
                                    var monthViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(result.data[0].total_income),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(result.data[0].total_income);
                                    return monthViz3Prince;
                                }).update();
                            } else {
                                monthViz3.data(0).update();
                                monthViz3.label(function () {
                                    var monthViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(0);
                                    return monthViz3Prince;
                                }).update();
                            }
                        } else {
                            $scope.thisMonth.completedBooksTotal = 0;
                            monthViz1.data(0).update();
                            monthViz1.label(function () {
                                return d3.format(".0f")(0);
                                // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                            }).update();
                            $scope.thisMonth.driverOntimeRate = 0;
                            monthViz2.data(0).update();
                            $scope.thisMonth.earningsTotal = 0;
                            monthViz3.data(0).update();
                            monthViz3.label(function () {
                                var monthViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                // return d3.format("$,.2f")(0);
                                return monthViz3Prince;
                            }).update();
                        }

                        if (result.data.length > 1) {
                            //订单完成数
                            $scope.lastMonth.completedBooksTotal = result.data[1].completed_bookings;
                            //准时率
                            if (result.data[1].completed_bookings > 0 && result.data[1].on_time > 0) {
                                $scope.lastMonth.driverOntimeRate = result.data[1].on_time / result.data[1].completed_bookings * 100;
                            } else {
                                $scope.lastMonth.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.lastMonth.earningsTotal = result.data[1].total_income;
                        } else {
                            $scope.lastMonth.completedBooksTotal = 0;
                            $scope.lastMonth.driverOntimeRate = 0;
                            $scope.lastMonth.earningsTotal = 0;
                        }

                        if (result.data.length > 2) {
                            //订单完成数
                            $scope.twoMonthsAgo.completedBooksTotal = result.data[2].completed_bookings;
                            //准时率
                            if (result.data[2].completed_bookings > 0 && result.data[2].on_time > 0) {
                                $scope.twoMonthsAgo.driverOntimeRate = result.data[2].on_time / result.data[2].completed_bookings * 100;
                            } else {
                                $scope.twoMonthsAgo.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.twoMonthsAgo.earningsTotal = result.data[2].total_income;
                        } else {
                            $scope.twoMonthsAgo.completedBooksTotal = 0;
                            $scope.twoMonthsAgo.driverOntimeRate = 0;
                            $scope.twoMonthsAgo.earningsTotal = 0;
                        }
                    }
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("stats.jsGet_statistics_fail"), "error");
                }
            });
        };

        var init = function () {
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            selectDate = now;

            $scope.tab = 0;
            $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'statsDate');
            getStats();

            $timeout(function () {
                // /************* 左右滑动tab ************* /
                $(".nav-slider li").click(function (e) {
                    var mywhidth = $(this).width();
                    $(this).addClass("act-tab1");
                    $(this).siblings().removeClass("act-tab1");

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
                // /************* / 左右滑动tab ************* /

                initRadialProgress();
            }, 0);
        };

        var initRadialProgress = function () {
            //Here we use the three div tags from our HTML page to load the three components into.
            dayDiv1 = d3.select("#day-stats-1");
            dayDiv2 = d3.select("#day-stats-2");
            dayDiv3 = d3.select("#day-stats-3");

            weekDiv1 = d3.select("#week-stats-1");
            weekDiv2 = d3.select("#week-stats-2");
            weekDiv3 = d3.select("#week-stats-3");

            monthDiv1 = d3.select("#month-stats-1");
            monthDiv2 = d3.select("#month-stats-2");
            monthDiv3 = d3.select("#month-stats-3");

            allDivs = [dayDiv1, dayDiv2, dayDiv3, weekDiv1, weekDiv2, weekDiv3, monthDiv1, monthDiv2, monthDiv3];

            //Here we create our three radial progress components by passing in a parent DOM element (our div tags)
            dayViz1 = vizuly.component.radial_progress(document.getElementById("day-stats-1"));
            dayViz2 = vizuly.component.radial_progress(document.getElementById("day-stats-2"));
            dayViz3 = vizuly.component.radial_progress(document.getElementById("day-stats-3"));

            weekViz1 = vizuly.component.radial_progress(document.getElementById("week-stats-1"));
            weekViz2 = vizuly.component.radial_progress(document.getElementById("week-stats-2"));
            weekViz3 = vizuly.component.radial_progress(document.getElementById("week-stats-3"));

            monthViz1 = vizuly.component.radial_progress(document.getElementById("month-stats-1"));
            monthViz2 = vizuly.component.radial_progress(document.getElementById("month-stats-2"));
            monthViz3 = vizuly.component.radial_progress(document.getElementById("month-stats-3"));

            allVizs = [dayViz1, dayViz2, dayViz3, weekViz1, weekViz2, weekViz3, monthViz1, monthViz2, monthViz3];

            //Here we set some bases line properties for all three components.
            allVizs.forEach(function (viz, i) {
                viz.data(0)                                // Current value
                    .min(0)                                 // min value
                    .max(100)                               // max value
                    .capRadius(1)                           // Sets the curvature of the ends of the arc.
                    .startAngle(270)                        // Angle where progress bar starts
                    .endAngle(270)                          // Angle where the progress bar stops
                    .arcThickness(.08);                     // The thickness of the arc (ratio of radius)
                if (i == 0 || i == 3 || i == 6) {
                    viz.label(function (d) {                // The 'label' property allows us to use a dynamic function for labeling.
                        return d3.format(".0f")(d);
                    });
                } else if (i == 1 || i == 4 || i == 7) {
                    viz.label(function (d) {
                        return d3.format(".0f")(d) + "%";
                    });
                } else {
                    viz.label(function (d) {
                        // return d3.format("$,.2f")(d);
                        return $filter('princeTranslateFilters')(d3.format(".2f")(d),false,false,$scope.companyCurrency)
                    });
                }

                vizuly.theme.radial_progress(viz).skin('White');
            });

            allDivs.forEach(function (div, i) {
                div.style("width", 250 + 'px');
                allVizs[i].width(250).height(250).radius(250 / 2).update();
            });
        };

        init();
    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('StripeAcctCtrl', function ($log, $scope, $rootScope, $state, $stateParams, $timeout, $filter,MessageBox, CarBS,T) {
        if($rootScope.loginUser == null){
            $state.go('login');
            return;
        }
        var clientId = ApiServer.stripeClientId;
        $scope.link = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id="+clientId+"&scope=read_write;"

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };
    });

/**
 * Created by jian on 17-10-11.
 */
angular.module('KARL.Controllers')
.controller('superGodViewCtrl',function ($scope, $state, MessageBox,T,$rootScope, $timeout, $filter,$uibModal) {
    var selectDate;
    $scope.onSelectDateButtonClick = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/dashboard/stats-date-select-model.html',
            controller: 'StatsDateSelectModel',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                $stateParams: {
                    data: {
                        currentDate: selectDate,
                        type: $scope.tab
                    },
                    event: {
                        done: function (date) {
                            modalInstance.dismiss();
                            selectDate = date;
                            console.log(selectDate)
                            perGetStats()
                        },
                        cancel: function () {
                            modalInstance.dismiss();
                        }
                    }
                }
            }
        });
    };

    var perGetStats = function () {
        if ($scope.tab == 0) {
            $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'statsDate');
        } else if ($scope.tab == 1) {
            var firstDateOfWeek = angular.copy(selectDate);
            if (firstDateOfWeek.getDay() == 0) {
                firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - 7);
            } else {
                firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - firstDateOfWeek.getDay());
            }

            var lastDateOfWeek = angular.copy(selectDate);
            if (lastDateOfWeek.getDay() == 0) {
                lastDateOfWeek.setDate(lastDateOfWeek.getDate());
            } else {
                lastDateOfWeek.setDate(lastDateOfWeek.getDate() + 7 - lastDateOfWeek.getDay());
            }

            if (firstDateOfWeek.getMonth() == lastDateOfWeek.getMonth()) {
                $scope.dateString = $filter('dateFormatter')(firstDateOfWeek.getTime(), 'statsShortFirstDate') +
                    '-' +
                    $filter('dateFormatter')(lastDateOfWeek.getTime(), 'statsShortLastDate');
            } else {
                $scope.dateString = $filter('dateFormatter')(firstDateOfWeek.getTime(), 'shortDate') +
                    '-' +
                    $filter('dateFormatter')(lastDateOfWeek.getTime(), 'statsLongLastDate') ;
            }
        } else {
            $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'MMM,YYYY');
        }
    };


    $scope.onTabChanged = function (tabIndex) {
        $scope.tab = tabIndex;
        perGetStats();
    };

    var init = function () {
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        selectDate = now;

        $scope.tab = 0;
        $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'statsDate');


        $timeout(function () {
            // /************* 左右滑动tab ************* /
            $(".nav-slider li").click(function (e) {
                var mywhidth = $(this).width();
                $(this).addClass("act-tab1");
                $(this).siblings().removeClass("act-tab1");

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
            // /************* / 左右滑动tab ************* /

        }, 0);
    };

    init()
});
/**
 * Created by wangyaunzhi on 16/11/9.
 */
angular.module('KARL.Controllers')
    .controller('SuperRateRuleCtrl', function (SuperRateBS, $log, $scope, $rootScope, $state, MessageBox, $uibModal) {
        if ($rootScope.loginUser == null) {
            $state.go('login');
            return;
        }
        $scope.rateRule = [
            {
                invl_start: 0,
                invl_end: 99999999,
                rate: 0.2
            }
        ];

        var init = function () {
            SuperRateBS.getRateRules().then(
                function (result) {
                    $scope.rateRule = result.data;
                    if($scope.rateRule.length === 0 ){
                        $scope.rateRule = [
                            {
                                invl_start: 0,
                                invl_end: 99999999,
                                rate: 0.2
                            }
                        ];
                    }
                }, function () {
                }
            );
        };
        init();


        $scope.addRule = function () {
            var index = $scope.rateRule.length;
            var last = $scope.rateRule[index - 1];
            $scope.rateRule[index-1] = {
                invl_start: 0,
                invl_end: 0,
                rate: 0
            };
            $scope.rateRule[index] = last;

        };

        $scope.removeZone = function (index) {
            $scope.rateRule.splice(index, 1);
        };

        $scope.saveAndUpdate  = function () {
            MessageBox.showLoading();
            if($scope.rateRule.length ===1){
                $scope.rateRule[0].invl_start = 0;
                $scope.rateRule[0].invl_end = 99999999;
            }else{
                var startMark = [];
                for(var i=$scope.rateRule.length-1;i>0; i--){
                    if(startMark.indexOf($scope.rateRule[i-1].invl_end)!==-1){
                        MessageBox.toast("please check the number.","error");
                        return ;
                    }
                    startMark[i]=$scope.rateRule[i-1].invl_end;
                    $scope.rateRule[i].invl_start = $scope.rateRule[i-1].invl_end;
                }
            }
            SuperRateBS.updateRateRules(JSON.stringify($scope.rateRule)).then(
                function (result) {
                    $scope.rateRule = result.data;
                    MessageBox.hideLoading();
                }, function () {
                    MessageBox.hideLoading();
                }
            );
        }

    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('superStatsCtrl', function ($scope, $state, StatisticsBS, $timeout, $filter, $uibModal, MessageBox, CompanyBS,T) {
        var dayDiv1, dayDiv2, dayDiv3;
        var weekDiv1, weekDiv2, weekDiv3;
        var monthDiv1, monthDiv2, monthDiv3;
        var allDivs = [];

        var dayViz1, dayViz2, dayViz3;
        var weekViz1, weekViz2, weekViz3;
        var monthViz1, monthViz2, monthViz3;
        var allVizs = [];

        var selectDate;

        $scope.showStatistics=false;

        $scope.today = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.yesterday = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.twoDaysAgo = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };

        $scope.thisWeek = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.lastWeek = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.twoWeeksAgo = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };

        $scope.thisMonth = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.lastMonth = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.twoMonthsAgo = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };

        $scope.onTabChanged = function (tabIndex) {
            $scope.tab = tabIndex;
            perGetStats();
        };

        $scope.onSelectDateButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/stats-date-select-model.html',
                controller: 'StatsDateSelectModel',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            currentDate: selectDate,
                            type: $scope.tab
                        },
                        event: {
                            done: function (date) {
                                modalInstance.dismiss();
                                selectDate = date;
                                perGetStats();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        var perGetStats = function () {
            if ($scope.tab == 0) {
                $scope.dateString = $filter('date')(selectDate.getTime(), 'MMM.dd,yyyy');
            } else if ($scope.tab == 1) {
                var firstDateOfWeek = angular.copy(selectDate);
                if (firstDateOfWeek.getDay() == 0) {
                    firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - 7);
                } else {
                    firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - firstDateOfWeek.getDay());
                }

                var lastDateOfWeek = angular.copy(selectDate);
                if (lastDateOfWeek.getDay() == 0) {
                    lastDateOfWeek.setDate(lastDateOfWeek.getDate());
                } else {
                    lastDateOfWeek.setDate(lastDateOfWeek.getDate() + 7 - lastDateOfWeek.getDay());
                }

                if (firstDateOfWeek.getMonth() == lastDateOfWeek.getMonth()) {
                    $scope.dateString = $filter('date')(firstDateOfWeek.getTime(), 'MMM') +
                        ' ' +
                        $filter('date')(firstDateOfWeek.getTime(), 'dd') +
                        '-' +
                        $filter('date')(lastDateOfWeek.getTime(), 'dd') +
                        ',' +
                        $filter('date')(lastDateOfWeek.getTime(), 'yyyy');
                } else {
                    $scope.dateString = $filter('date')(firstDateOfWeek.getTime(), 'MMM') +
                        ' ' +
                        $filter('date')(firstDateOfWeek.getTime(), 'dd') +
                        '-' +
                        $filter('date')(lastDateOfWeek.getTime(), 'MMM') +
                        ' ' +
                        $filter('date')(lastDateOfWeek.getTime(), 'dd') +
                        ',' +
                        $filter('date')(lastDateOfWeek.getTime(), 'yyyy');
                }
            } else {
                $scope.dateString = $filter('date')(selectDate.getTime(), 'MMMM,yyyy');
            }
            getStats();
        };

        var getStats = function () {
            console.log($scope.companyId);
            MessageBox.showLoading();
            CompanyBS.companyStatistics(selectDate, $scope.tab,$scope.companyId).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                $scope.showStatistics=true;
                $timeout(function () {
                    //整理数据
                    if ($scope.tab == 0) {
                        if (result.data.length > 0) {
                            //订单完成数
                            $scope.today.completedBooksTotal = result.data[0].completed_bookings;
                            if (result.data[0].total_bookings > 0 && result.data[0].completed_bookings > 0) {
                                dayViz1.data(parseInt(result.data[0].completed_bookings / result.data[0].total_bookings * 100)).update();
                                dayViz1.label(function () {
                                    return d3.format(".0f")(result.data[0].completed_bookings);
                                }).update();
                            } else {
                                dayViz1.data(0).update();
                                dayViz1.label(function () {
                                    return d3.format(".0f")(0);
                                }).update();
                            }
                            //准时率
                            if (result.data[0].completed_bookings > 0 && result.data[0].on_time > 0) {
                                $scope.today.driverOntimeRate = result.data[0].on_time / result.data[0].completed_bookings * 100;
                                dayViz2.data(parseInt(result.data[0].on_time / result.data[0].completed_bookings * 100)).update();
                            } else {
                                $scope.today.driverOntimeRate = 0;
                                dayViz2.data(0).update();
                            }
                            //收入
                            $scope.today.earningsTotal = result.data[0].total_income;
                            if (result.data[0].total_est_amount > 0 && result.data[0].total_income > 0) {
                                dayViz3.data(parseInt(result.data[0].total_income / result.data[0].total_est_amount * 100)).update();
                                dayViz3.label(function () {
                                    return d3.format("$,.2f")(result.data[0].total_income);
                                }).update();
                            } else {
                                dayViz3.data(0).update();
                                dayViz3.label(function () {
                                    return d3.format("$,.2f")(0);
                                }).update();
                            }
                        } else {
                            $scope.today.completedBooksTotal = 0;
                            dayViz1.data(0).update();
                            dayViz1.label(function () {
                                return d3.format(".0f")(0);
                            }).update();
                            $scope.today.driverOntimeRate = 0;
                            dayViz2.data(0).update();
                            $scope.today.earningsTotal = 0;
                            dayViz3.data(0).update();
                            dayViz3.label(function () {
                                return d3.format("$,.2f")(0);
                            }).update();
                        }

                        if (result.data.length > 1) {
                            //订单完成数
                            $scope.yesterday.completedBooksTotal = result.data[1].completed_bookings;
                            //准时率
                            if (result.data[1].completed_bookings > 0 && result.data[1].on_time > 0) {
                                $scope.yesterday.driverOntimeRate = result.data[1].on_time / result.data[1].completed_bookings * 100;
                            } else {
                                $scope.yesterday.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.yesterday.earningsTotal = result.data[1].total_income;
                        } else {
                            $scope.yesterday.completedBooksTotal = 0;
                            $scope.yesterday.driverOntimeRate = 0;
                            $scope.yesterday.earningsTotal = 0;
                        }

                        if (result.data.length > 2) {
                            //订单完成数
                            $scope.twoDaysAgo.completedBooksTotal = result.data[2].completed_bookings;
                            //准时率
                            if (result.data[2].completed_bookings > 0 && result.data[2].on_time > 0) {
                                $scope.twoDaysAgo.driverOntimeRate = result.data[2].on_time / result.data[2].completed_bookings * 100;
                            } else {
                                $scope.twoDaysAgo.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.twoDaysAgo.earningsTotal = result.data[2].total_income;
                        } else {
                            $scope.twoDaysAgo.completedBooksTotal = 0;
                            $scope.twoDaysAgo.driverOntimeRate = 0;
                            $scope.twoDaysAgo.earningsTotal = 0;
                        }
                    } else if ($scope.tab == 1) {
                        if (result.data.length > 0) {
                            //订单完成数
                            $scope.thisWeek.completedBooksTotal = result.data[0].completed_bookings;
                            if (result.data[0].total_bookings > 0 && result.data[0].completed_bookings > 0) {
                                weekViz1.data(parseInt(result.data[0].completed_bookings / result.data[0].total_bookings * 100)).update();
                                weekViz1.label(function () {
                                    return d3.format(".0f")(result.data[0].completed_bookings);
                                }).update();
                            } else {
                                weekViz1.data(0).update();
                                weekViz1.label(function () {
                                    return d3.format(".0f")(0);
                                }).update();
                            }
                            //准时率
                            if (result.data[0].completed_bookings > 0 && result.data[0].on_time > 0) {
                                $scope.thisWeek.driverOntimeRate = result.data[0].on_time / result.data[0].completed_bookings * 100;
                                weekViz2.data(parseInt(result.data[0].on_time / result.data[0].completed_bookings * 100)).update();
                            } else {
                                $scope.thisWeek.driverOntimeRate = 0;
                                weekViz2.data(0).update();
                            }
                            //收入
                            $scope.thisWeek.earningsTotal = result.data[0].total_income;
                            if (result.data[0].total_est_amount > 0 && result.data[0].total_income > 0) {
                                weekViz3.data(parseInt(result.data[0].total_income / result.data[0].total_est_amount * 100)).update();
                                weekViz3.label(function () {
                                    return d3.format("$,.2f")(result.data[0].total_income);
                                }).update();
                            } else {
                                weekViz3.data(0).update();
                                weekViz3.label(function () {
                                    return d3.format("$,.2f")(0);
                                }).update();
                            }
                        } else {
                            $scope.thisWeek.completedBooksTotal = 0;
                            weekViz1.data(0).update();
                            weekViz1.label(function () {
                                return d3.format(".0f")(0);
                            }).update();
                            $scope.thisWeek.driverOntimeRate = 0;
                            weekViz2.data(0).update();
                            $scope.thisWeek.earningsTotal = 0;
                            weekViz3.data(0).update();
                            weekViz3.label(function () {
                                return d3.format("$,.2f")(0);
                            }).update();
                        }

                        if (result.data.length > 1) {
                            //订单完成数
                            $scope.lastWeek.completedBooksTotal = result.data[1].completed_bookings;
                            //准时率
                            if (result.data[1].completed_bookings > 0 && result.data[1].on_time > 0) {
                                $scope.lastWeek.driverOntimeRate = result.data[1].on_time / result.data[1].completed_bookings * 100;
                            } else {
                                $scope.lastWeek.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.lastWeek.earningsTotal = result.data[1].total_income;
                        } else {
                            $scope.lastWeek.completedBooksTotal = 0;
                            $scope.lastWeek.driverOntimeRate = 0;
                            $scope.lastWeek.earningsTotal = 0;
                        }

                        if (result.data.length > 2) {
                            //订单完成数
                            $scope.twoWeeksAgo.completedBooksTotal = result.data[2].completed_bookings;
                            //准时率
                            if (result.data[2].completed_bookings > 0 && result.data[2].on_time > 0) {
                                $scope.twoWeeksAgo.driverOntimeRate = result.data[2].on_time / result.data[2].completed_bookings * 100;
                            } else {
                                $scope.twoWeeksAgo.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.twoWeeksAgo.earningsTotal = result.data[2].total_income;
                        } else {
                            $scope.twoWeeksAgo.completedBooksTotal = 0;
                            $scope.twoWeeksAgo.driverOntimeRate = 0;
                            $scope.twoWeeksAgo.earningsTotal = 0;
                        }
                    } else {
                        if (result.data.length > 0) {
                            //订单完成数
                            $scope.thisMonth.completedBooksTotal = result.data[0].completed_bookings;
                            if (result.data[0].total_bookings > 0 && result.data[0].completed_bookings > 0) {
                                monthViz1.data(parseInt(result.data[0].completed_bookings / result.data[0].total_bookings * 100)).update();
                                monthViz1.label(function () {
                                    return d3.format(".0f")(result.data[0].completed_bookings);
                                }).update();
                            } else {
                                monthViz1.data(0).update();
                                monthViz1.label(function () {
                                    return d3.format(".0f")(0);
                                }).update();
                            }
                            //准时率
                            if (result.data[0].completed_bookings > 0 && result.data[0].on_time > 0) {
                                $scope.thisMonth.driverOntimeRate = result.data[0].on_time / result.data[0].completed_bookings * 100;
                                monthViz2.data(result.data[0].on_time / result.data[0].completed_bookings * 100).update();
                            } else {
                                $scope.thisMonth.driverOntimeRate = 0;
                                monthViz2.data(0).update();
                            }
                            //收入
                            $scope.thisMonth.earningsTotal = result.data[0].total_income;
                            if (result.data[0].total_est_amount > 0 && result.data[0].total_income > 0) {
                                monthViz3.data(parseInt(result.data[0].total_income / result.data[0].total_est_amount * 100)).update();
                                monthViz3.label(function () {
                                    return d3.format("$,.2f")(result.data[0].total_income);
                                }).update();
                            } else {
                                monthViz3.data(0).update();
                                monthViz3.label(function () {
                                    return d3.format("$,.2f")(0);
                                }).update();
                            }
                        } else {
                            $scope.thisMonth.completedBooksTotal = 0;
                            monthViz1.data(0).update();
                            monthViz1.label(function () {
                                return d3.format(".0f")(0);
                            }).update();
                            $scope.thisMonth.driverOntimeRate = 0;
                            monthViz2.data(0).update();
                            $scope.thisMonth.earningsTotal = 0;
                            monthViz3.data(0).update();
                            monthViz3.label(function () {
                                return d3.format("$,.2f")(0);
                            }).update();
                        }

                        if (result.data.length > 1) {
                            //订单完成数
                            $scope.lastMonth.completedBooksTotal = result.data[1].completed_bookings;
                            //准时率
                            if (result.data[1].completed_bookings > 0 && result.data[1].on_time > 0) {
                                $scope.lastMonth.driverOntimeRate = result.data[1].on_time / result.data[1].completed_bookings * 100;
                            } else {
                                $scope.lastMonth.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.lastMonth.earningsTotal = result.data[1].total_income;
                        } else {
                            $scope.lastMonth.completedBooksTotal = 0;
                            $scope.lastMonth.driverOntimeRate = 0;
                            $scope.lastMonth.earningsTotal = 0;
                        }

                        if (result.data.length > 2) {
                            //订单完成数
                            $scope.twoMonthsAgo.completedBooksTotal = result.data[2].completed_bookings;
                            //准时率
                            if (result.data[2].completed_bookings > 0 && result.data[2].on_time > 0) {
                                $scope.twoMonthsAgo.driverOntimeRate = result.data[2].on_time / result.data[2].completed_bookings * 100;
                            } else {
                                $scope.twoMonthsAgo.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.twoMonthsAgo.earningsTotal = result.data[2].total_income;
                        } else {
                            $scope.twoMonthsAgo.completedBooksTotal = 0;
                            $scope.twoMonthsAgo.driverOntimeRate = 0;
                            $scope.twoMonthsAgo.earningsTotal = 0;
                        }
                    }
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                $scope.showStatistics=false;
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("stats.jsGet_statistics_fail"), "error");
                }
            });
        };

        var init = function () {
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            selectDate = now;
            $scope.companyId=0
            $scope.tab = 0;
            $scope.dateString = $filter('date')(selectDate.getTime(), 'MMM.dd,yyyy');
            getStats();

            $timeout(function () {
                // /************* 左右滑动tab ************* /
                $(".nav-slider li").click(function (e) {
                    var mywhidth = $(this).width();
                    $(this).addClass("act-tab1");
                    $(this).siblings().removeClass("act-tab1");

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
                // /************* / 左右滑动tab ************* /

                initRadialProgress();
            }, 0);
        };

        var initRadialProgress = function () {
            //Here we use the three div tags from our HTML page to load the three components into.
            dayDiv1 = d3.select("#day-stats-1");
            dayDiv2 = d3.select("#day-stats-2");
            dayDiv3 = d3.select("#day-stats-3");

            weekDiv1 = d3.select("#week-stats-1");
            weekDiv2 = d3.select("#week-stats-2");
            weekDiv3 = d3.select("#week-stats-3");

            monthDiv1 = d3.select("#month-stats-1");
            monthDiv2 = d3.select("#month-stats-2");
            monthDiv3 = d3.select("#month-stats-3");

            allDivs = [dayDiv1, dayDiv2, dayDiv3, weekDiv1, weekDiv2, weekDiv3, monthDiv1, monthDiv2, monthDiv3];

            //Here we create our three radial progress components by passing in a parent DOM element (our div tags)
            dayViz1 = vizuly.component.radial_progress(document.getElementById("day-stats-1"));
            dayViz2 = vizuly.component.radial_progress(document.getElementById("day-stats-2"));
            dayViz3 = vizuly.component.radial_progress(document.getElementById("day-stats-3"));

            weekViz1 = vizuly.component.radial_progress(document.getElementById("week-stats-1"));
            weekViz2 = vizuly.component.radial_progress(document.getElementById("week-stats-2"));
            weekViz3 = vizuly.component.radial_progress(document.getElementById("week-stats-3"));

            monthViz1 = vizuly.component.radial_progress(document.getElementById("month-stats-1"));
            monthViz2 = vizuly.component.radial_progress(document.getElementById("month-stats-2"));
            monthViz3 = vizuly.component.radial_progress(document.getElementById("month-stats-3"));

            allVizs = [dayViz1, dayViz2, dayViz3, weekViz1, weekViz2, weekViz3, monthViz1, monthViz2, monthViz3];

            //Here we set some bases line properties for all three components.
            allVizs.forEach(function (viz, i) {
                viz.data(0)                                // Current value
                    .min(0)                                 // min value
                    .max(100)                               // max value
                    .capRadius(1)                           // Sets the curvature of the ends of the arc.
                    .startAngle(270)                        // Angle where progress bar starts
                    .endAngle(270)                          // Angle where the progress bar stops
                    .arcThickness(.08);                     // The thickness of the arc (ratio of radius)
                if (i == 0 || i == 3 || i == 6) {
                    viz.label(function (d) {                // The 'label' property allows us to use a dynamic function for labeling.
                        return d3.format(".0f")(d);
                    });
                } else if (i == 1 || i == 4 || i == 7) {
                    viz.label(function (d) {
                        return d3.format(".0f")(d) + "%";
                    });
                } else {
                    viz.label(function (d) {
                        return d3.format("$,.2f")(d);
                    });
                }

                vizuly.theme.radial_progress(viz).skin('White');
            });

            allDivs.forEach(function (div, i) {
                div.style("width", 250 + 'px');
                allVizs[i].width(250).height(250).radius(250 / 2).update();
            });
        };

        init();

        $scope.getCompaniesList = function (key) {
            return CompanyBS.getCompaniesList(key).then(function (result) {
                console.log(result);
                return result.data;
            }, function (error) {
                $log.error(error);
                if (error.treated) {
                }
                else {
                }
            });
        };

        $scope.onSearchSelect = function (item) {
            $scope.companyId=item.company_id;
            $scope.showStatistics=false;
            perGetStats();
        }
    });

/**
 * Created by jian on 16-11-9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleCategoryAddCtrl', function ($scope, $state, $stateParams, $rootScope, $timeout, SuperCarBS, MessageBox,T) {
        console.log($stateParams);


        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $timeout(function () {
            angular.element('#addCategoryForm').validator();
        }, 0);

        $scope.onCreateOption = function () {
            console.log($scope.CategoryName);
            console.log($scope.CategoryDescribe);
            MessageBox.showLoading();
            SuperCarBS.addCarCategoriesOnPlatform($scope.CategoryName, $scope.CategoryDescribe).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                MessageBox.toast(T.T('super_vehicle_category_add.jsAdd_success'), "Success");
                $stateParams.event.cancel();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T('super_vehicle_category_add.jsGet_detail_fail'), "error");
                }
            })


        }
    });
/**
 * Created by jian on 16-11-9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleCategoryEditCtrl',function ($scope, $state,$stateParams,$timeout, SuperCarBS,MessageBox,T) {
        console.log($stateParams.data);
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $timeout(function () {
            angular.element('#editCategoryForm').validator();
        }, 0);

        var init=function () {
            $scope.CategoryName=$stateParams.data.name;
            $scope.CategoryDescribe=$stateParams.data.description;
        };
        init();
        
        $scope.onEditOption=function () {
            MessageBox.showLoading();
            SuperCarBS.modifyCategories($scope.CategoryName,$scope.CategoryDescribe,$stateParams.data.id).then(
                function (result) {
                    MessageBox.hideLoading();
                    console.log(result);
                    MessageBox.toast(T.T("super_vehicle_category_edit.jsEdit_success"), "Success");
                    $stateParams.event.cancel();
                    // MessageBox.alertView('Edit Successful !')
                },function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T('super_vehicle_category_add.jsGet_detail_fail'), "error");
                    }
                }
            )
        }
        
    });


/**
 * Created by wangyaunzhi on 16/11/9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleCategoryCtrl', function (SuperCarBS, $log, $scope, $rootScope, $state, MessageBox, $uibModal) {
        if ($rootScope.loginUser == null) {
            $state.go('login');
            return;
        }

        var init = function () {
            $scope.categorySearch = '';
            SuperCarBS.loadCarCategoriesOnPlatform().then(
                function (result) {
                    $scope.categories = result.data;
                }, function () {
                }
            );
        };
        init();


        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-category-add.html',
                controller: 'SuperVehicleCategoryAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                // loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                                init();
                            }
                        }
                    }

                }
            });
        };


        $scope.onEditButtonClick = function (index) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-category-edit.html',
                controller: 'SuperVehicleCategoryEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: $scope.categories[index],
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                                init();
                            }
                        }
                    }

                }
            });
        };

        // $scope.onSearchButtonClick = function () {
        //     if (!$scope.categorySearch) {
        //         MessageBox.toast("Please enter the content", "error");
        //         return;
        //     } else {
        //         var arr = [];
        //         for (var i = 0; i < $scope.categories.length; i++) {
        //             if ($scope.categorySearch.toString().toLowerCase() == $scope.categories[i].name.toString().toLowerCase()) {
        //                 arr.push($scope.categories[i]);
        //             }
        //         }
        //         $scope.categories.length = 0;
        //         for (var k = 0; k < arr.length; k++) {
        //             $scope.categories.push(arr[k])
        //         }
        //     }
        // }

    });

/**
 * Created by jian on 16-11-9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleMakerAddCtrl', function ($scope, $state, $stateParams, $rootScope, $timeout, SuperCarBS, MessageBox,T) {
        console.log($stateParams);

        $scope.makerName="";
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $timeout(function () {
            angular.element('#addCategoryForm').validator();
        }, 0);

        $scope.onCreateCarMaker = function () {
            MessageBox.showLoading();
            SuperCarBS.addCarBrandsOnPlatform($scope.makerName).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                MessageBox.toast(T.T("super_vehicle_category_add.jsAdd_success"), "Success");
                $stateParams.event.cancel();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("super_vehicle_category_add.jsGet_detail_fail"), "error");
                }
            })


        }
    });
/**
 * Created by jian on 16-11-9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleMakerEditCtrl',function ($scope, $state,$stateParams,$timeout, SuperCarBS,MessageBox,T) {
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $timeout(function () {
            angular.element('#editCategoryForm').validator();
        }, 0);

        var init=function () {
            $scope.carMaker=$stateParams.data;
            console.log("make is ",$scope.carMaker);
        };
        init();
        
        $scope.onEditVehicle=function () {
            MessageBox.showLoading();
            SuperCarBS.editCarBrandsOnPlatform($scope.carMaker.id,$scope.carMaker.name).then(
                function (result) {
                    MessageBox.hideLoading();
                    console.log(result);
                    MessageBox.toast(T.T("super_vehicle_category_edit.jsEdit_success"), "Success");
                    $stateParams.event.cancel();
                },function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("super_vehicle_category_add.jsGet_detail_fail"), "error");
                    }
                }
            )
        }
        
    });


/**
 * Created by wangyaunzhi on 16/11/9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleMakerCtrl', function (SuperCarBS, $log, $scope, $rootScope, $state, MessageBox, $uibModal) {
        if ($rootScope.loginUser == null) {
            $state.go('login');
            return;
        }

        var init = function () {
            SuperCarBS.loadCarBrandsOnPlatform().then(
                function (result) {
                    $scope.maker = result.data;
                }, function () {
                }
            );
        };
        init();


        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-maker-add.html',
                controller: 'SuperVehicleMakerAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                // loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                                init();
                            }
                        }
                    }

                }
            });
        };


        $scope.onEditButtonClick = function (index) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-maker-edit.html',
                controller: 'SuperVehicleMakerEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: $scope.maker[index],
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                                init();
                            }
                        }
                    }

                }
            });
        };
    });

/**
 * Created by liqihai on 16/9/6.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleModelsAddCtrl',function ($scope ,$stateParams, $rootScope,$state,MessageBox,SuperCarBS) {
        $scope.maxBags = 4;
        $scope.maxSeats = 4;
        $scope.carModelName = null;
        $scope.brandId = null;
        $scope.categoryId = null;

        $scope.categories = null;
        $scope.brands = null;
        var init = function () {
            SuperCarBS.loadCarCategoriesOnPlatform().then(
                function (result) {
                    $scope.categories = result.data;
                    $scope.categoryId = $scope.categories[0].id;
                },function () {

                }
            );
            SuperCarBS.loadCarBrandsOnPlatform().then(
                function (result) {
                    $scope.brands = result.data;
                    $scope.brandId = $scope.brands[0].id;
                },function () {

                }
            );
        };
        init();


        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };


        $scope.save = function () {
            SuperCarBS.addCarModelOnPlatform(
                $scope.brandId,
                $scope.categoryId,
                $scope.maxBags,
                $scope.maxSeats,
                $scope.carModelName
            ).then(
                function () {
                    if ($stateParams.event.addSuccess) {
                        $stateParams.event.addSuccess();
                    }
                },
                function () {

                }
            );
        }
    });
/**
 * Created by liqihai on 16/9/6.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleModelsEditCtrl',function ($scope ,$stateParams, $rootScope,$state,MessageBox,SuperCarBS) {
        $scope.carModel = $stateParams.data.carModel;
        $scope.maxBags = $scope.carModel.bags_max;
        $scope.maxSeats = $scope.carModel.seats_max;
        $scope.carModelName = $scope.carModel.model_name;
        $scope.brandId = $scope.carModel.brand_id;
        $scope.categoryId = $scope.carModel.category_id;

        $scope.categories = null;
        $scope.brands = null;
        var init = function () {
            SuperCarBS.loadCarCategoriesOnPlatform().then(
                function (result) {
                    $scope.categories = result.data;
                },function () {

                }
            );
            SuperCarBS.loadCarBrandsOnPlatform().then(
                function (result) {
                    $scope.brands = result.data;
                },function () {

                }
            );
        };
        init();


        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };


        $scope.save = function () {
            SuperCarBS.saveCarModelOnPlatform(
                $scope.carModel.id,
                $scope.brandId,
                $scope.categoryId,
                $scope.maxBags,
                $scope.maxSeats,
                $scope.carModelName
            ).then(
                function () {
                    if ($stateParams.event.editSuccess) {
                        $stateParams.event.editSuccess();
                    }
                },
                function () {

                }
            );
        }
    });
/**
 * Created by liqihai on 16/9/6.
 */
angular.module('KARL.Controllers')
    .controller('SuperListModelsImageListCtrl',function ($scope ,$stateParams, $rootScope,$state,MessageBox,SuperCarBS,T) {
        $scope.carModel = $stateParams.data.carModel;
        $scope.carModelsImages = $scope.carModel.imgs;
        console.log('car model images is ',$scope.carModelsImages);
        $scope.imageId = null;
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.replaceImage = function (file,imageId) {
            MessageBox.showLoading();
            SuperCarBS.replaceCarModelImage(imageId,file)
                .then(function (result) {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("super_vehicle_models_image_list.jsUpload_image_success"));
                    $scope.carModelsImages = result.data;
                    $stateParams.data.carModel.imgs = result.data;
                },function () {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("super_vehicle_models_image_list.jsUpload_image_fail"),'error');
                });
        };
        $scope.addNewCarImage = function (file,event) {
            MessageBox.showLoading();
            SuperCarBS.addCarModelImage($scope.carModel.id,file)
                .then(function (result) {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("super_vehicle_models_image_list.jsUpload_image_success"));
                    console.log('result image is ',result.data);
                    $scope.carModelsImages = result.data;
                    $stateParams.data.carModel.imgs = result.data;
                },function () {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("super_vehicle_models_image_list.jsUpload_image_fail"),'error');
                });
        }
    });
/**
 * Created by liqihai on 16/9/6.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleModelsCtrl',function ($scope , $rootScope,$state,MessageBox,SuperCarBS,$uibModal) {

        $scope.carModelList = null;
        var loadCarModels = function () {
            SuperCarBS.loadCarModelsOnPlatform()
                .then(function (result) {
                    $scope.carModelList = result.data;
                },function () {

                });
        };

        loadCarModels();

        $scope.onEditButtonClick = function (model) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-models-edit.html',
                controller: 'SuperVehicleModelsEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            carModel: model
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadCarModels();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };


        $scope.addNewCarModel = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-models-add.html',
                controller: 'SuperVehicleModelsAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadCarModels();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.showCarImage = function (model) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-models-image-list.html',
                controller: 'SuperListModelsImageListCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            carModel: model
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadCarModels();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('VehicleAddCtrl', function ($log, $scope, $state, $stateParams, $timeout, MessageBox, CarBS, CarCategoryBS, CarBrandBS, CarModelBS, T) {

        $timeout(function () {
            angular.element('#vehicleForm').validator();
        }, 0);
        $scope.file = undefined;
        $scope.fileType = 0;
        $scope.preTime = 0;
        $scope.maxPassengers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        $scope.selectedMaxPassengers = 0;
        $scope.maxBags = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.selectedMaxBags = 0;
        $scope.routineData=[
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000'
        ];

        $scope.uploadImage = function (files, $event) {
            if (!files) {
                return
            }
            $scope.bigImageUrl = files.$ngfBlobUrl;
            $scope.smallImageUrl = $scope.selectedCarModel.model_imgs[0].img;
            $scope.fileType = 1;
            $scope.file = files;
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.vehicleForm.$dirty) {
                MessageBox.confirm(T.T("alertTitle.warning"),T.T("vehicle_add.jsExit_warning"), function (isConfirm) {
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

        var commit = function (img, la) {
            CarBS.addNewVehicle($scope.selectedCarModel.id, $scope.licensePlate, $scope.preTime, $scope.description, $scope.routineData,
                $scope.fileType, img, $scope.year, $scope.color, $scope.selectedMaxPassengers, $scope.selectedMaxBags)
                .then(function (result) {
                    MessageBox.hideLoading();
                    la.stop();
                    $stateParams.event.addSuccess();
                }, function (error) {
                    MessageBox.hideLoading();
                    la.stop();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("vehicle_add.jsAdd_fail"), "error");
                    }
                });
        };
        var checkRouteHasNoWork = function () {
            var check = true;
            angular.forEach($scope.routineData, function (routine) {
                check = check && routine.match("^(1){48}");
            });
            return check;
        };

        var emptyRouteDataWarming = function (img, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("vehicle_add.jsVehicle_routine_not_work"), function (isConfirm) {
                if (isConfirm) {
                    commit(img, la);
                } else {
                    la.stop();
                }
            });
        };

        $scope.onSubmitButtonClick = function (valid, $event) {
            if (!valid) {
                return;
            }else if(!$scope.selectedCarModel){
                MessageBox.toast(T.T('vehicle_add.jsSelect_Car'), "error");
                return;
            }
            if (!$scope.description) {
                $scope.description = '';
            }
            var img;
            if ($scope.fileType == 1) {
                img = $scope.file;
            } else {
                img = $scope.selectedCarModelImageId;
            }
            MessageBox.showLoading();
            var la = Ladda.create($event.target);
            la.start();
            if (checkRouteHasNoWork()) {
                emptyRouteDataWarming(img, la);
            } else {
                commit(img, la);
            }
        };


        $scope.onCarBrandChange = function () {
            loadCarModel();
        };

        $scope.onChangeImageType = function () {
            if (!$scope.file) {
                return;
            }
            if ($scope.fileType == 0) {
                $scope.bigImageUrl = $scope.file.$ngfBlobUrl;
                $scope.smallImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                $scope.fileType = 1;
            } else {
                $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                $scope.smallImageUrl = $scope.file.$ngfBlobUrl;
                $scope.fileType = 0;
            }
        };

        // 加载汽车品牌
        var loadCarBrand = function () {
            CarBrandBS.getAll().then(function (result) {
                $scope.carBrands = result.data;
                // $scope.selectedCarBrand = result.data[0].id;
                // 加载车系
                // loadCarModel();
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicle_add.jsGet_make_fail"), "error");
                }
                $scope.onCancelButtonClick();
            });
        };

        // 加载车型
        var loadCarModel = function () {
            CarModelBS.getAll($scope.selectedCarBrand).then(function (result) {
                if (result.data.length < 1) {
                    $scope.carModels = [];
                    return
                }
                $scope.carModels = result.data;
                $scope.selectedCarModel = result.data[0];
                $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                $scope.selectedCarModelImageId = $scope.selectedCarModel.model_imgs[0].image_id;
                $scope.selectedMaxPassengers = $scope.selectedCarModel.seats_max;
                $scope.selectedMaxBags = $scope.selectedCarModel.bags_max;

                if ($scope.file) {
                    $scope.smallImageUrl = $scope.file.$ngfBlobUrl;
                }
                $scope.fileType = 0;
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicle_add.jsGet_model_fail"), "error");
                }
                if (!$scope.carModels) {
                    $scope.onCancelButtonClick();
                }
            });
        };

        $scope.onCarModelChange = function () {
            $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
            $scope.selectedCarModelImageId = $scope.selectedCarModel.model_imgs[0].image_id;
            if ($scope.file) {
                $scope.smallImageUrl = $scope.file.$ngfBlobUrl;
            }
            $scope.selectedMaxPassengers = $scope.selectedCarModel.seats_max;
            $scope.selectedMaxBags = $scope.selectedCarModel.bags_max;
            $scope.fileType = 0;
        };

        // Init
        loadCarBrand();

    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event editSuccess
 */
angular.module('KARL.Controllers')
    .controller('VehicleEditCtrl', function ($log, $scope, $state, $stateParams, $timeout, MessageBox, CarBS, CarCategoryBS, CarBrandBS, CarModelBS, EventBS, T) {

        $scope.file = undefined;
        $scope.fileType = 0;
        $scope.tab = 0;
        $scope.preTime = 30;
        $scope.maxPassengers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        $scope.maxBags = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.showAddEvent = false;
        $scope.carEvents = [];
        $scope.langStyle=localStorage.getItem('lang');
        // Init
        var carId = $stateParams.data.carId;
        var car;


        var enableDatePicker = function () {
            $timeout(function () {
                //init datetimepicker
                var date = new Date();
                date.setHours(date.getHours() + 1);
                var mon;
                var dat;
                var hour;
                if ((date.getMonth() + 1) >= 10) {
                    mon = date.getMonth() + 1;
                }
                else {
                    mon = "0" + (date.getMonth() + 1);
                }
                if (date.getDate() >= 10) {
                    dat = date.getDate();
                }
                else {
                    dat = "0" + date.getDate();
                }
                if (date.getHours() >= 10) {
                    hour = date.getHours();
                }
                else {
                    hour = "0" + date.getHours();
                }

                $scope.datetimeStart = new Date(date.getFullYear() + '/' + mon + '/' + dat + ' ' + hour + ':00');
                $('.datetimeStart').datetimepicker({
                    inline: true,
                    stepping:15,
                    minDate:$scope.datetimeStart,
                    sideBySide:true,
                    locale:T.T('fullCalendar_lang')
                });


                var date2 = new Date();
                date2.setHours(date2.getHours() + 2);
                var mon1;
                var dat1;
                var hour1;
                if ((date2.getMonth() + 1) >= 10) {
                    mon1 = date2.getMonth() + 1;
                }
                else {
                    mon1 = "0" + (date2.getMonth() + 1);
                }
                if (date2.getDate() >= 10) {
                    dat1 = date2.getDate();
                }
                else {
                    dat1 = "0" + date2.getDate();
                }
                if (date2.getHours() >= 10) {
                    hour1 = date2.getHours();
                }
                else {
                    hour1 = "0" + date2.getHours();
                }

                $scope.datetimeEnd = new Date(date2.getFullYear() + '/' + mon + '/' + dat1 + ' ' + hour1 + ':00');
                $('.datetimeEnd').datetimepicker({
                    inline: true,
                    stepping:15,
                    minDate:$scope.datetimeEnd,
                    sideBySide:true,
                    locale:T.T('fullCalendar_lang')
                });
            }, 0);
        };

        $timeout(function () {
            // /************* 左右滑动tab ************* /
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
            // /************* / 左右滑动tab ************* /
        }, 0);

        // Event
        $scope.onTabChanged = function (tabIndex) {
            $scope.tab = tabIndex;
        };

        $scope.uploadImage = function (files, $event) {
            if (!files) {
                return
            }
            $scope.bigImageUrl = files.$ngfBlobUrl;
            $scope.smallImageUrl = $scope.selectedCarModel.model_imgs[0].img;
            $scope.fileType = 1;
            $scope.file = files;
        };

        $scope.onChangeImageType = function () {
            if (!$scope.smallImageUrl) {
                return;
            }
            if ($scope.fileType == 0) {
                if ($scope.file) {
                    $scope.bigImageUrl = $scope.file.$ngfBlobUrl;
                } else {
                    $scope.bigImageUrl = $scope.smallImageUrl = car.img;
                }
                $scope.smallImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                $scope.fileType = 1;
            } else {
                $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                if ($scope.file) {
                    $scope.smallImageUrl = $scope.file.$ngfBlobUrl;
                } else {
                    $scope.smallImageUrl = car.img;
                }
                $scope.fileType = 0;
            }
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.vehicleForm.$dirty) {
                MessageBox.confirm(T.T("alertTitle.warning"),T.T("vehicle_add.jsExit_warning"), function (isConfirm) {
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

        var save = function (img, la) {
            CarBS.updateVehicleInfo(carId, $scope.selectedCarModel.id, $scope.licensePlate, $scope.preTime, $scope.description, $scope.routineData, $scope.fileType, img, $scope.year, $scope.color, $scope.selectedMaxPassengers, $scope.selectedMaxBags)
                .then(function (result) {
                    MessageBox.hideLoading();
                    la.stop();
                    if ($stateParams.event.editSuccess) {
                        $stateParams.event.editSuccess();
                    }
                }, function (error) {
                    MessageBox.hideLoading();
                    la.stop();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("vehicle_edit.jsUpdate_fail"), "error");
                    }
                });
        };


        var checkRouteHasNoWork = function () {
            var check = true;
            angular.forEach($scope.routineData, function (routine) {
                check = check && routine.match("^(1){48}");
            });
            return check;
        };

        var emptyRouteDataWarming = function (img, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("vehicle_add.jsVehicle_routine_not_work"), function (isConfirm) {
                if (isConfirm) {
                    save(img, la);
                } else {
                    la.stop();
                }
            });
        };

        $scope.onSubmitButtonClick = function (valid, $event) {
            if (!valid) {
                return;
            }
            if (!$scope.description) {
                $scope.description = '';
            }
            var img;
            if ($scope.fileType == 1) {
                if ($scope.file) {
                    img = $scope.file;
                } else {
                    img = -1;
                }
            } else {
                img = $scope.selectedCarModelImageId;
            }

            MessageBox.showLoading();
            var la = Ladda.create($event.target);
            la.start();
            if (checkRouteHasNoWork()) {
                emptyRouteDataWarming(img, la);
            } else {
                save(img, la);
            }
        };

        $scope.onCarBrandChange = function () {
            loadCarModel(true);
        };

        // Function
        // 加载汽车品牌
        var loadCarBrand = function () {
            CarBrandBS.getAll().then(function (result) {
                $scope.carBrands = result.data;
                angular.forEach(result.data, function (item, index, array) {
                    if (item.name == car.brand) {
                        $scope.selectedCarBrand = item.id;
                    }
                });
                // 加载车系
                loadCarModel(false);
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicle_add.jsGet_make_fail"), "error");
                }
                $scope.onCancelButtonClick();
            });
        };

        // 加载车型
        var loadCarModel = function (isLoc) {
            CarModelBS.getAll($scope.selectedCarBrand).then(function (result) {
                $scope.carModels = result.data;
                //是否加载本地数据
                if (isLoc) {
                    if (result.data.length < 1) {
                        return;
                    }
                    $scope.selectedCarModel = result.data[0];
                    $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                    $scope.selectedCarModelImageId = $scope.selectedCarModel.model_imgs[0].image_id;
                    if ($scope.file) {
                        $scope.smallImageUrl = $scope.file.$ngfBlobUrl;
                    } else {
                        if (car.type == 1) {
                            $scope.smallImageUrl = car.img;
                        }
                    }
                    $scope.fileType = 0;
                } else {
                    angular.forEach(result.data, function (item, index, array) {
                        if (item.name == car.model) {
                            $scope.selectedCarModel = item;
                            if ($scope.fileType == 0) {
                                $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                            } else {
                                $scope.smallImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                            }
                            $scope.selectedCarModelImageId = $scope.selectedCarModel.model_imgs[0].image_id;
                        }
                    });
                }
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicle_add.jsGet_model_fail"), "error");
                }
            });
        };

        $scope.onCarModelChange = function () {
            $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
            $scope.selectedCarModelImageId = $scope.selectedCarModel.model_imgs[0].image_id;
            if ($scope.file) {
                $scope.smallImageUrl = $scope.file.$ngfBlobUrl;
            } else {
                if (car.type == 1) {
                    $scope.smallImageUrl = car.img;
                }
            }
            $scope.fileType = 0;
        };

        $scope.onShowAddEventClick = function () {
            $scope.showAddEvent = !$scope.showAddEvent;
            if ($scope.showAddEvent) {
                $scope.event = {"content": "", "repeatType": "", "repeatDays": ""};
                enableDatePicker();
            }
        };

        $scope.onAddEventDone = function () {
            if(!$scope.event.content){
                return;
            }
            if ($scope.event.content.length == 0) {
                return;
            }

            $scope.datetimeStart = $('.datetimeStart').data("DateTimePicker").date()._d;
            var startTime = parseInt(($scope.datetimeStart.valueOf() + "").substr(0, 10));
            $scope.datetimeEnd = $('.datetimeEnd').data("DateTimePicker").date()._d;
            var endTime = parseInt(($scope.datetimeEnd.valueOf() + "").substr(0, 10));
            if (endTime <= startTime) {
                MessageBox.toast(T.T("vehicle_edit.jsEnd_Time_After_Start_Time"));
                return;
            }

            if ($scope.event.repeatType == 1) {
                $scope.event.repeatDays = new Date($scope.datetimeStart).getDay() + 1;
            } else {
                $scope.event.repeatDays = "";
            }
            MessageBox.showLoading();

            EventBS.addToCalendar(
                parseInt(($scope.datetimeStart.valueOf() + "").substr(0, 10)),
                parseInt(($scope.datetimeEnd.valueOf() + "").substr(0, 10)),
                $scope.event.content,
                2,
                carId,
                $scope.event.repeatType,
                $scope.event.repeatDays
                )
                .then(function (result) {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("vehicle_edit.jsAdd_event_success"), "success");
                    $scope.showAddEvent = false;
                    loadEventData();
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("vehicle_add.jsAdd_event_fail"), "error");
                    }
                });
        };

        $scope.onDeleteEventClick = function (event, repeat) {
            EventBS.deleteCalendarEvent(event.id, repeat).then(function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("vehicle_edit.jsDelete_success"), "Success");
                loadEventData();
            }, function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("vehicle_edit.jsDelete_fail"), "error");
            });
        };

        $scope.onAddEventCancel = function () {
            $scope.showAddEvent = false;
        };

        $scope.onGotoRates = function () {
            $scope.onCancelButtonClick();
            $state.go('rates');
        };

        $scope.onGotoDrivers = function () {
            $scope.onCancelButtonClick();
            $state.go('drivers');
        };

        var loadData = function () {
            MessageBox.showLoading();
            CarBS.getDetailFromCurrentUser(carId).then(function (result) {
                MessageBox.hideLoading();
                car = result.data;
                $scope.licensePlate = car.license_plate;
                $scope.description = car.description;
                $scope.fileType = car.type;
                $scope.year = car.year;
                $scope.color = car.color;
                $scope.preTime = car.pre_time;
                $scope.selectedMaxPassengers = car.seats_max;
                $scope.selectedMaxBags = car.bags_max;
                $scope.routineData = JSON.parse(car.routine);
                if ($scope.fileType == 1) {
                    $scope.bigImageUrl = car.img;
                }
                loadCarBrand();
                loadEventData();
                $timeout(function () {
                    angular.element('#vehicleForm').validator();
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("ClientEdit.jsGet_detail_fail"), "error");
                }
                $scope.onCancelButtonClick();
            });
        };

        var loadEventData = function () {
            MessageBox.showLoading();
            EventBS.eventsFromCurrentCompany(2, $stateParams.data.carId).then(function (result) {
                MessageBox.hideLoading();
                $scope.carEvents = result.data;

                $timeout(function () {
                    $(".eventcard-more").click(function () {
                        $(this).next().fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".gen").click(function () {
                        $(this).parent().find(".gen-panel").fadeIn(200);
                    });
                    $(".gen-cancel").click(function () {
                        $(this).parents(".gen-panel").fadeOut(200);
                    });
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {

                }
                else {
                    MessageBox.toast(T.T("vehicle_edit.jsGet_list_fail"), "error");
                }
            });
        };
        loadData();
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('VehiclesCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $timeout, $filter,MessageBox, CarBS,T) {
        if(!$rootScope.loginUser){
            return;
        }

        $scope.showSearchResult = false;

        //添加车辆
        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/vehicle-add.html',
                controller: 'VehicleAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onEditButtonClick = function (carId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/vehicle-edit.html',
                controller: 'VehicleEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            carId: carId
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            CarBS.deleteFromCurrentUser(id).then(function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("vehicles.jsDelete_success"), "Success");
                loadData();
            }, function (error) {
                console.log(error);
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == "3605")
                    {
                        $timeout(function ()
                        {
                            MessageBox.confirm(T.T('alertTitle.warning'), $filter('translate')('vehicles.jsDelete_vehicle_warning', {length: error.response.data.result.length}), function (isConfirm)
                            {
                                if (isConfirm)
                                {
                                    //$state.go("calendar");
                                    $state.go("calendar",{data:{bookId: error.response.data.result[0].id}});
                                }
                            });
                        }, 500);
                    }
                    else {
                        MessageBox.toast(T.T("vehicles.jsDelete_fail"), "error");
                    }
                }
            });
        };

        // Function
        var originalCars = [];
        var firstLoad = true;
        var loadData = function () {
            MessageBox.showLoading();
            CarBS.getCurrentUserAll().then(function (result) {
                MessageBox.hideLoading();
                $timeout(function () {
                    originalCars = result.data.cars;
                    $scope.brands = integrationCarInBrand(originalCars);

                    if(searchText && $scope.showSearchResult){
                        $scope.searchResult = getSearchCarsResult(originalCars,searchText);
                    }else {
                        $scope.searchResult = originalCars;
                    }
                    $scope.$apply();

                    $( function() {
                        $(".card-more").click(function(){
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".searchcard-more").click(function(){
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function(){
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function(){
                            $(this).parents(".gen-panel").fadeOut(200);
                        });
                        if(firstLoad){
                            $("#vehicle-accordion").accordion({
                                header: 'h3.myselect',
                                active: false,
                                collapsible:true,
                                heightStyle: "content"
                            });
                        }else {
                            $("#vehicle-accordion").accordion("refresh");
                            $("#vehicle-accordion").accordion( "option", "active",false);
                        }
                        firstLoad = false;
                    });
                },0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicles.jsGet_car_failed"), "error");
                }
            });
        };

        //以category整合车辆数据
        var integrationCarInCategory = function (cars) {
            var tempCategorys = [];
            angular.forEach(cars,function (car) {
                var findCategory = false;
                for (var i=0;i<tempCategorys.length;i++){
                    if(tempCategorys[i].categoryId == car.category_id){
                        findCategory = true;
                        var findCar = false;
                        for (var j=0;j<tempCategorys[i].cars.length;j++){
                            if(tempCategorys[i].cars[j].id == car.id){
                                findCar = true;
                                break;
                            }
                        }
                        if(!findCar){
                            tempCategorys[i].cars.push(car);
                        }
                        break;
                    }
                }
                if(!findCategory){
                    var category = {"categoryId":car.category_id,
                                    "categoryName":car.category,
                                    "cars":[car]};
                    tempCategorys.push(category);
                }
            });
            return tempCategorys;
        };

        //以brand整合车辆数据
        var integrationCarInBrand = function (cars) {
            var tempBrands = [];
            angular.forEach(cars,function (car) {
                var findBrand = false;
                for (var i=0;i<tempBrands.length;i++){
                    if(tempBrands[i].brandName == car.brand){
                        findBrand = true;
                        var findCar = false;
                        for (var j=0;j<tempBrands[i].cars.length;j++){
                            if(tempBrands[i].cars[j].id == car.id){
                                findCar = true;
                                break;
                            }
                        }
                        if(!findCar){
                            tempBrands[i].cars.push(car);
                        }
                        break;
                    }
                }
                if(!findBrand){
                    var brand = {"brandName":car.brand,
                                 "cars":[car]};
                    tempBrands.push(brand);
                }
            });
            return tempBrands;
        };

        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                if (!word) {
                    $scope.showSearchResult = false;
                    searchText = undefined;
                }else {
                    $scope.showSearchResult = true;
                    searchText = word;
                    $scope.searchResult = [];
                    $scope.$apply();

                    $scope.searchResult = getSearchCarsResult(originalCars,word);
                    $scope.$apply();
                    $(".searchcard-more").click(function(){
                        $(this).next().fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".gen").click(function(){
                        $(this).parent().find(".gen-panel").fadeIn(200);
                    });
                    $(".gen-cancel").click(function(){
                        $(this).parents(".gen-panel").fadeOut(200);
                    });
                }
            }, 100);
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchCarsResult = function (originalCars,searchText) {
            var tempSearch = [];
            angular.forEach(originalCars,function (car) {
                if(car.model.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                    || car.brand.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                    || car.license_plate.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1){
                    tempSearch.push(car);
                }
            });
            return tempSearch;
        };

        // Init
        loadData();
    });

/**
 * Created by wangyaunzhi on 16/12/14.
 */
angular.module('KARL.Controllers')
    .controller('YoutubeModelCtrl', function ($log, $scope,$sce,$stateParams) {

        $scope.youtubeUrl = $sce.trustAsResourceUrl($stateParams.data.videoUrl);
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };
    });