/**
 * Created by jian on 16-11-9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleCategoryAddCtrl', function ($scope, $state, $stateParams, $rootScope, $timeout, SuperCarBS, MessageBox,T) {
        console.log($stateParams);


        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $timeout(function () {
            angular.element('#addCategoryForm').validator();
        }, 0);

        $scope.onCreateOption = function () {
            console.log($scope.CategoryName);
            console.log($scope.CategoryDescribe);
            MessageBox.showLoading();
            SuperCarBS.addCarCategoriesOnPlatform($scope.CategoryName, $scope.CategoryDescribe).then(function (result) {
                MessageBox.hideLoading();
                console.log(result);
                MessageBox.toast(T.T('super_vehicle_category_add.jsAdd_success'), "Success");
                $stateParams.event.cancel();
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T('super_vehicle_category_add.jsGet_detail_fail'), "error");
                }
            })


        }
    });