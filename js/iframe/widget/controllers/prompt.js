/**
 * Created by jian on 16-12-2.
 */
angular.module('Widget.Controllers')
    .controller('promptCtrl', function ($log, $scope, $stateParams) {

        $scope.message = $stateParams.message;
        $scope.onCancelButtonClick = function () {
            $stateParams.event.ok();
        };
    });
