/**
 * Created by gaohui on 17-1-23.
 */
angular.module('KARL.Directives')
    .directive('multextinputbox', function () {
        return {
            restrict: 'A', // 只用于属性
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || '');
                };

                // Listen for change events to enable binding
                element.keyup(function (e) {
                    if (e.which != 8 && element.html().length >= attrs.ngMaxlength) {
                        e.preventDefault();
                    }
                });
                element.keydown(function (e) {
                    if (e.which != 8 && element.html().length >= attrs.ngMaxlength) {
                        e.preventDefault();
                    }
                });
                element.on('blur keyup change', function () {
                    scope.$apply(readViewText);
                });
                function readViewText() {
                    var html = element.html();
                    ngModel.$setViewValue(html);
                }
            }
        }
    });