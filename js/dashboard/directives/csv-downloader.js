/**
 * Created by jian on 17-9-7.
 */
angular.module('KARL.Directives')
    .directive('downCsv', function (TransactionBS, $filter, MessageBox, T, $rootScope) {
        return {
            require: '?ngModel',
            restrict: 'E',
            template: "<button id='csvButton' ng-click='downLoadCsv($event)' class='btn btn-x btn-primary' style='width: 60%; border-radius: 50px;display: block;margin: auto'> <b>{{exportText}}</b> </button>",
            replace: true,
            link: function (scope, element, attrs, ngModel) {

                if (scope.csvPage) {
                    scope.exportText = 'Export to CSV';
                } else {
                    scope.exportText = 'Export page to CSV';
                }
                scope.downLoadCsv = function () {
                    if (scope.csvPage) {
                        detailCsvFun()
                    } else {
                        console.log(attrs.page);
                        if (attrs.page == 'invoice') {
                            invoiceCsvFun()
                        } else if (attrs.page == 'bill') {
                            billCsvFun()
                        } else if (attrs.page == 'an') {
                            anCsvFun()
                        }

                    }
                };

                function fomartData(getData) {
                    console.log(getData);
                    var data=angular.copy(getData);
                    data.customer_data = JSON.parse(data.customer_data);
                    data.driver_data = JSON.parse(data.driver_data);
                    data.offer_data = JSON.parse(data.offer_data);
                    data.duration = fomartDuration(data.duration);
                    data.customer_name=data.customer_data.first_name+' '+data.customer_data.last_name;
                    try {
                        data.d_address = JSON.parse(data.d_address);
                        if (data.d_address.formatted_address) {
                            data.d_address = data.d_address.formatted_address
                        }
                    } catch (e) {
                    }
                    if (data.a_address) {
                        try {
                            data.a_address = JSON.parse(data.a_address);
                            if (data.a_address.formatted_address) {
                                data.a_address = data.a_address.formatted_address
                            }
                        } catch (e) {
                        }
                    }

                    if (data.offer_data.prices) {  //...计算rate
                        data.offer_data.prices = JSON.parse(data.offer_data.prices);
                        if (data.type == 1) {
                            if (data.distance <= data.offer_data.prices[0].invl_end) {
                                data.rate = data.offer_data.prices[0].price
                            }else if(data.distance > data.offer_data.prices[data.offer_data.prices.length-1].invl_start){
                                data.rate = data.offer_data.prices[data.offer_data.prices.length-1].price
                            }else {
                                for(var i=0;i<data.offer_data.prices.length;i++){
                                    if (data.distance <= data.offer_data.prices[i].invl_end) {
                                        data.rate = data.offer_data.prices[i].price
                                    }
                                }
                            }
                        }else {
                            data.rate = data.offer_data.prices[0].price
                        }
                    } else {
                        data.rate = data.offer_data.price
                    }
                    console.log(data)
                    return data
                }

                function fomartDuration(s) {
                    var t;
                    if (s > -1) {
                        var hour = Math.floor(s / 60) % 60;
                        var min = s % 60;
                        t = hour + ":";

                        if (min < 10) {
                            t += "0";
                        }
                        t += min;
                    }
                    return t;
                }

                function detailCsvFun() {
                    var l = Ladda.create(document.querySelector('#csvButton'));
                    l.start();
                    TransactionBS.getInvoiceInfo(scope.listDataDetail.booking_id).then(function (result) {
                        l.stop();
                        // var resData = result.data;
                        var resData = fomartData(result.data);
                        var csvData = {};
                        if (scope.csvPage == 3) {
                            csvData = {
                                'Client': resData.customer_name,
                                'Pick-up-date': $filter('dateFormatter')(resData.start_time * 1000, 'L'),
                                'Pick-up-time': $filter('dateFormatter')(resData.start_time * 1000, 'LT'),
                                'Pick-up-address': resData.d_address,
                                'Drop-off-date': $filter('dateFormatter')(resData.finish_time * 1000, 'L'),
                                'Drop-off-time': $filter('dateFormatter')(resData.finish_time * 1000, 'LT'),
                                'Drop-off-address': resData.a_address == null ? '' : resData.a_address,
                                'Total-time': resData.duration,
                                'Distance': $filter('DistanceFormatFilter')(resData.distance, true, resData.unit),
                                'Rate': resData.rate,
                                'Base-fare': $filter('princeTranslateFilters')(resData.base_fare, false, false, resData.ccy),
                                'Add-ons': $filter('princeTranslateFilters')(resData.add_ons, false, false, resData.ccy),
                                'Additional-mileage': $filter('princeTranslateFilters')(resData.additional, false, false, resData.ccy),
                                'Subtotal': $filter('princeTranslateFilters')(resData.sub_total, false, false, resData.ccy),
                                'Amount-off': resData.coupon_off > 0 ? '-' + $filter('princeTranslateFilters')(resData.coupon_off, false, false, resData.ccy) : $filter('princeTranslateFilters')(resData.coupon_off, false, false, resData.ccy),
                                'Affiliate-Pay-out': scope.canSendEmail ? $filter('princeTranslateFilters')(resData.an_fee, false, false, resData.ccy) : $filter('princeTranslateFilters')(resData.com_income, false, false, resData.ccy),
                                'KARL-fee': $filter('princeTranslateFilters')(resData.platform_income, false, false, resData.ccy),
                                'Tax': $filter('princeTranslateFilters')(resData.tax, false, false, resData.ccy),
                                'Total': $filter('princeTranslateFilters')(resData.settle_fee, false, false, resData.ccy)
                            };
                        } else if (scope.csvPage == 2) {
                            csvData = {
                                'Client': resData.customer_name,
                                'Pick-up-date': $filter('dateFormatter')(resData.start_time * 1000, 'L'),
                                'Pick-up-time': $filter('dateFormatter')(resData.start_time * 1000, 'LT'),
                                'Pick-up-address': resData.d_address,
                                'Drop-off-date': $filter('dateFormatter')(resData.finish_time * 1000, 'L'),
                                'Drop-off-time': $filter('dateFormatter')(resData.finish_time * 1000, 'LT'),
                                'Drop-off-address': resData.a_address == null ? '' : resData.a_address,
                                'Total-time': resData.duration,
                                'Distance': $filter('DistanceFormatFilter')(resData.distance, true, resData.unit),
                                'Rate': resData.rate,
                                'Base-fare': $filter('princeTranslateFilters')(resData.base_fare, false, false, resData.ccy),
                                'Add-ons': $filter('princeTranslateFilters')(resData.add_ons, false, false, resData.ccy),
                                'Additional-mileage': $filter('princeTranslateFilters')(resData.additional, false, false, resData.ccy),
                                'Subtotal': $filter('princeTranslateFilters')(resData.sub_total, false, false, resData.ccy),
                                'Amount-off': resData.coupon_off > 0 ? '-' + $filter('princeTranslateFilters')(resData.coupon_off, false, false, resData.ccy) : $filter('princeTranslateFilters')(resData.coupon_off, false, false, resData.ccy),
                                'KARL-fee': $filter('princeTranslateFilters')(resData.platform_income, false, false, resData.ccy),
                                'Tax': $filter('princeTranslateFilters')(resData.tax, false, false, resData.ccy),
                                'Total': $filter('princeTranslateFilters')(resData.settle_fee, false, false, resData.ccy)
                            };
                        } else {
                            csvData = {
                                'Client': resData.customer_name,
                                'Pick-up-date': $filter('dateFormatter')(resData.start_time * 1000, 'L'),
                                'Pick-up-time': $filter('dateFormatter')(resData.start_time * 1000, 'LT'),
                                'Pick-up-address': resData.d_address,
                                'Drop-off-date': $filter('dateFormatter')(resData.finish_time * 1000, 'L'),
                                'Drop-off-time': $filter('dateFormatter')(resData.finish_time * 1000, 'LT'),
                                'Drop-off-address': resData.a_address == null ? '' : resData.a_address,
                                'Total-time': resData.duration,
                                'Distance': $filter('DistanceFormatFilter')(resData.distance, true, resData.unit),
                                'Rate': resData.rate,
                                'Base-fare': $filter('princeTranslateFilters')(resData.base_fare, false, false, resData.ccy),
                                'Add-ons': $filter('princeTranslateFilters')(resData.add_ons, false, false, resData.ccy),
                                'Additional-mileage': $filter('princeTranslateFilters')(resData.additional, false, false, resData.ccy),
                                'Subtotal': $filter('princeTranslateFilters')(resData.sub_total, false, false, resData.ccy),
                                'Amount-off': resData.coupon_off > 0 ? '-' + $filter('princeTranslateFilters')(resData.coupon_off, false, false, resData.ccy) : $filter('princeTranslateFilters')(resData.coupon_off, false, false, resData.ccy),
                                'Tax': $filter('princeTranslateFilters')(resData.tax, false, false, resData.ccy),
                                'Total': $filter('princeTranslateFilters')(resData.settle_fee, false, false, resData.ccy)
                            };
                        }
                        var finalCsvData = [csvData];
                        console.log(finalCsvData);
                        JSONToCSVConvertor(finalCsvData, '', true)
                    }, function (error) {
                        l.stop();
                        if (error.treated) {
                        } else {
                            MessageBox.toast(T.T("book_invoice_detail.jsDownload_Fail"), "error");
                        }
                    });
                }


                function invoiceCsvFun() {
                    var invoiceCsvData = [];
                    console.log(scope.clientInvoiceList);
                    for (var k = 0; k < scope.clientInvoiceList.length; k++) {
                        for (var i = 0; i < scope.clientInvoiceList[k].invoiceList.length; i++) {
                            var item = scope.clientInvoiceList[k].invoiceList[i];
                            var csvData = {
                                'Client': item.customer_data.first_name + ' ' + item.customer_data.last_name,
                                'Pick-up-date': $filter('dateFormatter')(item.start_time * 1000, 'L'),
                                'Pick-up-time': $filter('dateFormatter')(item.start_time * 1000, 'LT'),
                                'Pick-up-address': item.d_address,
                                'Drop-off-date': $filter('dateFormatter')(item.finish_time * 1000, 'L'),
                                'Drop-off-time': $filter('dateFormatter')(item.finish_time * 1000, 'LT'),
                                'Drop-off-address': item.a_address == null ? '' : item.a_address,
                                'Total-time': item.duration,
                                'Distance': $filter('DistanceFormatFilter')(item.distance, true, item.unit),
                                'Rate': item.rate,
                                'Base-fare': $filter('princeTranslateFilters')(item.base_fare, false, false, item.ccy),
                                'Add-ons': $filter('princeTranslateFilters')(item.add_ons, false, false, item.ccy),
                                'Additional-mileage': $filter('princeTranslateFilters')(item.additional, false, false, item.ccy),
                                'Subtotal': $filter('princeTranslateFilters')(item.sub_total, false, false, item.ccy),
                                'Amount-off': item.coupon_off > 0 ? '-' + $filter('princeTranslateFilters')(item.coupon_off, false, false, item.ccy) : $filter('princeTranslateFilters')(item.coupon_off, false, false, item.ccy),
                                'Tax': $filter('princeTranslateFilters')(item.tax, false, false, item.ccy),
                                'Total': $filter('princeTranslateFilters')(item.settle_fee, false, false, item.ccy)
                            };
                            invoiceCsvData.push(csvData)
                        }
                    }
                    console.log(invoiceCsvData);
                    JSONToCSVConvertor(invoiceCsvData, '', true)
                }


                function billCsvFun() {
                    var billCsvData = [];
                    console.log(scope.karlBillList);
                    for (var k = 0; k < scope.karlBillList.length; k++) {
                        for (var i = 0; i < scope.karlBillList[k].invoiceList.length; i++) {
                            var item = scope.karlBillList[k].invoiceList[i];
                            var csvData = {
                                'Client': item.customer_data.first_name + ' ' + item.customer_data.last_name,
                                'Pick-up-date': $filter('dateFormatter')(item.start_time * 1000, 'L'),
                                'Pick-up-time': $filter('dateFormatter')(item.start_time * 1000, 'LT'),
                                'Pick-up-address': item.d_address,
                                'Drop-off-date': $filter('dateFormatter')(item.finish_time * 1000, 'L'),
                                'Drop-off-time': $filter('dateFormatter')(item.finish_time * 1000, 'LT'),
                                'Drop-off-address': item.a_address == null ? '' : item.a_address,
                                'Total-time': item.duration,
                                'Distance': $filter('DistanceFormatFilter')(item.distance, true, item.unit),
                                'Rate': item.rate,
                                'Base-fare': $filter('princeTranslateFilters')(item.base_fare, false, false, item.ccy),
                                'Add-ons': $filter('princeTranslateFilters')(item.add_ons, false, false, item.ccy),
                                'Additional-mileage': $filter('princeTranslateFilters')(item.additional, false, false, item.ccy),
                                'Subtotal': $filter('princeTranslateFilters')(item.sub_total, false, false, item.ccy),
                                'Amount-off': item.coupon_off > 0 ? '-' + $filter('princeTranslateFilters')(item.coupon_off, false, false, item.ccy) : $filter('princeTranslateFilters')(item.coupon_off, false, false, item.ccy),
                                'KARL-fee': $filter('princeTranslateFilters')(item.platform_income, false, false, item.ccy),
                                'Tax': $filter('princeTranslateFilters')(item.tax, false, false, item.ccy),
                                'Total': $filter('princeTranslateFilters')(item.settle_fee, false, false, item.ccy)
                            };
                            billCsvData.push(csvData)
                        }
                    }
                    console.log(billCsvData);
                    JSONToCSVConvertor(billCsvData, '', true)
                }


                function anCsvFun() {
                    var anCsvData = [];
                    console.log(scope.anList);
                    for (var k = 0; k < scope.anList.length; k++) {
                        var allAnList = scope.anList[k].AInvoice.invoiceList.concat(scope.anList[k].BInvoice.invoiceList);
                        for (var i = 0; i < allAnList.length; i++) {
                            var item = allAnList[i];
                            var csvData = {
                                'Client': item.customer_data.first_name + ' ' + item.customer_data.last_name,
                                'Pick-up-date': $filter('dateFormatter')(item.start_time * 1000, 'L'),
                                'Pick-up-time': $filter('dateFormatter')(item.start_time * 1000, 'LT'),
                                'Pick-up-address': item.d_address,
                                'Drop-off-date': $filter('dateFormatter')(item.finish_time * 1000, 'L'),
                                'Drop-off-time': $filter('dateFormatter')(item.finish_time * 1000, 'LT'),
                                'Drop-off-address': item.a_address == null ? '' : item.a_address,
                                'Total-time': item.duration,
                                'Distance': $filter('DistanceFormatFilter')(item.distance, true, item.unit),
                                'Rate': item.rate,
                                'Base-fare': $filter('princeTranslateFilters')(item.base_fare, false, false, item.ccy),
                                'Add-ons': $filter('princeTranslateFilters')(item.add_ons, false, false, item.ccy),
                                'Additional-mileage': $filter('princeTranslateFilters')(item.additional, false, false, item.ccy),
                                'Subtotal': $filter('princeTranslateFilters')(item.sub_total, false, false, item.ccy),
                                'Amount-off': item.coupon_off > 0 ? '-' + $filter('princeTranslateFilters')(item.coupon_off, false, false, item.ccy) : $filter('princeTranslateFilters')(item.coupon_off, false, false, item.ccy),
                                'Affiliate-Pay-out': item.own_com_id == $rootScope.loginUser.company_id ? $filter('princeTranslateFilters')(item.an_fee, false, false, item.ccy) : $filter('princeTranslateFilters')(item.com_income, false, false, item.ccy),
                                'KARL-fee': $filter('princeTranslateFilters')(item.platform_income, false, false, item.ccy),
                                'Tax': $filter('princeTranslateFilters')(item.tax, false, false, item.ccy),
                                'Total': $filter('princeTranslateFilters')(item.settle_fee, false, false, item.ccy)
                            };
                            anCsvData.push(csvData)
                        }
                    }
                    console.log(anCsvData);
                    JSONToCSVConvertor(anCsvData, '', true)
                }


                function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
                    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                    var CSV = '';
                    //Set Report title in first row or line

                    CSV += ReportTitle + '';

                    //This condition will generate the Label/Header
                    if (ShowLabel) {
                        var row = "";

                        //This loop will extract the label from 1st index of on array
                        for (var index in arrData[0]) {

                            //Now convert each value to string and comma-seprated
                            row += index + ',';
                        }

                        row = row.slice(0, -1);

                        //append Label row with line break
                        CSV += row + '\r\n';
                    }

                    //1st loop is to extract each row
                    for (var i = 0; i < arrData.length; i++) {
                        var row = "";

                        //2nd loop will extract each column and convert it in string comma-seprated
                        for (var index in arrData[i]) {
                            row += '"' + arrData[i][index] + '",';
                        }

                        row.slice(0, row.length - 1);

                        //add a line break after each row
                        CSV += row + '\r\n';
                    }

                    if (CSV == '') {
                        alert("Invalid data");
                        return;
                    }

                    //Generate a file name
                    var fileName = "KARL CSV file";
                    //this will remove the blank-spaces from the title and replace it with an underscore
                    fileName += ReportTitle.replace(/ /g, "_");

                    //Initialize file format you want csv or xls
                    // var uri = 'data:text/csv;charset=utf-8,\ufeff' + CSV;
                    var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(CSV);

                    // Now the little tricky part.
                    // you can use either>> window.open(uri);
                    // but this will not work in some browsers
                    // or you will not get the correct file extension

                    //this trick will generate a temp <a /> tag
                    var link = document.createElement("a");
                    link.href = uri;

                    //set the visibility hidden so it will not effect on your web-layout
                    link.style = "visibility:hidden";
                    link.download = fileName + ".csv";

                    //this part will append the anchor tag and remove it after automatic click
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        }
    });