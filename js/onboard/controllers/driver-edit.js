/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('DriverEditCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox,VerifyBS,T) {
        angular.element('#editDriverForm').validator();
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }
        var driverIndex = $rootScope.driverIndex;
        $scope.driver = angular.copy($rootScope.driverList[driverIndex]);
        $scope.car_select_id = undefined;
        if(localStorage.getItem('lang')==='fr'){
            $scope.timeClock = angular.copy(frTimeClock);
        }else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.preTimes = angular.copy(DriverDelayTime);
        $scope.savingDriver = false;
        $scope.editDisable = ($scope.driver.email == $rootScope.admin.email) || ($scope.driver.mobile == $rootScope.admin.mobile) ;
        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };


        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        $scope.selectCarId = function () {
            if ($scope.car_select_id == undefined) {
                return;
            }
            for (var i = 0; i < $scope.driver.unselectedCars.length; i++) {
                if ($scope.driver.unselectedCars[i].car_id == $scope.car_select_id) {
                    var key = i;
                    break;
                }
            }

            var car = $scope.driver.unselectedCars[key];
            if ($scope.driver.selectedCars == undefined) {
                $scope.driver.selectedCars = new Array(car);
            } else {
                $scope.driver.selectedCars.push(car);
            }
            $scope.driver.unselectedCars.splice(key, 1);
        };

        $scope.removeCars = function (key) {
            var car = $scope.driver.selectedCars[key];
            $scope.driver.unselectedCars.push(car);
            $scope.driver.selectedCars.splice(key, 1);
        };

        $scope.updateCurrentDriver = function ($event) {
            if($scope.savingDriver){
                return;
            }
            $scope.savingDriver = true;
            if ($scope.driver.firstName == undefined || $scope.driver.firstName.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsFirst_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.driver.lastName == undefined || $scope.driver.lastName.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsLast_name_null'), 'error');
                return;
            }
            if ($scope.driver.email == undefined || $scope.driver.email.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsEmail_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.driver.mobile == undefined || $scope.driver.mobile.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsMobile_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            var cars = '';
            angular.forEach($scope.driver.selectedCar, function (car) {
                if (car.selected == 1) {
                    cars += car.car_id + ",";
                }
            });
            if (cars != '') {
                cars = cars.substring(0, cars.length - 1)
            }
            $scope.driver.cars = cars;
            $scope.driver.routineCodeArray = VerifyBS.routineConversions($scope.driver.routine);
            var ladda = Ladda.create($event.target);
            ladda.start();
            VerifyBS.updatedDriver($scope.driver)
                .then(function (result) {
                    $scope.savingDriver = false;
                    ladda.stop();
                    $rootScope.driverList[driverIndex] = $scope.driver;
                    $state.go('driver');
                },function (error) {
                    $scope.savingDriver = false;
                    ladda.stop();
                });
        };


        $scope.deleteCurrentDriver = function () {
            VerifyBS.deleteCurrentDriver($scope.driver.driver_id)
                .then(function (result) {
                    $rootScope.driverList.splice(driverIndex,1);
                    $state.go('driver');
                },function (error) {
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "3100") {
                            MessageBox.toast(T.T('board_add_driver.jsUsername_used'), 'error');
                        } else if (error.response.data.code == "3101") {
                            MessageBox.toast(T.T('board_add_driver.jsMobile_used'), 'error');
                        } else if (error.response.data.code == "3102") {
                            MessageBox.toast(T.T('board_add_driver.jsEmail_used'), 'error');
                        }
                    }
                });
        };

        $scope.checkChanged = function (line) {
            $scope.driver.routine[line].work = !$scope.driver.routine[line].work;
        };
        $scope.selectWorkHour = function (index, startOrEnd) {
            if (startOrEnd) {
                if ($scope.driver.routine[index].start >= $scope.driver.routine[index].end) {
                    $scope.driver.routine[index].start = $scope.driver.routine[index].end - 1;
                }
            } else {
                if ($scope.driver.routine[index].end <= $scope.driver.routine[index].start) {
                    $scope.driver.routine[index].end = $scope.driver.routine[index].start + 1;
                }
            }
        };

        $scope.backEvent = function(){
            $state.go('driver');
        }
    });
