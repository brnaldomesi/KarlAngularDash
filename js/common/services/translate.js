/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('Common.Services')
    .factory('T',['$translate', function($translate) {
        var T = {
            T:function(key) {
                if(key){
                    return $translate.instant(key);
                }
                return key;
            }
        };
        return T;
    }]);

