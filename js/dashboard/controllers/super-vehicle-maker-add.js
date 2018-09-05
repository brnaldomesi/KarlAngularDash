/**
 * Created by jian on 16-11-9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleMakerAddCtrl', function ($scope, $state, $stateParams, $rootScope, $timeout, SuperCarBS, MessageBox,T) {
        console.log($stateParams);

        $scope.makerName="";
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $timeout(function () {
            angular.element('#addCategoryForm').validator();
        }, 0);

        $scope.onCreateCarMaker = function () {
            MessageBox.showLoading();
            SuperCarBS.addCarBrandsOnPlatform($scope.makerName).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                MessageBox.toast(T.T("super_vehicle_category_add.jsAdd_success"), "Success");
                $stateParams.event.cancel();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("super_vehicle_category_add.jsGet_detail_fail"), "error");
                }
            })


        }
    });