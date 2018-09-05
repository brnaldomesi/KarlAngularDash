/**
 * Created by jian on 17-8-9.
 */
angular.module('KARL.Controllers')
    .controller('salesRepEditCtrl', function ($stateParams, $scope, MessageBox, CompanyBS, $timeout, T) {
        console.log($stateParams);

        $scope.showSalesRep = true;
        $scope.countrys = angular.copy(countrysCode);


        $timeout(function () {
            // /************* 左右滑动tab ************* /
            $(".nav-slider li").click(function (e) {
                var mywhidth = $(this).width();
                $(this).addClass("act-tab");
                $(this).siblings().removeClass("act-tab");

                // make sure we cannot click the slider
                if ($(this).hasClass('slider')) {
                    return;
                }

                /* Add the slider movement */

                // what tab was pressed
                var whatTab = $(this).index();

                // Work out how far the slider needs to go
                var howFar = mywhidth * whatTab;

                $(".slider").css({
                    left: howFar + "px"
                });
            });
            // /************* / 左右滑动tab ************* /
        }, 0);

        $scope.onCancelButtonClick = function () {
            if ($scope.SalesRepForm.$dirty) {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("driver_add.jsExit_warning"), function (isConfirm) {
                    if (isConfirm) {
                        if ($stateParams.event.cancel) {
                            $stateParams.event.cancel();
                        }
                    }
                });
            } else {
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel();
                }
            }
        };

        $scope.changeTabs = function (tabIndex) {
            if (tabIndex == 0) {
                $scope.showSalesRep = true;
            } else {
                $scope.showSalesRep = false;
            }
        };

        loadData();
        function loadData() {
            MessageBox.showLoading();
            CompanyBS.getEditSalesRepInfo($stateParams.data.saleId).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                $scope.salesRepInfo = angular.copy(result.data.result);
                for (var i = 0; i < $scope.salesRepInfo.companies.length; i++) {
                    $scope.salesRepInfo.companies[i].selected = parseInt($scope.salesRepInfo.companies[i].selected);
                    $scope.salesRepInfo.companies[i].marked = parseInt($scope.salesRepInfo.companies[i].marked);
                    if ($scope.salesRepInfo.companies[i].selected === 1 || $scope.salesRepInfo.companies[i].marked === 1) {
                        $scope.salesRepInfo.companies[i].isSelect = true
                    } else {
                        $scope.salesRepInfo.companies[i].isSelect = false
                    }

                }
                console.log($scope.salesRepInfo)
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("drivers.jsGet_driver_fail"), "error");
                }
            })
        }


        $scope.onSubmitButtonClick = function (valid, event) {
            if (!$scope.salesRepInfo.first_name
                || !$scope.salesRepInfo.last_name
                || !$scope.salesRepInfo.email
                || !$scope.salesRepInfo.mobile
                || !$scope.salesRepInfo.email
            ) {
                MessageBox.toast(T.T("driver_edit.jsValue_format_error"), 'error');
                return;
            }

            var selectCompaniesIds = [];
            for (var i = 0; i < $scope.salesRepInfo.companies.length; i++) {
                if ($scope.salesRepInfo.companies[i].isSelect && $scope.salesRepInfo.companies[i].marked === 0) {
                    selectCompaniesIds.push($scope.salesRepInfo.companies[i].id);
                }
            }

            var params = {
                first_name: $scope.salesRepInfo.first_name,
                last_name: $scope.salesRepInfo.last_name,
                email: $scope.salesRepInfo.email,
                mobile: $scope.salesRepInfo.mobile,
                country: $scope.salesRepInfo.country,
                companies: selectCompaniesIds.join(',')
            };
            if ($scope.salesRepInfo.password) {
                if ($scope.salesRepInfo.password.length < 6 || $scope.salesRepInfo.password.length > 16) {
                    MessageBox.toast(T.T("driver_edit.jsPassword_limited_characters"), "error");
                    return;
                }
                if ($scope.salesRepInfo.password != $scope.salesRepInfo.confirmPassword) {
                    MessageBox.toast(T.T("driver_edit.jsNew_password_error"), "error");
                    return;
                }
                params.pwd = $scope.salesRepInfo.password;
            }
            console.log(params);
            MessageBox.showLoading();
            CompanyBS.updateSalesRepInfo(params, $stateParams.data.saleId).then(function (result) {
                MessageBox.hideLoading();
                $stateParams.event.addSuccess()
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicle_edit.jsUpdate_fail"), "error");
                }
            })
        }

    });
