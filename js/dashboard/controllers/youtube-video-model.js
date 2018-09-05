/**
 * Created by wangyaunzhi on 16/12/14.
 */
angular.module('KARL.Controllers')
    .controller('YoutubeModelCtrl', function ($log, $scope,$sce,$stateParams) {

        $scope.youtubeUrl = $sce.trustAsResourceUrl($stateParams.data.videoUrl);
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };
    });