/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('CurrencyAcctCtrl', function ($log, $scope, $rootScope, $state, $stateParams, CompanyBS, $filter,MessageBox,T) {

        if($rootScope.loginUser == null){
            $state.go('login');
            return;
        }
        $scope.currentCcy="";
        $scope.defaultCurrency = angular.copy(defaultCurrency);

        $scope.onOkButtonClick = function () {
            if($scope.currentCcy === ""){
                MessageBox.toast(T.T("currency.jsEmptyMsg"));
                return;
            }
            CompanyBS.setCompanyCcy($scope.currentCcy).
            then(function (result) {
                window.localStorage.companyCurrency = $scope.currentCcy;
                MessageBox.toast(T.T("currency.jsSetSuccess"));
                console.log("result",result);
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel();
                }
            },function (error) {
                console.log("error",error);
                MessageBox.toast(T.T("currency.jsSetFail"));
            });
        };
    });
