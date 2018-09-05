/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Directives')
    .directive('karlFooter', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/dashboard/footer.html'
        };
    });
