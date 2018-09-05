/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('TransactionBS', function ($q, HttpService, strformat) {
        return {

            getTransactions: function (startTime, endTime, page, perPage, keyword, filter, archive) {
                var defer = $q.defer();
                var params = {
                    start_time: (new Date(startTime).valueOf() + "").substr(0, 10),
                    end_time: (new Date(endTime).valueOf() + "").substr(0, 10),
                    page: page,
                    per_page: perPage,
                    filter: filter,
                    archive: archive
                };
                if (keyword) {
                    params.search = keyword;
                }
                HttpService.get(Api.transaction.getTransaction, params, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getInvoiceInfo: function (bookingId) {
                var defer = $q.defer();
                var params = {};
                HttpService.get(strformat(Api.transaction.getInvoiceDetail, bookingId), params, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getTransactionsBills: function (startTime, endTime, page, perPage) {
                var defer = $q.defer();
                var params = {
                    start_time: (new Date(startTime).valueOf() + "").substr(0, 10),
                    end_time: (new Date(endTime).valueOf() + "").substr(0, 10),
                    page: page,
                    per_page: perPage
                };
                HttpService.get(Api.transaction.getTransactionBill, params, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            sendInvoiceEmail: function (bookingId, email) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.transaction.sendInvoiceEmail, bookingId), {
                    email: email
                }, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            editArchive: function (bookingId, archiveId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.transaction.editArchive, bookingId), {
                    archive: archiveId
                }, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }
        }

    });