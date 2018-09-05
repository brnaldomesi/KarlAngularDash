/**
 * Created by wangyaunzhi on 16/11/9.
 */
angular.module('KARL.Controllers')
    .controller('SuperRateRuleCtrl', function (SuperRateBS, $log, $scope, $rootScope, $state, MessageBox, $uibModal) {
        if ($rootScope.loginUser == null) {
            $state.go('login');
            return;
        }
        $scope.rateRule = [
            {
                invl_start: 0,
                invl_end: 99999999,
                rate: 0.2
            }
        ];

        var init = function () {
            SuperRateBS.getRateRules().then(
                function (result) {
                    $scope.rateRule = result.data;
                    if($scope.rateRule.length === 0 ){
                        $scope.rateRule = [
                            {
                                invl_start: 0,
                                invl_end: 99999999,
                                rate: 0.2
                            }
                        ];
                    }
                }, function () {
                }
            );
        };
        init();


        $scope.addRule = function () {
            var index = $scope.rateRule.length;
            var last = $scope.rateRule[index - 1];
            $scope.rateRule[index-1] = {
                invl_start: 0,
                invl_end: 0,
                rate: 0
            };
            $scope.rateRule[index] = last;

        };

        $scope.removeZone = function (index) {
            $scope.rateRule.splice(index, 1);
        };

        $scope.saveAndUpdate  = function () {
            MessageBox.showLoading();
            if($scope.rateRule.length ===1){
                $scope.rateRule[0].invl_start = 0;
                $scope.rateRule[0].invl_end = 99999999;
            }else{
                var startMark = [];
                for(var i=$scope.rateRule.length-1;i>0; i--){
                    if(startMark.indexOf($scope.rateRule[i-1].invl_end)!==-1){
                        MessageBox.toast("please check the number.","error");
                        return ;
                    }
                    startMark[i]=$scope.rateRule[i-1].invl_end;
                    $scope.rateRule[i].invl_start = $scope.rateRule[i-1].invl_end;
                }
            }
            SuperRateBS.updateRateRules(JSON.stringify($scope.rateRule)).then(
                function (result) {
                    $scope.rateRule = result.data;
                    MessageBox.hideLoading();
                }, function () {
                    MessageBox.hideLoading();
                }
            );
        }

    });
