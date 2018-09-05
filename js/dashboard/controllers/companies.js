/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('CompaniesCtrl', function ($log, $scope, $rootScope, $state, $uibModal, MessageBox, CompanyBS, T) {
        if (!$rootScope.loginUser) {
            return;
        }

        $scope.currentPage = 1;
        $scope.pageTotalItems = 1;
        $scope.pagePreCount = 12;

        $scope.onPageChange = function () {
            loadData();
        };

        // Event
        $scope.onAddButtonClick = function () {
            addCompany();
        };

        $scope.onEditButtonClick = function (id) {
            checkCompany(id);
        };

        // Function
        var loadData = function () {
            MessageBox.showLoading();
            if ($rootScope.loginUser.superadmin) {
                CompanyBS.getAllCompanies($scope.currentPage, $scope.pagePreCount).then(function (result) {
                    MessageBox.hideLoading();
                    console.log(result);
                    angular.forEach(result.data.companies, function (item) {
                        if (item.address.indexOf('address_components') > 0) {
                            item.address = JSON.parse(item.address);
                        } else {
                            item.address = {"formatted_address": item.address};
                        }
                    });
                    $scope.listData = result.data.companies;
                    $scope.pageTotalItems = result.data.total;
                    console.log($scope.listData);
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("companies.jsGet_companies_fail"), "error");
                    }
                });
            }
            else {
                // assert(1);
            }
        };

        var addCompany = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/company-add.html',
                controller: 'CompanyAddCtrl',
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
                            }
                        }
                    }
                }
            });
        };

        var checkCompany = function (companyId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/company-detail.html',
                controller: 'CompanyDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            companyId: companyId
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

        // Init
        loadData();
    });
