/**
 * Created by jian on 17-8-8.
 */
angular.module('KARL.Controllers')
    .controller('salesRepAddCtrl', function ($scope, $stateParams, $timeout, MessageBox, CompanyBS) {

        $timeout(function () {
            angular.element('#SalesRepForm').validator();
        }, 0);

        $scope.countrys = angular.copy(countrysCode);
        $scope.languages = [
            {
                name:'English',
                value:'en'
            },
            {
                name:'French',
                value:'fr'
            }
        ];

        $scope.salesRepInfo = {};

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onSubmitButtonClick = function (valid, $event) {
            if ($scope.salesRepInfo.password != $scope.salesRepInfo.confirmPassword) {
                MessageBox.toast('Password Verification Error', "error");
                return
            }
            console.log($scope.salesRepInfo);
            var ladda = Ladda.create($event.target);
            ladda.start();
            CompanyBS.createSalesRep($scope.salesRepInfo).then(function (result) {
                ladda.stop();
                MessageBox.toast("Sales Rep created successfully!", "info");
                $stateParams.event.addSuccess();
            }, function (error) {
                ladda.stop();
                if (error.treated) {
                }
                else {
                    MessageBox.toast("Sorry, we couldn't add the Sales Rep.", "error");
                }
            });

        }
    });
