angular.module('KARL.Filters')
    .filter('BookingType', function () {

        return function (type) {
            if (type == 1) {
                return 'Transfer';
            }
            else if (type == 2) {
                return 'Hourly';
            }
            else if (type == 3) {
                return 'Custom Quote';
            }
            else {
                return 'Unknown';
            }
        }
    });
