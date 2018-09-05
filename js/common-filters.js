/**
 * Created by wangyaunzhi on 16/12/1.
 */
'use strict';

angular.module('Common.Filters', []);
angular.module('Common.Filters')
    .filter('dateFormatter', function () {
        return function (date, format) {
            if (date === 'Select Date' || date === 'Date') {
                return
            }
            var lang = localStorage.getItem('lang');
            var formatStr;
            var formatDate = {
                "shortDate": {
                    "en": "MMM DD",
                    "fr": "DD MMM"
                },
                "weekMonthDay": {
                    "en": 'dddd,MMMM D',
                    "fr": 'dddd,D MMMM'
                },
                "eventDate": {
                    "en": "MMMM.D h:mm a",
                    "fr": "D.MMMM H:mm"
                },
                "langDate": {
                    "en": "LL",
                    "fr": "LL"
                },
                "langsDate": {
                    "en": "lll",
                    "fr": "lll"
                },
                "shortTime": {
                    "en": "LT",
                    "fr": "LT"
                },
                "shortHour": {
                    "en": "h A",
                    "fr": "H :00"
                },
                "shortMonth": {
                    "en": "MMM",
                    "fr": "MMM"
                },
                "statsDate": {
                    "en": "MMMM.DD,YYYY",
                    "fr": "DD.MMMM,YYYY"
                },
                "statsShortFirstDate": {
                    "en": "MMM DD",
                    "fr": "DD"
                },
                "statsShortLastDate": {
                    "en": "DD ,YYYY",
                    "fr": "DD MMM ,YYYY"
                },
                "statsLongLastDate": {
                    "en": "MMM DD ,YYYY",
                    "fr": "DD MMM,YYYY"
                },
                "longDates": {
                    "en": "l LT",
                    "fr": "l LT"
                }
            };
            if (format in formatDate) {
                formatStr = formatDate[format][lang];
            } else {
                formatStr = format
            }

            var d = moment(date);
            if (d.isValid()) {
                return moment(date).format(formatStr); //in absence of format parameter, return the relative time from the given date
            } else {
                return date;
            }
        }
    });

/**
 * Created by wangyaunzhi on 16/12/1.
 */
angular.module('Common.Filters')
    .filter('DistanceFormatFilter', function (T) {
        //入参time单位为分钟
        return function (distance, isBookUnit, unit) {
            var distanceUnit = localStorage.getItem('distanceunit');
            var tempDistance = distance / 1000;
            if (isBookUnit) {
                if (distanceUnit == 1 && unit == 1) {
                    return distance + T.T("comment.h5Mi");
                } else if (distanceUnit == 1 && unit == 2) {
                    return (distance * 0.6213712).toFixed(2) + T.T("comment.h5Mi");
                } else if (distanceUnit == 2 && unit == 1) {
                    return (distance * 1.609344).toFixed(2) + T.T("comment.h5km");
                } else {
                    return distance + T.T("comment.h5km");
                }
            } else {
                if (distanceUnit == 1) {
                    return (tempDistance * 0.6213712).toFixed(2) + T.T("comment.h5Mi");
                } else {
                    return tempDistance.toFixed(2) + T.T("comment.h5km");
                }
            }
        }
    });

/**
 * Created by jian on 17-8-28.
 */
angular.module('Common.Filters')
    .filter('phoneNumFormatter', function () {
        return function (num, country) {
            if (num) {
                num = num.toString().replace(/\s/g, '');
                if (country === "FR") {
                    num = num.replace(/(\d{2})(?=\d)/g, "$1 ");
                } else {
                    num = num.replace(/(\d{3})(?=\d{2,}$)/g, '$1 ');
                }
            }
            return num
        }
    });

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
            };

            if (haveIcon) {
                return prince
            } else {
                return currencies[lang] ? prince + currencies[lang] : prince;
            }
        }
    });

/**
 * Created by wangyaunzhi on 16/12/10.
 */
