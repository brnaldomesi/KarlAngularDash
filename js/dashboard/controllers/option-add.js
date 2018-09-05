/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 */
angular.module('KARL.Controllers')
    .controller('OptionAddCtrl', function ($log, $scope, $state, MessageBox, OptionBS, $stateParams, $timeout,T) {

        $timeout(function () {
            angular.element('#optionForm').validator();
        }, 0);
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();
        $scope.onCreateOption = function (valid, $event) {
            if (!valid) {
                return;
            }
            var param = $scope.numberData;

            MessageBox.showLoading();
            OptionBS.addCurrentOption("[" + JSON.stringify(param) + "]").then(function (result) {
                MessageBox.hideLoading();
                $stateParams.event.addSuccess();
            }, function (result) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("option_add.jsAdd_fail"), "error");
                }
            });
        };

        $scope.onCancelButtonClick = function () {
            if ($scope.optionForm.$dirty) {
                MessageBox.confirm(T.T("alertTitle.warning"),T.T("option_add.jsExit_warning"), function (isConfirm) {
                    if (isConfirm) {
                        if ($stateParams.event.cancel) {
                            $stateParams.event.cancel();
                        }
                    }
                });
            }
            else {
                if ($stateParams.event.cancel) {
                    $stateParams.event.cancel();
                }
            }
        };

        $scope.init = function () {
            $scope.option = {type: 2};
            //init 选项卡
            $scope.checkBoxType = function () {
                $scope.option.type = 1;
            };
            $scope.numberType = function () {
                $scope.option.type = 2;
            };
            $scope.radioGroupType = function () {
                $scope.option.type = 3;
            };
            $scope.checkBoxGroupType = function () {
                $scope.option.type = 4;
            };
            $scope.numberGroupType = function () {
                $scope.option.type = 5;
            };
            $scope.numberType();
            //初始化checkBox 数据 以及事件
            $scope.checkBoxData = {
                "title": "",
                "type": "CHECKBOX",
                "desc": "",
                "add_max": 0,
                "price": 0
            };

            //初始化number 数据 以及事件
            $scope.numberData = {
                "title": "",
                "type": "NUMBER",
                "desc": "",
                "add_max": 1,
                "price": 0
            };

            //初始化RadioGroup 数据 以及事件
            $scope.radioGroupData = {
                "title": "",
                "type": "GROUP",
                "desc": "",
                "add_max": 0,
                "price": 0,
                "group": [{
                    "title": "",
                    "type": "RADIO",
                    "desc": "",
                    "add_max": 0,
                    "price": 0
                }]
            };

            //初始化CheckGroup 数据 以及事件
            $scope.checkBoxGroupData = {
                "title": "",
                "type": "GROUP",
                "desc": "",
                "add_max": 0,
                "price": 0,
                "group": [{
                    "title": "",
                    "type": "CHECKBOX",
                    "desc": "",
                    "add_max": 0,
                    "price": 0
                }]
            };

            //初始化NumberGroup 数据 以及事件
            $scope.numberGroupData = {
                "title": "",
                "type": "GROUP",
                "desc": "",
                "add_max": 0,
                "price": 0,
                "group": [{
                    "title": "",
                    "type": "NUMBER",
                    "desc": "",
                    "add_max": 0,
                    "price": 0
                }]
            };
        };
        $scope.init();
    });