'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Filters',[]);

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

angular.module('KARL.Filters')
    .filter('CardNumberFormat', function ()
    {
        return function (cardNumber)
        {
            var formatNumber = '';
            for (var i = 0;i<cardNumber.length;i++){

                formatNumber = formatNumber +  cardNumber.substring(i,i+1);
                if ((i+1)%4 == 0){
                    formatNumber = formatNumber + " ";
                }
            }

            return formatNumber;

        }
    });

angular.module('KARL.Filters')
    .filter('CheckBoxIsChecked', function ()
    {
        return function (isCheck)
        {
            if (isCheck == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    });

angular.module('KARL.Filters')
    .filter('GenderTitle', function ()
    {
        return function (gender)
        {
            if (gender == 1)
            {
                return 'Mrs.';
            }
            else if (gender == 2)
            {
                return 'Mr.';
            }
            else
            {
                return 'Unknown';
            }
        }
    });

angular.module('KARL.Filters')
    .filter('Gender', function ()
    {
        return function (gender)
        {
            if (gender == 1)
            {
                return 'Mrs.';
            }
            else if (gender == 2)
            {
                return 'Mr.';
            }
            else
            {
                return 'Unknown';
            }
        }
    });

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

angular.module('KARL.Filters')
    .filter('Tax', function () {
        return function (num, tva)
        {
            var percent = parseInt(tva)/100;
            var result = num * (1 + percent);
            return result;
        }
    });

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
