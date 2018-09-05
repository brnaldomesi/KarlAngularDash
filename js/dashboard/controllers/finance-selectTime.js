/**
 * Created by wanghui on 16-11-15.
 */
angular.module('KARL.Controllers')
    .controller('financeSelectTimeCtrl', function ($log, $scope, $state, MessageBox, OptionBS, $stateParams, $timeout,T) {

        console.log($stateParams);
        $scope.showState=$stateParams.type;
        $scope.onCancelButtonClick = function () {
            $stateParams.event.cancel();

        };

        $scope.onDoneButtonClick = function () {
            $scope.datetime = $('.datetime').data("DateTimePicker").date()._d;
            $stateParams.event.setTime($scope.datetime);
            $stateParams.event.cancel();
        };


        //init datetimepicker
        var initDatePicker = function () {
            $timeout(function () {
                var time = $stateParams.time;
                var minDate = new Date((time.getFullYear()-1) + '/' + (time.getMonth()+1) + '/' + time.getDate());
                $scope.datetime = time;
                $('.datetime').datetimepicker({
                    inline: true,
                    stepping:15,
                    minDate:minDate,
                    sideBySide:true,
                    defaultDate:time,
                    locale:T.T('fullCalendar_lang')
                });
            }, 0);
        };

        initDatePicker();
    });

