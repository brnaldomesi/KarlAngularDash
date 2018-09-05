angular.module('KARL.Filters')
    .filter('RepeatType', function () {
        return function (type) {
            if (type == 0) {
                return 'Day';

            } else if (type == 1) {
                return 'Week';
            }
            else if (type == 2) {
                return 'Month';
            }
            else if (type == 3) {
                return 'Year';
            }
            else {
                return 'No Repeat';
            }
        }
    });
