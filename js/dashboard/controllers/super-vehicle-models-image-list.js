/**
 * Created by liqihai on 16/9/6.
 */
angular.module('KARL.Controllers')
    .controller('SuperListModelsImageListCtrl',function ($scope ,$stateParams, $rootScope,$state,MessageBox,SuperCarBS,T) {
        $scope.carModel = $stateParams.data.carModel;
        $scope.carModelsImages = $scope.carModel.imgs;
        console.log('car model images is ',$scope.carModelsImages);
        $scope.imageId = null;
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.replaceImage = function (file,imageId) {
            MessageBox.showLoading();
            SuperCarBS.replaceCarModelImage(imageId,file)
                .then(function (result) {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("super_vehicle_models_image_list.jsUpload_image_success"));
                    $scope.carModelsImages = result.data;
                    $stateParams.data.carModel.imgs = result.data;
                },function () {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("super_vehicle_models_image_list.jsUpload_image_fail"),'error');
                });
        };
        $scope.addNewCarImage = function (file,event) {
            MessageBox.showLoading();
            SuperCarBS.addCarModelImage($scope.carModel.id,file)
                .then(function (result) {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("super_vehicle_models_image_list.jsUpload_image_success"));
                    console.log('result image is ',result.data);
                    $scope.carModelsImages = result.data;
                    $stateParams.data.carModel.imgs = result.data;
                },function () {
                    MessageBox.hideLoading();
                    MessageBox.toast(T.T("super_vehicle_models_image_list.jsUpload_image_fail"),'error');
                });
        }
    });