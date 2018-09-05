/**
 * Created by jian on 17-8-8.
 */
angular.module('KARL.Controllers')
    .controller('salesRepCtrl', function ($scope, $uibModal, MessageBox, CompanyBS, $timeout) {
        $scope.currentPage = 1;
        $scope.pagePerCount = 12;
        $scope.countrys = angular.copy(countrysCode);
        $scope.searchResult = [];
        $scope.showSearchResult = false;
        $scope.input = {
            searchText: undefined
        };
        $scope.addSalesRep = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/sales-rep-add.html',
                controller: 'salesRepAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadSales();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        loadSales();
        function loadSales() {
            MessageBox.showLoading();
            CompanyBS.getSalesRep($scope.currentPage, $scope.pagePerCount, $scope.input.searchText).then(function (result) {
                MessageBox.hideLoading();
                if (result.data.result.sales.length === 0 && $scope.input.searchText) {
                    $timeout(function () {
                        $scope.showSearchResult = true;
                    }, 0)
                } else {
                    $scope.showSearchResult = false;
                }
                $scope.pageTotalItems = result.data.result.total;
                $scope.salesRepList = result.data.result.sales;
                for (var i = 0; i < $scope.salesRepList.length; i++) {
                    for (var k = 0; k < $scope.countrys.length; k++) {
                        if ($scope.salesRepList[i].country === $scope.countrys[k].countryCode) {
                            $scope.salesRepList[i].countryName = $scope.countrys[k].name
                        }
                    }
                }
                console.log(result);
                $timeout(function () {
                    $(function () {
                        $(".card-more").click(function () {
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function () {
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function () {
                            $(this).parents(".gen-panel").fadeOut(200);
                        });
                    });
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("drivers.jsGet_driver_fail"), "error");
                }
            })
        }

        $scope.onPageChange = function () {
            loadSales();
        };

        $scope.onEditButtonClick = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/sales-rep-edit.html',
                controller: 'salesRepEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            saleId: id
                        },
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadSales();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            CompanyBS.deleteSalesRepInfo(id).then(function (result) {
                MessageBox.hideLoading();
                loadSales()
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    MessageBox.toast(T.T("comment.jsDelete_fail"), "error");
                }
            })
        };

        $scope.$watch('input.searchText', function (word) {
                $scope.currentPage = 1;
                loadSales();
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

    });
