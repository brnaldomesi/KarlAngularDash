/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('VehicleEditCtrl', function ($log, $scope, $rootScope,$stateParams,$state, $uibModal, $location, $timeout, MessageBox,VerifyBS,T) {
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }
        var index = $rootScope.carIndex;
        $scope.car = angular.copy($rootScope.carList[index]);
        $scope.brands = undefined;
        $scope.brandModels = undefined;

        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };


        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        var loopBrandAndModels = function () {
            angular.forEach($scope.brands,function (brand) {
                if(brand.car_brand_id == $scope.car.brand_id){
                    $scope.brandModels = brand.car_models;
                }
            });
        };

        var initData = function () {
            VerifyBS.getAllCarsModels().then(function (result) {
                $scope.brands = result.data;
                $rootScope.brands = $scope.brands;
                loopBrandAndModels();
            },function (error) {
                if(error.treated){

                }else{

                }
            })
        };

        $scope.selectCarBrands = function () {
            angular.forEach($scope.brands ,function (brand) {
                if (brand.car_brand_id == $scope.car.brand_id){
                    $scope.car.brand_name = brand.car_brand_name;
                    $scope.brandModels = brand.car_models;
                    $scope.car.model_id = brand.car_models[0].car_model_id;
                    $scope.car.model_name = brand.car_models[0].car_model_name;
                    return false;
                }
            });
        };
        $scope.selectCarBrandModels = function () {
            angular.forEach($scope.brandModels,function (model) {
                if (model.car_model_id == $scope.car.model_id){
                    $scope.car.model_name = model.car_model_name;
                }
            })
        };

        if($rootScope.brands == undefined){
            initData();
        }else{
            $scope.brands = $rootScope.brands ;
            loopBrandAndModels();
        }


        $scope.deleteCar = function () {
            VerifyBS.deleteCars($scope.car.car_id).then(
                function (result) {
                    $rootScope.carList.splice(index,1);
                    $state.go('vehicle')
                },function (error) {
                    MessageBox.toast(T.T('board_edit_vehicle.jsDelete_car_error'));
                }
            );
        };
        $scope.updateCarInfo = function () {
            if ($scope.car.year == undefined || $scope.car.year.trim(' ')==''){
                MessageBox.toast(T.T('board_add_vehicle.jsYear_null'),'error');
                return;
            }

            if ($scope.car.color == undefined || $scope.car.color.trim(' ') =='' ){
                MessageBox.toast(T.T('board_add_vehicle.jsColor_null'),'error');
                return;
            }
            if ($scope.car.license == undefined || $scope.car.license.trim(' ') =='' ){
                MessageBox.toast(T.T('board_add_vehicle.jsLicense_null'),'error');
                return;
            }
            VerifyBS.updateCarsInfo($scope.car).then(
                function (result) {
                    $rootScope.carList[index]=$scope.car;
                    $state.go('vehicle')
                },function (error) {
                    MessageBox.toast(T.T('board_edit_vehicle.jsUpdate_car_error'));
                }
            );
        }


        $scope.backEvent = function () {
            $state.go('vehicle');
        }
    });
