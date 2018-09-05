/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('OrderBS', function ($q, HttpService,$filter, AddressTool) {
        return {
            getActiveOrder: function (dateType, searchDate) {
                var defer = $q.defer();
                HttpService.get(Api.order.getActiveOrder, {}, function (response)
                {
                    defer.resolve({data: response.data.result});
                }, function (treated, response)
                {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            },

            getHomeOrders: function () {
                var defer = $q.defer();
                var day = new Date($filter('date')(new Date(), "longDate"));
                var requestParams = {
                    "start_time": parseInt(day.getTime() / 1000),
                    "end_time": parseInt(day.getTime() / 1000 + 24 * 60 * 60)
                };
                HttpService.get(Api.order.getActiveOrder, requestParams, function (response)
                {
                    angular.forEach(response.data.result, function (order) {
                        if (order.d_address) {
                            if(order.d_address.indexOf('formatted_address') > 0){
                                order.d_address = JSON.parse(order.d_address);
                            }
                            order.d_final_address = AddressTool.finalAddress(order.d_address);
                        }
                        if (order.a_address) {
                            if(order.a_address.indexOf('formatted_address') > 0){
                                order.a_address = JSON.parse(order.a_address);
                            }
                            order.a_final_address = AddressTool.finalAddress(order.a_address);
                        }
                    });
                    defer.resolve(response.data);
                }, function (treated, response)
                {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            }
        }
    });