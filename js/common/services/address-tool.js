/**
 * Created by gaohui on 17-2-21.
 */
angular.module('Common.Services')
    .factory('AddressTool', function ($log, $q, $rootScope) {
        return {
            finalAddress : function (address) {
                var finalAddressDate = [];
                if (address.formatted_address) {
                    //地址是JSON格式
                    var data = address.address_components;

                    //处理第一行
                    //格式:'street_number route premise political'
                    var line_1 = '';
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'street_number') {
                            line_1 += data[i].long_name + '  ';
                            break;
                        }
                    }
                    var hasRoute = false;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'route') {
                            line_1 += data[i].long_name + ' ';
                            hasRoute = true;
                            break;
                        }
                    }

                    if (!hasRoute) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].types[0] == 'street_address') {
                                line_1 += data[i].long_name + ' ';
                                break;
                            }
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'premise') {
                            line_1 += data[i].long_name + ' ';
                            break;
                        }
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'political') {
                            line_1 += data[i].long_name + ' ';
                            break;
                        }
                    }
                    finalAddressDate.push(line_1);

                    //处理第二行
                    //格式:'locality,administrative_area_level_1 postal_code'
                    var line_2 = '';
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'locality') {
                            line_2 += data[i].long_name;
                            break;
                        }
                    }
                    var hasState = false;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'administrative_area_level_1') {
                            line_2 += ',' + data[i].short_name;
                            hasState = true;
                            break;
                        }
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].types[0] == 'postal_code') {
                            if (hasState) {
                                line_2 += ' ' + data[i].long_name;
                            } else {
                                line_2 += ',' + data[i].long_name;
                            }
                            break;
                        }
                    }
                    finalAddressDate.push(line_2);
                } else {
                    //地址是字符串
                    finalAddressDate.push(address);
                }

                return finalAddressDate;
            }
        }
    });