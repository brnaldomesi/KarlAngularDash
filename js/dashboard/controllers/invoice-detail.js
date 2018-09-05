angular.module('KARL.Controllers')
    .controller('invoiceDetailCtrl', function ($uibModal,TransactionBS, $log, $scope, $state, MessageBox, OptionBS, $stateParams, $timeout,$rootScope) {
        $scope.listDataDetail = $stateParams.data;
        $scope.customerDetail = $stateParams.data.customer_data;
        $scope.driverDetail = $stateParams.data.driver_data;
        $scope.showEditButton = $stateParams.showEmailButton;
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.csvPage=1;
        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };

        $scope.sendEmail = function () {
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
        };


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