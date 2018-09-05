/**
 * Created by wangyaunzhi on 16/11/26.
 */
'use strict';
angular.module('Widget.Services', []);
/**
 * Created by wangyaunzhi on 16/11/26.
 */
angular.module('Widget.Services')
    .factory('WidgetBS', function ($q, HttpService, $rootScope, strformat) {
        return {
            getOffer: function (company_id, type, d_lat, d_lng, a_lat, a_lng, estimate_distance, estimate_duration, appointed_time,dIsAirport,aIsAirport,unit) {
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
                        d_is_airport:dIsAirport?1:0,
                        a_is_airport:aIsAirport?1:0,
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
            }
        }
    });