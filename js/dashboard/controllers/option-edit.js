/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 */
angular.module('KARL.Controllers')
    .controller('OptionEditCtrl', function ($log, $scope, $state, MessageBox, OptionBS, $stateParams, $timeout,T) {

        $timeout(function () {
            angular.element('#optionForm').validator();
        }, 0);

        $scope.optionData = $stateParams.data().option;
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();

        $scope.onCreateOption = function (valid, $event) {
            if (!valid) {
                return;
            }
            var param;
            if ($scope.option.type == 1) {
                param = $scope.checkBoxData;
            } else if ($scope.option.type == 2) {
                param = $scope.numberData;
            } else if ($scope.option.type == 3) {
                param = $scope.radioGroupData;
            } else if ($scope.option.type == 4) {
                param = $scope.checkBoxGroupData;
            } else if ($scope.option.type == 5) {
                param = $scope.numberGroupData;
            }
            MessageBox.showLoading();
            OptionBS.updateFromCurrentOption(param.id, JSON.stringify(param)).then(function (result) {
                MessageBox.hideLoading();
                $stateParams.event.addSuccess();
            }, function (result) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("option_edit.jsUpdate_fail"), "error");
                }
            });
        };

        $scope.onCancelButtonClick = function () {
            console.log($scope.optionForm);
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
            $scope.option = {type: 1};
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
                "add_max": 0,
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
                "add_max": "",
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

            $timeout(function () {
                if ($stateParams.data().option.loc_type_id == 0) {
                    $scope.checkBoxType();
                    $scope.checkBoxData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == 1) {
                    $scope.numberType();
                    $scope.numberData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == 2) {
                    $scope.checkBoxGroupType();
                    $scope.checkBoxGroupData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == 3) {
                    $scope.numberGroupType();
                    $scope.numberGroupData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == 4) {
                    $scope.radioGroupType();
                    $scope.radioGroupData = $stateParams.data().option;
                } else if ($stateParams.data().option.loc_type_id == -1) {
                    $scope.numberGroupType();
                    $scope.numberGroupData = $stateParams.data().option;
                }
            }, 50);


        };
        $scope.init();
    });