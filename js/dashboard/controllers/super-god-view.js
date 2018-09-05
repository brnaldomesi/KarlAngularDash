/**
 * Created by jian on 17-10-11.
 */
angular.module('KARL.Controllers')
.controller('superGodViewCtrl',function ($scope, $state, MessageBox,T,$rootScope, $timeout, $filter,$uibModal) {
    var selectDate;
    $scope.onSelectDateButtonClick = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/dashboard/stats-date-select-model.html',
            controller: 'StatsDateSelectModel',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                $stateParams: {
                    data: {
                        currentDate: selectDate,
                        type: $scope.tab
                    },
                    event: {
                        done: function (date) {
                            modalInstance.dismiss();
                            selectDate = date;
                            console.log(selectDate)
                            perGetStats()
                        },
                        cancel: function () {
                            modalInstance.dismiss();
                        }
                    }
                }
            }
        });
    };

    var perGetStats = function () {
        if ($scope.tab == 0) {
            $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'statsDate');
        } else if ($scope.tab == 1) {
            var firstDateOfWeek = angular.copy(selectDate);
            if (firstDateOfWeek.getDay() == 0) {
                firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - 7);
            } else {
                firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - firstDateOfWeek.getDay());
            }

            var lastDateOfWeek = angular.copy(selectDate);
            if (lastDateOfWeek.getDay() == 0) {
                lastDateOfWeek.setDate(lastDateOfWeek.getDate());
            } else {
                lastDateOfWeek.setDate(lastDateOfWeek.getDate() + 7 - lastDateOfWeek.getDay());
            }

            if (firstDateOfWeek.getMonth() == lastDateOfWeek.getMonth()) {
                $scope.dateString = $filter('dateFormatter')(firstDateOfWeek.getTime(), 'statsShortFirstDate') +
                    '-' +
                    $filter('dateFormatter')(lastDateOfWeek.getTime(), 'statsShortLastDate');
            } else {
                $scope.dateString = $filter('dateFormatter')(firstDateOfWeek.getTime(), 'shortDate') +
                    '-' +
                    $filter('dateFormatter')(lastDateOfWeek.getTime(), 'statsLongLastDate') ;
            }
        } else {
            $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'MMM,YYYY');
        }
    };


    $scope.onTabChanged = function (tabIndex) {
        $scope.tab = tabIndex;
        perGetStats();
    };

    var init = function () {
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        selectDate = now;

        $scope.tab = 0;
        $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'statsDate');


        $timeout(function () {
            // /************* 左右滑动tab ************* /
            $(".nav-slider li").click(function (e) {
                var mywhidth = $(this).width();
                $(this).addClass("act-tab1");
                $(this).siblings().removeClass("act-tab1");

                // make sure we cannot click the slider
                if ($(this).hasClass('slider')) {
                    return;
                }

                /* Add the slider movement */

                // what tab was pressed
                var whatTab = $(this).index();

                // Work out how far the slider needs to go
                var howFar = mywhidth * whatTab;

                $(".slider").css({
                    left: howFar + "px"
                });
            });
            // /************* / 左右滑动tab ************* /

        }, 0);
    };

    init()
});