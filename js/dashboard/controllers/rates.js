/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('RatesCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $timeout, MessageBox, OfferBS) {
        if (!$rootScope.loginUser) {
            return;
        }
        $scope.distanceUnit = localStorage.getItem('distanceunit');
        $scope.companyCurrency = window.localStorage.companyCurrency.toLowerCase();
        $scope.currentPage = 1;
        $scope.pageTotalItems = 1;
        $scope.pagePreCount = 10;

        $scope.showRatesView = false;
        $scope.showNoRatesView = false;
        if ($rootScope.loginUser == null) {
            $state.go('login');
            return;
        }

        if ($scope.companyCurrency == null ||
            $scope.companyCurrency == undefined ||
            $scope.companyCurrency.trim(' ') == '') {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/currency-alert-modal.html',
                controller: 'CurrencyAcctCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        }

        // Event
        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/rate-add.html',
                controller: 'RateAddCtrl',
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
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onEditButtonClick = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/rate-edit.html',
                controller: 'RateEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            offerId: id
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            OfferBS.deleteFromCurrentUser(id).then(function (result) {
                MessageBox.hideLoading();
                for (var i = 0; i < originalRates.length; i++) {
                    if (originalRates[i].offer_id == id) {
                        originalRates.splice(i, 1);
                        i--
                    }
                }
                for (var i = 0; i < $scope.listData.length; i++) {
                    if ($scope.listData[i].offer_id == id) {
                        $scope.listData.splice(i, 1);
                        i--
                    }
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("comment.jsDelete_fail"), "error", "error");
                }
            });
        };

        // Function
        var originalRates = [];
        var loadData = function () {
            MessageBox.showLoading();
            OfferBS.getCurrentOfferAll().then(function (result) {
                MessageBox.hideLoading();
                if (result.data.length > 0) {
                    $scope.showRatesView = true;
                    $scope.showNoRatesView = false;

                    originalRates = result.data;
                    $scope.pageTotalItems = 1;
                    angular.forEach(originalRates, function (item) {
                        item.workStates = routineConversionsFromISOToLoc(JSON.parse(item.routine));
                        item.prices = JSON.parse(item.prices)
                    });

                    if (searchText) {
                        $scope.listData = getSearchRatesResult(originalRates, searchText);
                    } else {
                        $scope.listData = angular.copy(originalRates);
                    }

                    console.log($scope.listData);

                    $timeout(function () {
                        $(function () {
                            $(".card-more").click(function () {
                                $(this).next().fadeToggle();
                                $(this).fadeToggle(
                                    $(this).children("i").toggleClass("fa-ellipsis-v")
                                );
                            });
                            $(".gen").click(function () {
                                $(this).parent().find(".gen-panel").fadeIn(200);
                            });
                            $(".gen-cancel").click(function () {
                                $(this).parents(".gen-panel").fadeOut(200);
                            });
                        });
                    }, 0);
                } else {
                    $scope.showRatesView = false;
                    $scope.showNoRatesView = true;
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("rates.jsGet_offer_fail"), "error");
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
                var tempStart = finalWeekRoutine.substring(48 * 7 - timeZone);
                var tempSpell = finalWeekRoutine.substring(0, 48 * 7 - timeZone);
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
                if (routinePerDay.indexOf('0') == -1) {
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
                if (!word) {
                    searchText = undefined;
                    $scope.listData = angular.copy(originalRates);
                } else {
                    $scope.listData = [];
                    $scope.$apply();

                    searchText = word;
                    $scope.listData = getSearchRatesResult(originalRates, word);
                }
                $scope.$apply();
                $(function () {
                    $(".card-more").click(function () {
                        $(this).next().fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".gen").click(function () {
                        $(this).parent().find(".gen-panel").fadeIn(200);
                    });
                    $(".gen-cancel").click(function () {
                        $(this).parents(".gen-panel").fadeOut(200);
                    });
                });
            }, 100);
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchRatesResult = function (originalRates, searchText) {
            var tempSearch = [];
            angular.forEach(originalRates, function (rate) {
                if (rate.offer_name.toString().indexOf(searchText.toString()) > -1) {
                    tempSearch.push(rate);
                }
            });
            return tempSearch;
        };

        // Init
        loadData();

    });
