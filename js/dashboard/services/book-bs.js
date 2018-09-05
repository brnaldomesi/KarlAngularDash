/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('BookBS', function ($q, HttpService, $rootScope, $filter, strformat, AddressTool) {
        return {

            getOffersP2P: function (type, pickup, dropoff, estimateDistance, estimateDuration, appointedTime, dIsAirport, aIsAirport,unit) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.offer.getOffers, $rootScope.loginUser.company_id),
                    {
                        type: type,
                        d_lat: pickup.geometry.location.lat,
                        d_lng: pickup.geometry.location.lng,
                        a_lat: dropoff.geometry.location.lat,
                        a_lng: dropoff.geometry.location.lng,
                        estimate_distance: estimateDistance,
                        estimate_duration: estimateDuration,
                        appointed_time: (new Date(appointedTime).valueOf() + "").substr(0, 10),
                        car_category: 0,
                        d_is_airport: dIsAirport ? 1 : 0,
                        a_is_airport: aIsAirport ? 1 : 0,
                        unit:unit
                    }, function (response) {
                        defer.resolve({data: response.data.result});
                    }, function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    });
                return defer.promise;
            },

            getOffersHourly: function (type, pickup, estimateDuration, appointedTime, dIsAirport,unit) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.offer.getOffers, $rootScope.loginUser.company_id), {
                    type: type,
                    d_lat: pickup.geometry.location.lat,
                    d_lng: pickup.geometry.location.lng,
                    estimate_duration: estimateDuration,
                    appointed_time: (new Date(appointedTime).valueOf() + "").substr(0, 10),
                    car_category: 0,
                    d_is_airport: dIsAirport ? 1 : 0,
                    unit:unit
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getModifyOffersP2P: function (type, pickup, dropoff, estimateDistance, estimateDuration, appointedTime, bookId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.offer.getModifyOffers, bookId),
                    {
                        type: type,
                        d_lat: pickup.geometry.location.lat(),
                        d_lng: pickup.geometry.location.lng(),
                        d_address: pickup.formatted_address,
                        a_lat: dropoff.geometry.location.lat(),
                        a_lng: dropoff.geometry.location.lng(),
                        a_address: dropoff.formatted_address,
                        estimate_distance: estimateDistance,
                        estimate_duration: estimateDuration,
                        appointed_time: (new Date(appointedTime).valueOf() + "").substr(0, 10),
                        car_category: 0
                    }, function (response) {
                        defer.resolve({data: response.data.result});
                    }, function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    });
                return defer.promise;
            },

            getModifyOffersHourly: function (type, pickup, estimateDuration, appointedTime, bookId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.offer.getModifyOffers, bookId), {
                    type: type,
                    d_lat: pickup.geometry.location.lat(),
                    d_lng: pickup.geometry.location.lng(),
                    d_address: pickup.formatted_address,
                    estimate_duration: estimateDuration,
                    appointed_time: (new Date(appointedTime).valueOf() + "").substr(0, 10),
                    car_category: 0
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getCustomQuote: function (estimateDuration, appointedTime, lat, lng, dIsAirport,unit) {
                var defer = $q.defer();
                HttpService.get(Api.offer.getCustomQuote, {
                    estimate_duration: estimateDuration,
                    appointed_time: appointedTime,
                    lat: lat,
                    lng: lng,
                    d_is_airport: dIsAirport,
                    unit:unit
                }, function (response) {
                    defer.resolve({
                        date: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            bookCustomQuote: function (customer_id, param, determine) {
                var defer = $q.defer();
                HttpService.post(Api.offer.addCustomQuote, {
                    customer_id: customer_id,
                    param: param,
                    determine: determine
                }, function (response) {
                    defer.resolve({
                        date: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },


            book: function (param, customerId) {
                var defer = $q.defer();
                HttpService.post(Api.book.book, {
                    param: param,
                    customer_id: customerId
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            changeBook: function (param, customerId, bookId) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.book.changeBook, bookId), {
                    param: param,
                    customer_id: customerId
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            ratesCountsFromCurrentCompany: function (data) {
                var defer = $q.defer();
                var startYear = data.getFullYear();
                var startMonth = data.getMonth() + 1;
                var endYear = startYear;
                var endMonth = startMonth + 1;
                if (startMonth == 12) {
                    endMonth = 1;
                    endYear = startYear + 1;
                }

                var startDayOfMonth = new Date(startYear + "/" + startMonth + "/1 00:00:00");
                var endDayOfMonth = new Date(endYear + "/" + endMonth + "/1 00:00:00");
                var requestParame = {
                    "start_time": parseInt(startDayOfMonth.getTime() / 1000),
                    "end_time": parseInt(endDayOfMonth.getTime() / 1000),
                    "filter": 0,
                    "timezone": jstz.determine().name()
                };
                HttpService.get(Api.book.ratesCountsFromCurrentCompany, requestParame, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            ratesInOneDayFromCurrentCompany: function (date,page,per_page) {
                var defer = $q.defer();
                var day = new Date($filter('date')(date, "longDate"));
                if(!page&&!per_page){
                    page=1;
                    per_page=30
                }
                var requestParams = {
                    "start_time": parseInt(day.getTime() / 1000),
                    "end_time": parseInt(day.getTime() / 1000 + 24 * 60 * 60),
                    "filter": 0,
                    page: page,
                    per_page: per_page
                };
                HttpService.get(Api.book.ratesFromCurrentCompany, requestParams, function (response) {
                    angular.forEach(response.data.result.bookings, function (booking) {
                        if (booking.d_address) {
                            if (booking.d_address.indexOf('formatted_address') > 0) {
                                booking.d_address = JSON.parse(booking.d_address);
                            }
                            booking.d_final_address = AddressTool.finalAddress(booking.d_address);
                        }
                        if (booking.a_address) {
                            if (booking.a_address.indexOf('formatted_address') > 0) {
                                booking.a_address = JSON.parse(booking.a_address);
                            }
                            booking.a_final_address = AddressTool.finalAddress(booking.a_address);
                        }
                    });
                    defer.resolve({
                        data: response.data.result.bookings,
                        total: response.data.result.total
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            homeRatesFromCurrentCompany: function () {
                var defer = $q.defer();
                var day = new Date($filter('date')(new Date(), "longDate"));
                var requestParams = {
                    "start_time": parseInt(day.getTime() / 1000),
                    "end_time": parseInt(day.getTime() / 1000 + 24 * 60 * 60),
                    "filter": 1,
                    "trip_state": "1,2,3,4"
                };
                HttpService.get(Api.book.ratesFromCurrentCompany, requestParams, function (response) {
                    defer.resolve({
                        data: response.data.result.bookings,
                        total: response.data.result.total
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getDetail: function (bookId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.book.detail, bookId), {}, function (response) {
                    if (response.data.result.d_address) {
                        if (response.data.result.d_address.indexOf('formatted_address') > 0) {
                            response.data.result.d_address = JSON.parse(response.data.result.d_address);
                        }
                        response.data.result.d_final_address = AddressTool.finalAddress(response.data.result.d_address);
                    }
                    if (response.data.result.a_address) {
                        if (response.data.result.a_address.indexOf('formatted_address') > 0) {
                            response.data.result.a_address = JSON.parse(response.data.result.a_address);
                        }
                        response.data.result.a_final_address = AddressTool.finalAddress(response.data.result.a_address);
                    }
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getBookInfo: function (bookId) {
                var defer = $q.defer();

                HttpService.get(strformat(Api.order.getBookInfo, bookId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            cancel: function (bookId) {
                var defer = $q.defer();

                HttpService.post(strformat(Api.book.cancel, bookId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            sendEmail: function (bookId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.book.sendEmail, bookId), {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            getEditBookingCars: function (bookId, type) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.book.getEditBookingCars, bookId), {
                    type: type
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            editBookingCars: function (bookId, param) {
                var defer = $q.defer();
                HttpService.put(strformat(Api.book.editBookingCars, bookId), {
                    param: param
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            editTripState: function (bookId, state) {
                var defer = $q.defer();
                HttpService.patch(Api.book.editTripState, {
                    booking_id: bookId,
                    state: state
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            sendBackBooking : function (bookId) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.book.sendBackBooking,bookId), {
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            verifyCoupon: function (companyId,code) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.customer.verifyCode,companyId, code), {}, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, null);
                return defer.promise;
            },

        }
    });