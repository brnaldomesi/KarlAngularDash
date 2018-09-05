/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('StripeAcctCtrl', function ($log, $scope, $rootScope, $state, $stateParams, $timeout, $filter,MessageBox, CarBS,T) {
        if($rootScope.loginUser == null){
            $state.go('login');
            return;
        }
        var clientId = ApiServer.stripeClientId;
        $scope.link = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id="+clientId+"&scope=read_write;"

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };
    });
