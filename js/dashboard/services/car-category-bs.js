/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CarCategoryBS', function ($q, HttpService) {
        return {

            getAll: function ()
            {
                var defer = $q.defer();
                HttpService.get(Api.carCategory.getAll, {}, function (response)
                {
                    defer.resolve({data: response.data.result});
                }, function (treated, response)
                {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            }
        }
    });