'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Services')
    .factory('SuperCarBS', function ($log, $q, HttpService, strformat) {
        return {

            loadCarModelsOnPlatform: function () {
                var defer = $q.defer();
                HttpService.get(Api.super.carModelsOnPlatform, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            loadCarCategoriesOnPlatform: function () {
                var defer = $q.defer();
                HttpService.get(Api.super.carCategoriesOnPlatform, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addCarCategoriesOnPlatform: function (CategoryName, CategoryDescribe) {
                var defer = $q.defer();
                HttpService.post(Api.super.carCategoriesOnPlatform, {
                    name: CategoryName,
                    desc: CategoryDescribe
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            modifyCategories: function (CategoryName, CategoryDescribe, CategoryId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.super.modifyCategories, CategoryId), {
                    name: CategoryName,
                    desc: CategoryDescribe
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            loadCarBrandsOnPlatform: function () {
                var defer = $q.defer();
                HttpService.get(Api.super.carBrandsOnPlatform, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addCarBrandsOnPlatform: function (name) {
                var defer = $q.defer();
                HttpService.post(Api.super.carBrandsOnPlatform, {
                    name: name
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            editCarBrandsOnPlatform: function (id, name) {
                var defer = $q.defer();
                HttpService.patch(Api.super.carBrandsOnPlatform + "/" + id, {
                    name: name
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addCarModelOnPlatform: function (brandId, categoryId, maxBags, maxSeats, modelName) {
                var defer = $q.defer();
                HttpService.post(Api.super.carModelsOnPlatform, {
                    brand_id: brandId,
                    category_id: categoryId,
                    max_bags: maxBags,
                    max_seats: maxSeats,
                    model_name: modelName
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            saveCarModelOnPlatform: function (modelId, brandId, categoryId, maxBags, maxSeats, modelName) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.super.carModelIdOnPlatform, modelId), {
                    brand_id: brandId,
                    category_id: categoryId,
                    max_bags: maxBags,
                    max_seats: maxSeats,
                    model_name: modelName
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            addCarModelImage: function (carModelId, file) {
                var defer = $q.defer();
                HttpService.uploadParamsAndData(strformat(Api.super.carModelsImageOnPlatform, carModelId), {},
                    {car_model_img: file}, function (response) {
                        defer.resolve({
                            data: response.data.result
                        });
                    }, function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    });

                return defer.promise;
            },

            replaceCarModelImage: function (imageId, file) {
                var defer = $q.defer();
                HttpService.uploadParamsAndData(strformat(Api.super.carModelsImageIdOnPlatform, imageId), {},
                    {car_model_img: file}, function (response) {
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
