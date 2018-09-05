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
            param.costMin = $scope.costMin;

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