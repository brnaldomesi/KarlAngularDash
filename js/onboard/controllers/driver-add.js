/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('DriverAddCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox, VerifyBS,T) {
        angular.element('#addDriverForm').validator();
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }
        $scope.selectedCars = undefined;
        $scope.unselectedCars = angular.copy($rootScope.carList);
        if ($scope.unselectedCars == undefined) {
            $scope.unselectedCars = [];
        }

        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };

        if(localStorage.getItem('lang')==='fr'){
            $scope.timeClock = angular.copy(frTimeClock);
        }else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.savingDriver = false;

        $scope.car_select_id = 0;
        $scope.firstName = undefined;
        $scope.lastName = undefined;
        $scope.email = undefined;
        $scope.mobile = undefined;
        $scope.routine = angular.copy(DriverRoutineDefault);
        $scope.preTimes = angular.copy(DriverDelayTime);
        $scope.pre_time = 1;
        $scope.editEmailDisable = false;
        $scope.editMobileDisable = false;


        var templateFirstName;
        var templateLastName;
        var templateMobile;
        var templateEmail;

        $scope.editFirstName = function () {
            templateFirstName = $scope.firstName;
        };
        $scope.editLastName = function () {
            templateLastName = $scope.lastName;
        };

        $scope.editEmailContent = function () {
            var match = false;
            angular.forEach($rootScope.driverList , function (driver) {
                if(driver.email == $scope.email){
                    match = true;
                }
            });

            if (match){
                MessageBox.toast(T.T('board_add_driver.jsEmail_has_used'),'error');
                return;
            }

            templateEmail = $scope.email;

            if($rootScope.admin.email == $scope.email){
                $scope.editEmailDisable = true;

                $scope.firstName = $rootScope.admin.first_name;
                $scope.lastName = $rootScope.admin.last_name;
                $scope.mobile = $rootScope.admin.mobile;

            }else{
                $scope.editEmailDisable = false;
                $scope.firstName = templateFirstName;
                $scope.lastName = templateLastName;
                $scope.mobile = templateMobile;
            }
        };
        $scope.editMobileContent = function () {
            var match = false;
            angular.forEach($rootScope.driverList , function (driver) {
                if(driver.mobile == $scope.mobile){
                    match = true;
                }
            });

            if(match){
                MessageBox.toast(T.T('board_add_driver.jsMobile_has_used'),'error');
                return;
            }

            templateMobile = $scope.mobile;

            if($rootScope.admin.mobile == $scope.mobile){
                $scope.editMobileDisable = true;

                $scope.firstName = $rootScope.admin.first_name;
                $scope.lastName = $rootScope.admin.last_name;
                $scope.email = $rootScope.admin.email;

            }else{
                $scope.editMobileDisable = false;
                $scope.firstName = templateFirstName;
                $scope.lastName = templateLastName;
                $scope.email = templateEmail;
            }
        };


        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        $scope.selectCarId = function () {
            console.log('car_select_id is', $scope.car_select_id);
            if ($scope.car_select_id == undefined) {
                return;
            }
            for (var i = 0; i < $scope.unselectedCars.length; i++) {
                if ($scope.unselectedCars[i].car_id == $scope.car_select_id) {
                    var key = i;
                    break;
                }
            }

            var car = $scope.unselectedCars[key];
            if ($scope.selectedCars == undefined) {
                $scope.selectedCars = new Array(car);
            } else {
                $scope.selectedCars.push(car);
            }
            $scope.unselectedCars.splice(key, 1);
        };

        $scope.removeCars = function (key) {
            var car = $scope.selectedCars[key];
            $scope.unselectedCars.push(car);
            $scope.selectedCars.splice(key, 1);
        };

        $scope.addNewDriver = function ($event) {
            if($scope.savingDriver){
                return;
            }
            $scope.savingDriver = true;
            if ($scope.firstName == undefined || $scope.firstName.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsFirst_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.lastName == undefined || $scope.lastName.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsLast_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.email == undefined || $scope.email.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsEmail_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            if ($scope.mobile == undefined || $scope.mobile.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_driver.jsMobile_name_null'), 'error');
                $scope.savingDriver = false;
                return;
            }
            var cars = '';
            angular.forEach($scope.selectedCars, function (car) {
                    cars += car.car_id + ",";
            });
            if (cars != '') {
                cars = cars.substring(0, cars.length - 1)
            }


            var driver = {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                mobile: $scope.mobile,
                email: $scope.email,
                routine: $scope.routine,
                routineCodeArray:VerifyBS.routineConversions($scope.routine),
                pre_time: $scope.pre_time,
                selectedCars: $scope.selectedCars,
                unselectedCars: $scope.unselectedCars,
                cars: cars
            };
            var ladda = Ladda.create($event.target);
            ladda.start();
            if(!$scope.editEmailDisable&&!$scope.editMobileDisable){
                driver.lang=$rootScope.comapnyLang;
                console.log(driver);
                VerifyBS.addDrivers(driver)
                    .then(
                    function (result) {
                        driver.driver_id = result.data.driver_id;
                        if ($rootScope.driverList == undefined) {
                            $rootScope.driverList = new Array(driver);
                        } else {
                            $rootScope.driverList.push(driver);
                        }
                        $scope.savingDriver = false;
                        ladda.stop();
                        $state.go('driver');
                    }, function (error) {
                        $scope.savingDriver = false;
                        ladda.stop();
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
                    }
                );
            }else {
                driver.lang=window.localStorage.lang;
                console.log(driver);
                VerifyBS.addAddAdminAsDriver(driver,VerifyBS.routineConversions($scope.routine)).then(function (result) {
                    ladda.stop();
                    $scope.savingDriver = false;
                    driver.driver_id = result.data.id;
                    if ($rootScope.driverList == undefined) {
                        $rootScope.driverList = new Array(driver);
                    } else {
                        $rootScope.driverList.push(driver);
                    }
                    $state.go('driver');
                }, function (error) {
                    ladda.stop();
                    $scope.savingDriver = false;
                    if (error.treated) {
                    } else {
                        if (error.response.data.code == "3001") {
                            MessageBox.toast(T.T('board_add_driver.jsParam_error'), 'error');
                        } else if (error.response.data.code == "3300") {
                            MessageBox.toast(T.T('board_add_driver.jsAlready_exist'), 'error');
                        }
                    }
                });
            }

        };


        $scope.checkChanged = function (line) {
            $scope.routine[line].work = !$scope.routine[line].work;
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

        $scope.backEvent = function(){
            if($rootScope.driverList == undefined || $rootScope.driverList.length == 0 ){
                $state.go('vehicle');
            }else{
                $state.go('driver');
            }
        }
    });
