'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Directives', []);

/**
 * Created by gaohui on 17-1-24.
 */
angular.module('KARL.Directives')
    .directive('ckeditor', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                var ckeditor = CKEDITOR.replace(element[0], {});
                if (!ngModel) {
                    return;
                }
                ckeditor.on('instanceReady', function () {
                    ckeditor.setData(ngModel.$viewValue);
                });
                ckeditor.on('pasteState', function () {
                    scope.$apply(function () {
                        ngModel.$setViewValue(ckeditor.getData());
                    });
                });
                ngModel.$render = function (value) {
                    ckeditor.setData(ngModel.$viewValue);
                };
            }
        };
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Directives')
    .directive('contenteditable', function () {
        return {
            restrict: 'A', // 只用于属性
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || '');
                };

                // Listen for change events to enable binding
                element.keyup(function (e) {
                    if (e.which != 8 && element.html().length >= attrs.ngMaxlength) {
                        e.preventDefault();
                    }
                });
                element.keydown(function (e) {
                    if (e.which != 8 && element.html().length >= attrs.ngMaxlength) {
                        e.preventDefault();
                    }
                });

                element.on("paste",function (event) {
                    console.log("",event);
                    event.preventDefault();
                });

                // element.watch(attrs.contenteditable,function (value) {
                //
                // });

                element.on('blur keyup change', function () {
                    scope.$apply(readViewText);
                });
                function readViewText() {
                    var html = element.html();
                    ngModel.$setViewValue(html);
                }
            }
        }
    });

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
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Directives')
    .directive('karlFooter', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/dashboard/footer.html'
        };
    });

/**
 * Created by wangyaunzhi on 16/12/17.
 */
angular.module('KARL.Directives')
    .directive('googleAnalytics', function ($rootScope) {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                mixpanel.track('DashBoard Entry Page', {'pageName': attrs.analyticsPage});
                if($rootScope.loginUser != null){
                    scope.userId = $rootScope.loginUser.id;
                    mixpanel.identify($rootScope.loginUser.id);
                    mixpanel.people.set({
                        "first_name": $rootScope.loginUser.first_name,
                        "last_name": $rootScope.loginUser.last_name,
                        "email": $rootScope.loginUser.email,
                        "gender":($rootScope.loginUser.gender == 2) ? 'female' : 'male'
                    });
                }else {
                    scope.userId = "";
                }

                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                ga('create', 'UA-89070126-1', 'auto');
                ga('set', 'page', attrs.analyticsPage);
                ga('send', 'pageview');
                ga('set', 'userId', scope.userId);
            }
        };
    });
/**
 * Created by wangyaunzhi on 16/9/19.
 */
