/**
 * Created by liqihai on 16/9/6.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleModelsEditCtrl',function ($scope ,$stateParams, $rootScope,$state,MessageBox,SuperCarBS) {
        $scope.carModel = $stateParams.data.carModel;
        $scope.maxBags = $scope.carModel.bags_max;
        $scope.maxSeats = $scope.carModel.seats_max;
        $scope.carModelName = $scope.carModel.model_name;
        $scope.brandId = $scope.carModel.brand_id;
        $scope.categoryId = $scope.carModel.category_id;

        $scope.categories = null;
        $scope.brands = null;
        var init = function () {
            SuperCarBS.loadCarCategoriesOnPlatform().then(
                function (result) {
                    $scope.categories = result.data;
                },function () {

                }
            );
            SuperCarBS.loadCarBrandsOnPlatform().then(
                function (result) {
                    $scope.brands = result.data;
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
            SuperCarBS.saveCarModelOnPlatform(
                $scope.carModel.id,
                $scope.brandId,
                $scope.categoryId,
                $scope.maxBags,
                $scope.maxSeats,
                $scope.carModelName
            ).then(
                function () {
                    if ($stateParams.event.editSuccess) {
                        $stateParams.event.editSuccess();
                    }
                },
                function () {

                }
            );
        }
    });