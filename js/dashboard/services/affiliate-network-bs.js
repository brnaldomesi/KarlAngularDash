/**
 * Created by wangyaunzhi on 16/9/26.
 */
angular.module('KARL.Services')
    .factory('AffiliateNetworkBS', function ($q, HttpService, strformat,EncodeTool) {
        return {
            getAnSeting: function () {
                var defer = $q.defer();

                HttpService.get(Api.an.getSetting, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            enableLn: function (enable) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.an.enableLnSetting, enable), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            enableGn: function (enable) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.an.enableGnSetting, enable), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            enableCombine: function (enable) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.an.enableCombineSetting, enable), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addWantedCarModel: function (modelId) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.an.addLnWantedCarModel, modelId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            deleteWantedCarModel: function (carModelId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.an.deleteLnWantedCarModel, carModelId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addGivenCar: function (carID) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.an.addLnGivenCar, carID), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            deleteGivenCar: function (carID) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.an.deleteLnGivenCar, carID), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            updateLNRadius: function (radius) {
                var defer = $q.defer();
                HttpService.patch(Api.an.updateLnRadius, {"radius":radius}, function (response) {
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