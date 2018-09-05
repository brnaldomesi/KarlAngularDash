/**
 * Created by liqihai on 16/8/15.
 */
angular.module('OnBoard.Controllers')
    .controller('DriverCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $location, $timeout, MessageBox,VerifyBS,T) {
        if($rootScope.token == null || $rootScope.token==''){
            $state.go('home');
        }

        $scope.closeWindow = function () {
            MessageBox.confirm(T.T('alertTitle.determine'), '', function (isConfirm) {
                if (isConfirm) {
                    window.location.href = WebsiteUrl;
                }
            });
        };

        $scope.driverList = $rootScope.driverList;
        if($scope.driverList == null || $scope.driverList.length==0){
            $state.go('driver-add');
        }else {
            $scope.driver = $scope.driverList[0];
            $timeout(function () {
                $("body").find(".vehicle-item").eq(0).addClass("vehicle-active");
            },100);
        }

        if(localStorage.getItem('lang')==='fr'){
            $scope.timeClock = angular.copy(frTimeClock);
        }else {
            $scope.timeClock = angular.copy(TimeClock);
        }
        $scope.editDriver = function(index){
            $rootScope.driverIndex = index;
            $state.go('driver-edit');
        };

        $scope.addAnotherDriver = function () {
            $state.go('driver-add');
        };

        $scope.switchDriver = function (index) {
            $scope.driver = $scope.driverList[index];
        };

        $scope.nextToFinish = function (){
            $state.go('finish');
        };
        $scope.backToVehicle = function (){
            $state.go('vehicle');
        };
    });
