/**
 * Created by liqihai on 16/9/6.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleModelsAddCtrl',function ($scope ,$stateParams, $rootScope,$state,MessageBox,SuperCarBS) {
        $scope.maxBags = 4;
        $scope.maxSeats = 4;
        $scope.carModelName = null;
        $scope.brandId = null;
        $scope.categoryId = null;

        $scope.categories = null;
        $scope.brands = null;
        var init = function () {
            SuperCarBS.loadCarCategoriesOnPlatform().then(
                function (result) {
                    $scope.categories = result.data;
                    $scope.categoryId = $scope.categories[0].id;
                },function () {

                }
            );
            SuperCarBS.loadCarBrandsOnPlatform().then(
                function (result) {
                    $scope.brands = result.data;
                    $scope.brandId = $scope.brands[0].id;
                },function () {

                }
            );
        };
        init();


        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };


        $scope.save = function () {
            SuperCarBS.addCarModelOnPlatform(
                $scope.brandId,
                $scope.categoryId,
                $scope.maxBags,
                $scope.maxSeats,
                $scope.carModelName
            ).then(
                function () {
                    if ($stateParams.event.addSuccess) {
                        $stateParams.event.addSuccess();
                    }
                },
                function () {

                }
            );
        }
    });