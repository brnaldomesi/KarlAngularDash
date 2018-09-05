/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('StatsCtrl', function ($scope, $state, StatisticsBS, $timeout, $filter, $uibModal, MessageBox,T,$rootScope) {
        if(!$rootScope.loginUser){
            return;
        }
        var dayDiv1, dayDiv2, dayDiv3;
        var weekDiv1, weekDiv2, weekDiv3;
        var monthDiv1, monthDiv2, monthDiv3;
        var allDivs = [];

        var dayViz1, dayViz2, dayViz3;
        var weekViz1, weekViz2, weekViz3;
        var monthViz1, monthViz2, monthViz3;
        var allVizs = [];

        var selectDate;
        $scope.companyCurrency=window.localStorage.companyCurrency.toLowerCase();
        $scope.today = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.yesterday = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.twoDaysAgo = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };

        $scope.thisWeek = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.lastWeek = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.twoWeeksAgo = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };

        $scope.thisMonth = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.lastMonth = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };
        $scope.twoMonthsAgo = {
            completedBooksTotal: 0,
            driverOntimeRate: 0,
            earningsTotal: 0
        };

        $scope.onTabChanged = function (tabIndex) {
            $scope.tab = tabIndex;
            perGetStats();
        };

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
                                perGetStats();
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
            getStats();
        };

        var getStats = function () {
            MessageBox.showLoading();
            StatisticsBS.statistics(selectDate, $scope.tab).then(function (result) {
                MessageBox.hideLoading();
                $timeout(function () {
                    //整理数据
                    if ($scope.tab == 0) {
                        if (result.data.length > 0) {
                            //订单完成数
                            $scope.today.completedBooksTotal = result.data[0].completed_bookings;
                            if (result.data[0].total_bookings > 0 && result.data[0].completed_bookings > 0) {
                                dayViz1.data(parseInt(result.data[0].completed_bookings / result.data[0].total_bookings * 100)).update();
                                dayViz1.label(function () {
                                    return d3.format(".0f")(result.data[0].completed_bookings);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(result.data[0].completed_bookings),false,false,$scope.companyCurrency);
                                }).update();
                            } else {
                                dayViz1.data(0).update();
                                dayViz1.label(function () {
                                    return d3.format(".0f")(0);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                                }).update();
                            }
                            //准时率
                            if (result.data[0].completed_bookings > 0 && result.data[0].on_time > 0) {
                                $scope.today.driverOntimeRate = result.data[0].on_time / result.data[0].completed_bookings * 100;
                                dayViz2.data(parseInt(result.data[0].on_time / result.data[0].completed_bookings * 100)).update();
                            } else {
                                $scope.today.driverOntimeRate = 0;
                                dayViz2.data(0).update();
                            }
                            //收入
                            $scope.today.earningsTotal = result.data[0].total_income;
                            if (result.data[0].total_est_amount > 0 && result.data[0].total_income > 0) {
                                dayViz3.data(parseInt(result.data[0].total_income / result.data[0].total_est_amount * 100)).update();
                                dayViz3.label(function () {
                                    var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(result.data[0].total_income),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(result.data[0].total_income);
                                    return dayViz3Prince;
                                }).update();
                            } else {
                                dayViz3.data(0).update();
                                dayViz3.label(function () {
                                    var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(0);
                                    return dayViz3Prince;
                                }).update();
                            }
                        } else {
                            $scope.today.completedBooksTotal = 0;
                            dayViz1.data(0).update();
                            dayViz1.label(function () {
                                return d3.format(".0f")(0);
                                // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                            }).update();
                            $scope.today.driverOntimeRate = 0;
                            dayViz2.data(0).update();
                            $scope.today.earningsTotal = 0;
                            dayViz3.data(0).update();
                            dayViz3.label(function () {
                                // return d3.format("$,.2f")(0);
                                return $filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency) ;
                            }).update();
                        }

                        if (result.data.length > 1) {
                            //订单完成数
                            $scope.yesterday.completedBooksTotal = result.data[1].completed_bookings;
                            //准时率
                            if (result.data[1].completed_bookings > 0 && result.data[1].on_time > 0) {
                                $scope.yesterday.driverOntimeRate = result.data[1].on_time / result.data[1].completed_bookings * 100;
                            } else {
                                $scope.yesterday.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.yesterday.earningsTotal = result.data[1].total_income;
                        } else {
                            $scope.yesterday.completedBooksTotal = 0;
                            $scope.yesterday.driverOntimeRate = 0;
                            $scope.yesterday.earningsTotal = 0;
                        }

                        if (result.data.length > 2) {
                            //订单完成数
                            $scope.twoDaysAgo.completedBooksTotal = result.data[2].completed_bookings;
                            //准时率
                            if (result.data[2].completed_bookings > 0 && result.data[2].on_time > 0) {
                                $scope.twoDaysAgo.driverOntimeRate = result.data[2].on_time / result.data[2].completed_bookings * 100;
                            } else {
                                $scope.twoDaysAgo.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.twoDaysAgo.earningsTotal = result.data[2].total_income;
                        } else {
                            $scope.twoDaysAgo.completedBooksTotal = 0;
                            $scope.twoDaysAgo.driverOntimeRate = 0;
                            $scope.twoDaysAgo.earningsTotal = 0;
                        }
                    } else if ($scope.tab == 1) {
                        if (result.data.length > 0) {
                            //订单完成数
                            $scope.thisWeek.completedBooksTotal = result.data[0].completed_bookings;
                            if (result.data[0].total_bookings > 0 && result.data[0].completed_bookings > 0) {
                                weekViz1.data(parseInt(result.data[0].completed_bookings / result.data[0].total_bookings * 100)).update();
                                weekViz1.label(function () {
                                    return d3.format(".0f")(result.data[0].completed_bookings);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(result.data[0].completed_bookings),false,false,$scope.companyCurrency);
                                }).update();
                            } else {
                                weekViz1.data(0).update();
                                weekViz1.label(function () {
                                    return d3.format(".0f")(0);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                                }).update();
                            }
                            //准时率
                            if (result.data[0].completed_bookings > 0 && result.data[0].on_time > 0) {
                                $scope.thisWeek.driverOntimeRate = result.data[0].on_time / result.data[0].completed_bookings * 100;
                                weekViz2.data(parseInt(result.data[0].on_time / result.data[0].completed_bookings * 100)).update();
                            } else {
                                $scope.thisWeek.driverOntimeRate = 0;
                                weekViz2.data(0).update();
                            }
                            //收入
                            $scope.thisWeek.earningsTotal = result.data[0].total_income;
                            if (result.data[0].total_est_amount > 0 && result.data[0].total_income > 0) {
                                weekViz3.data(parseInt(result.data[0].total_income / result.data[0].total_est_amount * 100)).update();
                                weekViz3.label(function () {
                                    var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(result.data[0].total_income),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(result.data[0].total_income);
                                    return weekViz3Prince;
                                }).update();
                            } else {
                                weekViz3.data(0).update();
                                weekViz3.label(function () {
                                    var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(0);
                                    return weekViz3Prince;
                                }).update();
                            }
                        } else {
                            $scope.thisWeek.completedBooksTotal = 0;
                            weekViz1.data(0).update();
                            weekViz1.label(function () {
                                return d3.format(".0f")(0);
                                // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                            }).update();
                            $scope.thisWeek.driverOntimeRate = 0;
                            weekViz2.data(0).update();
                            $scope.thisWeek.earningsTotal = 0;
                            weekViz3.data(0).update();
                            weekViz3.label(function () {
                                var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                return weekViz3Prince;
                            }).update();
                        }

                        if (result.data.length > 1) {
                            //订单完成数
                            $scope.lastWeek.completedBooksTotal = result.data[1].completed_bookings;
                            //准时率
                            if (result.data[1].completed_bookings > 0 && result.data[1].on_time > 0) {
                                $scope.lastWeek.driverOntimeRate = result.data[1].on_time / result.data[1].completed_bookings * 100;
                            } else {
                                $scope.lastWeek.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.lastWeek.earningsTotal = result.data[1].total_income;
                        } else {
                            $scope.lastWeek.completedBooksTotal = 0;
                            $scope.lastWeek.driverOntimeRate = 0;
                            $scope.lastWeek.earningsTotal = 0;
                        }

                        if (result.data.length > 2) {
                            //订单完成数
                            $scope.twoWeeksAgo.completedBooksTotal = result.data[2].completed_bookings;
                            //准时率
                            if (result.data[2].completed_bookings > 0 && result.data[2].on_time > 0) {
                                $scope.twoWeeksAgo.driverOntimeRate = result.data[2].on_time / result.data[2].completed_bookings * 100;
                            } else {
                                $scope.twoWeeksAgo.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.twoWeeksAgo.earningsTotal = result.data[2].total_income;
                        } else {
                            $scope.twoWeeksAgo.completedBooksTotal = 0;
                            $scope.twoWeeksAgo.driverOntimeRate = 0;
                            $scope.twoWeeksAgo.earningsTotal = 0;
                        }
                    } else {
                        if (result.data.length > 0) {
                            //订单完成数
                            $scope.thisMonth.completedBooksTotal = result.data[0].completed_bookings;
                            if (result.data[0].total_bookings > 0 && result.data[0].completed_bookings > 0) {
                                monthViz1.data(parseInt(result.data[0].completed_bookings / result.data[0].total_bookings * 100)).update();
                                monthViz1.label(function () {
                                    return d3.format(".0f")(result.data[0].completed_bookings);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(result.data[0].completed_bookings),false,false,$scope.companyCurrency);
                                }).update();
                            } else {
                                monthViz1.data(0).update();
                                monthViz1.label(function () {
                                    return d3.format(".0f")(0);
                                    // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                                }).update();
                            }
                            //准时率
                            if (result.data[0].completed_bookings > 0 && result.data[0].on_time > 0) {
                                $scope.thisMonth.driverOntimeRate = result.data[0].on_time / result.data[0].completed_bookings * 100;
                                monthViz2.data(result.data[0].on_time / result.data[0].completed_bookings * 100).update();
                            } else {
                                $scope.thisMonth.driverOntimeRate = 0;
                                monthViz2.data(0).update();
                            }
                            //收入
                            $scope.thisMonth.earningsTotal = result.data[0].total_income;
                            if (result.data[0].total_est_amount > 0 && result.data[0].total_income > 0) {
                                monthViz3.data(parseInt(result.data[0].total_income / result.data[0].total_est_amount * 100)).update();
                                monthViz3.label(function () {
                                    var monthViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(result.data[0].total_income),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(result.data[0].total_income);
                                    return monthViz3Prince;
                                }).update();
                            } else {
                                monthViz3.data(0).update();
                                monthViz3.label(function () {
                                    var monthViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                    // return d3.format("$,.2f")(0);
                                    return monthViz3Prince;
                                }).update();
                            }
                        } else {
                            $scope.thisMonth.completedBooksTotal = 0;
                            monthViz1.data(0).update();
                            monthViz1.label(function () {
                                return d3.format(".0f")(0);
                                // return $filter('princeTranslateFilters')(d3.format(".0f")(0),false,false,$scope.companyCurrency);
                            }).update();
                            $scope.thisMonth.driverOntimeRate = 0;
                            monthViz2.data(0).update();
                            $scope.thisMonth.earningsTotal = 0;
                            monthViz3.data(0).update();
                            monthViz3.label(function () {
                                var monthViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                                // return d3.format("$,.2f")(0);
                                return monthViz3Prince;
                            }).update();
                        }

                        if (result.data.length > 1) {
                            //订单完成数
                            $scope.lastMonth.completedBooksTotal = result.data[1].completed_bookings;
                            //准时率
                            if (result.data[1].completed_bookings > 0 && result.data[1].on_time > 0) {
                                $scope.lastMonth.driverOntimeRate = result.data[1].on_time / result.data[1].completed_bookings * 100;
                            } else {
                                $scope.lastMonth.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.lastMonth.earningsTotal = result.data[1].total_income;
                        } else {
                            $scope.lastMonth.completedBooksTotal = 0;
                            $scope.lastMonth.driverOntimeRate = 0;
                            $scope.lastMonth.earningsTotal = 0;
                        }

                        if (result.data.length > 2) {
                            //订单完成数
                            $scope.twoMonthsAgo.completedBooksTotal = result.data[2].completed_bookings;
                            //准时率
                            if (result.data[2].completed_bookings > 0 && result.data[2].on_time > 0) {
                                $scope.twoMonthsAgo.driverOntimeRate = result.data[2].on_time / result.data[2].completed_bookings * 100;
                            } else {
                                $scope.twoMonthsAgo.driverOntimeRate = 0;
                            }
                            //收入
                            $scope.twoMonthsAgo.earningsTotal = result.data[2].total_income;
                        } else {
                            $scope.twoMonthsAgo.completedBooksTotal = 0;
                            $scope.twoMonthsAgo.driverOntimeRate = 0;
                            $scope.twoMonthsAgo.earningsTotal = 0;
                        }
                    }
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("stats.jsGet_statistics_fail"), "error");
                }
            });
        };

        var init = function () {
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            selectDate = now;

            $scope.tab = 0;
            $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'statsDate');
            getStats();

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

                initRadialProgress();
            }, 0);
        };

        var initRadialProgress = function () {
            //Here we use the three div tags from our HTML page to load the three components into.
            dayDiv1 = d3.select("#day-stats-1");
            dayDiv2 = d3.select("#day-stats-2");
            dayDiv3 = d3.select("#day-stats-3");

            weekDiv1 = d3.select("#week-stats-1");
            weekDiv2 = d3.select("#week-stats-2");
            weekDiv3 = d3.select("#week-stats-3");

            monthDiv1 = d3.select("#month-stats-1");
            monthDiv2 = d3.select("#month-stats-2");
            monthDiv3 = d3.select("#month-stats-3");

            allDivs = [dayDiv1, dayDiv2, dayDiv3, weekDiv1, weekDiv2, weekDiv3, monthDiv1, monthDiv2, monthDiv3];

            //Here we create our three radial progress components by passing in a parent DOM element (our div tags)
            dayViz1 = vizuly.component.radial_progress(document.getElementById("day-stats-1"));
            dayViz2 = vizuly.component.radial_progress(document.getElementById("day-stats-2"));
            dayViz3 = vizuly.component.radial_progress(document.getElementById("day-stats-3"));

            weekViz1 = vizuly.component.radial_progress(document.getElementById("week-stats-1"));
            weekViz2 = vizuly.component.radial_progress(document.getElementById("week-stats-2"));
            weekViz3 = vizuly.component.radial_progress(document.getElementById("week-stats-3"));

            monthViz1 = vizuly.component.radial_progress(document.getElementById("month-stats-1"));
            monthViz2 = vizuly.component.radial_progress(document.getElementById("month-stats-2"));
            monthViz3 = vizuly.component.radial_progress(document.getElementById("month-stats-3"));

            allVizs = [dayViz1, dayViz2, dayViz3, weekViz1, weekViz2, weekViz3, monthViz1, monthViz2, monthViz3];

            //Here we set some bases line properties for all three components.
            allVizs.forEach(function (viz, i) {
                viz.data(0)                                // Current value
                    .min(0)                                 // min value
                    .max(100)                               // max value
                    .capRadius(1)                           // Sets the curvature of the ends of the arc.
                    .startAngle(270)                        // Angle where progress bar starts
                    .endAngle(270)                          // Angle where the progress bar stops
                    .arcThickness(.08);                     // The thickness of the arc (ratio of radius)
                if (i == 0 || i == 3 || i == 6) {
                    viz.label(function (d) {                // The 'label' property allows us to use a dynamic function for labeling.
                        return d3.format(".0f")(d);
                    });
                } else if (i == 1 || i == 4 || i == 7) {
                    viz.label(function (d) {
                        return d3.format(".0f")(d) + "%";
                    });
                } else {
                    viz.label(function (d) {
                        // return d3.format("$,.2f")(d);
                        return $filter('princeTranslateFilters')(d3.format(".2f")(d),false,false,$scope.companyCurrency)
                    });
                }

                vizuly.theme.radial_progress(viz).skin('White');
            });

            allDivs.forEach(function (div, i) {
                div.style("width", 250 + 'px');
                allVizs[i].width(250).height(250).radius(250 / 2).update();
            });
        };

        init();
    });
