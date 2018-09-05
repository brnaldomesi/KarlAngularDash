/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('CalendarCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $stateParams, $timeout, $filter, uiCalendarConfig, MessageBox, BookBS, OfferBS,T) {
        if(!$rootScope.loginUser){
            return;
        }
        var dayGroupEvents = {};
        var companyId = $rootScope.loginUser.company_id;
        $scope.events = [];
        $scope.eventSources = [$scope.events];
        $scope.bookings = [];
        $scope.showSearchResult = false;
        $scope.showNoRatesView = false;
        $scope.showCalendarView = false;
        $scope.saveDate='';
        $scope.currentPage = 1;
        $scope.pagePerCount = 30;
        var preDayCell;
        var lastSelect;
        //加载数据标记
        var initData = true;

        /* alert on eventClick */
        $scope.onEventClick = function (event, jsEvent, view) {
            console.log(111)
            if (initData) {
                return;
            }
            initData = true;
            $scope.bookings = [];
            $scope.bookingTotalCount = 0;

            var newDate = event.start._d;
            $scope.selectedDay = newDate;

            var day = $filter('date')(newDate, "yyyy-MM-dd");
            lastSelect = day;
            angular.element(preDayCell).css('background-color', '');
            angular.element(".fc-" + lastSelect).css('background-color', '#3c7ace');
            preDayCell = angular.element(".fc-" + lastSelect);

            if (dayGroupEvents[$filter('date')(newDate, "yyyy-MM-dd")]) {
                MessageBox.showLoading();
                BookBS.ratesInOneDayFromCurrentCompany(newDate).then(function (detailResult) {
                    MessageBox.hideLoading();
                    $scope.pageTotalItems = detailResult.total;
                    $scope.saveDate=newDate;
                    var onedayBookings = [];
                    var bookings = detailResult.data;
                    if (bookings && bookings.length > 0) {
                        for (var i = 0; i < bookings.length; i++) {
                            bookings[i].driver_data = JSON.parse(bookings[i].driver_data);
                            bookings[i].car_data = JSON.parse(bookings[i].car_data);
                            onedayBookings.push(bookings[i]);
                        }
                    }
                    $scope.bookings = integrationBookingInOnedayByHourly(onedayBookings);
                    $scope.bookingTotalCount = onedayBookings.length;

                    $timeout(function () {
                        originalBookings = onedayBookings;
                        if (searchText && $scope.showSearchResult) {
                            $scope.searchResult = getSearchBookingResult(originalBookings, searchText);
                        } else {
                            $scope.searchResult = originalBookings;
                        }
                        $scope.$apply();
                    }, 0);
                    initData = false;
                }, function (error) {
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("calendar.jsGet_list_fail"), "error");
                    }
                    initData = false;
                });
            }
        };
        $scope.onDayClick = function (date, jsEvent, view) {
            if(!jsEvent.target.className){
                return
            }
            //加载中返回
            if (initData) {
                return;
            }
            initData = true;
            $scope.bookings = [];
            $scope.bookingTotalCount = 0;

            var longDay = Date.parse(date._d);
            longDay = longDay + date._d.getTimezoneOffset() * 60 * 1000;
            var newDate = new Date(longDay);

            $scope.selectedDay = newDate;

            var day = $filter('date')(newDate, "yyyy-MM-dd");
            lastSelect = day;
            angular.element(preDayCell).css('background-color', '');
            angular.element(this).css('background-color', '#3c7ace');
            preDayCell = this;

            if (dayGroupEvents[$filter('date')(newDate, "yyyy-MM-dd")]) {
                MessageBox.showLoading();
                BookBS.ratesInOneDayFromCurrentCompany(newDate).then(function (detailResult) {
                    MessageBox.hideLoading();
                    $scope.pageTotalItems = detailResult.total;
                    $scope.saveDate=newDate;
                    var onedayBookings = [];
                    var bookings = detailResult.data;
                    if (bookings && bookings.length > 0) {
                        for (var i = 0; i < bookings.length; i++) {
                            bookings[i].driver_data = JSON.parse(bookings[i].driver_data);
                            bookings[i].car_data = JSON.parse(bookings[i].car_data);
                            onedayBookings.push(bookings[i]);
                        }
                    }
                    $scope.bookings = integrationBookingInOnedayByHourly(onedayBookings);
                    $scope.bookingTotalCount = onedayBookings.length;

                    $timeout(function () {
                        originalBookings = onedayBookings;
                        if (searchText && $scope.showSearchResult) {
                            $scope.searchResult = getSearchBookingResult(originalBookings, searchText);
                        } else {
                            $scope.searchResult = originalBookings;
                        }
                        $scope.$apply();
                    }, 0);
                    initData = false;
                }, function (error) {
                    MessageBox.hideLoading();
                    initData = false;
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T("calendar.jsGet_list_fail"), "error");
                    }
                });
            } else {
                //不加载数据
                initData = false;
            }
        };

        $scope.onBookRowClick = function (booking) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/book-detail.html',
                controller: 'BookDetailCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            bookingId: booking.id,
                            appointedTime: booking.appointed_at
                        },
                        event: {
                            driverName: function (driverData) {
                                booking.driver_data.first_name = JSON.parse(driverData).first_name;
                                booking.driver_data.last_name = JSON.parse(driverData).last_name;
                            },
                            cancel: function (isSuspended,order_state,trip_state) {
                                modalInstance.dismiss();
                                if (isSuspended == 0) {
                                    booking.condition = 1;
                                    booking.tripStateString = T.T('calendar.jsTrip_Suspended');
                                    if (booking.showState == 3) {
                                        if (companyId == booking.own_company_id && companyId != booking.exe_company_id) {
                                            booking.showState = 1
                                        } else if (companyId != booking.own_company_id && companyId == booking.exe_company_id) {
                                            booking.showState = 2
                                        }
                                    }
                                } else if (isSuspended == 1) {
                                    booking.condition = 3;
                                    booking.tripStateString = T.T('calendar.jsEn_Route');
                                } else if (isSuspended == 2) {
                                    console.log(order_state)
                                    console.log(trip_state)
                                    // booking.condition = 4;
                                    // booking.tripStateString = T.T('calendar.jsTrip_Ended');
                                    if (order_state == OrderOrderState.ORDER_STATE_DONE) {
                                        switch (trip_state) {
                                            case OrderTripState.TRIP_STATE_WAITING_DRIVER_DETERMINE: {
                                                booking.tripStateString = T.T('calendar.jsEn_Route');
                                                booking.condition = 3
                                            }
                                                break;
                                            case OrderTripState.TRIP_STATE_WAITING_TO_SETTLE: {
                                                booking.tripStateString = T.T('calendar.jsEn_Route');
                                                booking.condition = 3
                                            }
                                                break;
                                            case OrderTripState.TRIP_STATE_SETTLING: {
                                                booking.tripStateString = T.T('calendar.jsEn_Route');
                                                booking.condition = 3
                                            }
                                                break;
                                            case OrderTripState.TRIP_STATE_SETTLE_DONE: {
                                                booking.tripStateString = T.T('calendar.jsTrip_Ended');
                                                booking.condition = 4
                                            }
                                                break;
                                            default : {
                                                booking.tripStateString = "Unknown";
                                            }
                                                break;
                                        }
                                    }
                                }
                            },
                            hasSentBack: function () {
                                booking.showState = 3
                            },
                            displayStatus: function (companyInfo) {
                                if (companyId == companyInfo.company_id && companyId != companyInfo.exe_com_id) {
                                    booking.showState = 1
                                } else if (companyId != companyInfo.company_id && companyId == companyInfo.exe_com_id) {
                                    booking.showState = 2
                                } else {
                                    booking.showState = false;
                                }
                            }
                        }
                    }
                }
            });
        };

        /* config object */
        $scope.uiConfig = {
            calendar: {
                contentHeight: 350,
                editable: false,
                timeFormat: ' ',
                timezone: 'local',
                lang: localStorage.getItem('lang'),
                header: {
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                },
                eventClick: $scope.onEventClick,
                dayClick: $scope.onDayClick,
                nextChange: function (date) {
                    $timeout(function () {
                            var hiddenDate =  angular.element($('.fc-other-month'));
                        hiddenDate.css('visibility','hidden');
                        loadData(date._d)
                    }, 0);
                }
            }
        };

        // Function
        var loadRates = function () {
            $timeout(function () {
                var hiddenDate =  angular.element($('.fc-other-month'));
                hiddenDate.css('visibility','hidden');
            },0);
            MessageBox.showLoading();
            OfferBS.getCurrentOfferAll().then(function (result) {
                MessageBox.hideLoading();
                if (result.data.length > 0) {
                    $scope.showCalendarView = true;
                    loadData(new Date());
                } else {
                    $scope.showNoRatesView = true;
                }
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("calendar.jsGet_offer_fail"), "error");
                }
            });
        };

        var originalBookings = [];

        function loadData(date) {
            $scope.bookings = [];
            $scope.bookingTotalCount = 0;
            $scope.selectedDay = date;

            MessageBox.showLoading();
            BookBS.ratesCountsFromCurrentCompany(date).then(function (result) {
                BookBS.ratesInOneDayFromCurrentCompany(date).then(function (detailResult) {
                    MessageBox.hideLoading();
                    $scope.pageTotalItems = detailResult.total;
                    $scope.saveDate=date;
                    dayGroupEvents = {};
                    angular.forEach(result.data, function (item) {
                        if (item.counts > 0) {
                            var startTime = new Date(item.start_time * 1000);
                            var day = $filter('date')(startTime, "yyyy-MM-dd");
                            dayGroupEvents[day] = item;
                        }
                    });
                    $scope.eventSources = [];
                    angular.forEach(dayGroupEvents, function (value, key) {
                        $scope.events.push({
                            id: key,
                            title: "",
                            start: new Date(value.start_time * 1000)
                        });
                    });

                    var onedayBookings = [];
                    var bookings = detailResult.data;
                    if (bookings && bookings.length > 0) {
                        for (var i = 0; i < bookings.length; i++) {
                            bookings[i].driver_data = JSON.parse(bookings[i].driver_data);
                            bookings[i].car_data = JSON.parse(bookings[i].car_data);
                            onedayBookings.push(bookings[i]);
                        }
                    }
                    $scope.bookings = integrationBookingInOnedayByHourly(onedayBookings);
                    $scope.bookingTotalCount = onedayBookings.length;

                    $timeout(function () {
                        originalBookings = onedayBookings;
                        if (searchText && $scope.showSearchResult) {
                            $scope.searchResult = getSearchBookingResult(originalBookings, searchText);
                        } else {
                            $scope.searchResult = originalBookings;
                        }
                        $scope.$apply();
                    }, 0);

                    $scope.selectedDay = date;
                    var day = $filter('date')(date, "yyyy-MM-dd");
                    lastSelect = day;

                    var now = new Date();
                    if (date.getYear() == now.getYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) {
                        angular.element(".fc-today").css('background-color', '#3c7ace');
                        preDayCell = angular.element(".fc-today");
                    } else {
                        angular.element(preDayCell).css('background-color', '');
                        angular.element(".fc-" + lastSelect).css('background-color', '#3c7ace');
                        preDayCell = angular.element(".fc-" + lastSelect);
                    }
                    //数据加载成功
                    initData = false;

                }, function (error) {
                    //数据加载失败
                    initData = false;
                    MessageBox.hideLoading();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast(T.T('calendar.jsGet_list_fail'), "error");
                    }
                });
            }, function (error) {
                //数据加载失败
                initData = false;
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T('calendar.jsGet_list_fail'), "error");
                }
            });
        }

        //按小时为单位,整合一天的booking
        var integrationBookingInOnedayByHourly = function (bookings) {
            var bookingGroup = [];
            for (var i = 0; i < bookings.length; i++) {
                var hour = $filter('date')(bookings[i].appointed_at * 1000, 'h a');
                if (companyId == bookings[i].own_company_id && companyId != bookings[i].exe_company_id) {
                    bookings[i].showState = 1;
                } else if (companyId != bookings[i].own_company_id && companyId == bookings[i].exe_company_id) {
                    bookings[i].showState = 2
                }

                if (bookings[i].reject == 1) {
                    bookings[i].showState = 3
                }

                if (
                    bookings[i].order_state == OrderOrderState.ORDER_STATE_ADMIN_CANCEL ||
                    bookings[i].order_state == OrderOrderState.ORDER_STATE_SUPER_ADMIN_CANCEL ||
                    bookings[i].order_state == OrderOrderState.ORDER_STATE_PASSENGER_CANCEL ||
                    bookings[i].order_state == OrderOrderState.ORDER_STATE_TIMES_UP_CANCEL
                ) {
                    bookings[i].tripStateString = T.T('calendar.jsTrip_Suspended');
                    bookings[i].condition = 1
                    if (bookings[i].showState == 3) {
                        if (companyId == bookings[i].own_company_id && companyId != bookings[i].exe_company_id) {
                            bookings[i].showState = 1;
                        } else if (companyId != bookings[i].own_company_id && companyId == bookings[i].exe_company_id) {
                            bookings[i].showState = 2
                        }
                    }
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_BOOKING) {
                    bookings[i].tripStateString = T.T('calendar.jsTrip_not_started');
                    bookings[i].condition = 2
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_RUN) {
                    switch (bookings[i].trip_state) {
                        case OrderTripState.TRIP_STATE_WAIT_TO_DEPARTURE: {
                            bookings[i].tripStateString = T.T('calendar.jsTrip_not_started');
                            bookings[i].condition = 2
                        }
                            break;
                        case OrderTripState.TRIP_STATE_DRIVE_TO_PICK_UP: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_WAITING_CUSTOMER: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_GO_TO_DROP_OFF: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        default : {
                            bookings[i].tripStateString = "Unknown";
                        }
                            break;
                    }
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_DONE) {
                    switch (bookings[i].trip_state) {
                        case OrderTripState.TRIP_STATE_WAITING_DRIVER_DETERMINE: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_WAITING_TO_SETTLE: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_SETTLING: {
                            bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                            bookings[i].condition = 3
                        }
                            break;
                        case OrderTripState.TRIP_STATE_SETTLE_DONE: {
                            bookings[i].tripStateString = T.T('calendar.jsTrip_Ended');
                            bookings[i].condition = 4
                        }
                            break;
                        default : {
                            bookings[i].tripStateString = "Unknown";
                        }
                            break;
                    }
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_WAIT_DETERMINE) {
                    bookings[i].tripStateString = T.T('calendar.jsEn_Route');
                    bookings[i].condition = 3
                } else if (bookings[i].order_state == OrderOrderState.ORDER_STATE_SETTLE_ERROR) {
                    bookings[i].tripStateString = T.T("book_detail.jsSettle_Error");
                    bookings[i].condition = 4
                }
                else {
                    bookings[i].tripStateString = "Unknown";
                }

                if (bookingGroup.length == 0) {
                    bookingGroup.push({bookingList: [bookings[i]], bookingCount: 1})
                } else {
                    var find = false;
                    for (var j = 0; j < bookingGroup.length; j++) {
                        var header = $filter('date')(bookingGroup[j].bookingList[0].appointed_at * 1000, 'h a');
                        if (hour == header) {
                            find = true;
                            bookingGroup[j].bookingList.push(bookings[i]);
                            bookingGroup[j].bookingCount++;
                        }
                    }
                    if (!find) {
                        bookingGroup.push({bookingList: [bookings[i]], bookingCount: 1});
                    }
                }
            }
            return bookingGroup;
        };

        //先判断有没有rates,如果没有,显示提示界面,如果有,请求booking数据
        loadRates();


        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                if (!word) {
                    $scope.showSearchResult = false;
                    searchText = undefined;
                } else {
                    $scope.showSearchResult = true;
                    searchText = word;
                    $scope.searchResult = [];
                    $scope.$apply();

                    $scope.searchResult = getSearchBookingResult(originalBookings, word);
                    $scope.$apply();
                }
            }, 100);
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchBookingResult = function (originalBookings, searchText) {
            var tempSearch = [];
            angular.forEach(originalBookings, function (booking) {
                if (booking.c_email.toString().indexOf(searchText.toString()) > -1
                    || booking.c_first_name.toString().indexOf(searchText.toString()) > -1
                    || booking.c_last_name.toString().indexOf(searchText.toString()) > -1
                    || booking.c_mobile.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.first_name.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.last_name.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.email.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.license_number.toString().indexOf(searchText.toString()) > -1
                    || booking.driver_data.mobile.toString().indexOf(searchText.toString()) > -1
                    || booking.car_data.brand.toString().indexOf(searchText.toString()) > -1
                    || booking.car_data.license_plate.toString().indexOf(searchText.toString()) > -1
                    || booking.car_data.model.toString().indexOf(searchText.toString()) > -1) {
                    tempSearch.push(booking);
                }
            });
            return tempSearch;
        };

        function PageChangeAndSearch() {
            console.log( $scope.saveDate);
            MessageBox.showLoading();
            BookBS.ratesInOneDayFromCurrentCompany($scope.saveDate, $scope.currentPage,$scope.pagePerCount).then(function (detailResult) {
                MessageBox.hideLoading();
                var onedayBookings = [];
                $scope.pageTotalItems = detailResult.total;
                var bookings = detailResult.data;
                if (bookings && bookings.length > 0) {
                    for (var i = 0; i < bookings.length; i++) {
                        bookings[i].driver_data = JSON.parse(bookings[i].driver_data);
                        bookings[i].car_data = JSON.parse(bookings[i].car_data);
                        onedayBookings.push(bookings[i]);
                    }
                }
                $scope.bookings = integrationBookingInOnedayByHourly(onedayBookings);
                $scope.bookingTotalCount = onedayBookings.length;

                $timeout(function () {
                    originalBookings = onedayBookings;
                    if (searchText && $scope.showSearchResult) {
                        $scope.searchResult = getSearchBookingResult(originalBookings, searchText);
                    } else {
                        $scope.searchResult = originalBookings;
                    }
                    $scope.$apply();
                }, 0);
                initData = false;
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("calendar.jsGet_list_fail"), "error");
                }
                initData = false;
            });
        }

        $scope.onPageChange=function () {
            PageChangeAndSearch();
        };

        $scope.finalAddress = function (arr) {
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < arr[i].bookingList.length; j++) {
                        arr[i].bookingList[j].d_final_address = [];
                        var d_line_a = '';
                        var d_line_b = '';
                        if (arr[i].bookingList[j].d_address.address_components) {
                            if (arr[i].bookingList[j].d_address.address_components[arr[i].bookingList[j].d_address.address_components.length - 1].types[0] == 'postal_code') {
                                var postal_code = arr[i].bookingList[j].d_address.address_components[arr[i].bookingList[j].d_address.address_components.length - 1].long_name;
                                arr[i].bookingList[j].d_address.address_components.reverse().shift();
                                arr[i].bookingList[j].d_address.address_components.reverse();
                                for (var y = 0; y < (arr[i].bookingList[j].d_address.address_components.length) - 3; y++) {
                                    if (y == (arr[i].bookingList[j].d_address.address_components.length) - 4) {
                                        d_line_a += arr[i].bookingList[j].d_address.address_components[y].long_name;
                                    } else {
                                        d_line_a += arr[i].bookingList[j].d_address.address_components[y].long_name + ' ';
                                    }
                                }
                                arr[i].bookingList[j].d_address.address_components.reverse().shift();
                                for (var z = 0; z < 2; z++) {
                                    if (z == 1) {
                                        d_line_b += arr[i].bookingList[j].d_address.address_components[z].long_name;
                                    } else {
                                        d_line_b += arr[i].bookingList[j].d_address.address_components[z].long_name + ',';
                                    }
                                }
                                d_line_b = d_line_b + ',' + postal_code;
                                arr[i].bookingList[j].d_final_address.push(d_line_a);
                                arr[i].bookingList[j].d_final_address.push(d_line_b);
                            } else {
                                for (var y = 0; y < (arr[i].bookingList[j].d_address.address_components.length) - 3; y++) {
                                    if (y == (arr[i].bookingList[j].d_address.address_components.length) - 4) {
                                        d_line_a += arr[i].bookingList[j].d_address.address_components[y].long_name;
                                    } else {
                                        d_line_a += arr[i].bookingList[j].d_address.address_components[y].long_name + ' ';
                                    }
                                }
                                arr[i].bookingList[j].d_address.address_components.reverse().shift();
                                for (var z = 0; z < 2; z++) {
                                    if (z == 1) {
                                        d_line_b += arr[i].bookingList[j].d_address.address_components[z].long_name;
                                    } else {
                                        d_line_b += arr[i].bookingList[j].d_address.address_components[z].long_name + ',';
                                    }
                                }
                                arr[i].bookingList[j].d_final_address.push(d_line_a);
                                arr[i].bookingList[j].d_final_address.push(d_line_b);
                            }
                        } else {
                            arr[i].bookingList[j].d_final_address.push(arr[i].bookingList[j].d_address);
                        }
                    }
                }
            }
        };
    });

