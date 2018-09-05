/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('ClientsCtrl', function ($log ,$scope, $rootScope, $state, $uibModal, $timeout, MessageBox, CustomerBS, T) {
        if (!$rootScope.loginUser) {
            return;
        }
        $scope.currentPage = 1;
        $scope.pageTotalItems = 1;
        $scope.pagePreCount = 12;
        $scope.input = {
            searchText:undefined
        };
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/client-add.html',
                controller: 'ClientAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            },
                            Data:function () {

                            }
                        }
                    }
                }
            });
        };

        $scope.onEditButtonClick = function (customer) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/client-edit.html',
                controller: 'ClientEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            customer: customer
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onPageChange = function () {
            loadData();
        };

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        // Function
        var loadData = function () {
            MessageBox.showLoading();
            if (!$rootScope.loginUser.superadmin) {
                CustomerBS.getFromCurrentUser($scope.currentPage, $scope.pagePreCount, $scope.input.searchText).then(function (result) {
                    MessageBox.hideLoading();
                    angular.forEach(result.data, function (item, index) {
                        item.mouse = false;
                        if (item.cards.length > 0) {
                            if (item.cards[0].card_type == 1) {
                                item.cardTypeImg = 'img/dashboard/card-visa.png';
                            } else if (item.cards[0].card_type == 2) {
                                item.cardTypeImg = 'img/dashboard/card-mastercard.png';
                            } else if (item.cards[0].card_type == 3) {
                                item.cardTypeImg = 'img/dashboard/card-american-express.png';
                            } else if (item.cards[0].card_type == 4) {
                                item.cardTypeImg = 'img/dashboard/card-discover.png';
                            }
                            if (item.cards[0].card_number) {
                                item.cardNumber = ' ****' + item.cards[0].card_number.replace(/x/g, '');
                            } else {
                                item.cardNumber = '';
                            }
                            if (item.cards.length == 1) {
                                item.cardCount = '';
                            } else {
                                item.cardCount = '+' + (item.cards.length - 1).toString() + ' Payments';
                            }
                        } else {
                            item.cardNumber = 'No Card';
                            item.cardCount = '';
                        }
                    });
                    
                    $scope.listData = result.data;
                    $scope.pageTotalItems = result.total;
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T('client.jsGet_client_fail'), "error");
                    }
                });
            }
            else {
                // TODO: 处理SuperAdmin情况
            }
        };

        // Init
        loadData();

        var deleteFinalDetermine = function (customerId) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("comment.jsDetermine_to_delete"), function (isConfirm) {
                if (isConfirm) {
                    CustomerBS.deleteFromCurrentUser(customerId).then(function (result) {
                        MessageBox.hideLoading();
                        MessageBox.toast(T.T("comment.jsDelete_passenger_success"));
                        loadData();
                    }, function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                        }
                        else {
                            if(error.response.data.code == "3604"){
                                MessageBox.toast(T.T("client.jsPassenger_has_booking"), "error");
                            }else{
                                MessageBox.toast(T.T("client.jsDelete_passenger_fault"), "error");
                            }
                        }
                    });
                }
            })
        };

        $scope.deleteCustomer = function (customerId) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("client.jsDelete_customer"), function (isConfirm) {
                MessageBox.hideLoading();
                if (isConfirm) {
                    setTimeout(function(){
                        deleteFinalDetermine(customerId)
                    },100);

                }
            });
        };

        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                $scope.currentPage = 1;
                loadData();
            }, 10);
        });


    });
