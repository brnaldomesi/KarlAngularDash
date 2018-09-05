/**
 * Created by jian on 17-2-10.
 */
angular.module('KARL.Controllers')
    .controller('financeSendEmail',function ($scope,$stateParams,TransactionBS,MessageBox,$timeout,T) {
        $timeout(function () {
            angular.element('#sendEmails').validator();
        }, 0);
        $scope.email=$stateParams.data.customerData.email;
        $scope.choiceArchive=false;
        $scope.onCancelButtonClick=function () {
            $stateParams.event.cancel(false);
        };

        $scope.archiveClick = function () {
            $scope.choiceArchive = !$scope.choiceArchive
        };

        $scope.submitSendEmail=function ($valid) {
            if (!$valid) {
                return;
            }
            MessageBox.showLoading();
            TransactionBS.sendInvoiceEmail($stateParams.data.bookingId,$scope.email).then(function (result) {
                if($scope.choiceArchive){
                    TransactionBS.editArchive($stateParams.data.bookingId,1).then(function (result) {
                        $stateParams.event.cancel(true);
                        MessageBox.hideLoading();
                        MessageBox.toast(T.T("finance_send_email.jsArchive_invoice_success"), "success");
                    },function () {
                        MessageBox.hideLoading();
                        if (error.treated) {
                        } else {
                            MessageBox.toast(T.T("finance_send_email.jsArchive_invoice_fail"), "error");
                        }
                    })
                }else {
                    $stateParams.event.cancel(false);
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("finance_send_email.jsSend_invoice_email_success"), "success");
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    if (error.response.data.code == "7007") {
                        MessageBox.toast(T.T("finance_send_email.jsThis_Order_Not_Finished"), 'error');
                    }else {
                        MessageBox.toast(T.T("finance_send_email.jsSend_invoice_email_fail"), "error");
                    }
                }
            })

        }
    });