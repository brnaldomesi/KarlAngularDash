/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('BookInvoiceDetailCtrl', function ($log, $sce,$scope, $rootScope, $state, $stateParams, MessageBox, BookBS, $uibModal) {
        var token = $rootScope.loginUser.token;
        var bookingId = $stateParams.data.bookingId;
        var url = ApiServer.serverUrl + ApiServer.version+"/companies/bookings/"+bookingId+"/invoice/html?token="+token;
        $scope.invoiceUrl = $sce.trustAsResourceUrl(url);
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

    });
