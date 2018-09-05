/**
 * Created by wangyaunzhi on 16/11/9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleMakerCtrl', function (SuperCarBS, $log, $scope, $rootScope, $state, MessageBox, $uibModal) {
        if ($rootScope.loginUser == null) {
            $state.go('login');
            return;
        }

        var init = function () {
            SuperCarBS.loadCarBrandsOnPlatform().then(
                function (result) {
                    $scope.maker = result.data;
                }, function () {
                }
            );
        };
        init();


        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-maker-add.html',
                controller: 'SuperVehicleMakerAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                // loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                                init();
                            }
                        }
                    }

                }
            });
        };


        $scope.onEditButtonClick = function (index) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-maker-edit.html',
                controller: 'SuperVehicleMakerEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: $scope.maker[index],
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                                init();
                            }
                        }
                    }

                }
            });
        };
    });
