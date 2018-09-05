/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/26/16.
 *
 * @event addSuccess
 */
angular.module('KARL.Controllers')
    .controller('MailChimpCtrl', function ($log, $scope, $state, $stateParams, CompanyBS, MessageBox, T) {
        console.log($stateParams.data());
        $scope.groupSetting = false;
        $scope.mailChimp = angular.copy($stateParams.data());
        $scope.newMailChimp = angular.copy($stateParams.data());
        $scope.mailType = 1;
        $scope.mailisDelete = false;
        $scope.mailState=$scope.mailChimp.state;
        $scope.unitconversion = window.localStorage.lang;
        $scope.vipTypeValue={
            vipCost:'',
            vipRides:''
        };

        $scope.langStyle=localStorage.getItem('lang');
       var synchronizationState=function () {
           $scope.groupSetting = true;
           $scope.mailChimpGroupList=$scope.mailChimp.groups;
           $scope.sortType = $scope.mailChimp.sort;
           $scope.mailChimpList=$scope.mailChimp.groups;
           console.log($scope.mailChimpList)
           for(var i=0;i<$scope.mailChimpList.length;i++){
               $scope.mailChimpList[i].id=$scope.mailChimpList[i].outer_id
           }
           if($scope.mailChimpGroupList.length>2){
               if($scope.mailChimpGroupList[2].type==2){
                   $scope.vipTypeValue={
                       vipCost:$scope.mailChimpGroupList[2].section_start,
                       vipRides:''
                   }
               }else if($scope.mailChimpGroupList[2].type==1){
                   $scope.vipTypeValue={
                       vipCost:'',
                       vipRides:$scope.mailChimpGroupList[2].section_start
                   }
               }
               $scope.isAddGroup=1
           }else {
               $scope.isAddGroup=0
           }
       };

        var initGroupData = function () {
            $scope.isAddGroup = 0;
            $scope.mailChimpGroupList = [
                {
                    outer_id: '',
                    section_start: 0,
                    section_end: 99999999,
                    type:1,
                    priority:''
                }
            ];
            $scope.sortType = 1;
            $scope.vipTypeValue={
                vipCost:'',
                vipRides:''
            };
        };
        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                if ($scope.mailisDelete) {
                    $stateParams.event.cancel('');
                } else {
                    $stateParams.event.cancel($scope.newMailChimp);
                }
            }
        };

        $scope.tipsMsg = "";
        $scope.mailChimpList = undefined;
        var checkButtonText = function () {
            if ($scope.mailChimp) {
                if ($scope.mailChimp.outer_key.match(/^[0-9a-zA-z]{32}\-us[0-9]{1,2}$/g)) {
                    getChimpList($scope.mailChimp.outer_key);
                }
            }
        };

        $scope.$watch("mailChimp.outer_key", function (newValue, oldValue) {
            // if($scope.mailState==1){
            //     synchronizationState()
            // }else {
                $scope.groupSetting = false;
                checkButtonText();
            // }
        });


        $scope.updateMailChimp = function (type) {
            $scope.mailChimpGroupList.forEach(function (item) {
                for (var i = 0; i < $scope.mailChimpList.length; i++) {
                    if (item.outer_id == $scope.mailChimpList[i].id) {
                        item.name = $scope.mailChimpList[i].name
                    }
                }
            });
            if($scope.mailChimpGroupList.length==3){
                if($scope.mailChimpGroupList[2].type==2){
                    $scope.mailChimpGroupList[2].section_start=$scope.vipTypeValue.vipCost;
                }else if($scope.mailChimpGroupList[2].type==1){
                    $scope.mailChimpGroupList[2].section_start=$scope.vipTypeValue.vipRides;
                }
            }
            for (var i = 0; i < $scope.mailChimpGroupList.length; i++) {
                if (!$scope.mailChimpGroupList[i].name) {
                    MessageBox.toast(T.T('mail_chimp_pop.jsSelect_group_name'), "error");
                    return;
                }

                if (!$scope.mailChimpGroupList[i].type) {
                    MessageBox.toast(T.T('mail_chimp_pop.jsMust_choose_condition'), "error");
                    return;
                }
                if ($scope.mailChimpGroupList[i].section_start==='') {
                    MessageBox.toast(T.T('mail_chimp_pop.jsMust_input_value'), "error");
                    return;
                }
                // if ($scope.mailChimpGroupList[0].section_end <= 0) {
                //     MessageBox.toast(T.T('mail_chimp_pop.jsValid_number_not_than_zero'), "error");
                //     return;
                // }

                if ($scope.mailChimpGroupList[i].section_end > 99999999 || $scope.mailChimpGroupList[i].section_start > 99999999) {
                    MessageBox.toast(T.T('mail_chimp_pop.jsNot_greater'), "error");
                    return;
                }

                // if (i < $scope.mailChimpGroupList.length - 1 && ($scope.mailChimpGroupList[i].section_end != $scope.mailChimpGroupList[i + 1].section_start)) {
                //     MessageBox.toast(T.T('mail_chimp_pop.jsSame_number'), "error");
                //     return;
                // }

                // if (parseInt($scope.mailChimpGroupList[i].section_start) != $scope.mailChimpGroupList[i].section_start) {
                //     MessageBox.toast(T.T('mail_chimp_pop.jsPositive_integer'), "error");
                //     return;
                // }

                // if (parseInt($scope.mailChimpGroupList[i].section_end) != $scope.mailChimpGroupList[i].section_end) {
                //     MessageBox.toast(T.T('mail_chimp_pop.jsPositive_integer'), "error");
                //     return;
                // }
            }
            if ($scope.mailChimp.outer_key === "") {
                setTimeout(function () {
                    MessageBox.confirm(T.T('alertTitle.warning'), T.T('mail_chimp_pop.jsNot_input_MailChimp'),
                        function (isConfirm) {
                            if (isConfirm) {
                                updateKey(type);
                            }
                        });
                }, 200);
            } else {
                updateKey(type);
            }
        };

        var updateKey = function (type) {
            var param = angular.toJson($scope.mailChimpGroupList);
            if(type==1){
                MessageBox.showLoading();
                CompanyBS.setGroupSetting($scope.mailType, $scope.sortType, $scope.mailChimp.outer_key, param).then(function (result) {
                        MessageBox.hideLoading();
                        MessageBox.toast(T.T('mail_chimp_pop.jsUpdate_Mail_Chimp_Success'),'success');

                        $stateParams.event.success(result.data.result);
                    },
                    function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                            MessageBox.toast(T.T('mail_chimp_pop.jsUpload_setting_fault'));
                        } else {
                            if(error.response.data.code == "3300"){
                                MessageBox.toast(T.T('mail_chimp_pop.jsState_change_reload'),'error')
                            }else if (error.response.data.code == "8900") {
                                MessageBox.toast(T.T('mail_chimp_pop.jsGet_list_error'));
                            } else {
                                MessageBox.toast(T.T('mail_chimp_pop.jsUpload_setting_fault'));
                            }
                        }
                    });
            }else {
                            MessageBox.showLoading();
                            CompanyBS.modifyGroupSetting($scope.mailType, $scope.sortType, $scope.mailChimp.outer_key, param).then(function (result) {
                                console.log(result);
                                MessageBox.hideLoading();
                                MessageBox.toast(T.T('mail_chimp_pop.jsUpdate_Mail_Chimp_Success'),'success');
                                $stateParams.event.success(result.data.result);
                            }, function (error) {
                                MessageBox.hideLoading();
                                MessageBox.toast( T.T('mail_chimp_pop.jsModify_error'), "error");
                            });
            }
        };

        var getChimpList = function (key) {
            if (key.match(/^[0-9a-zA-z]{32}\-us[0-9]{1,2}$/g)) {
                $scope.tipsMsg = T.T('mail_chimp_pop.jsChecking');
                MessageBox.showLoading();
                CompanyBS.checkOutGroupList(key).then(
                    function (result) {
                        var code = result.data.code;
                        if (code == 2000) {
                            $scope.mailChimpList = result.data.result;
                            CompanyBS.getMailChimpSetting().then(function (results) {
                                MessageBox.hideLoading();
                                $scope.groupSetting = true;
                                $scope.newMailChimp=results.data.result;
                                $scope.mailChimpGroupList = results.data.result.groups;
                                if($scope.mailChimpGroupList&&$scope.mailChimpGroupList.length>0){
                                    for(var i=0;i<$scope.mailChimpGroupList.length;i++){
                                        delete $scope.mailChimpGroupList[i].company_id;
                                        delete $scope.mailChimpGroupList[i].count;
                                        delete $scope.mailChimpGroupList[i].id
                                    }
                                }
                                $scope.sortType = $scope.mailChimp.sort;
                                $scope.mailState=results.data.result.state;
                                if (!$scope.mailChimpGroupList) {
                                    initGroupData();
                                } else {
                                    if($scope.mailChimpGroupList.length>2){
                                        if($scope.mailChimpGroupList[2].type==2){
                                            $scope.vipTypeValue={
                                                vipCost:$scope.mailChimpGroupList[2].section_start,
                                                vipRides:''
                                            }
                                        }else if($scope.mailChimpGroupList[2].type==1){
                                            $scope.vipTypeValue={
                                                vipCost:'',
                                                vipRides:$scope.mailChimpGroupList[2].section_start
                                            }
                                        }
                                        $scope.isAddGroup=1
                                    }else {
                                        $scope.isAddGroup=0
                                    }
                                }
                                $scope.tipsMsg = "";
                            },function (error) {
                                $scope.tipsMsg = T.T("Profile.jsLoading_error");
                            })

                        } else {
                            $scope.tipsMsg = T.T('mail_chimp_pop.jsNo_Lists');
                        }
                    }, function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                            MessageBox.toast(T.T('mail_chimp_pop.jsUpload_setting_fault'));
                        } else {
                            if (error.response.data.code == "8901") {
                                $scope.tipsMsg = T.T('mail_chimp_pop.jsError_Api_Key');
                            }
                        }
                    }
                );
            }
        };

        $scope.addGroupClick = function () {
            $scope.isAddGroup++;
            if ($scope.isAddGroup<2) {
                $scope.mailChimpGroupList.push(
                    {
                        outer_id: '',
                        section_start: 0,
                        section_end: 99999999,
                        type:1,
                        priority:''
                    },
                    {
                        outer_id: '',
                        section_start: 0,
                        section_end: 99999999,
                        type:'',
                        priority:''
                    }
                );
            }
        };

        $scope.clickGropeWay = function (type) {
            if ($scope.mailState == 0) {
                return
            } else {
                    $scope.mailChimpGroupList[2].type=type;
            }
        };

        $scope.$watch('mailChimpGroupList', function (newValue, oldValue) {
            if(newValue){
                $scope.mailChimpGroupList = newValue;
                if($scope.mailChimpGroupList.length>1){
                    $scope.mailChimpGroupList[0].section_end=1;
                    for (var i = 0; i < $scope.mailChimpGroupList.length-1; i++) {
                        $scope.mailChimpGroupList[1].section_start=$scope.mailChimpGroupList[0].section_end
                    }
                }
                for (var k = 0; k < $scope.mailChimpGroupList.length; k++) {
                    $scope.mailChimpGroupList[k].priority=k+1
                }
            }
        }, true);



        $scope.removeGroup = function (index) {
            if($scope.isAddGroup>0){
                $scope.mailChimpGroupList.splice($scope.mailChimpGroupList.length-2, 2);
                $scope.isAddGroup=0;
                if($scope.mailChimpGroupList.length==1){
                    $scope.mailChimpGroupList[0].section_end=99999999
                }
            }
        };

        $scope.reset = function () {
            initGroupData();
        };

        $scope.reloadGroup = function () {
            $scope.groupSetting = false;
            if($scope.mailChimp){
                getChimpList($scope.mailChimp.outer_key);
            }
        };

        // $scope.deleteMailChimp = function () {
        //     var param = angular.toJson($scope.mailChimpGroupList);
        //     console.log(param);
        //     console.log($scope.mailType);
        //     console.log($scope.sortType);
        //     console.log($scope.mailChimp.outer_key);
        //     MessageBox.confirm(T.T('alertTitle.warning'), T.T('mail_chimp_pop.jsSure_delete'),
        //         function (isConfirm) {
        //             if (isConfirm) {
        //                 MessageBox.showLoading();
        //                 CompanyBS.deleteGroupSetting($scope.mailType, $scope.sortType, $scope.mailChimp.outer_key, param).then(function (result) {
        //                     MessageBox.hideLoading();
        //                     // $scope.reset();
        //                     // $scope.mailChimp.outer_key = '';
        //                     // $scope.mailState = 0;
        //                     // $scope.mailisDelete = true;
        //                     MessageBox.toast(T.T('mail_chimp_pop.jsUpdate_Mail_Chimp_Success'),'success');
        //                     $stateParams.event.success(result.data.result);
        //                 }, function (error) {
        //                     MessageBox.hideLoading();
        //                     MessageBox.toast( T.T('mail_chimp_pop.jsDelete_error'), "error");
        //                 })
        //             }
        //         });
        // }
    });
