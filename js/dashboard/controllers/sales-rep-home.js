/**
 * Created by jian on 17-8-9.
 */
angular.module('KARL.Controllers')
    .controller('salesRapHomeCtrl', function ($scope, $rootScope) {
        $scope.salesRapInfo = $rootScope.loginUser;
        var countrys = angular.copy(countrysCode);
        for (var i = 0; i < countrys.length; i++) {
            if ($scope.salesRapInfo.sale.country === countrys[i].countryCode) {
                $scope.countrys = countrys[i].name
            }
        }
    });