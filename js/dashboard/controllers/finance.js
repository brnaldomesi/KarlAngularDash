/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('FinanceCtrl', function ($scope, $timeout, $state, $uibModal, $rootScope, $log, $filter, MessageBox, TransactionBS, T) {
        if (!$rootScope.loginUser) {
            return;
        }

        $scope.showSearchResult = false;

        $scope.currentPage1 = 1;
        $scope.pageTotalItems1 = 1;

        $scope.currentPage2 = 1;
        $scope.pageTotalItems2 = 1;

        $scope.currentPage3 = 1;
        $scope.pageTotalItems3 = 1;

        $scope.archivePaging = {};

        $scope.pagePerCount = 12;

        $scope.input = {
            searchText: undefined
        };

        var ciOriginalList = [];
        $scope.clientInvoiceList = [];
        var kbOriginalList = [];
        $scope.karlBillList = [];
        var anOriginalList = [];
        $scope.anList = [];

        $scope.onPageChange = function () {
            loadData(false);
        };

        $scope.onInvoiceDetailClick = function (invoice) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/invoice-detail.html',
                controller: 'invoiceDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: invoice,
                        showEmailButton: 1,
                        event: {
                            cancel: function () {
                                modalInstance.dismiss();
                            },
                            archive: function () {
                                loadData(true);
                            }
                        }
                    }

                }
            });
        };

        $scope.onBillDetailClick = function (invoice) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/bill-detail.html',
                controller: 'billDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: invoice,
                        event: {
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onAnDetailClick = function (invoice) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/an-detail.html',
                controller: 'anDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: invoice,
                        showEmailButton: 1,
                        event: {
                            cancel: function () {
                                modalInstance.dismiss();
                            },
                            archive: function () {
                                loadData(true);
                            }
                        }
                    }
                }
            });
        };

        $scope.selectTimeButton = function (type) {
            var time;
            if (type == 0) {
                time = $scope.startTime
            } else {
                time = $scope.endTime;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/finance-selectTime.html',
                controller: 'financeSelectTimeCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        time: time,
                        type: type,
                        event: {
                            setTime: function (date) {
                                if (type == 0) {
                                    $scope.startTime = date;
                                    if ($scope.startTime.getTime() >= $scope.endTime.getTime()) {
                                        $scope.endTime = new Date($scope.startTime.getTime() + 24 * 3600000);
                                    }
                                } else {
                                    $scope.endTime = date;
                                    if ($scope.startTime.getTime() >= $scope.endTime.getTime()) {
                                        $scope.startTime = new Date($scope.endTime.getTime() - 24 * 3600000);
                                    }
                                }
                                loadData(true);
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }

                }
            });
        };

        $scope.onTabChanged = function (tabIndex) {
            $scope.totleArchive = [];
            $scope.tab = tabIndex;
            loadData(true);
        };

        var init = function () {
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            $scope.startTime = new Date((yesterday.getMonth() + 1) + '/' + yesterday.getDate() + '/' + yesterday.getFullYear() + ' ' + "00:00 AM");
            $scope.endTime = new Date();
            $scope.tab = 0;
            $timeout(function () {
                // /************* 左右滑动tab ************* /
                $(".nav-slider li").click(function (e) {
                    var mywhidth = $(this).width();
                    $(this).addClass("act-tab1");
                    $(this).siblings().removeClass("act-tab1");

                    // make sure we cannot click the slider
                    if ($(this).hasClass('slider')) {
                        return;
                    }

                    /* Add the slider movement */

                    // what tab was pressed
                    var whatTab = $(this).index();

                    // Work out how far the slider needs to go
                    var howFar = mywhidth * whatTab;

                    $(".slider").css({
                        left: howFar + "px"
                    });
                });
                // /************* / 左右滑动tab ************* /
            }, 0);
        };

        var firstLoad = true;
        var loadData = function (withTimeOrTabChange) {
            MessageBox.showLoading();
            var tempPage;
            var filter;
            var archive;
            if ($scope.tab == 0) {
                if (withTimeOrTabChange) {
                    tempPage = 1;
                } else {
                    tempPage = $scope.currentPage1;
                }
                filter = 3;
                archive = 0;
            } else if ($scope.tab == 1) {
                if (withTimeOrTabChange) {
                    tempPage = 1;
                } else {
                    tempPage = $scope.currentPage2;
                }
                filter = 3;
                archive = 0;
            } else if ($scope.tab == 2) {
                if (withTimeOrTabChange) {
                    tempPage = 1;
                } else {
                    tempPage = $scope.currentPage3;
                }
                filter = 4;
                archive = 0;
            } else {
                if (withTimeOrTabChange) {
                    tempPage = 1;
                }
                $scope.archivePaging.archiveCurrentPage1 = 1;
                $scope.archivePageTotalItems1 = 1;
                $scope.archivePaging.archiveCurrentPage2 = 1;
                $scope.archivePageTotalItems2 = 1;
                $scope.archivePaging.archiveCurrentPage3 = 1;
                $scope.archivePageTotalItems3 = 1;
                filter = 3;
                archive = 1;
                $scope.totleArchive = [];
            }
            TransactionBS.getTransactions($scope.startTime, $scope.endTime,
                tempPage, $scope.pagePerCount, $scope.input.searchText, filter, archive).then(function (result) {
                for (var i = 0; i < result.data.transactions.length; i++) {
                    result.data.transactions[i].duration = formartDuration(result.data.transactions[i].duration);
                    result.data.transactions[i].customer_data = JSON.parse(result.data.transactions[i].customer_data);
                    result.data.transactions[i].driver_data = JSON.parse(result.data.transactions[i].driver_data);
                    result.data.transactions[i].offer_data = JSON.parse(result.data.transactions[i].offer_data);
                    try {
                        result.data.transactions[i].d_address = JSON.parse(result.data.transactions[i].d_address);
                        if (result.data.transactions[i].d_address.formatted_address) {
                            result.data.transactions[i].d_address = result.data.transactions[i].d_address.formatted_address
                        }
                    } catch (e) {
                    }
                    if (result.data.transactions[i].a_address) {
                        try {
                            result.data.transactions[i].a_address = JSON.parse(result.data.transactions[i].a_address);
                            if (result.data.transactions[i].a_address.formatted_address) {
                                result.data.transactions[i].a_address = result.data.transactions[i].a_address.formatted_address
                            }
                        } catch (e) {
                        }
                    }
                    if (result.data.transactions[i].offer_data.prices) {   //...计算rate
                        result.data.transactions[i].offer_data.prices = JSON.parse(result.data.transactions[i].offer_data.prices);
                        var item = result.data.transactions[i].offer_data.prices;
                        if (result.data.transactions[i].type == 1) {
                            if (result.data.transactions[i].distance <= item[0].invl_end) {
                                result.data.transactions[i].rate = item[0].price
                            } else if (result.data.transactions[i].distance > item[item.length - 1].invl_start) {
                                result.data.transactions[i].rate = item[item.length - 1].price
                            } else {
                                for (var n = 0; n < item.length; n++) {
                                    if (result.data.transactions[i].distance <= item[n].invl_end) {
                                        result.data.transactions[i].rate = item[n].price
                                    }
                                }
                            }
                        } else {
                            result.data.transactions[i].rate = result.data.transactions[i].offer_data.prices[0].price
                        }
                    } else {
                        result.data.transactions[i].rate = result.data.transactions[i].offer_data.price
                    }
                }
                console.log(result.data);
                var clientInvoice = angular.copy(result.data);
                clientInvoice.name = T.T('finance.jsClient_Invoices');
                clientInvoice.id = 1;
                var KarlBill = angular.copy(result.data);
                KarlBill.name = T.T('finance.jsKarl_Bill');
                KarlBill.id = 2;
                $timeout(function () {
                    if ($scope.tab == 0 || $scope.tab == 1 || $scope.tab == 2) {
                        $timeout(function () {
                            $(function () {
                                $(".card-more").click(function () {
                                    $(this).next().fadeToggle();
                                    $(this).fadeToggle(
                                        $(this).children("i").toggleClass("fa-ellipsis-v")
                                    );
                                });
                                $(".gen").click(function () {
                                    $(this).parent().find(".gen-panel").fadeIn(200);
                                });
                                $(".gen-cancel").click(function () {
                                    $(this).parents(".gen-panel").fadeOut(200);
                                });
                            });
                        }, 0);
                    }

                    var tempSearch;
                    if ($scope.tab == 0) {
                        MessageBox.hideLoading();
                        if (withTimeOrTabChange) {
                            $scope.currentPage1 = 1;

                        }
                        $scope.pageTotalItems1 = result.data.total;
                        ciOriginalList = result.data.transactions;
                        if (searchText) {
                            tempSearch = getSearchInvoiceResult(ciOriginalList, searchText);
                            $scope.clientInvoiceList = getClientInvoiceList(tempSearch);
                        } else {
                            $scope.clientInvoiceList = getClientInvoiceList(ciOriginalList);
                        }
                        console.log($scope.clientInvoiceList)
                    } else if ($scope.tab == 1) {
                        MessageBox.hideLoading();
                        if (withTimeOrTabChange) {
                            $scope.currentPage2 = 1;
                        }
                        $scope.pageTotalItems2 = result.data.total;
                        kbOriginalList = result.data.transactions;
                        if (searchText) {
                            tempSearch = getSearchInvoiceResult(kbOriginalList, searchText);
                            $scope.karlBillList = getKarlBillList(tempSearch);
                        } else {
                            $scope.karlBillList = getKarlBillList(kbOriginalList);
                        }
                    } else if ($scope.tab == 2) {
                        MessageBox.hideLoading();
                        if (withTimeOrTabChange) {
                            $scope.currentPage3 = 1;
                        }
                        $scope.pageTotalItems3 = result.data.total;
                        anOriginalList = result.data.transactions;
                        if (searchText) {
                            tempSearch = getSearchInvoiceResult(anOriginalList, searchText);
                            $scope.anList = getAnList(tempSearch);
                        } else {
                            $scope.anList = getAnList(anOriginalList);
                        }
                    } else {
                        // AN archive
                        TransactionBS.getTransactions($scope.startTime, $scope.endTime,
                            tempPage, $scope.pagePerCount, $scope.input.searchText, 4, 1).then(function (result) {
                            $scope.totleArchive = [];
                            $timeout(function () {
                                var anList = {};
                                anList.name = T.T('finance.jsAffiliate_Network');
                                anList.total = result.data.total;
                                anList.id = 3;
                                anList.transactions = [];
                                var AInvoice = [];
                                var BInvoice = [];
                                var myCompayId = $rootScope.loginUser.company_id;
                                for (var i = 0; i < result.data.transactions.length; i++) {
                                    result.data.transactions[i].customer_data = JSON.parse(result.data.transactions[i].customer_data);
                                    result.data.transactions[i].driver_data = JSON.parse(result.data.transactions[i].driver_data);
                                    if (myCompayId == result.data.transactions[i].own_com_id) {
                                        AInvoice.push(result.data.transactions[i])
                                    } else {
                                        BInvoice.push(result.data.transactions[i])
                                    }
                                }
                                anList.transactions.push(AInvoice, BInvoice);
                                $scope.totleArchive.push(clientInvoice, KarlBill, anList);
                                $scope.archivePageTotalItems1 = $scope.totleArchive[0].total;
                                $scope.archivePageTotalItems2 = $scope.totleArchive[1].total;
                                $scope.archivePageTotalItems3 = $scope.totleArchive[2].total;
                                $timeout(function () {
                                    $(".card-more").click(function () {
                                        $(this).next().fadeToggle();
                                        $(this).fadeToggle(
                                            $(this).children("i").toggleClass("fa-ellipsis-v")
                                        );
                                    });
                                    $(".gen").click(function () {
                                        $(this).parent().find(".gen-panel").fadeIn(200);
                                    });
                                    $(".gen-cancel").click(function () {
                                        $(this).parents(".gen-panel").fadeOut(200);
                                    });

                                    if (firstLoad) {
                                        $("#karl-accordion").accordion({
                                            header: 'h3.myselect',
                                            active: false,
                                            collapsible: true,
                                            heightStyle: "content"
                                        });
                                    } else {
                                        $("#karl-accordion").accordion("refresh");
                                        $("#karl-accordion").accordion("option", "active", false);
                                        $("#karl-accordion").accordion("option", "animate", false);
                                    }
                                    firstLoad = false;
                                }, 0);
                                MessageBox.hideLoading();
                            }, 0)

                        }, function (error) {
                            MessageBox.hideLoading();
                            if (error.treated) {
                            } else {
                                MessageBox.toast(T.T("finance.jsGet_accounting_fail"), "error");
                            }
                        })
                    }
                    $scope.$apply();
                }, 0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    MessageBox.toast(T.T("finance.jsGet_accounting_fail"), "error");
                }
            });
        };

        function formartDuration(s) {
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

        var getClientInvoiceList = function (orList) {
            console.log(orList)
            var dayGroup = [];
            for (var i = 0; i < orList.length; i++) {
                var day = $filter('date')(orList[i].settle_time * 1000, 'longDate');
                if (dayGroup.length == 0) {
                    dayGroup.push({invoiceList: [orList[i]], invoiceCount: 1})
                } else {
                    var find = false;
                    for (var j = 0; j < dayGroup.length; j++) {
                        var header = $filter('date')(dayGroup[j].invoiceList[0].settle_time * 1000, 'longDate');
                        if (day == header) {
                            find = true;
                            dayGroup[j].invoiceList.push(orList[i]);
                            dayGroup[j].invoiceCount++;
                        }
                    }
                    if (!find) {
                        dayGroup.push({invoiceList: [orList[i]], invoiceCount: 1});
                    }
                }
            }
            return dayGroup;
        };

        var getKarlBillList = function (orList) {
            return getClientInvoiceList(orList);
        };

        var getAnList = function (orList) {
            var dayGroup = [];
            var myCompayId = $rootScope.loginUser.company_id;
            for (var i = 0; i < orList.length; i++) {
                var day = $filter('date')(orList[i].settle_time * 1000, 'longDate');
                console.log(day);
                if (dayGroup.length == 0) {
                    var AInvoice;
                    var BInvoice;
                    if (myCompayId == orList[i].own_com_id) {
                        //A单
                        AInvoice = {invoiceList: [orList[i]], invoiceCount: 1};
                        BInvoice = {invoiceList: [], invoiceCount: 0};
                    } else {
                        //B单
                        AInvoice = {invoiceList: [], invoiceCount: 0};
                        BInvoice = {invoiceList: [orList[i]], invoiceCount: 1};
                    }
                    dayGroup.push({time: orList[i].settle_time, AInvoice: AInvoice, BInvoice: BInvoice});
                } else {
                    var find = false;
                    for (var j = 0; j < dayGroup.length; j++) {
                        var header = $filter('date')(dayGroup[j].time * 1000, 'longDate');
                        console.log(header);
                        if (day == header) {
                            find = true;
                            if (myCompayId == orList[i].own_com_id) {
                                //A单
                                dayGroup[j].AInvoice.invoiceList.push(orList[i]);
                                dayGroup[j].AInvoice.invoiceCount++;
                            } else {
                                //B单
                                dayGroup[j].BInvoice.invoiceList.push(orList[i]);
                                dayGroup[j].BInvoice.invoiceCount++;
                            }
                        }
                    }
                    if (!find) {
                        var AInvoice;
                        var BInvoice;
                        if (myCompayId == orList[i].own_com_id) {
                            //A单
                            AInvoice = {invoiceList: [orList[i]], invoiceCount: 1};
                            BInvoice = {invoiceList: [], invoiceCount: 0};
                        } else {
                            //B单
                            AInvoice = {invoiceList: [], invoiceCount: 0};
                            BInvoice = {invoiceList: [orList[i]], invoiceCount: 1};
                        }
                        dayGroup.push({time: orList[i].settle_time, AInvoice: AInvoice, BInvoice: BInvoice});
                    }
                }
            }
            console.log(dayGroup)
            return dayGroup;
        };

        init();
        loadData(false);

        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            if ($scope.tab == 3) {
                $timeout(function () {
                    loadData(true);
                }, 10);
            } else {
                $timeout(function () {
                    if (!word) {
                        searchText = undefined;
                        $scope.showSearchResult = false;
                        $timeout(function () {
                            $(".card-more").click(function () {
                                $(this).next().fadeToggle();
                                $(this).fadeToggle(
                                    $(this).children("i").toggleClass("fa-ellipsis-v")
                                );
                            });
                            $(".gen").click(function () {
                                $(this).parent().find(".gen-panel").fadeIn(200);
                            });
                            $(".gen-cancel").click(function () {
                                $(this).parents(".gen-panel").fadeOut(200);
                            });
                        }, 0);
                        if ($scope.tab == 0) {
                            $scope.clientInvoiceList = [];
                            $scope.$apply();

                            $scope.clientInvoiceList = getClientInvoiceList(ciOriginalList);
                        } else if ($scope.tab == 1) {
                            $scope.karlBillList = [];
                            $scope.$apply();

                            $scope.karlBillList = getKarlBillList(kbOriginalList);
                        } else {
                            $scope.anList = [];
                            $scope.$apply();

                            $scope.anList = getAnList(anOriginalList);
                        }
                    } else {
                        searchText = word;
                        $scope.showSearchResult = true;
                        var tempSearch;
                        $timeout(function () {
                            $(".card-more").click(function () {
                                $(this).next().fadeToggle();
                                $(this).fadeToggle(
                                    $(this).children("i").toggleClass("fa-ellipsis-v")
                                );
                            });
                            $(".gen").click(function () {
                                $(this).parent().find(".gen-panel").fadeIn(200);
                            });
                            $(".gen-cancel").click(function () {
                                $(this).parents(".gen-panel").fadeOut(200);
                            });
                        }, 0);
                        if ($scope.tab == 0) {
                            $scope.clientInvoiceList = [];
                            $scope.$apply();

                            tempSearch = getSearchInvoiceResult(ciOriginalList, word);
                            $scope.clientInvoiceList = getClientInvoiceList(tempSearch);
                        } else if ($scope.tab == 1) {
                            $scope.clientInvoiceList = [];
                            $scope.$apply();

                            tempSearch = getSearchInvoiceResult(kbOriginalList, word);
                            $scope.karlBillList = getKarlBillList(tempSearch);
                        } else {
                            $scope.clientInvoiceList = [];
                            $scope.$apply();

                            tempSearch = getSearchInvoiceResult(anOriginalList, word);
                            $scope.anList = getAnList(tempSearch);
                        }
                    }
                    $scope.$apply();
                }, 100);
            }

        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchInvoiceResult = function (orlList, searchText) {
            var tempSearch = [];
            angular.forEach(orlList, function (invoice) {
                if (invoice.customer_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || invoice.customer_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || invoice.customer_data.email.toString().indexOf(searchText.toString()) > -1
                    || invoice.customer_data.mobile.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.mobile.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.email.toString().indexOf(searchText.toString()) > -1
                    || invoice.driver_data.license_number.toString().indexOf(searchText.toString()) > -1) {
                    tempSearch.push(invoice);
                }
            });
            return tempSearch;
        };


        $scope.onArchiveButtonClick = function (archiveId, bookingId) {
            MessageBox.showLoading();
            TransactionBS.editArchive(bookingId, archiveId).then(function (result) {
                MessageBox.hideLoading();
                loadData(true);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                } else {
                    MessageBox.toast(T.T("finance.jsArchive_Failed"), "error");
                }
            })
        };


        $scope.onArchiveDetailClick = function (item, index) {
            if (index == 1) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/invoice-detail.html',
                    controller: 'invoiceDetailCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: item,
                            event: {
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }

                    }
                });
            } else if (index == 2) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/bill-detail.html',
                    controller: 'billDetailCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: item,
                            event: {
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }
                    }
                });
            } else {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/dashboard/an-detail.html',
                    controller: 'anDetailCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        $stateParams: {
                            data: item,
                            event: {
                                cancel: function () {
                                    modalInstance.dismiss();
                                }
                            }
                        }
                    }
                });
            }
        };

        $scope.onArchivePageChange = function (index) {
            if (index == 1 || index == 2) {
                var tempPage;
                if (index == 1) {
                    tempPage = $scope.archivePaging.archiveCurrentPage1
                } else if (index == 2) {
                    tempPage = $scope.archivePaging.archiveCurrentPage2
                }
                MessageBox.showLoading();
                TransactionBS.getTransactions($scope.startTime, $scope.endTime,
                    tempPage, $scope.pagePerCount, $scope.input.searchText, 3, 1).then(function (result) {
                    $timeout(function () {
                        $(".card-more").click(function () {
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function () {
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function () {
                            $(this).parents(".gen-panel").fadeOut(200);
                        });

                        $("#karl-accordion").accordion("refresh");
                        $("#karl-accordion").accordion("option", "active", index - 1);
                        $("#karl-accordion").accordion("option", "animate", false);

                    }, 0);
                    for (var i = 0; i < result.data.transactions.length; i++) {
                        result.data.transactions[i].customer_data = JSON.parse(result.data.transactions[i].customer_data);
                        result.data.transactions[i].driver_data = JSON.parse(result.data.transactions[i].driver_data);
                    }
                    if (index == 1) {
                        var clientInvoice = angular.copy(result.data);
                        clientInvoice.name = T.T('finance.jsClient_Invoices');
                        clientInvoice.id = 1;
                        $scope.totleArchive[0] = clientInvoice;
                        $scope.archivePageTotalItems1 = $scope.totleArchive[0].total;
                    } else if (index == 2) {
                        var KarlBill = angular.copy(result.data);
                        KarlBill.name = T.T('finance.jsKarl_Bill');
                        KarlBill.id = 2;
                        $scope.totleArchive[1] = KarlBill;
                        $scope.archivePageTotalItems2 = $scope.totleArchive[1].total;
                    }
                    MessageBox.hideLoading();
                }, function () {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    } else {
                        MessageBox.toast(T.T("finance.jsGet_accounting_fail"), "error");
                    }
                })
            } else {
                MessageBox.showLoading();
                TransactionBS.getTransactions($scope.startTime, $scope.endTime,
                    $scope.archivePaging.archiveCurrentPage3, $scope.pagePerCount, $scope.input.searchText, 4, 1).then(function (result) {
                    $timeout(function () {
                        $(".card-more").click(function () {
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function () {
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function () {
                            $(this).parents(".gen-panel").fadeOut(200);
                        });

                        $("#karl-accordion").accordion("refresh");
                        $("#karl-accordion").accordion("option", "active", index - 1);
                        $("#karl-accordion").accordion("option", "animate", false);

                    }, 0);

                    var anList = {};
                    anList.name = T.T('finance.jsAffiliate_Network');
                    anList.total = result.data.total;
                    anList.id = 3;
                    anList.transactions = [];
                    var AInvoice = [];
                    var BInvoice = [];
                    var myCompayId = $rootScope.loginUser.company_id;
                    for (var i = 0; i < result.data.transactions.length; i++) {
                        result.data.transactions[i].customer_data = JSON.parse(result.data.transactions[i].customer_data);
                        result.data.transactions[i].driver_data = JSON.parse(result.data.transactions[i].driver_data);
                        if (myCompayId == result.data.transactions[i].own_com_id) {
                            AInvoice.push(result.data.transactions[i])
                        } else {
                            BInvoice.push(result.data.transactions[i])
                        }
                    }
                    anList.transactions.push(AInvoice, BInvoice);
                    $scope.totleArchive[2] = anList;
                    $scope.archivePageTotalItems3 = $scope.totleArchive[2].total;
                    MessageBox.hideLoading();
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    } else {
                        MessageBox.toast(T.T("finance.jsGet_accounting_fail"), "error");
                    }
                })
            }
        }

    });
