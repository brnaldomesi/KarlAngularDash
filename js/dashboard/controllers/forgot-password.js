/**
 * Created by lqh on 2016/11/9.
 */
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('ForgotPwdCtrl', function ($log, $scope,$stateParams, MessageBox,UserBS,T) {
        $scope.email='';
        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();
        };
        $scope.commitEmail = function (valid) {
            if (!valid) {
                return;
            }
            UserBS.forgotPassword($scope.email).then(
                function () {
                    $scope.email=null;
                    MessageBox.toast(T.T("forgot_password.jsCheck_email_admin"));
                    $stateParams.event.cancel();
                },function () {
                    MessageBox.toast(T.T("forgot_password.jsEmail_not_found"),"error");
                });
        }
    });
