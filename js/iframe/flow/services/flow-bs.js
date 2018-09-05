/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('Flow.Services')
    .factory('FlowBS', function ($q, HttpService, $rootScope, strformat) {
        return {

            login: function (company_id, username, password) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.flow.login, company_id), {
                    username: username,
                    password: password
                }, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            register: function (company_id, password, firstName, lastName, mobile, email,lang) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.flow.register, company_id), {
                    // username: username,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                    mobile: mobile,
                    email: email,
                    lang:lang
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCards: function (token) {
                var defer = $q.defer();
                HttpService.get(Api.flow.getCreditCards, {}, function (response) {
                    if(response.data.code == 2100){
                        response.data.result = [];
                    }
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, token);
                return defer.promise;
            },

            addCard: function (token, params) {
                var defer = $q.defer();
                HttpService.post(Api.flow.addCreditCard, params, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                }, true, token);
                return defer.promise;
            },

            book: function (token, params) {
                var defer = $q.defer();
                HttpService.post(Api.flow.booking, {param: params}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                }, true, token);
                return defer.promise;
            },

            getOffer: function (company_id,
                                type,
                                d_lat, d_lng,
                                a_lat, a_lng,
                                estimate_distance,
                                estimate_duration,
                                appointed_time,
                                d_is_airport,a_is_airport,
                                unit
            ) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.flow.getOffers, company_id),
                    {
                        type: type,
                        d_lat: d_lat,
                        d_lng: d_lng,
                        a_lat: a_lat,
                        a_lng: a_lng,
                        estimate_distance: estimate_distance,
                        estimate_duration: estimate_duration,
                        appointed_time: (new Date(appointed_time).valueOf() + "").substr(0, 10),
                        d_is_airport:d_is_airport,
                        a_is_airport:a_is_airport,
                        unit:unit
                    }, function (response) {
                        defer.resolve({data: response.data.result});
                    }, function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    }, true);
                return defer.promise;
            },

            getCompanyInfor: function (company_id) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.flow.getCompanyInfor, company_id),
                    {}, function (response) {
                        defer.resolve({data: response.data.result});
                    }, function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    }, true);
                return defer.promise;
            },
            clientsGetCompanyDisclaimer: function (companyId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.flow.getCompanyDisclaimer, companyId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            verifyCoupon: function (companyId,code) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.customer.verifyCode,companyId, code), {}, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, null);
                return defer.promise;
            }
        }
    });