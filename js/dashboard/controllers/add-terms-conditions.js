/**
 * Created by gaohui on 17-1-18.
 */
angular.module('KARL.Controllers', ['angular-medium-editor'])
    .controller('TermsConditionsAddCtrl', function ($log, $scope, $state, $stateParams, $rootScope, $http, Base64, $timeout, CompanyBS, MessageBox, T) {
        $scope.disclaimer = $stateParams.data.payment;

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onEditCompanyDisclaimer = function () {
            if (!$scope.disclaimer) {
                $scope.disclaimer = '<p><br></p>';
            }
            CompanyBS.editCompanyDisclaimer(Base64.encode($scope.disclaimer)).then(function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("terms_conditions.jsEdit_Company_Disclaimer_Successfully"), "Success");
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel(0);
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (treated) {
                }
                else {
                    MessageBox.toast(T.T("terms_conditions.jsCancel_Edit_Company_Disclaimer_Fail"), "error");
                }
            })
        };
    });