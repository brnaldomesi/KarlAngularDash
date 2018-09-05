/**
 * Created by jian on 17-8-28.
 */
angular.module('Common.Filters')
    .filter('phoneNumFormatter', function () {
        return function (num, country) {
            if (num) {
                num = num.toString().replace(/\s/g, '');
                if (country === "FR") {
                    num = num.replace(/(\d{2})(?=\d)/g, "$1 ");
                } else {
                    num = num.replace(/(\d{3})(?=\d{2,}$)/g, '$1 ');
                }
            }
            return num
        }
    });
