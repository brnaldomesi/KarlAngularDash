angular.module('KARL.Filters')
    .filter('Tax', function () {
        return function (num, tva)
        {
            var percent = parseInt(tva)/100;
            var result = num * (1 + percent);
            return result;
        }
    });
