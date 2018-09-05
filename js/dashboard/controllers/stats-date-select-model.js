/**
 * Created by wangyaunzhi on 16/12/27.
 */
angular.module('KARL.Controllers')
    .controller('StatsDateSelectModel', function ($log, $scope, $state, $stateParams,$filter,$timeout,T) {
        var preDayCell;
        var lastDaySelect;
        var lastWeekDaysSelect = [];
        var preWeekDayCells = [];
        $scope.selectDate = angular.copy($stateParams.data.currentDate);
        $scope.type = 0;//0:day,1:week,2:month
        $scope.allMonths = [];

        var init = function () {
            $scope.events = [];
            $scope.eventSources = [$scope.events];
            $scope.type = $stateParams.data.type;
            $timeout(function () {
                var date = $stateParams.data.currentDate;
                if($scope.type == 0){
                    lastDaySelect = $filter('date')(date, "yyyy-MM-dd");
                    angular.element(".fc-" + lastDaySelect).css('background-color', 'red');
                    preDayCell = angular.element(".fc-" + lastDaySelect);
                }else if ($scope.type == 1){
                    var firstDateOfWeek = angular.copy(date);
                    if(firstDateOfWeek.getDay() == 0){
                        firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - 7);
                    }else {
                        firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - firstDateOfWeek.getDay());
                    }
                    lastWeekDaysSelect.push($filter('date')(firstDateOfWeek, "yyyy-MM-dd"));
                    for (var i=0;i<6;i++){
                        var day = new Date(firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1));
                        lastWeekDaysSelect.push($filter('date')(day, "yyyy-MM-dd"));
                    }
                    lastWeekDaysSelect.forEach(function (perDay) {
                        angular.element(".fc-" + perDay).css('background-color', 'red');
                        angular.element(".fc-" + perDay).css('border-radius', '0');
                        preWeekDayCells.push(angular.element(".fc-" + perDay));
                    });
                }else {
                    var year = $scope.selectDate.getFullYear();
                    var month = $scope.selectDate.getMonth()+1;
                    for (var i=1;i<13;i++){
                        var monthData = {};
                        var firstdate = year + '/' + i + '/01';
                        if(month == i){
                            monthData.date = $scope.selectDate;
                            monthData.isSelected = true;
                        }else {
                            monthData.date = new Date(firstdate);
                            monthData.isSelected = false;
                        }
                        $scope.allMonths.push(monthData);
                    }
                }
            },0);
        };

        var dayHasBeenChanged = function (date) {
            $scope.selectDate = date;

            $timeout(function () {
                if($scope.type == 0){
                    lastDaySelect = $filter('date')($scope.selectDate, "yyyy-MM-dd");
                    angular.element(preDayCell).css('background-color', '');
                    angular.element(".fc-" + lastDaySelect).css('background-color', 'red');
                    preDayCell = angular.element(".fc-" + lastDaySelect);
                }else {
                    preWeekDayCells.forEach(function (dayCell) {
                        angular.element(dayCell).css('background-color', '');
                        angular.element(dayCell).css('border-radius', '100%');
                    });
                    lastWeekDaysSelect = [];
                    preWeekDayCells = [];
                    var firstDateOfWeek = angular.copy($scope.selectDate);
                    if(firstDateOfWeek.getDay() == 0){
                        firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - 7);
                    }else {
                        firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1 - firstDateOfWeek.getDay());
                    }
                    lastWeekDaysSelect.push($filter('date')(firstDateOfWeek, "yyyy-MM-dd"));
                    for (var i=0;i<6;i++){
                        var day = new Date(firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 1));
                        lastWeekDaysSelect.push($filter('date')(day, "yyyy-MM-dd"));
                    }
                    lastWeekDaysSelect.forEach(function (perDay) {
                        angular.element(".fc-" + perDay).css('background-color', 'red');
                        angular.element(".fc-" + perDay).css('border-radius', '0');
                        preWeekDayCells.push(angular.element(".fc-" + perDay));
                    });
                }
            },0);
        };

        $scope.onDayClick = function (date, jsEvent, view) {
            var longDay = Date.parse(date._d);
            longDay = longDay + date._d.getTimezoneOffset() * 60 * 1000;
            dayHasBeenChanged(new Date(longDay));
        };

        $scope.statsDate = {
            calendar: {
                contentHeight: 350,
                editable: false,
                timeFormat: ' ',
                firstDay:1,
                timezone: 'local',
                lang: T.T('fullCalendar_lang'),
                defaultDate: $stateParams.data.currentDate,
                header: {
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                },
                dayClick: $scope.onDayClick,
                nextChange: function (date) {
                    dayHasBeenChanged(date._d);
                }
            }
        };

        $scope.changeYear = function (add) {
            var year;
            if(add){
                year = $scope.selectDate.getFullYear()+1
            }else {
                year = $scope.selectDate.getFullYear()-1;
            }
            $scope.allMonths = [];
            for (var i=1;i<13;i++){
                var monthData = {};
                var firstdate = year + '/' + i + '/01';
                monthData.date = new Date(firstdate);
                if(i == 1){
                    monthData.isSelected = true;
                    $scope.selectDate = monthData.date;
                }else {
                    monthData.isSelected = false;
                }
                $scope.allMonths.push(monthData);
            }
        };

        $scope.changeMonth = function (selectIndex) {
            $scope.allMonths.forEach(function (monthData,index) {
                if(selectIndex == index){
                    monthData.isSelected = true;
                    $scope.selectDate = monthData.date;
                }else {
                    monthData.isSelected = false;
                }
            })
        };

        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };

        $scope.onSaveButtonClick = function () {
            if ($stateParams.event.done) {
                $stateParams.event.done(angular.copy($scope.selectDate));
            }
        };

        init();
    });