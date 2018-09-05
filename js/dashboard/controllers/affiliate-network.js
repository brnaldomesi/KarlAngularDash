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