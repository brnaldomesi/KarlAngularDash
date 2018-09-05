/**
 * Created by jian on 16-11-9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleCategoryEditCtrl',function ($scope, $state,$stateParams,$timeout, SuperCarBS,MessageBox,T) {
        console.log($stateParams.data);
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $timeout(function () {
            angular.element('#editCategoryForm').validator();
        }, 0);

        var init=function () {
            $scope.CategoryName=$stateParams.data.name;
            $scope.CategoryDescribe=$stateParams.data.description;
        };
        init();
        
        $scope.onEditOption=function () {
            MessageBox.showLoading();
            SuperCarBS.modifyCategories($scope.CategoryName,$scope.CategoryDescribe,$stateParams.data.id).then(
                function (result) {
                    MessageBox.hideLoading();
                    console.log(result);
                    MessageBox.toast(T.T("super_vehicle_category_edit.jsEdit_success"), "Success");
                    $stateParams.event.cancel();
                    // MessageBox.alertView('Edit Successful !')
                },function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T('super_vehicle_category_add.jsGet_detail_fail'), "error");
                    }
                }
            )
        }
        
    });

