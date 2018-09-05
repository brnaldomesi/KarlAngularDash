'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Services')
    .factory('SuperRateBS', function ($log, $q, HttpService, strformat) {
        return {

            getRateRules: function () {
                var defer = $q.defer();
                HttpService.get(Api.super.rateRules, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            updateRateRules: function (rate) {
                var defer = $q.defer();
                HttpService.patch(Api.super.rateRules, {rules: rate}, function (response) {
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
