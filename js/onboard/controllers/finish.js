/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('FinishCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox,VerifyBS,T) {
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }

        $scope.dashboardUrl = DashboardUrl;

        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };
    });
