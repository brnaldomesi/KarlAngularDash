/**
 * Created by jian on 17-9-11.
 */
angular.module('KARL.Controllers')
    .controller('salesAssistantHomeCtrl', function ($scope, $rootScope) {
        $scope.salesAssistantInfo = $rootScope.loginUser;
        var countrys = angular.copy(countrysCode);
        for (var i = 0; i < countrys.length; i++) {
            if ($scope.salesAssistantInfo.asst.country === countrys[i].countryCode) {
                $scope.countrys = countrys[i].name
            }
        }
    });
