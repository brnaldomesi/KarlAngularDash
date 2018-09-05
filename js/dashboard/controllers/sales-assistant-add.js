/**
 * Created by jian on 17-9-9.
 */
angular.module('KARL.Controllers')
    .controller('salesAssistantAddCtrl', function ($scope, $stateParams, $timeout, MessageBox, CompanyBS) {

        $timeout(function () {
            angular.element('#SalesAssistantForm').validator();
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

        $scope.salesAssistantInfo = {};

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onSubmitButtonClick = function (valid, $event) {
            if ($scope.salesAssistantInfo.password != $scope.salesAssistantInfo.confirmPassword) {
                MessageBox.toast('Password Verification Error', "error");
                return
            }
            console.log($scope.salesAssistantInfo);
            var ladda = Ladda.create($event.target);
            ladda.start();
            CompanyBS.createSalesAssistant($scope.salesAssistantInfo).then(function (result) {
                console.log(result)
                ladda.stop();
                MessageBox.toast("Sales Assistant created successfully!", "info");
                $stateParams.event.addSuccess();
            }, function (error) {
                ladda.stop();
                if (error.treated) {
                }
                else {
                    MessageBox.toast("Sorry, we couldn't add the Sales Assistant.", "error");
                }
            });

        }
    });
