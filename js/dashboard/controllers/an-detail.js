/**
 * Created by wanghui on 16-11-18.
 */
angular.module('KARL.Controllers')
    .controller('anDetailCtrl', function (TransactionBS, $log, $rootScope, $scope, $state, MessageBox, OptionBS, $stateParams,$uibModal) {
        $scope.listDataDetail = $stateParams.data;
        $scope.customerDetail = $stateParams.data.customer_data;
        $scope.driverDetail = $stateParams.data.driver_data;
        $scope.showEditButton = $stateParams.showEmailButton;
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.csvPage=3;
        if ($scope.listDataDetail.own_com_id == $rootScope.loginUser.company_id) {
            $scope.canSendEmail = true;
        } else {
            $scope.canSendEmail = false;
        }

        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };

        $scope.orderInvoice = function () {

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/finance-send-email.html',
                controller: 'financeSendEmail',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            customerData: $scope.customerDetail,
                            bookingId:$scope.listDataDetail.booking_id
                        },
                        event: {
                            cancel: function (close) {
                                if(close){
                                    modalInstance.dismiss();
                                    $stateParams.event.cancel();
                                    $stateParams.event.archive()
                                }else {
                                    modalInstance.dismiss();
                                }

                            }
                        }
                    }

                }
            });
        }
        $scope.showInvoiceHtml = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/book-invoice-detail.html',
                controller: 'BookInvoiceDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            bookingId:$scope.listDataDetail.booking_id
                        },
                        event: {
                            cancel: function (close) {
                                if(close){
                                    modalInstance.dismiss();
                                    $stateParams.event.cancel();
                                    $stateParams.event.archive()
                                }else {
                                    modalInstance.dismiss();
                                }

                            }
                        }
                    }

                }
            });
        }
    });