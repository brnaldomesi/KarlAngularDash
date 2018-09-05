/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('DriverBS', function ($q, HttpService, strformat, AddressTool) {
        return {
            getCurrentUserAll: function () {
                var defer = $q.defer();
                HttpService.get(Api.driver.getCurrentUserAll, {}, function (response) {
                    angular.forEach(response.data.result, function (driver) {
                        if (driver.address) {
                            if (driver.address.indexOf('formatted_address') > 0) {
                                driver.address = JSON.parse(driver.address);
                            }else {
                                if(driver.address == "{}"){
                                    driver.address = '';
                                }
                            }
                            driver.final_address = AddressTool.finalAddress(driver.address);
                        }
                    });
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addToCurrentUser: function (param) {
                var defer = $q.defer();
                HttpService.post(Api.driver.addToCurrentUser, {
                    param: JSON.stringify(param)
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            routineConversionsFromLocToISO: function (routine) {
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

            deleteFromCurrentUser: function (driverId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.driver.deleteFromCurrentUser, driverId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getDetailFromCurrentUser: function (driverId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.driver.getDetailFromCurrentUser, driverId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateToCurrentUser: function (driverId, param) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.driver.updateToCurrentUser, driverId), {
                    param: JSON.stringify(param)
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            changeDriverImage: function (driverId, file) {
                var defer = $q.defer();
                HttpService.upload(strformat(Api.driver.changeDriverImage, driverId), {
                    avatar: file
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addAdminAsDriver: function (param) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.driver.addAdminToDriverUser, param), {
                    param: param
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }
        }
    });