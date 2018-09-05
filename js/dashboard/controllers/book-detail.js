/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('BookDetailCtrl', function ($log, $scope, $rootScope, $state, $stateParams, MessageBox, BookBS, $uibModal, T) {
        var companyId = $rootScope.loginUser.company_id;


        $scope.onCancelButtonClick = function () {
            if ($stateParams.event.cancel) {
                $stateParams.event.cancel();
            }
        };
        $scope.showEndButton = false;
        $scope.showMoreNotes = false;
        $scope.showSendBack = false;
        $scope.hasSentBack = false;
        $scope.distanceUnit = localStorage.getItem('distanceunit');
        $scope.langStyle=localStorage.getItem('lang');
        $scope.country=$rootScope.loginUser.admin.location.country;
         //todo
        // var lang='en';
        var lang;
        var initialize = function () {
            if (window.localStorage.lang) {
                lang = window.localStorage.lang;
            } else {
                lang = navigator.language.toLocaleLowerCase();
            }
            // console.log(lang);
            if ( lang == 'zh') {
                $scope.disclaimerTranslate = 0
            }else if(lang == 'eur'||lang == 'fr'){
                $scope.disclaimerTranslate = 1
            }else {
                $scope.disclaimerTranslate = 2
            }
            console.log($scope.disclaimerTranslate);
        };

        $scope.onEndBookButtonClick = function () {
            if ($scope.showAffiliate == 1) {
                MessageBox.confirm(T.T("alertTitle.determine"), T.T("book_detail.jsSuspend_waring"), function (isConfirm) {
                    if (isConfirm) {
                        BookBS.cancel($stateParams.data.bookingId).then(function (result) {
                            MessageBox.hideLoading();
                            MessageBox.toast(T.T("book_detail.jsCancel_booking_success"), "info");
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel(0);
                            }
                        }, function (treated) {
                            MessageBox.hideLoading();
                            if (treated) {
                            }
                            else {
                                MessageBox.toast(T.T("book_detail.jsCancel_booking_fail"), "error");
                            }
                        });
                    }
                });
            } else {
                MessageBox.confirm(T.T("alertTitle.determine"), '', function (isConfirm) {
                    if (isConfirm) {
                        BookBS.cancel($stateParams.data.bookingId).then(function (result) {
                            MessageBox.hideLoading();
                            MessageBox.toast(T.T("book_detail.jsCancel_booking_success"), "info");
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel(0);
                            }
                        }, function (treated) {
                            MessageBox.hideLoading();
                            if (treated) {
                            }
                            else {
                                MessageBox.toast(T.T("book_detail.jsCancel_booking_fail"), "error");
                            }
                        });
                    }
                });
            }

        };

        $scope.showOrHideMoreNotes = function () {
            $scope.showMoreNotes = !$scope.showMoreNotes;
        };

        // Function
        function loadDetail(bookId) {
            initialize();
            MessageBox.showLoading();
            var rightNow = (new Date().getTime() + "").substring(0, 10) * 1;
            BookBS.getDetail(bookId).then(function (result) {
                console.log(result)
                MessageBox.hideLoading();
                $scope.book = result.data;
                $scope.isCoupon = false;
                if ($scope.book.coupon) {
                    $scope.isCoupon = true;
                }
                if ($scope.book.company_id != companyId) {
                    $scope.isCoupon = false;
                }
                if ($scope.book.type == 3 || $scope.book.appointed_at - rightNow < 300) {
                    $scope.showEditButton = false;
                } else if ($scope.book.order_state > 0) {
                    $scope.showEditButton = false;
                } else {
                    $scope.showEditButton = true;
                }
                if (($scope.book.trip_state == 0 || $scope.book.trip_state == 1 || $scope.book.trip_state == 2) && $scope.book.order_state == 0) {
                    $scope.isStart = true;
                } else if ($scope.book.trip_state == 3 && ($scope.book.order_state == 1 || $scope.book.order_state == 2)) {
                    $scope.isStart = false;
                }
                $scope.bookType = result.data.type;
                if (companyId == $scope.book.company_id && companyId != $scope.book.exe_com_id) { //A单
                    $scope.isTirp = true;
                    $scope.showEditButton = false;
                    if ($scope.book.order_state > 3 || ($scope.book.trip_state > 3 && $scope.book.trip_state < 9)) {
                        $scope.isTirp = false;
                    }
                    $scope.showAffiliate = 1;
                    $scope.comapnyName = $scope.book.exe_com_name;
                    $scope.book.driver_data = JSON.parse($scope.book.driver_data);
                    $scope.book.driver_data.mobile = $scope.book.exe_com_phone1;
                    $scope.book.driver_data.email = $scope.book.exe_com_email;
                    if ($scope.book.reject == 0) {
                        $scope.hasSentBack = false;
                        $scope.showSendBack = false;
                    } else {
                        $scope.hasSentBack = true;
                        $scope.showSendBack = false;
                        $scope.showEditButton = true;
                    }
                } else if (companyId != $scope.book.company_id && companyId == $scope.book.exe_com_id) { //B单
                    $scope.showEndButton = false;
                    $scope.isTirp = false;
                    $scope.book.c_email = $scope.book.own_com_email;
                    $scope.book.driver_data = JSON.parse($scope.book.driver_data);
                    $scope.showAffiliate = 2;
                    if ($scope.book.order_state == 0) {
                        if ($scope.book.reject == 0) {
                            $scope.hasSentBack = false;
                            $scope.showSendBack = true;
                        } else {
                            $scope.hasSentBack = true;
                            $scope.showSendBack = false;
                            $scope.showEditButton = false;
                        }
                    } else {
                        $scope.hasSentBack = false;
                        $scope.showSendBack = false;
                        $scope.showEditButton = false;
                    }

                } else {
                    if ($scope.book.reject == 0) {
                        $scope.hasSentBack = false;
                    } else {
                        $scope.hasSentBack = true;
                    }
                    $scope.isTirp = true;
                    if ($scope.book.order_state > 3 || ($scope.book.trip_state > 3 && $scope.book.trip_state < 9)) {
                        $scope.isTirp = false;
                    }
                    $scope.book.driver_data = JSON.parse($scope.book.driver_data);
                }
                $scope.book.car_data = JSON.parse($scope.book.car_data);
                $scope.book.offer_data = JSON.parse($scope.book.offer_data);
                $scope.book.option_data = JSON.parse($scope.book.option_data);
                $scope.book.passengerNames = $scope.book.passenger_names.split(",");
                if ($scope.book.type == 1) {
                    if ($scope.book.detail_distance.toString().indexOf('.') > -1 && $scope.book.detail_distance.toString().length > $scope.book.detail_distance.toString().indexOf('.') + 3) {
                        $scope.book.detail_distance = $scope.book.detail_distance.toString().substring(0, $scope.book.detail_distance.toString().indexOf('.') + 3);
                    }
                }
                if (
                    $scope.book.order_state == OrderOrderState.ORDER_STATE_ADMIN_CANCEL ||
                    $scope.book.order_state == OrderOrderState.ORDER_STATE_SUPER_ADMIN_CANCEL ||
                    $scope.book.order_state == OrderOrderState.ORDER_STATE_PASSENGER_CANCEL ||
                    $scope.book.order_state == OrderOrderState.ORDER_STATE_TIMES_UP_CANCEL
                ) {
                    $scope.hasSentBack = false;
                    $scope.showEndButton = false;
                    $scope.showEditButton = false;
                    $scope.tripStateString = T.T("book_detail.jsCancelled_Trip");
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_BOOKING) {
                    $scope.showEndButton = true;
                    $scope.tripStateString = T.T("book_detail.jsTrip_Not_Started");
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_RUN) {
                    $scope.showEndButton = false;
                    switch ($scope.book.trip_state) {
                        case OrderTripState.TRIP_STATE_DRIVE_TO_PICK_UP: {
                            $scope.tripStateString = T.T("book_detail.jsOnRoute_To_Passenger");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_WAITING_CUSTOMER: {
                            $scope.tripStateString = T.T("book_detail.jsWaiting_Passenger");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_GO_TO_DROP_OFF: {
                            $scope.tripStateString = T.T("book_detail.jsOn_Trip");
                            $scope.showEndButton = false;
                        }
                            break;
                        default : {
                            $scope.tripStateString = "Unknown";
                        }
                            break;
                    }
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_DONE) {
                    $scope.showEndButton = false;
                    switch ($scope.book.trip_state) {
                        case OrderTripState.TRIP_STATE_WAITING_DRIVER_DETERMINE: {
                            $scope.tripStateString = T.T("book_detail.jsDriver_Confirm_Price");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_WAITING_TO_SETTLE: {
                            $scope.tripStateString = T.T("book_detail.jsWaiting_Settle");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_SETTLING: {
                            $scope.tripStateString = T.T("book_detail.jsSettling");
                            $scope.showEndButton = false;
                        }
                            break;
                        case OrderTripState.TRIP_STATE_SETTLE_DONE: {
                            $scope.tripStateString = T.T("book_detail.jsTrip_Ended");
                            $scope.showEndButton = false;
                        }
                            break;
                        default : {
                            $scope.tripStateString = "Unknown";
                        }
                            break;
                    }
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_WAIT_DETERMINE) {
                    $scope.tripStateString = T.T("book_detail.jsWaiting_passenger_approval");
                    $scope.showEndButton = false;
                } else if ($scope.book.order_state == OrderOrderState.ORDER_STATE_SETTLE_ERROR) {
                    $scope.showEndButton = false;
                    $scope.isTirp = false;
                    $scope.tripStateString = T.T("book_detail.jsSettle_Error");
                }
                else {
                    $scope.tripStateString = "Unknown";
                }

                if ($scope.showEndButton
                    && ($scope.book.exe_com_id != $scope.book.company_id)
                    && ($rootScope.loginUser.company_id != $scope.book.company_id)) {
                    $scope.showEndButton = false;
                }
                console.log("send back is ", $scope.showSendBack);

                console.log("show end button ", $scope.showEndButton);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("book_detail.jsGet_detail_fail"), "error");
                }
            });
            // console.log($scope.hasSentBack);
        }

        $scope.editStartTrip = function () {
            if ($scope.isStart == true) {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("book_detail.jsDo_you_start_trip"), function (isConfirm) {
                    if (isConfirm) {
                        $scope.state = 3;
                        BookBS.editTripState($stateParams.data.bookingId, $scope.state).then(function (result) {
                            MessageBox.hideLoading();
                            MessageBox.toast(T.T("book_detail.jsStart_Trip_Successfully"), "Success");
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel(1);
                            }
                        }, function (error) {
                            if (error.response.data.code == '7009') {
                                MessageBox.toast(T.T("book_detail.jsDriver_has_running_trip"), "error");
                            } else {
                                MessageBox.toast(T.T("book_detail.jsStart_Trip_Failed"), "error");
                            }
                        })
                    }
                })
            } else {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("book_detail.jsDo_you_end_trip"), function (isConfirm) {
                    if (isConfirm) {
                        $scope.state = 4;
                        BookBS.editTripState($stateParams.data.bookingId, $scope.state).then(function (result) {
                            // console.log(result);
                            MessageBox.hideLoading();
                            MessageBox.toast(T.T("book_detail.jsEnd_Trip_Successfully"), "Success");
                            if ($stateParams.event.cancel) {
                                $stateParams.event.cancel(2,result.data.result.order_state,result.data.result.trip_state);
                            }
                        }, function (error) {
                            MessageBox.toast(T.T("book_detail.jsEnd_Trip_Failed"), "error");
                        })
                    }
                })
            }
        };
        $scope.sendEmail = function () {
            MessageBox.showLoading();
            BookBS.sendEmail($stateParams.data.bookingId).then(function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("book_detail.jsItinerary_email_success"), "Success");
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("book_detail.jsSend_email_fail"), "error");
                }
            })
        };

        loadDetail($stateParams.data.bookingId);

        $scope.sendBackBooking = function () {
            var sendingBooking = T.T("book_detail.jsSending_Booking");
            var company_name = /\{company_name\}/g;
            var company_phone = /\{company_phone\}/g;
            var company_email = /\{company_email\}/g;
            var at = /\{at\}/g;
            var or = /\{or\}/g;
            if (!$scope.book.own_com_phone1 && !$scope.book.own_com_phone2 && !$scope.book.own_com_email) {
                sendingBooking = sendingBooking.replace(at, '');
            }else {
                sendingBooking = sendingBooking.replace(at, T.T("book_detail.jsAt"));
            }
            if ($scope.book.own_com_phone1) {
                sendingBooking = sendingBooking.replace(company_phone, $scope.book.own_com_phone1);
            } else {
                if ($scope.book.own_com_phone2) {
                    sendingBooking = sendingBooking.replace(company_phone, $scope.book.own_com_phone2);
                } else {
                    sendingBooking = sendingBooking.replace(company_phone, '');
                    sendingBooking = sendingBooking.replace(or, '');
                }
            }
            if ($scope.book.own_com_email) {
                sendingBooking = sendingBooking.replace(or,  T.T("book_detail.jsOr"));
                sendingBooking = sendingBooking.replace(company_email, $scope.book.own_com_email);
            } else {
                sendingBooking = sendingBooking.replace(or, '');
                sendingBooking = sendingBooking.replace(company_email, '');
            }

            sendingBooking = sendingBooking.replace(company_name, $scope.book.own_com_name);
            MessageBox.confirm(T.T("alertTitle.warning"), sendingBooking, function (isConfirm) {
                if (isConfirm) {
                    BookBS.sendBackBooking($stateParams.data.bookingId).then(function () {
                        $scope.hasSentBack = true;
                        $scope.showSendBack = false;
                        $scope.showEditButton = false;
                        $stateParams.event.hasSentBack();
                        MessageBox.toast(T.T("book_detail.jsBooking_sent_successfully"), 'info');

                    }, function () {
                        MessageBox.toast(T.T("book_detail.jsBooking_sent_failed"), 'error');
                    })
                }
            }, T.T('alertTitle.alert_button_Send_Back'));

        };


        $scope.editCars = function () {
            var now = (new Date().getTime() + "").substring(0, 10) * 1;
            if ($scope.book.appointed_at - now < 300) {
                MessageBox.toast(T.T("book_detail.jsOrder_Cannot_Modified"), "error");
            } else {
                MessageBox.confirm(T.T("alertTitle.warning"), T.T("book_detail.jsWant_edit_Vehicles_Driver"), function (isConfirm) {
                    if (isConfirm) {
                        MessageBox.showLoading();
                        BookBS.getEditBookingCars($stateParams.data.bookingId, $scope.bookType).then(function (result) {
                            if (result.data.code == 2100) {
                                MessageBox.hideLoading();
                                MessageBox.toast(T.T("book_detail.jsOffer_not_matched"), "info");
                            } else {
                                var totalData = result.data.result;

                                var initCategory = function (data) {
                                    var categories = [];

                                    //循环遍历offer
                                    for (var i = 0; i < data.length; i++) {

                                        //循环遍历offer 中的car_categories
                                        for (var k = 0; k < data[i].car_categories.length; k++) {

                                            var isNewCategory = true;

                                            //循环对比category类型 如果是已知类型，直接在此类型下添加数据，如果未知类型，创建此新类型。
                                            for (var j = 0; j < categories.length; j++) {
                                                if (categories[j].category_id == data[i].car_categories[k].category_id) {
                                                    for (var m = 0; m < data[i].car_categories[k].cars.length; m++) {
                                                        data[i].car_categories[k].cars[m].offer = data[i];
                                                    }
                                                    categories[j].cars = categories[j].cars.concat(data[i].car_categories[k].cars);
                                                    isNewCategory = false;
                                                }
                                            }

                                            if (isNewCategory) {
                                                var category = {
                                                    category: "",
                                                    category_id: "",
                                                    cars: [],
                                                    options: [],
                                                    offer: "",
                                                    isSelect: false
                                                };
                                                category.category_id = data[i].car_categories[k].category_id;
                                                category.category = data[i].car_categories[k].category;
                                                category.cars = data[i].car_categories[k].cars;
                                                for (var m = 0; m < category.cars.length; m++) {
                                                    category.cars[m].offer = data[i];
                                                    category.cars[m].isSelect = false;
                                                    for (var n = 0; n < category.cars[m].drivers.length; n++) {
                                                        category.cars[m].drivers[n].isSelect = false;
                                                    }
                                                }
                                                categories.push(category);
                                            }
                                        }
                                    }
                                    var noRepeatCategories = categories;

                                    // 对生成的car 增加序号
                                    for (var i = 0; i < noRepeatCategories.length; i++) {
                                        for (var j = 0; j < noRepeatCategories[i].cars.length; j++) {
                                            noRepeatCategories[i].cars[j].index = j;
                                        }
                                    }
                                    return noRepeatCategories;
                                };

                                var modalInstance = $uibModal.open({
                                    templateUrl: 'templates/dashboard/calendar-selectcars.html',
                                    controller: 'calendarSelectCarsCtrl',
                                    size: 'md',
                                    backdrop: 'static',
                                    keyboard: false,
                                    resolve: {
                                        $stateParams: {
                                            data: $scope.book,
                                            bookId: $stateParams.data.bookingId,
                                            event: {
                                                totalCarsData: initCategory(totalData),
                                                getCarsMessages: function (carsMessages) {
                                                    $scope.book.car_data = JSON.parse(carsMessages.car_data);
                                                    $scope.book.driver_data = JSON.parse(carsMessages.driver_data);
                                                },
                                                getDriverNameToCalendar: $stateParams.event.driverName,
                                                editSuccess: function (companyInfo) {
                                                    loadDetail($stateParams.data.bookingId);
                                                    $stateParams.event.displayStatus(companyInfo)
                                                    modalInstance.dismiss();
                                                },
                                                cancel: function () {
                                                    modalInstance.dismiss();
                                                }
                                            }
                                        }
                                    }
                                });
                                MessageBox.hideLoading();
                            }

                        }, function (error) {
                            MessageBox.hideLoading();
                            if (error.treated) {
                            }
                            else {
                                setTimeout(function () {
                                    MessageBox.alertView(T.T("alertTitle.warning"), T.T("book_detail.jsNo_vehicles_drivers_info"), function (isAlertView) {
                                        if (isAlertView) {
                                            $stateParams.event.cancel();
                                        }
                                    })
                                }, 800);
                            }
                        })
                    }
                });
            }
        }
    });
