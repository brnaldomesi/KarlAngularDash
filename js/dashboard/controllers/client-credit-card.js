/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('ClientCreditCardCtrl', function ($scope, $stateParams) {
        $scope.card = $stateParams.data.card;

        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };
    });
