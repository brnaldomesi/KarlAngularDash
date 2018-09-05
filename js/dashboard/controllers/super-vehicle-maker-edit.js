/**
 * Created by jian on 16-11-9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleMakerEditCtrl',function ($scope, $state,$stateParams,$timeout, SuperCarBS,MessageBox,T) {
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $timeout(function () {
            angular.element('#editCategoryForm').validator();
        }, 0);

        var init=function () {
            $scope.carMaker=$stateParams.data;
            console.log("make is ",$scope.carMaker);
        };
        init();
        
        $scope.onEditVehicle=function () {
            MessageBox.showLoading();
            SuperCarBS.editCarBrandsOnPlatform($scope.carMaker.id,$scope.carMaker.name).then(
                function (result) {
                    MessageBox.hideLoading();
                    console.log(result);
                    MessageBox.toast(T.T("super_vehicle_category_edit.jsEdit_success"), "Success");
                    $stateParams.event.cancel();
                },function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("super_vehicle_category_add.jsGet_detail_fail"), "error");
                    }
                }
            )
        }
        
    });

