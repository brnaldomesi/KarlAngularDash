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