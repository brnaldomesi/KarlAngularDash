'use strict';

/**
 * Created by Alur on 2017-12-10.
 */
angular.module('EasySignUp.Services', []);

/**
 * Created by Alur on 2017-12-10.
 */
angular.module('EasySignUp.Services')
    .factory('EasySignUpBS', function ($q, HttpService) {
        return {

            easySignUp: function (company, admin) {
                var defer = $q.defer();
                HttpService.post(Api.easysignup.easysignup, {
                    company: company,
                    admin: admin
                }, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, null);
                return defer.promise;
            },
        };
    });