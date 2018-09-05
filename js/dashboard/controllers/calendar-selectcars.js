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