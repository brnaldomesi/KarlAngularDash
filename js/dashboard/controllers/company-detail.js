/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event editSuccess
 */
angular.module('KARL.Controllers')
    .controller('CompanyDetailCtrl', function ($timeout, $log, $scope, $state, $stateParams, MessageBox, CompanyBS,T) {

        $scope.company_id = $stateParams.data.companyId;
        var company;

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        // $timeout(function () {
        //     angular.element('#companyEditForm').validator();
        // }, 0);


        var loadData = function () {
            MessageBox.showLoading();
            CompanyBS.getCompanyDetails($scope.company_id).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                if (result.data.address.indexOf('address_components') > 0) {
                    $scope.address = JSON.parse(result.data.address).formatted_address;
                } else {
                    $scope.address = result.data.address
                }
                company = result.data;
                $scope.name = company.name;
                $scope.rate = company.rate;
                $scope.customer_count = company.customer_count;
                $scope.car_count = company.car_count;
                $scope.driver_count = company.driver_count;
                $scope.offer_count = company.offer_count;
                $scope.option_count = company.option_count;
                $scope.pushProfile = company.push_profile;
                $scope.pushToken = company.push_api_token;
                $scope.gmt = company.gmt;
                $scope.address_number = company.address_number;
                $scope.address_code_postal = company.address_code_postal;
                $scope.domain = company.domain;
                $scope.img = company.img;
                $scope.an_locked = company.an_locked;
                $scope.configId = company.push_config_id;
                $scope.androidApp = company.android_app;
                $scope.androidPkgName = company.pkg_name;
                $scope.iosApp = company.ios_app;
                $scope.iosId = company.ios_id;
                $scope.pushConfigId = company.push_config_id;
                $scope.salesRepName=company.sale_name;
                if(company.sale_id&&company.sale_name){
                    $scope.saleRepId=company.sale_id;
                    $scope.saleRep=company.sale_name + " " +company.sale_id ;
                }else {
                    $scope.saleRep='No Select'
                }

                if(company.asst_id&&company.asst_name){
                    $scope.saleAssistant=company.asst_name + " " +company.asst_id ;
                }else {
                    $scope.saleAssistant='No Select'
                }

            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsGet_detail_fail"), "error");
                }
            });
        };

        loadData();

        $scope.saveButtonClick = function () {
            if(!$scope.rate){
                MessageBox.toast(T.T("company_detail.jsInput_company_rate"), "error");
                return;
            }
            MessageBox.showLoading();
            CompanyBS.companyDetailRate($scope.rate, $scope.company_id).then(function (result) {
                MessageBox.hideLoading();
                $stateParams.event.cancel();
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsModify_rate_fail"), "error");
                }
            })
        };


        $scope.isShowConfig=function () {
            $scope.showConfig=!$scope.showConfig
        };


        $scope.savePushClick=function ($event) {
            if(!$scope.pushProfile){
                MessageBox.toast(T.T("company_detail.jsInput_push_profile"), "error");
                return;
            }
            if(!$scope.pushToken){
                MessageBox.toast(T.T("company_detail.jsInput_push_token"), "error");
                return;
            }
            var ladda = Ladda.create($event.target);
            ladda.start();
            if ($scope.pushConfigId==null) {
                addConfigPush(ladda)
            }else {
                modifyConfigPush(ladda);
            }
        };


        $scope.saveAppClick=function ($event) {
            if(!$scope.androidApp){
                MessageBox.toast(T.T("company_detail.jsInput_android_url"), "error");
                return;
            }
            if(!$scope.androidPkgName){
                MessageBox.toast(T.T("company_detail.jsInput_Android_package_name"), "error");
                return;
            }
            if(!$scope.iosApp){
                MessageBox.toast(T.T("company_detail.jsInput_ios_url"), "error");
                return;
            }
            if(!$scope.iosId){
                MessageBox.toast(T.T("company_detail.jsInput_IOS_App_Id"), "error");
                return;
            }
            var ladda = Ladda.create($event.target);
            ladda.start();
            modifyCompanyApp(ladda)
        };


        var addConfigPush = function (ladda) {
            CompanyBS.addCompanyPush($scope.pushProfile, $scope.pushToken, $scope.company_id).then(function (result) {
                MessageBox.toast(T.T("company_detail.jsAdd_push_config_success"), "success");
                ladda.stop();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsAdd_push_config_fail"), "error");
                }
                ladda.stop();
            })
        };


        var modifyConfigPush = function (ladda) {
            CompanyBS.modifyCompanyPush($scope.pushProfile, $scope.pushToken, $scope.configId).then(function (result) {
                MessageBox.toast(T.T("company_detail.jsModify_push_config_success"), "success");
                console.log(result);
                ladda.stop();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsModify_push_config_fail"), "error");
                }
                ladda.stop();
            })
        };

        var modifyCompanyApp = function (ladda) {
            CompanyBS.modifyCompanyApp(
                $scope.androidApp,
                $scope.androidPkgName,
                $scope.iosApp,
                $scope.iosId,
                $scope.company_id).then(function (result) {
                console.log(result);
                MessageBox.toast(T.T("company_detail.jsModify_passenger_app_success"), "success");
                ladda.stop();
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("company_detail.jsModify_passenger_app_fail"), "error");
                }
                ladda.stop();
            })
        };


        $scope.lockSwitchAn = function (an_locked) {
            if(an_locked == AnLocked.Locked){
                an_locked = AnLocked.Unlocked
            }else{
                an_locked = AnLocked.Locked
            }
            CompanyBS.changeCompanyAnSettingLock($scope.company_id,an_locked)
                .then(function (result) {
                    MessageBox.toast("Change company "+$scope.name+" AN setting success", "success");
                    $scope.an_locked = an_locked;
                },function (error) {
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast("Change company "+$scope.name+" AN setting Field", "error");
                    }
                })


        }
    });
