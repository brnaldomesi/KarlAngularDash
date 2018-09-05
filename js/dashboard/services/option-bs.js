/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('OptionBS', function ($q, HttpService,strformat) {
        return {
            getCurrentOptionAll: function () {
                var defer = $q.defer();

                HttpService.get(Api.option.currentOptionAll, {}, function (response) {
                    if(response.data.code == 2100){
                        response.data.result = [];
                    }
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            addCurrentOption: function (param) {
                var defer = $q.defer();

                HttpService.post(Api.option.currentOptionAll, {param:param}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            deleteFromCurrentOption: function (optionId) {
                var defer = $q.defer();

                HttpService.delete(strformat(Api.option.deleteFromCurrentUserOption,optionId ), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },updateFromCurrentOption: function (id,param) {
                var defer = $q.defer();

                HttpService.patch(strformat(Api.option.updateFromCurrentOption,id), {param:param}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            getAll: function (page, count) {
                var defer = $q.defer();

                HttpService.get(Api.option.getAll, {
                    page: page,
                    per_page: count
                }, function (response) {
                    defer.resolve({
                        data: response.data.result.cars,
                        total:response.data.result.total,
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            }
        }
    });

