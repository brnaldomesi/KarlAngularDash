/**
 * Created by gaohui on 17-1-20.
 */
angular.module('Flow.Controllers')
    .controller('PrivacyPolicyCtrl', function ($log, $scope, $state, $stateParams, $rootScope, $http, $timeout, strformat) {

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };
        var companyId = $rootScope.company_id;
        $scope.disclaimerUrl = strformat(Api.flow.getCompanyDisclaimer, companyId);

        $timeout(function () {
            //这个方法如果跨域就不能加载页面
            //但是,齐海说绝对不存在跨域问题
            $('#flow-disclaimer-div').load($scope.disclaimerUrl);

        }, 0);
    });