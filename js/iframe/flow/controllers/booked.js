/**
 * Created by jian on 16-10-28.
 */
angular.module('Flow.Controllers')
    .controller('bookedCtrl', function ($log, $scope, $stateParams, $rootScope) {
        if (!$rootScope.company_id) {
            window.location.href = localStorage.getItem('a4c_iframe_widget_parent_link');
            return;
        }
        $scope.langStyle=localStorage.getItem('lang');
        if($scope.langStyle==='fr'){
            $scope.iosAppImgLink='img/dashboard/iox-FR.png';
            $scope.androidAppImgLink='img/dashboard/google-FR.png'
        }else {
            $scope.iosAppImgLink='img/dashboard/download-on-the-app-store.png';
            $scope.androidAppImgLink='img/dashboard/google-play.png'
        }
        $scope.allData = angular.copy($stateParams.data);
        console.log("", $scope.allData);
        $scope.companyInfor = $stateParams.data.company_infor;
        $scope.offer=$scope.allData.params.car.offer;
        if (!$scope.allData.reParams) {
            $scope.amountRsOff = 0;
            $scope.percentRsOff = 0;
            $scope.showRsTotalPrice = 0;
        } else {
            $scope.rsoffer=$scope.allData.reParams.car.offer;
            $scope.amountRsOff = $scope.allData.reParams.amountOff;
            $scope.percentRsOff = $scope.allData.reParams.percentOff;
            $scope.showRsTotalPrice = $scope.allData.reParams.showTotalPrice;
        }
        //公司APP
        $scope.getCompanyIosApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/ios';
        $scope.getCompanyGoogleApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/android';
        $scope.preCost = $scope.allData.params.cost;
        $scope.cost = ($scope.allData.params.cost - $scope.allData.params.amountOff) * (1 - $scope.allData.params.percentOff / 100);
        if ($scope.cost < 0) {
            $scope.cost = 0;
        } else if ($scope.cost > 0 && $scope.cost < 1) {
            $scope.cost = 1;
        }
        console.log($scope.cost)
        $scope.reCost = 0;
        if ($scope.allData.reParams) {
            $scope.rePreCost=$scope.allData.reParams.cost;
            $scope.reCost = ($scope.allData.reParams.cost - $scope.allData.reParams.amountOff) * (1 - $scope.allData.reParams.percentOff / 100);
        }
        if($scope.reCost <0){
            $scope.reCost = 0;
        }else if($scope.reCost > 0&&$scope.reCost<1){
            $scope.reCost=1;
        }
        console.log($scope.reCost)
        // $scope.cost = $scope.cost + $scope.reCost;

        $scope.firstName = $scope.allData.loginUser.first_name;
        $scope.lastName = $scope.allData.loginUser.last_name;
        $scope.email = $scope.allData.loginUser.email;
        $scope.mobile = $scope.allData.loginUser.mobile;

        $scope.goButtonClick = function () {
            window.parent.postMessage("hideFlowIframe", "*");
        }
    });

