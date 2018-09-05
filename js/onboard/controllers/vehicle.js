/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('VehicleCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox, VerifyBS,T) {

        // $rootScope.token = 'd527d168-30cb-34c8-9cef-bbe6e5336708';
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }
        $scope.skipToFinal = function () {
            MessageBox.confirm(T.T('alertTitle.warning'),T.T('board_vehicle.jsWant_to_skip'),function (isConfirm) {
                if(isConfirm){
                    $state.go("finish")
                }
            })
        };

        $scope.carList = $rootScope.carList;
        if ($scope.carList == null || $scope.carList.length == 0) {
            $state.go('vehicle-add');
        }else {
            $scope.car = $scope.carList[0];
            $timeout(function () {
                $("body").find(".vehicle-item").eq(0).addClass("vehicle-active");
            },100);
        }

        $scope.showCarDetail = function (index) {
            $rootScope.carIndex = index;
            $state.go('vehicle-edit');
        };

        $scope.switchCar = function (index) {
            $scope.car = $scope.carList[index];
        };

        $scope.nextToDriver = function () {
            $state.go('driver');
        };
        $scope.addAnotherVehicle = function () {
            $state.go('vehicle-add');
        };
        $scope.backEvent = function(){
            $state.go('home');
            $rootScope.token=null;
        }
    });
