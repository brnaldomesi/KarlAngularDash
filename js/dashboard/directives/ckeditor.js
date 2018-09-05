/**
 * Created by gaohui on 17-1-24.
 */
angular.module('KARL.Directives')
    .directive('ckeditor', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                var ckeditor = CKEDITOR.replace(element[0], {});
                if (!ngModel) {
                    return;
                }
                ckeditor.on('instanceReady', function () {
                    ckeditor.setData(ngModel.$viewValue);
                });
                ckeditor.on('pasteState', function () {
                    scope.$apply(function () {
                        ngModel.$setViewValue(ckeditor.getData());
                    });
                });
                ngModel.$render = function (value) {
                    ckeditor.setData(ngModel.$viewValue);
                };
            }
        };
    });