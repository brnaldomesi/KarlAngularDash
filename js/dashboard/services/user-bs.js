/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('UserBS', function ($log, $q, HttpService, UserCacheBS, strformat) {
        return {

            login: function (username, password) {
                var defer = $q.defer();
                HttpService.post(Api.user.login, {username: username, password: password}, function (response) {
                    // 登录成功保存用户数据
                    if (response.data.result.admin && response.data.result.admin.expire_time) {
                        response.data.result.admin.location = response.data.result.location
                    }
                    UserCacheBS.cache(response.data.result);
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateCurrentUser: function (param) {
                var defer = $q.defer();
                HttpService.patch(Api.admin.updateAdmin, {
                    param: param
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            changeAvatarToCurrentUser: function (file) {
                var defer = $q.defer();

                HttpService.upload(Api.admin.changeAvatar, {
                    avatar: file
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            logout: function () {
                var defer = $q.defer();

                HttpService.post(Api.user.logout, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            changePassword: function (oldPwd, newPwd) {
                var defer = $q.defer();
                HttpService.post(Api.admin.changePassword, {
                    old_pwd: oldPwd,
                    new_pwd: newPwd
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            forgotPassword: function (email) {
                var defer = $q.defer();
                HttpService.post(Api.admin.forgotPassword, {
                    email: email
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            updateAdminWebToken: function (token) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.admin.pushWebToken, token), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateSalesRep: function (param) {
                var defer = $q.defer();
                HttpService.patch(Api.salesRep.updateSalesRep, {
                    param: param
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateSalesAssistant: function (param) {
                var defer = $q.defer();
                HttpService.patch(Api.salesAssistant.updateSalesAssistant, {
                    param: param
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