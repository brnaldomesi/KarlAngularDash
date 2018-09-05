/**
 * Created by wangyaunzhi on 16/12/1.
 */
angular.module('Common.Filters')
    .filter('DistanceFormatFilter', function (T) {
        //入参time单位为分钟
        return function (distance, isBookUnit, unit) {
            var distanceUnit = localStorage.getItem('distanceunit');
            var tempDistance = distance / 1000;
            if (isBookUnit) {
                if (distanceUnit == 1 && unit == 1) {
                    return distance + T.T("comment.h5Mi");
                } else if (distanceUnit == 1 && unit == 2) {
                    return (distance * 0.6213712).toFixed(2) + T.T("comment.h5Mi");
                } else if (distanceUnit == 2 && unit == 1) {
                    return (distance * 1.609344).toFixed(2) + T.T("comment.h5km");
                } else {
                    return distance + T.T("comment.h5km");
                }
            } else {
                if (distanceUnit == 1) {
                    return (tempDistance * 0.6213712).toFixed(2) + T.T("comment.h5Mi");
                } else {
                    return tempDistance.toFixed(2) + T.T("comment.h5km");
                }
            }
        }
    });
