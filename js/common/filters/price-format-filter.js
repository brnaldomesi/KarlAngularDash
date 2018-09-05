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
