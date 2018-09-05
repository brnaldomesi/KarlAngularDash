/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 */
angular.module('KARL.Controllers')
    .controller('MgrMCCtrl', function ($log, $scope, $state, MessageBox, CustomerBS, T,$stateParams, $timeout) {

        $timeout(function () {
            angular.element('#optionForm').validator();
        }, 0);

        var email = $stateParams.data.email;
        $scope.companyMCList = [];
        var getMCList = function () {
            CustomerBS.getCustomerMCList(email).then(
                function (result) {
                    $scope.companyMCList = result.data.result;
                }, function (error) {
                    if (error.treated) {
                    } else {
                        if(error.response.data.code == "8902"){
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel();
                            }
                            MessageBox.toast(T.T("mgrCustomerToMc.notSetApi"));
                        }else{
                            MessageBox.toast(T.T("mgrCustomerToMc.getMcListFault"));
                        }
                    }
                }
            )
        };
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.changeMCList = function (item) {
            var checked = item.checked === 1 ? 0 : 1;
            CustomerBS.changeCustomerMCList({
                email:email,
                list_id: item.id,
                change: checked
            }).then(function (result) {
                item.checked = checked;
            }, function (error) {
                if (checked === 1) {
                    MessageBox.toast(T.T("mgrCustomerToMc.addMcListFault"));
                } else {
                    MessageBox.toast(T.T("mgrCustomerToMc.rmMcListFault"));
                }
            });
        };
        getMCList();
    });