/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CarModelBS', function ($q, strformat, HttpService) {
        return {

            getAll: function (carModelId)
            {
                var defer = $q.defer();
                HttpService.get(strformat(Api.carModel.getAll, carModelId), {}, function (response)
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