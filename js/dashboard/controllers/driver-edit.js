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