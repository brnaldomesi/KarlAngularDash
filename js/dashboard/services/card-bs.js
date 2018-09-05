/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CardBS', function ($q, HttpService, strformat) {
        return {
            getFromCurrentCompany: function () {
                var defer = $q.defer();

                HttpService.get(Api.card.getFromCurrentCompany, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            updateCurrentCompany: function (cardType, cardNumber, cvv2, expireMonth, expireYear, firstName, lastName) {
                var defer = $q.defer();

                HttpService.put(Api.card.updateCurrentCompany, {
                    card_type: cardType,
                    card_number: cardNumber,
                    cvv2: cvv2,
                    expire_month: expireMonth,
                    expire_year: expireYear,
                    first_name: firstName,
                    last_name: lastName
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            
            getFromCurrentUser: function (userId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.card.getFromCurrentUser,userId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            }
        }
    });