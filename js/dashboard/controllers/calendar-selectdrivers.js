/**
 * Created by jian on 17-1-10.
 */
angular.module('KARL.Controllers')
    .controller('calendarSelectDriversCtrl', function ($scope, $stateParams,$timeout) {
console.log($stateParams);
        $scope.initDriver=$stateParams.data.initDrivers;
        $timeout(function () {
            angular.element('#selectDriverForm').validator();
        },0);

        $scope.drivers = $stateParams.data.drivers;
        $scope.input = {};
        angular.forEach($scope.drivers,function (driver,index) {
            if(driver.isSelect){
                $scope.input.selectedIndex = index;
            }
        });

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onSaveButtonClick = function (valid) {
            if(!valid){
                return;
            }
            if ($stateParams.event.ok) {
                $stateParams.event.ok($scope.drivers[$scope.input.selectedIndex]);
            }
        }
    });