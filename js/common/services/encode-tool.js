/**
 * Created by wangyaunzhi on 16/9/27.
 */
/**
 * Created by wangyaunzhi on 16/9/2.
 */
angular.module('Common.Services')
    .factory('EncodeTool', function () {
        var DICTIONARY = {
            "encode": {
                ",": "d",
                "1": "e",
                "2": "f",
                "3": "g",
                "4": "a",
                "5": "x",
                "6": "w",
                "7": "m",
                "8": "n",
                "9": "y",
                "0": "o"
            },
            "decode": {
                "d": ",",
                "e": "1",
                "f": "2",
                "g": "3",
                "a": "4",
                "x": "5",
                "w": "6",
                "m": "7",
                "n": "8",
                "y": "9",
                "o": "0"
            }
        };
        return {
            enCode: function (string) {
                var encode = DICTIONARY["encode"];
                for(var code in encode){
                    string = string.replace(new RegExp(code,'gm'),encode[code]);
                }
                string = string.split("").reverse().join("");
                return string;
            },
            deCode : function (string) {
                string = string.split("").reverse().join("");
                string = string.toLowerCase();
                var decode = DICTIONARY["decode"];
                for(var code in decode){
                    string = string.replace(new RegExp(code,'gm'),decode[code]);
                }
                return string;
            }
        }
    });