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
