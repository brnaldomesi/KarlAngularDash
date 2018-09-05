/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('PaymentBS', function ($q, HttpService, strformat) {
        return {

            getCompanyPaymentList: function () {
                var defer = $q.defer();
                HttpService.get(Api.payment.getFromCurrentCompany, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            deleteFromCurrentCompany: function (id) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.payment.deleteFromCurrentCompany, id), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            activeFromCurrentCompany: function (id) {
                var defer = $q.defer();
                HttpService.put(strformat(Api.payment.activeFromCurrentCompany, id), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getCardByClient: function (id) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.payment.getCardByClient, id), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addCardByClient: function (id, params) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.payment.addCardByClient, id), params, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            deleteCardByClient: function (id, number) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.payment.deleteCardByClient, id, number), {}, function (response) {
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