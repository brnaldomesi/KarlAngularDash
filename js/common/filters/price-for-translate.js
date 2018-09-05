/**
 * Created by jian on 17-5-6.
 */
angular.module('Common.Filters')
    .filter('princeTranslateFilters', function () {
        return function (num, allowNegative, haveIcon, priceCode) {
            var lang;
            var sign;
            var cents;
            var prince;


            if (!priceCode) {
                lang = window.localStorage.lang;
            } else {
                lang = priceCode.toLowerCase()
            }
            if (allowNegative) {
                num = Math.abs(num);
            }

            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / 100).toString();

            if (cents < 10)
                cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                    num.substring(num.length - (4 * i + 3));

            if (lang == 'eur' || lang == 'fr')
                prince = (((sign) ? '' : '-') + num + ',' + cents);
            else prince = (((sign) ? '' : '-') + num + '.' + cents);

            var currencies = {
                eur: '€',
                fr: '€',
                zh: '¥',
                gbp: '£',
                aud: 'AUD',
                dkk: 'kr',
                cad: 'CAD',
                hkd: 'HKD',
                jpy: '¥',
                nzd: 'NZD',
                nok: 'kr',
                sgd: 'SGD',
                sek: 'kr',
                chf: 'chf',
                usd: '$'
            };

            if (haveIcon) {
                return prince
            } else {

                if(currencies[lang]){
                    if(currencies[lang] == '$') {
                        return currencies[lang] + prince;
                    }
                    else
                        return prince + currencies[lang];
                }
                else
                   return prince;
            }
        }
    });
