/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('CustomerCreditCardAddCtrl', function ($log, $scope, $state, $stateParams, $timeout, MessageBox, FlowBS) {

        $timeout(function () {
            angular.element('#addCreditCardForm').validator();
        }, 0);

        $scope.charge =  {
            card_type:1
        };

        // Event
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.addCreditCard = function (valid, $event) {
            if (!valid) {
                return;
            }
            MessageBox.showLoading();
            FlowBS.addCard($stateParams.data.customerId, $scope.charge)
                .then(function (result)
                {
                    MessageBox.hideLoading();
                    $stateParams.event.addSuccess(result);
                }, function (error)
                {
                    MessageBox.hideLoading();
                    if (error.treated)
                    {
                    }
                    else
                    {
                        MessageBox.toast("Add Fail","error");
                    }
                });
        };

    });