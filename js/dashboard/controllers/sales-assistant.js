/**
 * Created by jian on 17-9-8.
 */
angular.module('KARL.Controllers')
    .controller('salesAssistantCtrl', function ($scope, $uibModal, MessageBox, CompanyBS, $timeout) {
        $scope.currentPage = 1;
        $scope.pagePerCount = 12;
        $scope.countrys = angular.copy(countrysCode);
        $scope.showSearchResult = false;
        $scope.input = {
            searchText: undefined
        };
        $scope.addSalesAssistant = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/sales-assistant-add.html',
                controller: 'salesAssistantAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadAssistant();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        loadAssistant();
        function loadAssistant() {
            MessageBox.showLoading();
            CompanyBS.getSalesAssistant($scope.currentPage, $scope.pagePerCount, $scope.input.searchText).then(function (result) {
                MessageBox.hideLoading();
                if ($scope.input.searchText) {
                        $scope.showSearchResult = true;
                } else {
                    $scope.showSearchResult = false;
                }
                $scope.pageTotalItems = result.data.result.total;
                $scope.salesAssistantList = result.data.result.sales;
                for (var i = 0; i < $scope.salesAssistantList.length; i++) {
                    for (var k = 0; k < $scope.countrys.length; k++) {
                        if ($scope.salesAssistantList[i].country === $scope.countrys[k].countryCode) {
                            $scope.salesAssistantList[i].countryName = $scope.countrys[k].name
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
            loadAssistant();
        };

        $scope.onEditButtonClick = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/sales-assistant-edit.html',
                controller: 'salesAssistantEditCtrl',
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
                                loadAssistant();
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
            CompanyBS.deleteSalesAssistantInfo(id).then(function (result) {
                MessageBox.hideLoading();
                loadAssistant()
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
            loadAssistant();
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

    });