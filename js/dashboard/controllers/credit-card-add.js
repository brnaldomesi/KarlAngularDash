/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('CreditCardAddCtrl', function ($log, $scope, $state, $uibModal, MapTool, $stateParams, $timeout, MessageBox, CarBS, PaymentBS, T) {

        $scope.cardTypes = [
            {
                name: 'VISA',
                value: 1
            },
            {
                name: 'MaserCard',
                value: 2
            },
            {
                name: 'AmericanExpress',
                value: 3
            },
            {
                name: 'Discover',
                value: 4
            }
        ];

        // $scope.address = angular.copy($stateParams.data.address);
        $timeout(function () {
            angular.element('#addCreditCardForm').validator();
        }, 0);

        $scope.charge = {
            card_type: 1
        };

        $scope.onChangesCardType = function () {
            $timeout(function () {
                angular.element('#addCreditCardForm').validator();
            }, 0);
        };

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.addCreditCard = function (valid, $event) {
            if (!valid) {
                return;
            }
            var cvv2Reg;
            var cvv2ResultArray;
            if ($scope.charge.card_type != 3) {
                cvv2Reg = /^[0-9]{3}$/g;
            } else {
                cvv2Reg = /^[0-9]{4}$/g;
            }
            cvv2ResultArray = $scope.charge.cvv2.match(cvv2Reg);
            if (!cvv2ResultArray || cvv2ResultArray != $scope.charge.cvv2) {
                MessageBox.toast(T.T("credit_card_add.jsFormat_cvc_warning"), 'error');
                return;
            }
            // if(!$scope.address){
            //     MessageBox.toast(T.T("credit_card_add.jsFill_Billing_address"), 'error');
            // }
            // $scope.charge.address = JSON.stringify($scope.address);
            MessageBox.showLoading();
            var nextLadda = Ladda.create($event.target);
            nextLadda.start();
            PaymentBS.addCardByClient($stateParams.data.customerId, $scope.charge)
                .then(function (result) {
                    MessageBox.hideLoading();
                    nextLadda.stop();
                    $stateParams.event.addSuccess();
                }, function (error) {
                    MessageBox.hideLoading();
                    nextLadda.stop();
                    console.log(error);
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("credit_card_add.jsCard_error_or_used"), "error");
                    }
                });
        };

        // $scope.getLocation = function (val) {
        //     return MapTool.getSearchLocations(val);
        // };
        // $scope.selectLocationOnMap = function () {
        //     var locationData = 0;
        //     if ($scope.address) {
        //         console.log('address is here ',$scope.address);
        //         locationData = angular.copy($scope.address);
        //         locationData.geometry.location = {
        //             lat: locationData.geometry.location.lat,
        //             lng: locationData.geometry.location.lng
        //         };
        //     }
        //     var modalInstance = $uibModal.open({
        //         templateUrl: 'templates/common/location-select.html',
        //         controller: 'LocationSelectCtrl',
        //         size: 'md',
        //         resolve: {
        //             data: function () {
        //                 return locationData;
        //             },
        //             event: {
        //                 okHandler: function (data) {
        //                     if (data != undefined) {
        //                         $scope.address = JSON.parse(JSON.stringify(angular.copy(data)));
        //                     }
        //                     modalInstance.dismiss();
        //                 }
        //             }
        //         }
        //     });
        // };
        // $scope.onAddressSelect = function ($item, $model, $label, $event) {
        //     MapTool.geocoderAddress($item.geometry.location.lat(), $item.geometry.location.lng(), function (result) {
        //         $timeout(function () {
        //             $scope.address = JSON.parse(JSON.stringify(result));
        //         }, 0);
        //     }, function (error) {
        //     });
        //     $scope.address = JSON.parse(JSON.stringify(angular.copy($item)));
        // };
    });