/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('StatisticsBS', function ($q, HttpService) {
        return {

            statistics: function (selectDate, type) {
                //如果是日,则取当日的23:59:59
                //如果是周,则取周末的23:59:59
                //如果是月,则取月末的23:59:59
                var date = angular.copy(selectDate);
                var timeStamp = '';
                if (type == 0) {
                    date.setDate(date.getDate() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else if (type == 1) {
                    if (date.getDay() == 0) {
                        date.setDate(date.getDate() + 1);
                    } else {
                        date.setDate(date.getDate() + 7 - date.getDay() + 1);
                    }
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else {
                    date.setDate(1);
                    date.setMonth(date.getMonth() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                }
                var defer = $q.defer();
                HttpService.get(Api.order.statistics, {
                    timestamp: timeStamp,
                    type: type,
                    count: 3
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            saleStatistics: function (selectDate, type) {
                //如果是日,则取当日的23:59:59
                //如果是周,则取周末的23:59:59
                //如果是月,则取月末的23:59:59
                var date = angular.copy(selectDate);
                var timeStamp = '';
                if (type == 0) {
                    date.setDate(date.getDate() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else if (type == 1) {
                    if (date.getDay() == 0) {
                        date.setDate(date.getDate() + 1);
                    } else {
                        date.setDate(date.getDate() + 7 - date.getDay() + 1);
                    }
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else {
                    date.setDate(1);
                    date.setMonth(date.getMonth() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                }
                var defer = $q.defer();
                HttpService.get(Api.salesRep.getCompaniesState, {
                    timestamp: timeStamp,
                    type: type,
                    count: 3
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