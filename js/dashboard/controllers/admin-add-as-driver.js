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
