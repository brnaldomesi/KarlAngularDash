/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('Common.Services')
    .factory('UserCacheBS', function ($log, $q, $rootScope) {
        return {

            cache: function (user) {
                var defer = $q.defer();
                if (user.avatar_url == "") {
                    user.avatar_url = "img/default-avatar.png";
                }
                localStorage.setItem('loginUser', JSON.stringify(user));
                $rootScope.loginUser = user;
                defer.resolve({data: user});
                return defer.promise;
            },

            loadCache: function () {
                var defer = $q.defer();
                var cache = localStorage.getItem('loginUser');
                var data;
                if (cache) {
                    data = JSON.parse(cache);
                }
                $rootScope.loginUser = data;
                defer.resolve({data: data});
                return defer.promise;
            },

            cleanCache: function () {
                localStorage.setItem('loginUser', null);
            }
        }
    });