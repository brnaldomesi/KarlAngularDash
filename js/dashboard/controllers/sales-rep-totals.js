/**
 * Created by jian on 17-8-9.
 */
angular.module('KARL.Controllers')
    .controller('SalesRapTotalsCtrl', function ($scope, $filter, $timeout, $uibModal,MessageBox, StatisticsBS) {
        $scope.companyCount = 0;
        $scope.vehicleCount = 0;
        $scope.activeVehicle = 0;
        $scope.ccyType = 'usd';
        var ccyStats =[];
        var dayDiv3;
        var weekDiv3;
        var monthDiv3;
        var allDivs = [];

        var dayViz3;
        var weekViz3;
        var monthViz3;
        var allVizs = [];
        $scope.companyCurrency = window.localStorage.companyCurrency.toLowerCase();
        $scope.today = {
            earningsTotal: 0
        };
        $scope.yesterday = {
            earningsTotal: 0
        };
        $scope.twoDaysAgo = {
            earningsTotal: 0
        };

        $scope.thisWeek = {
            earningsTotal: 0
        };
        $scope.lastWeek = {
            earningsTotal: 0
        };
        $scope.twoWeeksAgo = {
            earningsTotal: 0
        };

        $scope.thisMonth = {
            earningsTotal: 0
        };
        $scope.lastMonth = {
            earningsTotal: 0
        };
        $scope.twoMonthsAgo = {
            earningsTotal: 0
        };
        var selectDate;

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
        var getStats = function () {
            MessageBox.showLoading();
            StatisticsBS.saleStatistics(selectDate, $scope.tab).then(function (result) {
                MessageBox.hideLoading();
                $timeout(function () {
                    //整理数据
                    $scope.companyCount = result.data.companies;
                    $scope.vehicleCount = result.data.cars;
                    $scope.activeVehicle = result.data.active_vehicle;
                    ccyStats = result.data.statistic;
                    switchCurrency('usd',ccyStats['usd'])
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
                        $filter('dateFormatter')(lastDateOfWeek.getTime(), 'statsLongLastDate');
                }
            } else {
                $scope.dateString = $filter('dateFormatter')(selectDate.getTime(), 'MMM,YYYY');
            }
            getStats();
        };


        var initRadialProgress = function () {
            //Here we use the three div tags from our HTML page to load the three components into.
            dayDiv3 = d3.select("#day-stats-3");

            weekDiv3 = d3.select("#week-stats-3");

            monthDiv3 = d3.select("#month-stats-3");

            allDivs = [dayDiv3, weekDiv3, monthDiv3];

            //Here we create our three radial progress components by passing in a parent DOM element (our div tags)
            dayViz3 = vizuly.component.radial_progress(document.getElementById("day-stats-3"));

            weekViz3 = vizuly.component.radial_progress(document.getElementById("week-stats-3"));

            monthViz3 = vizuly.component.radial_progress(document.getElementById("month-stats-3"));

            allVizs = [dayViz3, weekViz3, monthViz3];

            //Here we set some bases line properties for all three components.
            allVizs.forEach(function (viz, i) {
                viz.data(0)                                // Current value
                    .min(0)                                 // min value
                    .max(100)                               // max value
                    .capRadius(1)                           // Sets the curvature of the ends of the arc.
                    .startAngle(270)                        // Angle where progress bar starts
                    .endAngle(270)                          // Angle where the progress bar stops
                    .arcThickness(.08);                     // The thickness of the arc (ratio of radius)
                viz.label(function (d) {
                    var initViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(d),false,false,$scope.companyCurrency);
                    return initViz3Prince;
                });
                vizuly.theme.radial_progress(viz).skin('White');
            });

            allDivs.forEach(function (div, i) {
                div.style("width", 250 + 'px');
                allVizs[i].width(250).height(250).radius(250 / 2).update();
            });
        };

        init();
        $scope.changeCcy = function () {
            switchCurrency($scope.ccyType);
        };
       var switchCurrency = function (ccy) {
            $scope.companyCurrency = ccy;
            $scope.ccyType = ccy;
            console.log("ccy is ",$scope.companyCurrency);
            var stats = ccyStats[ccy];
            console.log("stats is ",stats);

           if(stats.length == 0){
                if($scope.tab == 0){
                    $scope.today.earningsTotal=0;
                    $scope.yesterday.earningsTotal=0;
                    $scope.twoDaysAgo.earningsTotal=0;
                    dayViz3.data(0).update();
                    dayViz3.label(function () {
                        var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return dayViz3Prince;
                    }).update();
                }else if($scope.tab == 1){
                    $scope.thisWeek.earningsTotal=0;
                    $scope.lastWeek.earningsTotal=0;
                    $scope.twoWeeksAgo.earningsTotal=0;
                    weekViz3.data(0).update();
                    weekViz3.label(function () {
                        var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return weekViz3Prince;
                    }).update();
                }else if($scope.tab == 2){
                    $scope.thisMonth.earningsTotal=0;
                    $scope.lastMonth.earningsTotal=0;
                    $scope.twoMonthsAgo.earningsTotal=0;
                    monthViz3.data(0).update();
                    monthViz3.label(function () {
                        var monViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")(0),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return monViz3Prince;
                    }).update();
                }
            }else if(stats.length == 1){
                if($scope.tab == 0){
                    $scope.today.earningsTotal=stats[0]['total_income'];
                    $scope.yesterday.earningsTotal=0;
                    $scope.twoDaysAgo.earningsTotal=0;
                    dayViz3.data(0).update();
                    dayViz3.label(function () {
                        var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.today.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return dayViz3Prince;
                    }).update();
                }else if($scope.tab == 1){
                    $scope.thisWeek.earningsTotal=stats[0]['total_income'];
                    $scope.lastWeek.earningsTotal=0;
                    $scope.twoWeeksAgo.earningsTotal=0;
                    weekViz3.data(0).update();
                    weekViz3.label(function () {
                        var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisWeek.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return weekViz3Prince;
                    }).update();
                }else if($scope.tab == 2){
                    $scope.thisMonth.earningsTotal=stats[0]['total_income'];
                    $scope.lastMonth.earningsTotal=0;
                    $scope.twoMonthsAgo.earningsTotal=0;
                    monthViz3.data(0).update();
                    monthViz3.label(function () {
                        var monViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisMonth.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return monViz3Prince;
                    }).update();
                }
            }else if(stats.length == 2){
                if($scope.tab == 0){
                    $scope.today.earningsTotal=stats[0]['total_income'];
                    $scope.yesterday.earningsTotal=stats[1]['total_income'];
                    $scope.twoDaysAgo.earningsTotal=0;
                    dayViz3.data(0).update();
                    dayViz3.label(function () {
                        var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.today.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return dayViz3Prince;
                    }).update();
                }else if($scope.tab == 1){
                    $scope.thisWeek.earningsTotal=stats[0]['total_income'];
                    $scope.lastWeek.earningsTotal=stats[1]['total_income'];
                    $scope.twoWeeksAgo.earningsTotal=0;
                    weekViz3.data(0).update();
                    weekViz3.label(function () {
                        var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisWeek.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return weekViz3Prince;
                    }).update();
                }else if($scope.tab == 2){
                    $scope.thisMonth.earningsTotal=stats[0]['total_income'];
                    $scope.lastMonth.earningsTotal=stats[1]['total_income'];
                    $scope.twoMonthsAgo.earningsTotal=0;
                    monthViz3.data(0).update();
                    monthViz3.label(function () {
                        var monViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisMonth.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return monViz3Prince;
                    }).update();
                }
            }else if(stats.length == 3){
                if($scope.tab == 0){
                    $scope.today.earningsTotal=stats[0]['total_income'];
                    $scope.yesterday.earningsTotal=stats[1]['total_income'];
                    $scope.twoDaysAgo.earningsTotal=stats[2]['total_income'];
                    dayViz3.data(0).update();
                    dayViz3.label(function () {
                        var dayViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.today.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return dayViz3Prince;
                    }).update();
                }else if($scope.tab == 1){
                    $scope.thisWeek.earningsTotal=stats[0]['total_income'];
                    $scope.lastWeek.earningsTotal=stats[1]['total_income'];
                    $scope.twoWeeksAgo.earningsTotal=stats[2]['total_income'];
                    weekViz3.data(0).update();
                    weekViz3.label(function () {
                        var weekViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisWeek.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return weekViz3Prince;
                    }).update();
                }else if($scope.tab == 2){
                    $scope.thisMonth.earningsTotal=stats[0]['total_income'];
                    $scope.lastMonth.earningsTotal=stats[1]['total_income'];
                    $scope.twoMonthsAgo.earningsTotal=stats[2]['total_income'];
                    monthViz3.data(0).update();
                    monthViz3.label(function () {
                        var monViz3Prince=$filter('princeTranslateFilters')(d3.format(".2f")($scope.thisMonth.earningsTotal),false,false,$scope.companyCurrency);
                        // return d3.format("$,.2f")(0);
                        return monViz3Prince;
                    }).update();
                }
            }
        }

    });
