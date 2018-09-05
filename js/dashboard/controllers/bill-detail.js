/**
 * Created by wanghui on 16-11-18.
 */
angular.module('KARL.Controllers')
    .controller('billDetailCtrl', function (TransactionBS,$log, $scope, $rootScope,$state, MessageBox, OptionBS, $stateParams, $timeout) {
        $scope.listDataDetail = $stateParams.data;
        $scope.customerDetail = $stateParams.data.customer_data;
        $scope.driverDetail = $stateParams.data.driver_data;
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.csvPage=2;
        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };
    });