angular.module('KARL.Directives')
    .directive('karlHeaderMenu', function ($rootScope, $state, $log, $uibModal, MessageBox, UserCacheBS, UserBS, T, $translate) {
        var MenuPermission = {
            superAdmin: {
                home: false,
                book: false,
                calendar: false,
                vehicles: false,
                drivers: false,
                option: false,
                stats: false,
                clients: false,
                affiliate: false,
                rates: false,
                finance: false,
                coupon: false,
                companies: true,
                carModel: true,
                profile: false,
                vehicleCategory: true,
                vehicleMaker: true,
                vehicleModel: true,
                superStats: true,
                superRate: true,
                setting: false,
                SalesRep: true,
                superSalesAssistant:true,
                salesRepHome: false,
                salesRepTotals: false,
                salesRepCompanies: false,
                salesAssistantHome:false,
                salesAssistantCompanies:false,
                superGodView:true
            },
            admin: {
                home: true,
                book: true,
                calendar: true,
                vehicles: true,
                drivers: true,
                option: true,
                stats: true,
                clients: true,
                affiliate: true,
                rates: true,
                finance: true,
                coupon: true,
                companies: false,
                carModel: false,
                profile: true,
                vehicleCategory: false,
                vehicleMaker: false,
                vehicleModel: false,
                superStats: false,
                setting: true,
                SalesRep: false,
                salesRepHome: false,
                salesRepTotals: false,
                salesRepCompanies: false,
                salesAssistantHome:false,
                salesAssistantCompanies:false,
                superGodView:false
            },

            salesRep: {
                home: false,
                book: false,
                calendar: false,
                vehicles: false,
                drivers: false,
                option: false,
                stats: false,
                clients: false,
                affiliate: false,
                rates: false,
                finance: false,
                coupon: true,
                companies: false,
                carModel: false,
                profile: false,
                vehicleCategory: false,
                vehicleMaker: false,
                vehicleModel: false,
                superStats: false,
                setting: false,
                SalesRep: false,
                salesRepHome: true,
                salesRepTotals: true,
                salesRepCompanies: true,
                salesAssistantHome:false,
                salesAssistantCompanies:false,
                superGodView:false
            },


            salesAssistant: {
                home: false,
                book: false,
                calendar: false,
                vehicles: false,
                drivers: false,
                option: false,
                stats: false,
                clients: false,
                affiliate: false,
                rates: false,
                finance: false,
                coupon: true,
                companies: false,
                carModel: false,
                profile: false,
                vehicleCategory: false,
                vehicleMaker: false,
                vehicleModel: false,
                superStats: false,
                setting: false,
                SalesRep: false,
                salesRepHome: false,
                salesRepTotals: false,
                salesRepCompanies: false,
                salesAssistantHome:true,
                salesAssistantCompanies:true,
                superGodView:false
            }
        };

        // var viewTitle = {0:T.T('header_menu.h5home'),
        //                  1:T.T('header_menu.h5easy_book'),
        //                  2:T.T('header_menu.h5calendar'),
        //                  3:T.T('comment.h5vehicles'),
        //                  4:T.T('comment.h5drivers'),
        //                  5:T.T('comment.h5add-Ons'),
        //                  6:T.T('header_menu.h5stats'),
        //                  7:T.T('comment.h5client'),
        //                  8:T.T('header_menu.h5affiliate_network'),
        //                  9:T.T('header_menu.h5rates'),
        //                  10:T.T('header_menu.h5finance'),
        //                  11:T.T('header_menu.h5companies'),
        //                  12:T.T('header_menu.h5car_model'),
        //                  13:T.T('header_menu.h5profile'),
        //                  14:T.T('header_menu.h5vehicle_category'),
        //                  15:T.T('header_menu.h5vehicle_maker'),
        //                  16:T.T('header_menu.h5vehicle_model'),
        //                  17:T.T('header_menu.h5super_stats' ),
        //                  18:T.T('header_menu.h5Setting')
        // };
        return {
            restrict: 'E',
            templateUrl: 'templates/dashboard/header-menu.html',
            link: function (scope, element, attrs) {
                if (!$rootScope.loginUser) {
                    $state.go('login');
                    return;
                }

                if (!$rootScope.menuState || $rootScope.menuState == 0) {
                    //关闭(默认)
                    $(element).parent().addClass('app-aside-folded');
                } else {
                    //打开
                    $(element).parent().removeClass('app-aside-folded');
                }

                scope.setMenuState = function () {
                    if (!$rootScope.menuState || $rootScope.menuState == 0) {
                        //设置为打开状态
                        $rootScope.menuState = 1;
                    } else {
                        ////设置为关闭状态
                        $rootScope.menuState = 0;
                    }
                };
                scope.viewTitles = viewTitles;
                scope.activeIndex = attrs.activeIndex;
                // scope.title = viewTitle[scope.activeIndex];
                if ($rootScope.loginUser.superadmin) {
                    scope.menuPermission = MenuPermission.superAdmin;
                } else if ($rootScope.loginUser.admin) {
                    scope.menuPermission = MenuPermission.admin;
                } else if($rootScope.loginUser.sale){
                    scope.salesRepInfo = $rootScope.loginUser;
                    scope.menuPermission = MenuPermission.salesRep;
                }else {
                    scope.salesAssisInfo = $rootScope.loginUser;
                    scope.menuPermission = MenuPermission.salesAssistant;
                }

                scope.videoUrl = YoutobeUrls[scope.activeIndex] + "?autoplay=1";
                scope.openYoutubeVideo = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'templates/dashboard/youtube-video-model.html',
                        controller: 'YoutubeModelCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            $stateParams: {
                                data: {
                                    videoUrl: scope.videoUrl
                                },
                                event: {
                                    cancel: function () {
                                        modalInstance.dismiss();
                                    }
                                }
                            }
                        }
                    });
                };

                scope.logout = function () {
                    MessageBox.confirm(T.T('alertTitle.warning'), T.T('header_menu.jsLogout_info'), function (isConfirm) {
                        if (isConfirm) {
                            localStorage.removeItem('loginusername');
                            localStorage.removeItem('loginpassword');
                            sessionStorage.removeItem('password');
                            localStorage.setItem('rememberme', '0');
                            $rootScope.menuState = undefined;
                            MessageBox.showLoading();
                            UserBS.logout().then(function (result) {
                                UserCacheBS.cleanCache();
                                MessageBox.hideLoading();
                                MessageBox.toast(T.T('header_menu.jsLogout_success'), 'success');
                                $state.go("login");
                            }, function (error) {
                                MessageBox.hideLoading();
                                UserCacheBS.cleanCache();
                                MessageBox.toast(T.T('header_menu.jsLogout_success'), 'success');
                                // 哪怕登出调用失败, 也要跳到登录界面
                                $state.go("login");
                            });
                        }
                    })
                };

                var initLanguage = function () {
                    if (window.localStorage.lang) {
                        scope.cur_lang = window.localStorage.lang;
                    } else {
                        scope.cur_lang = navigator.language.toLocaleLowerCase();
                    }
                    if (scope.cur_lang == 'en' || scope.cur_lang == 'fr') {
                        $translate.use(scope.cur_lang);
                        // $translate.use('en');
                    } else {
                        scope.cur_lang = 'en';
                        $translate.use('en');
                    }
                };

                 function languageReload(atrs) {
                     window.localStorage.lang = atrs;
                     $translate.use(atrs);
                     window.location.reload();
                 }

                initLanguage();

                scope.switching = function (atr) {
                    atr = atr === 'en' ? 'fr' : "en";
                    $rootScope.loginUser.lang = atr;
                    // console.log($rootScope.loginUser);
                    var loginUser = {
                        lang: atr,
                        token: $rootScope.loginUser.token
                    };
                    if($rootScope.loginUser.admin.expire_time){
                        languageReload(atr);
                    } else if ($rootScope.loginUser.admin) {
                        MessageBox.showLoading();
                        UserBS.updateCurrentUser(JSON.stringify(loginUser)).then(function (result) {
                            MessageBox.hideLoading();
                            languageReload(atr)
                        }, function (error) {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        });
                    } else if ($rootScope.loginUser.sale) {
                        MessageBox.showLoading();
                        UserBS.updateSalesRep(JSON.stringify(loginUser)).then(function (result) {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        }, function (error) {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        });
                    } else if($rootScope.loginUser.asst){
                        MessageBox.showLoading();
                        UserBS.updateSalesAssistant(JSON.stringify(loginUser)).then(function (result) {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        },function () {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        })
                    }else {
                        languageReload(atr);
                    }

                }
            }
        };
    });

/**
 * Created by gaohui on 17-1-23.
 */
angular.module('KARL.Directives')
    .directive('multextinputbox', function () {
        return {
            restrict: 'A', // 只用于属性
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || '');
                };

                // Listen for change events to enable binding
                element.keyup(function (e) {
                    if (e.which != 8 && element.html().length >= attrs.ngMaxlength) {
                        e.preventDefault();
                    }
                });
                element.keydown(function (e) {
                    if (e.which != 8 && element.html().length >= attrs.ngMaxlength) {
                        e.preventDefault();
                    }
                });
                element.on('blur keyup change', function () {
                    scope.$apply(readViewText);
                });
                function readViewText() {
                    var html = element.html();
                    ngModel.$setViewValue(html);
                }
            }
        }
    });