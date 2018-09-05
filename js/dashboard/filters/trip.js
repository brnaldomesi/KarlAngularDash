angular.module('KARL.Filters')
    .filter('Trip', function () {
        return function (trip) {
            if (trip == 0) {
                return 'Not Start';
            }
            else if (trip == 1) {
                return 'Driver Started';
            }
            else if (trip == 2) {
                return 'Driver Arrived';
            }
            else if (trip == 3) {
                return 'On Trip';
            }
            else if (trip == 4) {
                return 'Trip Finished';
            }
            else if (trip == 5) {
                return 'Trip Finished';
            }
            else {
                return 'Unknown';
            }
        }
    });
