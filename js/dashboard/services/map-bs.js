/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('MapBS', function ($q, $http) {

            return {

                getTimezone: function (lat, lng) {
                    // var defer = $q.defer();
                    // var url = 'https://maps.googleapis.com/maps/api/timezone/json';
                    // var params = {
                    //     location: lat + ',' + lng,
                    //     timestamp: (new Date().valueOf() + "").substr(0, 10),
                    //     key: 'AIzaSyA_l3gw9utuFnIMofTHjzIAMYWQUac8iqc'
                    // };
                    // HttpService.get(url, params, function (response) {
                    //     defer.resolve({data: response.data.result});
                    // }, function (treated, response) {
                    //     defer.reject({treated: treated, response: response});
                    // });
                    // return defer.promise;

                    // HttpUtils.get($http, url, params, function (response) {
                    //     {
                    // if (response.data == null || response.data.code == null || response.data.result == null) {
                    //     MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                    //     if (faultHandler) {
                    //         faultHandler(true, response);
                    //     }
                    // }
                    // if (response.data.code >= 2000 && response.data.code < 3000) {
                    //     if (successHandler) {
                    //         successHandler(response);
                    //     }
                    // }
                    // var treated = treatCommonFault(response);
                    // if (faultHandler) {
                    //     faultHandler(treated, response);
                    // }
                    // if (response.data.code == 3007) {
                    //     $state.go("login");
                    // }
                    // }, function (error) {
                    // MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                    // if (faultHandler) {
                    //     faultHandler(true, error);
                    // }
                    // }

                    // },

                }
            }
        }
    );


// get: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
//     if (!arguments[4]) bNoUseToken = false;
//     UserCacheBS.loadCache().then(function (result) {
//         if (!bNoUseToken && result.data) {
//             if (!params) {
//                 params = {};
//             }
//             params.token = result.data.token;
//         }
//         if (bNoUseToken && customizeToken) {
//             if (!params) {
//                 params = {};
//             }
//             params.token = customizeToken;
//         }
//         angular.forEach(params, function (key, value) {
//             if (angular.isObject(value)) {
//                 params.key = JSON.stringify(value);
//             }
//         });
//         HttpUtils.get($http, url, params, function (response) {
//             if (response.data == null || response.data.code == null || response.data.result == null) {
//                 MessageBox.toast(T.T("ErrorCode.GET"), 'error');
//                 if (faultHandler) {
//                     faultHandler(true, response);
//                 }
//             }
//             if (response.data.code >= 2000 && response.data.code < 3000) {
//                 if (successHandler) {
//                     successHandler(response);
//                 }
//             }
//             var treated = treatCommonFault(response);
//             if (faultHandler) {
//                 faultHandler(treated, response);
//             }
//             if(response.data.code == 3007){
//                 $state.go("login");
//             }
//         }, function (error) {
//             MessageBox.toast(T.T("ErrorCode.GET"), 'error');
//             if (faultHandler) {
//                 faultHandler(true, error);
//             }
//         });
//     }, function (error) {
//         $log.error(error);
//         MessageBox.toast(T.T("ErrorCode.GET"), 'error');
//         if (faultHandler) {
//             faultHandler(true, error);
//         }
//     });
// },
