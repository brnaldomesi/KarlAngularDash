/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('OptionCtrl', function ($log, $scope, $state, $uibModal, MessageBox, OptionBS, $rootScope, $timeout,T) {
        if(!$rootScope.loginUser){
            return;
        }

        console.log(window.localStorage.companyCurrency);
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();
        $scope.showOptionsView = false;
        $scope.showNoOptionsView = false;

        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/option-add.html',
                controller: 'OptionAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                            }
                        }
                    }

                }
            });
        };

        $scope.onEditButtonClick = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/option-edit.html',
                controller: 'OptionEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: function () {
                            for (var i = 0; i < $scope.listData.length; i++) {
                                if ($scope.listData[i].id == id) {
                                    return {
                                        option: jQuery.extend(true, {}, $scope.listData[i])
                                    };
                                }
                            }
                        },
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel:function(){
                                modalInstance.dismiss();
                                loadData(true);
                            }
                        }
                    }

                }
            });
        };

        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            OptionBS.deleteFromCurrentOption(id).then(function (result) {
                MessageBox.hideLoading();
                loadData();
            }, function (result) {
                MessageBox.hideLoading();
                if (error.treated)
                {
                }
                else
                {
                    MessageBox.toast(T.T("comment.jsDelete_fail"),"error");
                }
            });
        };

        $scope.onPageChange = function () {
            loadData();
        };

        // Function
        var initOptionType = function (items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].type == "CHECKBOX") {
                    items[i].loc_type = "Checkbox";
                    items[i].loc_type_id = 0;
                } else if (items[i].type == "NUMBER") {
                    items[i].loc_type = "Number";
                    items[i].loc_type_id = 1;
                } else if (items[i].group.length > 0 && items[i].type == "GROUP") {
                    if (items[i].group[0].type == "CHECKBOX") {
                        items[i].loc_type = "Checkbox Group";
                        items[i].loc_type_id = 2;
                    } else if (items[i].group[0].type == "NUMBER") {
                        items[i].loc_type = "Number Group";
                        items[i].loc_type_id = 3;
                    } else if (items[i].group[0].type == "RADIO") {
                        items[i].loc_type = "Radio Group";
                        items[i].loc_type_id = 4;
                    } else {
                        items[i].loc_type = "Others";
                        items[i].loc_type_id = -1;
                    }
                } else {
                    items[i].loc_type = "Others";
                    items[i].loc_type_id = -1;
                }
            }
            return items;
        };

        var loadData = function (isShow) {
            if (!isShow){
                MessageBox.showLoading();
            }
            OptionBS.getCurrentOptionAll().then(function (result) {
                MessageBox.hideLoading();
                
                if(result.data.length > 0){
                    $scope.showOptionsView = true;
                    $scope.showNoOptionsView = false;

                    $scope.listData = initOptionType(result.data);
                    $timeout(function () {
                        $( function() {
                            $(".card-more").click(function(){
                                $(this).next().fadeToggle();
                                $(this).fadeToggle(
                                    $(this).children("i").toggleClass("fa-ellipsis-v")
                                );
                            });
                            $(".gen").click(function(){
                                $(this).parent().find(".gen-panel").fadeIn(200);
                            });
                            $(".gen-cancel").click(function(){
                                $(this).parents(".gen-panel").fadeOut(200);
                            });
                        });
                    },0);
                }else {
                    $scope.showOptionsView = false;
                    $scope.showNoOptionsView = true;
                }
            }, function (error)
            {
                MessageBox.hideLoading();
                if (error.treated)
                {
                }
                else
                {
                    MessageBox.toast(T.T("option.jsGet_option_fail"),"error");
                }
            });
        };

        // Init
        loadData();
    });
