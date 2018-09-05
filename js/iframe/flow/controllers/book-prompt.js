/**
 * Created by wangyaunzhi on 16/12/9.
 */
angular.module('Flow.Controllers')
    .controller('BookPromptCtrl', function ($log, $scope, $stateParams) {

        $scope.message = $stateParams.message;
        $scope.onCancelButtonClick = function () {
            $stateParams.event.ok();
        };
    });