angular.module('Common.Filters')
    .filter('PriceFormatFilter', function () {
        //符号:$
        //当大于0且小于1时,返回1
        //返回值保留2位有效数字
        return function (param, unitSymbol, allowNegative, priceCode) {
            // console.log(param)
            // console.log(unitSymbol)
            // console.log(allowNegative)
            // console.log(priceCode)
            var lang;
            if (!priceCode) {
                if (window.localStorage.lang) {
                    lang = window.localStorage.lang;
                } else {
                    lang = navigator.language.toLocaleLowerCase();
                }
                if (lang != 'en' && lang != 'fr') {
                    lang = 'en'
                }
            } else {
                lang = priceCode.toLowerCase()
            }

            var price = parseFloat(param);
            if (allowNegative) {
                price = Math.abs(price);
            }
            var result = "0.00";
            if (!price) {
                result = "0.00";
            } else {
                console.log(price);
                if (price <= 0) {
                    result = "0.00";
                } else if (price > 0 && price < 1) {
                    result = '1.00'
                } else {
                    if (price.toString().indexOf('.') > -1) {
                        var num = price.toString().split(".")[1];
                        if (num.length == 3 && num[2] >= 5) {
                            var pointBefore = price.toString().substring(0, price.toString().indexOf(".") + 1);
                            var pointAfter = price.toString().substring(price.toString().indexOf(".") + 1, price.toString().length - 1);
                            result = (pointBefore + pointAfter) * 1 + 0.01;
                            if (result.toString().split(".")[1].length > 2) {
                                result = result.toFixed(2)
                            }
                            console.log(result)
                        } else {
                            result = price.toFixed(2);
                        }
                    } else {
                        result = price.toFixed(2);
                    }
                    // if(price.toString().length==6&&price.toString()[5]>=5){
                    //     result = (price.toString().substring(0,5)*1+0.01).toString();
                    //     console.log(result);
                    // }else {
                    //     result = price.toFixed(2);
                    //     console.log(result);
                    // }
                    // console.log(price);
                    // console.log(result);
                }
            }
            if (unitSymbol) {
                if (lang == 'eur' || lang == 'fr') {
                    result = result.toString().replace(/\./i, ",");
                    return result + '€'
                }
                else if (lang == 'gbp') {
                    result = result.toString().replace(/\./i, ",");
                    return result + '£'
                }
                else {
                    // console.log(result)
                    return '$' + result
                }
                // return unitSymbol+result;
            } else {
                return result;
            }
        }
    });

/**
 * Created by wangyaunzhi on 16/12/1.
 */
angular.module('Common.Filters')
    .filter('TimeFormatFilter', function (T) {
        //入参time单位为分钟
        return function (time, isIframe) {
            if (!time) {
                return ""
            } else {
                time = Math.round(time);
                if (time <= 1) {
                    if (isIframe) {
                        return 1 + "Min";
                    } else {
                        return 1 + T.T('comment.jsMin');
                    }
                } else if (time > 1 && time <= 60) {
                    if (isIframe) {
                        return time + "Mins";
                    } else {
                        return time + T.T('comment.jsMins');
                    }

                } else {
                    if (time % 60 == 0) {
                        if (isIframe) {
                            return parseInt(time / 60) + ":00" + " Hrs";
                        } else {
                            return parseInt(time / 60) + ":00" + T.T('comment.jsHrs');
                        }
                    } else if (time % 60 > 0 && time % 60 < 10) {
                        if (isIframe) {
                            return parseInt(time / 60) + ":0" + time % 60 + " Hrs";
                        } else {
                            return parseInt(time / 60) + ":0" + time % 60 + T.T('comment.jsHrs');
                        }
                    } else {
                        if (isIframe) {
                            return parseInt(time / 60) + ":" + time % 60 + " Hrs";
                        } else {
                            return parseInt(time / 60) + ":" + time % 60 + T.T('comment.jsHrs');
                        }
                    }
                }
            }
        }
    });
