/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Services')
    .factory('VerifyBS', function ($q, HttpService, $rootScope, strformat) {
        return {

            getAllCarsModels: function () {
                var defer = $q.defer();
                HttpService.get(Api.carModel.getAllCarsModels, {}, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, null);
                return defer.promise;
            },

            addCompany: function (company, admin, card_token, coupon) {
                var defer = $q.defer();
                HttpService.post(Api.onboard.payOrder, {
                    company: company,
                    admin: admin,
                    card_token: card_token,
                    coupon: coupon
                }, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, null);
                return defer.promise;
            },

            addCars: function (vehicle, calendar) {
                var defer = $q.defer();
                var param = {
                    car_model_id: vehicle.model_id,
                    license_plate: vehicle.license,
                    description: "",
                    calendar: (calendar),
                    type: 0,
                    car_img: vehicle.model_img_id,
                    bags_max: vehicle.bags_max,
                    seats_max: vehicle.seats_max,
                    year: vehicle.year,
                    color: vehicle.color,
                    pre_time:30
                };
                HttpService.post(Api.car.addToCurrentUser,
                    {param:JSON.stringify(param)},
                    function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, $rootScope.token);
                return defer.promise;
            },

            updateCarsInfo: function (car) {
                var defer = $q.defer();
                var param = {
                    car_model_id: car.model_id,
                    license_plate: car.license,
                    year: car.year,
                    color: car.color
                };
                HttpService.post(strformat(Api.car.updateToCurrentUser, car.car_id),
                    {param:JSON.stringify(param)},
                    function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, $rootScope.token);
                return defer.promise;
            },

            deleteCars: function (carId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.car.deleteFromCurrentUser, carId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, $rootScope.token);
                return defer.promise;
            },

            getCompaniesAllCars: function () {
                var defer = $q.defer();
                HttpService.get(Api.car.getCurrentUserAll, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, $rootScope.token);
                return defer.promise;
            },

            addDrivers: function (driver) {
                var defer = $q.defer();
                HttpService.post(Api.onboard.addDrivers, {
                    param: JSON.stringify({
                        //password: password,
                        first_name: driver.firstName,
                        last_name: driver.lastName,
                        mobile: driver.mobile,
                        email: driver.email,
                        calendar: driver.routineCodeArray,
                        delay_time: driver.pre_time*60,
                        cars: driver.cars,
                        gender:1,
                        lang:driver.lang
                    })
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, $rootScope.token);
                return defer.promise;
            },

            addAddAdminAsDriver :function (driver) {
                var param = {
                    license_number: "",
                    delay_time: driver.pre_time*60,
                    cars: driver.cars,
                    calendar: driver.routineCodeArray,
                    lang:driver.lang
                };
                var defer = $q.defer();
                HttpService.post(Api.onboard.addAdminAsDriver, {
                    param: JSON.stringify(param)
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, $rootScope.token);
                return defer.promise;
            },

            deleteCurrentDriver: function (driverId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.driver.deleteFromCurrentUser, driverId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, $rootScope.token);
                return defer.promise;
            },

            routineConversions: function (routine) {
                var defaultDayRoutine = "111111111111111111111111111111111111111111111111";
                var finalWeekRoutine = '';
                angular.forEach(routine, function (item) {
                    if (!item.work) {
                        finalWeekRoutine += defaultDayRoutine;
                    } else {
                        var start_index = item.start * 2;
                        var end_index = item.end * 2;
                        var startString = defaultDayRoutine.substring(0, start_index);
                        var endString = defaultDayRoutine.substring(end_index);
                        var middleString = defaultDayRoutine.substring(start_index, end_index);
                        middleString = middleString.replace(/1/g, '0');

                        finalWeekRoutine += startString + middleString + endString;
                    }
                });
                //获取时区
                var timeZone = (new Date().getTimezoneOffset() / 60) * (-1) * 2;
                var locRoutineDataString = "";
                if (timeZone > 0) {
                    var tempStart = finalWeekRoutine.substring(timeZone);
                    var tempSpell = finalWeekRoutine.substring(0, timeZone);
                    locRoutineDataString = tempStart + tempSpell;
                } else if (timeZone < 0) {
                    var tempStart = finalWeekRoutine.substr(timeZone);
                    locRoutineDataString = tempStart + finalWeekRoutine;
                } else {
                    locRoutineDataString = finalWeekRoutine;
                }
                //locRoutineDataString 转locRoutineData 数组
                var locRoutineData = undefined;
                for (var i = 0; i < 7; i++) {
                    if (locRoutineData == undefined) {
                        locRoutineData = new Array(locRoutineDataString.substring(i * 48, (i + 1) * 48) + "");
                    } else {
                        locRoutineData.push(locRoutineDataString.substring(i * 48, (i + 1) * 48) + "");

                    }
                }
                return locRoutineData;
            },

            updatedDriver: function (driver) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.driver.updateToCurrentUser, driver.driver_id), {
                    param: JSON.stringify({
                        first_name: driver.firstName,
                        last_name: driver.lastName,
                        mobile: driver.mobile,
                        email: driver.email,
                        calendar: driver.routineCodeArray,
                        cars: driver.cars
                    })
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, $rootScope.token);
                return defer.promise;
            },

            verifyCoupon: function (code) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.onboard.verifyCode, code), {}, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, null);
                return defer.promise;
            },

            getServicePrice: function () {
                var defer = $q.defer();
                HttpService.get(Api.onboard.servicePrice, {}, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, null);
                return defer.promise;
            }
        };
    });