/**
 * Created by jian on 17-9-9.
 */
angular.module('KARL.Controllers')
    .controller('salesAssistantEditCtrl', function ($stateParams, $scope, MessageBox, CompanyBS, $timeout, T) {
        console.log($stateParams);

        $scope.showSalesAssistant = true;
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
            if ($scope.SalesAssistantForm.$dirty) {
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
                $scope.showSalesAssistant = true;
            } else {
                $scope.showSalesAssistant = false;
            }
        };

        loadData();
        function loadData() {
            MessageBox.showLoading();
            CompanyBS.getEditSalesAssistantInfo($stateParams.data.saleId).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                $scope.salesAssistantInfo = angular.copy(result.data.result);
                var salesArray = [];

                for (var i = 0; i < $scope.salesAssistantInfo.sales.length; i++) {
                    $scope.salesAssistantInfo.sales[i].selected = parseInt($scope.salesAssistantInfo.sales[i].selected);
                    $scope.salesAssistantInfo.sales[i].marked = parseInt($scope.salesAssistantInfo.sales[i].marked);
                    if ($scope.salesAssistantInfo.sales[i].selected == 1||$scope.salesAssistantInfo.sales[i].marked==1) {
                        $scope.salesAssistantInfo.sales[i].isSelect = true
                    } else {
                        $scope.salesAssistantInfo.sales[i].isSelect = false
                    }
                    var haveSales = false;
                    for (var k = 0; k < salesArray.length; k++) {
                        if (salesArray[k].salesIds === $scope.salesAssistantInfo.sales[i].sale_id) {
                            haveSales = true;
                            if ($scope.salesAssistantInfo.sales[i].selected == 1&&$scope.salesAssistantInfo.sales[i].marked!=1) {
                                // $scope.salesAssistantInfo.sales[i].selectedCount++;
                                salesArray[k].selectedCount++
                            }
                            salesArray[k].salesArr.push($scope.salesAssistantInfo.sales[i]);
                            break;
                        }
                    }
                    if (!haveSales) {
                        var selectedCount = 0;
                        if ($scope.salesAssistantInfo.sales[i].selected == 1&&$scope.salesAssistantInfo.sales[i].marked!=1) {
                            selectedCount++;
                        }
                        var item = {
                            salesIds: $scope.salesAssistantInfo.sales[i].sale_id,
                            salesArr: $scope.salesAssistantInfo.sales[i].company_id === null ? [] : [$scope.salesAssistantInfo.sales[i]],
                            salesName: $scope.salesAssistantInfo.sales[i].first_name + $scope.salesAssistantInfo.sales[i].last_name,
                            "selectedCount": selectedCount
                        };
                        salesArray.push(item)
                    }
                }
                console.log(salesArray);
                $scope.salesArray = salesArray;
                $timeout(function () {
                    angular.element('#SalesAssistantForm').validator();
                    $(function () {
                        $("#salesAssistant-accordion").accordion({
                            header: 'h3.rates-select',
                            active: true,
                            alwaysOpen: false,
                            animated: false,
                            collapsible: true,
                            heightStyle: "content"
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


        $scope.onSalesAssSelect = function (salesAss, company) {
            for(var i=0;i<salesAss.salesArr.length;i++){
                if(salesAss.salesArr[i].company_id===company.company_id){
                    console.log(salesAss.salesArr[i]);
                    if(company.isSelect){
                        salesAss.selectedCount++
                    }else {
                        salesAss.selectedCount--
                    }
                }
            }
        };


        $scope.onSubmitButtonClick = function (valid, event) {
            console.log($scope.salesAssistantInfo);
                if (!$scope.salesAssistantInfo.first_name
                    || !$scope.salesAssistantInfo.last_name
                    || !$scope.salesAssistantInfo.email
                    || !$scope.salesAssistantInfo.mobile
                    || !$scope.salesAssistantInfo.email
                ) {
                    MessageBox.toast(T.T("driver_edit.jsValue_format_error"), 'error');
                    return;
                }

                var selectCompanies = [];
                for (var i = 0; i < $scope.salesAssistantInfo.sales.length; i++) {
                    if ($scope.salesAssistantInfo.sales[i].isSelect && $scope.salesAssistantInfo.sales[i].marked == 0) {
                        var item={
                            id:$scope.salesAssistantInfo.sales[i].company_id,
                            sale_id:$scope.salesAssistantInfo.sales[i].sale_id
                        };
                        selectCompanies.push(item);
                    }
                }

                var params = {
                    first_name: $scope.salesAssistantInfo.first_name,
                    last_name: $scope.salesAssistantInfo.last_name,
                    email: $scope.salesAssistantInfo.email,
                    mobile: $scope.salesAssistantInfo.mobile,
                    country: $scope.salesAssistantInfo.country,
                    companies: selectCompanies
                };
                if ($scope.salesAssistantInfo.password) {
                    if ($scope.salesAssistantInfo.password.length < 6 || $scope.salesAssistantInfo.password.length > 16) {
                        MessageBox.toast(T.T("driver_edit.jsPassword_limited_characters"), "error");
                        return;
                    }
                    if ($scope.salesAssistantInfo.password != $scope.salesAssistantInfo.confirmPassword) {
                        MessageBox.toast(T.T("driver_edit.jsNew_password_error"), "error");
                        return;
                    }
                    params.pwd = $scope.salesAssistantInfo.password;
                }
                console.log(params);
                MessageBox.showLoading();
                CompanyBS.updateSalesAssistantInfo(params, $stateParams.data.saleId).then(function (result) {
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
