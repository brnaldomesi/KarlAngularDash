/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CarBS', function ($q, HttpService, strformat) {
        return {

            getCurrentUserAll: function () {
                var defer = $q.defer();
                HttpService.get(Api.car.getCurrentUserAll, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            getCurrentUserAllAndDriver: function () {
                var defer = $q.defer();
                HttpService.get(Api.car.getCurrentUserAllAndDriver, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getAll: function (page, count) {
                var defer = $q.defer();

                HttpService.get(Api.car.getAll, {
                    page: page,
                    per_page: count
                }, function (response) {
                    defer.resolve({
                        data: response.data.result.cars,
                        total: response.data.result.total,
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addNewVehicle: function (carModelId, licensePlate,preTime, description, calendar, type, img, year, color,passengerMax,bagsMax) {
                var defer = $q.defer();
                var param = {
                    car_model_id: carModelId,
                    license_plate: licensePlate,
                    description: description,
                    calendar:calendar,
                    type: type,
                    pre_time: preTime,
                    car_img: img,
                    year: year,
                    color: color,
                    seats_max:passengerMax,
                    bags_max:bagsMax
                };
                HttpService.uploadParamsAndData(Api.car.addToCurrentUser,{
                    param:JSON.stringify(param)
                    }
                    , {car_img: img}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            deleteFromCurrentUser: function (carId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.car.deleteFromCurrentUser, carId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getDetailFromCurrentUser: function (carId) {
                var defer = $q.defer();

                HttpService.get(strformat(Api.car.getDetailFromCurrentUser, carId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            updateVehicleInfo: function (carId, carModelId, licensePlate,preTime, description, calendar, type, img, year, color,passengerMax,bagsMax) {
                var defer = $q.defer();

                var param = {
                    car_model_id: carModelId,
                    license_plate: licensePlate,
                    description: description,
                    calendar: calendar,
                    car_img: img,
                    pre_time: preTime,
                    year: year,
                    color: color,
                    seats_max:passengerMax,
                    bags_max:bagsMax
                };
                var file = {car_img: img};
                if (img != -1) {
                    param.type = type;
                }

                HttpService.uploadParamsAndData(strformat(Api.car.updateToCurrentUser, carId),
                    {param:JSON.stringify(param)},
                    file, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            changeCarImage: function (carId, file) {
                var defer = $q.defer();

                HttpService.upload(strformat(Api.car.changeCarImage, carId), {
                    car_image: file
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