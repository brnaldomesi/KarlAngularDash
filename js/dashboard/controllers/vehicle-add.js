/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('VehicleAddCtrl', function ($log, $scope, $state, $stateParams, $timeout, MessageBox, CarBS, CarCategoryBS, CarBrandBS, CarModelBS, T) {

        $timeout(function () {
            angular.element('#vehicleForm').validator();
        }, 0);
        $scope.file = undefined;
        $scope.fileType = 0;
        $scope.preTime = 0;
        $scope.maxPassengers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        $scope.selectedMaxPassengers = 0;
        $scope.maxBags = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.selectedMaxBags = 0;
        $scope.routineData=[
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000',
            '000000000000000000000000000000000000000000000000'
        ];

        $scope.uploadImage = function (files, $event) {
            if (!files) {
                return
            }
            $scope.bigImageUrl = files.$ngfBlobUrl;
            $scope.smallImageUrl = $scope.selectedCarModel.model_imgs[0].img;
            $scope.fileType = 1;
            $scope.file = files;
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.vehicleForm.$dirty) {
                MessageBox.confirm(T.T("alertTitle.warning"),T.T("vehicle_add.jsExit_warning"), function (isConfirm) {
                    if (isConfirm) {
                        if ($stateParams.event.cancel) {
                            $stateParams.event.cancel();
                        }
                    }
                });
            }
            else {
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel();
                }
            }
        };

        var commit = function (img, la) {
            CarBS.addNewVehicle($scope.selectedCarModel.id, $scope.licensePlate, $scope.preTime, $scope.description, $scope.routineData,
                $scope.fileType, img, $scope.year, $scope.color, $scope.selectedMaxPassengers, $scope.selectedMaxBags)
                .then(function (result) {
                    MessageBox.hideLoading();
                    la.stop();
                    $stateParams.event.addSuccess();
                }, function (error) {
                    MessageBox.hideLoading();
                    la.stop();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("vehicle_add.jsAdd_fail"), "error");
                    }
                });
        };
        var checkRouteHasNoWork = function () {
            var check = true;
            angular.forEach($scope.routineData, function (routine) {
                check = check && routine.match("^(1){48}");
            });
            return check;
        };

        var emptyRouteDataWarming = function (img, la) {
            MessageBox.confirm(T.T('alertTitle.warning'), T.T("vehicle_add.jsVehicle_routine_not_work"), function (isConfirm) {
                if (isConfirm) {
                    commit(img, la);
                } else {
                    la.stop();
                }
            });
        };

        $scope.onSubmitButtonClick = function (valid, $event) {
            if (!valid) {
                return;
            }else if(!$scope.selectedCarModel){
                MessageBox.toast(T.T('vehicle_add.jsSelect_Car'), "error");
                return;
            }
            if (!$scope.description) {
                $scope.description = '';
            }
            var img;
            if ($scope.fileType == 1) {
                img = $scope.file;
            } else {
                img = $scope.selectedCarModelImageId;
            }
            MessageBox.showLoading();
            var la = Ladda.create($event.target);
            la.start();
            if (checkRouteHasNoWork()) {
                emptyRouteDataWarming(img, la);
            } else {
                commit(img, la);
            }
        };


        $scope.onCarBrandChange = function () {
            loadCarModel();
        };

        $scope.onChangeImageType = function () {
            if (!$scope.file) {
                return;
            }
            if ($scope.fileType == 0) {
                $scope.bigImageUrl = $scope.file.$ngfBlobUrl;
                $scope.smallImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                $scope.fileType = 1;
            } else {
                $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                $scope.smallImageUrl = $scope.file.$ngfBlobUrl;
                $scope.fileType = 0;
            }
        };

        // 加载汽车品牌
        var loadCarBrand = function () {
            CarBrandBS.getAll().then(function (result) {
                $scope.carBrands = result.data;
                // $scope.selectedCarBrand = result.data[0].id;
                // 加载车系
                // loadCarModel();
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicle_add.jsGet_make_fail"), "error");
                }
                $scope.onCancelButtonClick();
            });
        };

        // 加载车型
        var loadCarModel = function () {
            CarModelBS.getAll($scope.selectedCarBrand).then(function (result) {
                if (result.data.length < 1) {
                    $scope.carModels = [];
                    return
                }
                $scope.carModels = result.data;
                $scope.selectedCarModel = result.data[0];
                $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
                $scope.selectedCarModelImageId = $scope.selectedCarModel.model_imgs[0].image_id;
                $scope.selectedMaxPassengers = $scope.selectedCarModel.seats_max;
                $scope.selectedMaxBags = $scope.selectedCarModel.bags_max;

                if ($scope.file) {
                    $scope.smallImageUrl = $scope.file.$ngfBlobUrl;
                }
                $scope.fileType = 0;
            }, function (error) {
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicle_add.jsGet_model_fail"), "error");
                }
                if (!$scope.carModels) {
                    $scope.onCancelButtonClick();
                }
            });
        };

        $scope.onCarModelChange = function () {
            $scope.bigImageUrl = $scope.selectedCarModel.model_imgs[0].img;
            $scope.selectedCarModelImageId = $scope.selectedCarModel.model_imgs[0].image_id;
            if ($scope.file) {
                $scope.smallImageUrl = $scope.file.$ngfBlobUrl;
            }
            $scope.selectedMaxPassengers = $scope.selectedCarModel.seats_max;
            $scope.selectedMaxBags = $scope.selectedCarModel.bags_max;
            $scope.fileType = 0;
        };

        // Init
        loadCarBrand();

    });