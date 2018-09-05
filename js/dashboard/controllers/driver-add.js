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
