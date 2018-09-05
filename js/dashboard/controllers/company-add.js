/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('CompanyAddCtrl', function ($log, $scope, $state, $stateParams, $http, $timeout, MessageBox, CompanyBS,MapTool,T) {
        $scope.gender = '2';
        $timeout(function () {
            angular.element('#addCompanyForm').validator();
        }, 0);

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.getLocation = function (val) {
            return MapTool.getSearchLocations(val);
        };

        $scope.onSubmitButtonClick = function (valid) {
            if (!valid) {
                return;
            }
            addCompany();
        };

        var addCompany = function () {
            MessageBox.showLoading();

            $scope.admin.address = $scope.company.address;
            $scope.admin.address_number = $scope.company.address_number;
            $scope.admin.address_code_postal = $scope.company.address_code_postal;
            $scope.admin.gender = $scope.gender;


            //TODO 待修改
            $scope.charge.pay_type =1;
            var company_param = JSON.stringify($scope.company);
            var admin_param = JSON.stringify($scope.admin);
            var payment_param = JSON.stringify($scope.payment);
            var charge_param = JSON.stringify($scope.charge);
            CompanyBS.createCompany(company_param, admin_param, payment_param, charge_param)
                .then(function (result) {
                    MessageBox.hideLoading();
                    if ($stateParams.event.addSuccess) {
                        $stateParams.event.addSuccess();
                    }
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("vehicle_add.jsAdd_fail"), "error");
                    }
                });
        };

        $scope.companyLocation = function ($item, $model, $label, $event) {
            var address = jQuery.extend(true, {}, $item);
            address.formatted_address = $item.vicinity+' '+$item.name;
            MapTool.geocoderAddress($item.geometry.location.lat(),$item.geometry.location.lng(),function (result) {
                address.formatted_address = result.formatted_address;
                address.address_components = result.address_components;
                $('#companyAddressID').val(address.formatted_address);
                $timeout(function () {
                    $scope.company.address = address.formatted_address;
                    $scope.company.lat = address.geometry.location.lat();
                    $scope.company.lng = address.geometry.location.lng();
                    angular.forEach(address.address_components, function (item, index) {
                        if(item.types[0] == 'postal_code') {
                            $scope.company.address_code_postal = item.long_name;
                        }
                    });
                },100);
            },function (error) {});

            $scope.company.address = address.formatted_address;
            $scope.company.lat = address.geometry.location.lat();
            $scope.company.lng = address.geometry.location.lng();
        };

    });
