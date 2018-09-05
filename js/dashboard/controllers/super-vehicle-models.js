/**
 * Created by liqihai on 16/9/6.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleModelsCtrl',function ($scope , $rootScope,$state,MessageBox,SuperCarBS,$uibModal) {

        $scope.carModelList = null;
        var loadCarModels = function () {
            SuperCarBS.loadCarModelsOnPlatform()
                .then(function (result) {
                    $scope.carModelList = result.data;
                },function () {

                });
        };

        loadCarModels();

        $scope.onEditButtonClick = function (model) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-models-edit.html',
                controller: 'SuperVehicleModelsEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            carModel: model
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadCarModels();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };


        $scope.addNewCarModel = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-models-add.html',
                controller: 'SuperVehicleModelsAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadCarModels();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.showCarImage = function (model) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-models-image-list.html',
                controller: 'SuperListModelsImageListCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            carModel: model
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadCarModels();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        }
    });