/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('VehicleAddCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox, VerifyBS,T) {
        if ($rootScope.token == null || $rootScope.token == '') {
            $state.go('home');
        }
        var vehicle = {};

        $scope.canSave = true;
        $scope.notEmpty = ($rootScope.carList == null)||($rootScope.carList.length == 0);

        $scope.brands = undefined;
        $scope.brandModels = undefined;
        $scope.brand_id = undefined;
        var carBrand = undefined;
        $scope.model_id = undefined;
        var carModel = undefined;
        $scope.color = undefined;
        $scope.year = undefined;
        $scope.license = undefined;


        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };

        $scope.backEvent = function () {
            if ($rootScope.carList == null) {
                $rootScope.token = null;
                $state.go('home');
            } else {
                $state.go('vehicle');
            }
        };

        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        $scope.selectCarBrands = function () {
            angular.forEach($scope.brands, function (brand) {
                if (brand.car_brand_id == $scope.brand_id) {
                    carBrand = brand;
                    $scope.brandModels = brand.car_models;
                    carModel = brand.car_models[0];
                    $scope.model_id = brand.car_models[0].car_model_id;
                    return false;
                }
            });
        };
        $scope.selectCarBrandModels = function () {
            angular.forEach($scope.brandModels, function (model) {
                if (model.car_model_id == $scope.model_id) {
                    carModel = model;
                }
            })
        };

        var initBrandAndModel = function () {
            $scope.brandModels = $scope.brands[0].car_models;

            carBrand = $scope.brands[0];
            $scope.brand_id = carBrand.car_brand_id;
            carModel = $scope.brandModels[0];
            $scope.model_id = $scope.brandModels[0].car_model_id;
        };

        var initData = function () {
            VerifyBS.getAllCarsModels().then(function (result) {
                $scope.brands = result.data;
                $rootScope.brands = $scope.brands;
                initBrandAndModel();
            }, function (error) {
                //TODO
                if (error.treated) {

                } else {

                }
            })
        };
        if ($rootScope.brands == undefined) {
            initData();
        } else {
            $scope.brands = $rootScope.brands;
            initBrandAndModel();
        }

        $scope.addNewCars = function ($event) {
            if (!$scope.canSave) {
                return;
            }
            $scope.canSave = false;
            if ($scope.year == undefined || $scope.year.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_vehicle.jsYear_null'), 'error');
                $scope.canSave = true;
                return;
            }

            if ($scope.color == undefined || $scope.color.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_vehicle.jsColor_null'), 'error');
                $scope.canSave = true;
                return;
            }

            if ($scope.brand_id == undefined) {
                MessageBox.toast(T.T('board_add_vehicle.jsBrand_null'), 'error');
                $scope.canSave = true;
                return;
            }

            if ($scope.model_id == undefined) {
                MessageBox.toast(T.T('board_add_vehicle.jsModel_null'), 'error');
                $scope.canSave = true;
                return;
            }
            if ($scope.license == undefined || $scope.license.trim(' ') == '') {
                MessageBox.toast(T.T('board_add_vehicle.jsLicense_null'), 'error');
                $scope.canSave = true;
                return;
            }

            vehicle.year = $scope.year;
            vehicle.color = $scope.color;
            vehicle.license = $scope.license;
            vehicle.brand_id = $scope.brand_id;
            vehicle.brand_name = carBrand.car_brand_name;
            vehicle.model_id = $scope.model_id;
            vehicle.bags_max = carModel.bags_max;
            vehicle.seats_max = carModel.seats_max;
            vehicle.model_name = carModel.car_model_name;
            vehicle.model_img_id = carModel.model_imgs[0].image_id;
            var ladda = Ladda.create($event.target);
            ladda.start();
            VerifyBS.addCars(
                vehicle,{
                    0: "000000000000000000000000000000000000000000000000",
                    1: "000000000000000000000000000000000000000000000000",
                    2: "000000000000000000000000000000000000000000000000",
                    3: "000000000000000000000000000000000000000000000000",
                    4: "000000000000000000000000000000000000000000000000",
                    5: "000000000000000000000000000000000000000000000000",
                    6: "000000000000000000000000000000000000000000000000"
                }
            ).then(
                function (result) {
                    vehicle.car_id = result.data.id;
                    vehicle.selected = 0;
                    if ($rootScope.carList == null) {
                        $rootScope.carList = new Array(vehicle);
                    } else {
                        $rootScope.carList.push(vehicle);
                    }
                    $state.go('vehicle');
                    $scope.canSave = true;
                    ladda.stop();
                }, function (error) {
                    $scope.canSave = true;
                    MessageBox.toast(T.T('board_add_vehicle.jsAdd_vehicle_fault'), 'error');
                    ladda.stop();
                }
            );
        }

    });
