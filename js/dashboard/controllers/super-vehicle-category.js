/**
 * Created by wangyaunzhi on 16/11/9.
 */
angular.module('KARL.Controllers')
    .controller('SuperVehicleCategoryCtrl', function (SuperCarBS, $log, $scope, $rootScope, $state, MessageBox, $uibModal) {
        if ($rootScope.loginUser == null) {
            $state.go('login');
            return;
        }

        var init = function () {
            $scope.categorySearch = '';
            SuperCarBS.loadCarCategoriesOnPlatform().then(
                function (result) {
                    $scope.categories = result.data;
                }, function () {
                }
            );
        };
        init();


        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/super-vehicle-category-add.html',
                controller: 'SuperVehicleCategoryAddCtrl',
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
                templateUrl: 'templates/dashboard/super-vehicle-category-edit.html',
                controller: 'SuperVehicleCategoryEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: $scope.categories[index],
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

        // $scope.onSearchButtonClick = function () {
        //     if (!$scope.categorySearch) {
        //         MessageBox.toast("Please enter the content", "error");
        //         return;
        //     } else {
        //         var arr = [];
        //         for (var i = 0; i < $scope.categories.length; i++) {
        //             if ($scope.categorySearch.toString().toLowerCase() == $scope.categories[i].name.toString().toLowerCase()) {
        //                 arr.push($scope.categories[i]);
        //             }
        //         }
        //         $scope.categories.length = 0;
        //         for (var k = 0; k < arr.length; k++) {
        //             $scope.categories.push(arr[k])
        //         }
        //     }
        // }

    });
