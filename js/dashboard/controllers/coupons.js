/* Created by pham 3/18/2018  */

angular.module('KARL.Controllers')
    .controller('CouponsCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $timeout, MessageBox, CouponBS, UserCacheBS,T,$filter) {

        if(!$rootScope.loginUser){
            return;
        }
        $scope.country=$rootScope.loginUser.admin.location.country;
        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/coupon-add.html',
                controller: 'CouponAddCtrl',
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
                templateUrl: 'templates/dashboard/coupon-edit.html',
                controller: 'CouponEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            couponId: id
                        },
                        event: {
                            editSuccess: function () {
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

        $scope.onDeleteButtonClick = function (id,user_id) {
            MessageBox.showLoading();
            CouponBS.deleteFromCurrentUser(id).then(function (result) {
                MessageBox.hideLoading();
                if($rootScope.loginUser.admin.is_coupon){
                    if($rootScope.loginUser.id == user_id){
                        $rootScope.loginUser.admin.is_coupon = 0;
                        UserCacheBS.cache($rootScope.loginUser);
                    }
                }
                for (var i=0;i<originalCoupons.length;i++){
                    if(originalCoupons[i].coupon_id == id){
                        originalCoupons.splice(i,1);
                        i--
                    }
                }
                for (var i=0;i<$scope.listData.length;i++){
                    if($scope.listData[i].coupon_id == id){
                        $scope.listData.splice(i,1);
                        i--
                    }
                }
            }, function (error) {
                console.log(error);
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == "3603")
                    {
                        $timeout(function ()
                        {
                            MessageBox.confirm(T.T('alertTitle.warning'), $filter('translate')('coupons.jsDelete_coupon_warning', {length: error.response.data.result.length}), function (isConfirm)
                            {
                                if (isConfirm)
                                {
                                    //$state.go("calendar");
                                    $state.go("calendar",{data:{bookId: error.response.data.result[0].id}});
                                }
                            });
                        }, 500);
                    }
                    else {
                        MessageBox.toast(T.T("comment.jsDelete_fail"), "error");
                    }
                }
            });
        };
        
        // Function
        var originalCoupons = [];
        var loadData = function () {
            MessageBox.showLoading();
            CouponBS.getCurrentUserAll().then(function (result) {
                MessageBox.hideLoading();
                originalCoupons = result.data;
                angular.forEach(originalCoupons,function (item) {
                    if(item.routine){
                        item.workStates = routineConversionsFromISOToLoc(JSON.parse(item.routine))
                    }
                });

                if(searchText){
                    $scope.listData = getSearchCouponsResult(originalCoupons,searchText);
                }else {
                    $scope.listData = angular.copy(originalCoupons);
                }
                $scope.timeConvert($scope.listData);
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
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated)
                {
                }
                else
                {
                    MessageBox.toast(T.T("coupons.jsGet_coupon_fail"),"error");
                }
            });
        };

        //转时区获得正确的routine
        var routineConversionsFromISOToLoc = function (routineArray) {
            var finalWeekRoutine = routineArray.join('');
            //获取时区
            var timeZone = (new Date().getTimezoneOffset() / 60) * (-1) * 2;
            var locRoutineDataString = "";
            if (timeZone > 0) {
                //后面拼到前面
                var tempStart = finalWeekRoutine.substring(48*7-timeZone);
                var tempSpell = finalWeekRoutine.substring(0, 48*7-timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else if (timeZone < 0) {
                //前面拼到后面
                var tempStart = finalWeekRoutine.substring(-timeZone);
                var tempSpell = finalWeekRoutine.substring(0, -timeZone);
                locRoutineDataString = tempStart + tempSpell;
            } else {
                locRoutineDataString = finalWeekRoutine;
            }

            //通过locRoutineDataString得到出勤情况
            var routineArray = undefined;
            for (var i = 0; i < 7; i++) {
                var routinePerDay = locRoutineDataString.substring(i * 48, (i + 1) * 48) + "";
                var work = true;
                if(routinePerDay.indexOf('0') == -1){
                    work = false;
                }
                if (routineArray == undefined) {
                    routineArray = new Array(work);
                } else {
                    routineArray.push(work);

                }
            }
            return routineArray;
        };

        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                $scope.timeConvert(originalCoupons);
                if (!word) {
                    searchText = undefined;
                    $scope.listData = angular.copy(originalCoupons);
                }else {
                    $scope.listData = [];
                    $scope.$apply();

                    searchText = word;
                    $scope.listData = getSearchCouponsResult(originalCoupons,word);
                }
                $scope.$apply();
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
            }, 100);
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchCouponsResult = function (originalCoupons,searchText) {
            var tempSearch = [];
            angular.forEach(originalCoupons,function (coupon) {
                if(coupon.first_name.toString().indexOf(searchText.toString()) > -1
                    || coupon.last_name.toString().indexOf(searchText.toString()) > -1
                    || coupon.mobile.toString().indexOf(searchText.toString()) > -1
                    || coupon.email.toString().indexOf(searchText.toString()) > -1
                    || coupon.license_number.toString().indexOf(searchText.toString()) > -1){
                    tempSearch.push(coupon);
                }
            });
            return tempSearch;
        };

        $scope.timeConvert = function (data) {
            var allTime = [1, 2, 3, 4, 5, 6, 7, 8, 24, 48];
            for(var j = 0; j < data.length;j++){
                data[j].delayTime = data[j].delay_time / 60;
                if (data[j].delayTime < 1) {
                    data[j].delayTime = 1;
                } else if (1 <= data[j].delayTime <= 48) {
                    for (var i = 0; i < allTime.length; i++) {
                        if (data[j].delayTime != allTime[i]) {
                            if (data[j].delayTime > allTime[i] && data[j].delayTime < allTime[i + 1]) {
                                data[j].delayTime = allTime[i + 1];
                            }
                        }
                    }
                } else if (data[j].delayTime > 48) {
                    data[j].delayTime = 48;
                }
            }
        }

        // Init
        loadData();
    });