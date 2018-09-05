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
                    param.costMin = $scope.costMin;
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