'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Services', []);

/**
 * Created by wangyaunzhi on 16/9/26.
 */
angular.module('KARL.Services')
    .factory('AffiliateNetworkBS', function ($q, HttpService, strformat,EncodeTool) {
        return {
            getAnSeting: function () {
                var defer = $q.defer();

                HttpService.get(Api.an.getSetting, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            enableLn: function (enable) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.an.enableLnSetting, enable), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            enableGn: function (enable) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.an.enableGnSetting, enable), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            enableCombine: function (enable) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.an.enableCombineSetting, enable), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addWantedCarModel: function (modelId) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.an.addLnWantedCarModel, modelId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            deleteWantedCarModel: function (carModelId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.an.deleteLnWantedCarModel, carModelId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addGivenCar: function (carID) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.an.addLnGivenCar, carID), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            deleteGivenCar: function (carID) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.an.deleteLnGivenCar, carID), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            updateLNRadius: function (radius) {
                var defer = $q.defer();
                HttpService.patch(Api.an.updateLnRadius, {"radius":radius}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            }

        }
    });
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

                //var startDayOfMonth = new Date(Date.UTC(startYear, data.getMonth(), 1, 0, 0, 0));
                //var endDayOfMonth = new Date(Date.UTC(endYear, data.getMonth() + 1, 1, 0, 0, 0));

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
                var timeZone_offset = (new Date()).getTimezoneOffset();
                // - timeZone_offset*60*1000
                
                if(!page&&!per_page){
                    page=1;
                    per_page=30
                }
                var requestParams = {
                    "start_time": parseInt((day.getTime()) / 1000),
                    "end_time": parseInt((day.getTime()) / 1000 + 24 * 60 * 60),
                    "filter": 0,
                    page: page,
                    per_page: per_page,
                    "timezone": jstz.determine().name()
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

            /*
                Created by pham 3/21/2018
            */
             verifyCoupon_self: function (companyId,code,appointedTime, customer_id) {
                

                var defer = $q.defer();
                HttpService.get(strformat(Api.customer.verifyCode,companyId, code), {appointedTime, customer_id}, function (response) {
                    console.log(response);
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                }, true, null);
                return defer.promise;
            },
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CarBrandBS', function ($q, HttpService) {
        return {

            getAll: function ()
            {
                var defer = $q.defer();
                HttpService.get(Api.carBrand.getAll, {}, function (response)
                {
                    defer.resolve({data: response.data.result});
                }, function (treated, response)
                {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CarBS', function ($q, HttpService, strformat) {
        return {

            getCurrentUserAll: function () {
                var defer = $q.defer();
                HttpService.get(Api.car.getCurrentUserAll, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            getCurrentUserAllAndDriver: function () {
                var defer = $q.defer();
                HttpService.get(Api.car.getCurrentUserAllAndDriver, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getAll: function (page, count) {
                var defer = $q.defer();

                HttpService.get(Api.car.getAll, {
                    page: page,
                    per_page: count
                }, function (response) {
                    defer.resolve({
                        data: response.data.result.cars,
                        total: response.data.result.total,
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addNewVehicle: function (carModelId, licensePlate,preTime, description, calendar, type, img, year, color,passengerMax,bagsMax) {
                var defer = $q.defer();
                var param = {
                    car_model_id: carModelId,
                    license_plate: licensePlate,
                    description: description,
                    calendar:calendar,
                    type: type,
                    pre_time: preTime,
                    car_img: img,
                    year: year,
                    color: color,
                    seats_max:passengerMax,
                    bags_max:bagsMax
                };
                HttpService.uploadParamsAndData(Api.car.addToCurrentUser,{
                    param:JSON.stringify(param)
                    }
                    , {car_img: img}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            deleteFromCurrentUser: function (carId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.car.deleteFromCurrentUser, carId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getDetailFromCurrentUser: function (carId) {
                var defer = $q.defer();

                HttpService.get(strformat(Api.car.getDetailFromCurrentUser, carId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            updateVehicleInfo: function (carId, carModelId, licensePlate,preTime, description, calendar, type, img, year, color,passengerMax,bagsMax) {
                var defer = $q.defer();

                var param = {
                    car_model_id: carModelId,
                    license_plate: licensePlate,
                    description: description,
                    calendar: calendar,
                    car_img: img,
                    pre_time: preTime,
                    year: year,
                    color: color,
                    seats_max:passengerMax,
                    bags_max:bagsMax
                };
                var file = {car_img: img};
                if (img != -1) {
                    param.type = type;
                }

                HttpService.uploadParamsAndData(strformat(Api.car.updateToCurrentUser, carId),
                    {param:JSON.stringify(param)},
                    file, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            changeCarImage: function (carId, file) {
                var defer = $q.defer();

                HttpService.upload(strformat(Api.car.changeCarImage, carId), {
                    car_image: file
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CarCategoryBS', function ($q, HttpService) {
        return {

            getAll: function ()
            {
                var defer = $q.defer();
                HttpService.get(Api.carCategory.getAll, {}, function (response)
                {
                    defer.resolve({data: response.data.result});
                }, function (treated, response)
                {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CarModelBS', function ($q, strformat, HttpService) {
        return {

            getAll: function (carModelId)
            {
                var defer = $q.defer();
                HttpService.get(strformat(Api.carModel.getAll, carModelId), {}, function (response)
                {
                    defer.resolve({data: response.data.result});
                }, function (treated, response)
                {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CardBS', function ($q, HttpService, strformat) {
        return {
            getFromCurrentCompany: function () {
                var defer = $q.defer();

                HttpService.get(Api.card.getFromCurrentCompany, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            updateCurrentCompany: function (cardType, cardNumber, cvv2, expireMonth, expireYear, firstName, lastName) {
                var defer = $q.defer();

                HttpService.put(Api.card.updateCurrentCompany, {
                    card_type: cardType,
                    card_number: cardNumber,
                    cvv2: cvv2,
                    expire_month: expireMonth,
                    expire_year: expireYear,
                    first_name: firstName,
                    last_name: lastName
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            
            getFromCurrentUser: function (userId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.card.getFromCurrentUser,userId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CompanyBS', function ($q, HttpService, strformat) {
        return {
            createCompany: function (company_param, admin_param, payment_param, charge_param) {
                var defer = $q.defer();
                var params = {
                    company_param: company_param,
                    admin_param: admin_param,
                    payment_param: payment_param,
                    charge_param: charge_param
                };
                HttpService.post(Api.company.createAllNewCompany, params, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCompanyDetail: function (companyId) {
                var defer = $q.defer();
                var params = {};
                HttpService.get(strformat(Api.company.getACompanyDetail, companyId), params, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getAllCompanies: function (page, count) {
                var defer = $q.defer();
                var params = {
                    page: page,
                    per_page: count
                };
                HttpService.get(Api.company.getAllCompanies, params, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCurrentCompanies: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getCurrentCompanies, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            updateCurrentCompanies: function (name, address, lat, lng, tcp, phone, email, emailHost, emailPort, emailPassword, country, language) {
                var defer = $q.defer();
                HttpService.patch(Api.company.getCurrentCompanies, {
                    name: name,
                    address: address,
                    lat: lat,
                    lng: lng,
                    tcp: tcp,
                    phone1: phone,
                    email: email,
                    email_host: emailHost,
                    email_port: emailPort,
                    email_password: emailPassword,
                    country: country,
                    lang: language
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            changeLogoToCurrentCompany: function (file) {
                var defer = $q.defer();

                HttpService.upload(Api.company.changeLogo, {
                    company_logo: file
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCompanyDetails: function (companyId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getCompanyDetail, companyId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            companyDetailRate: function (rate, companyId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.companyDetailRate, companyId), {
                    company_rate: rate
                }, function (response) {
                    defer.resolve({
                        data: response
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            modifyCompanyPush: function (pushProfile, pushApiToken, configId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.modifyCompanyPush, configId), {
                    push_profile: pushProfile,
                    push_api_token: pushApiToken
                }, function (response) {
                    defer.resolve({
                        data: response
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addCompanyPush: function (pushProfile, pushApiToken, companyId) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.company.addCompanyPush, companyId), {
                    push_profile: pushProfile,
                    push_api_token: pushApiToken
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCompanyPush: function (companyId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getCompanyPush, companyId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCompanyApp: function (companyId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getCompanyApp, companyId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            modifyCompanyApp: function (androidUrl, androidPkgName, iosUrl, iosId, companyId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.modifyCompanyApp, companyId), {
                    android_url: androidUrl,
                    pkg_name: androidPkgName,
                    ios_id: iosId,
                    ios_url: iosUrl
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            getCompaniesList: function (name) {
                var defer = $q.defer();
                HttpService.get(Api.super.getCompaniesList, {
                    search: name
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            companyStatistics: function (selectDate, type, companyId) {
                //如果是日,则取当日的23:59:59
                //如果是周,则取周末的23:59:59
                //如果是月,则取月末的23:59:59
                var date = angular.copy(selectDate);
                var timeStamp = '';
                if (type == 0) {
                    date.setDate(date.getDate() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else if (type == 1) {
                    if (date.getDay() == 0) {
                        date.setDate(date.getDate() + 1);
                    } else {
                        date.setDate(date.getDate() + 7 - date.getDay() + 1);
                    }
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else {
                    date.setDate(1);
                    date.setMonth(date.getMonth() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                }
                var defer = $q.defer();
                HttpService.get(Api.super.companyStatistics, {
                    timestamp: timeStamp,
                    type: type,
                    count: 3,
                    company_id: companyId
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            getCompanySetting: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getCompanySetting, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            editCompanySetting: function (hideDriverFee, payAuth, settleType, distanceUnit) {
                var defer = $q.defer();
                HttpService.patch(Api.company.editCompanySetting, {
                    hide_driver_fee: hideDriverFee,
                    pay_auth: payAuth,
                    settle_type: settleType,
                    distance_unit: distanceUnit
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            getProxyAdmin: function () {
                var defer = $q.defer();
                HttpService.get(Api.admin.getProxyAdmin, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            createProxyAdmin: function () {
                var defer = $q.defer();
                HttpService.put(Api.admin.createProxyAdmin, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            deleteProxyAdmin: function () {
                var defer = $q.defer();
                HttpService.delete(Api.admin.deleteProxyAdmin, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            getCompanyDisclaimer: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getCompanyDisclaimer, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            editCompanyDisclaimer: function (disclaimer) {
                var defer = $q.defer();
                HttpService.patch(Api.company.editCompanyDisclaimer, {disclaimer: disclaimer}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            changeCompanyAnSettingLock: function (companyId, locked) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.changeCompanyAnLocked, companyId),
                    {locked: locked},
                    function (response) {
                        defer.resolve({
                            data: response.data
                        });
                    }, function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    });
                return defer.promise;
            },

            getMailChimpSetting: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getGroupSetting, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            updateMailChimpSetting: function (key, list) {
                var defer = $q.defer();
                HttpService.put(Api.company.getCompanyMailChimp, {
                    key: key,
                    list_id: list
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            getMailChimpList: function (key) {
                var defer = $q.defer();
                HttpService.get(Api.company.getMailChimpList + key, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            checkOutGroupList: function (key) {
                var defer = $q.defer();
                HttpService.get(Api.company.checkOutGroupKey, {key: key}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            getGroupSetting: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getGroupSetting, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            setGroupSetting: function (type, sort, key, group) {
                var defer = $q.defer();
                HttpService.post(Api.company.getGroupSetting, {
                    type: type,
                    sort: sort,
                    key: key,
                    groups: group
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            deleteGroupSetting: function (type, sort, key, group) {
                var defer = $q.defer();
                HttpService.delete(Api.company.getGroupSetting, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            modifyGroupSetting: function (type, sort, key, group) {
                var defer = $q.defer();
                HttpService.patch(Api.company.getGroupSetting, {
                    type: type,
                    sort: sort,
                    key: key,
                    groups: group
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            bindStripeAccount: function (code) {
                var defer = $q.defer();
                HttpService.post(Api.company.bindStripe, {
                    code: code
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getSalesRep: function (page, perPage, searchKeyWord) {
                var defer = $q.defer();
                var params = {
                    page: page,
                    per_page: perPage
                };

                if (searchKeyWord) {
                    params.search = searchKeyWord;
                }
                HttpService.get(Api.company.getSalesRep, params, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            createSalesRep: function (SalesRepInfo) {
                var defer = $q.defer();
                HttpService.post(Api.company.createSalesRep, {
                    first_name: SalesRepInfo.firstName,
                    last_name: SalesRepInfo.lastName,
                    password: SalesRepInfo.password,
                    email: SalesRepInfo.email,
                    mobile: SalesRepInfo.mobile,
                    country: SalesRepInfo.selectedCountry,
                    lang: SalesRepInfo.selectedLanguage
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getEditSalesRepInfo: function (salesId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getEditSalesRepInfo, salesId), {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateSalesRepInfo: function (params, salesId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.updateSalesRepInfo, salesId), {
                    param: JSON.stringify(params)
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            deleteSalesRepInfo: function (salesId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.company.deleteSalesRepInfo, salesId), {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },


            getSalesAssistant: function (page, perPage, searchKeyWord) {
                var defer = $q.defer();
                var params = {
                    page: page,
                    per_page: perPage
                };

                if (searchKeyWord) {
                    params.search = searchKeyWord;
                }
                HttpService.get(Api.company.getSalesAssistant, params, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            createSalesAssistant: function (SalesAssInfo) {
                var defer = $q.defer();
                HttpService.post(Api.company.createSalesAssistant, {
                    first_name: SalesAssInfo.firstName,
                    last_name: SalesAssInfo.lastName,
                    password: SalesAssInfo.password,
                    email: SalesAssInfo.email,
                    mobile: SalesAssInfo.mobile,
                    country: SalesAssInfo.selectedCountry,
                    lang: SalesAssInfo.selectedLanguage
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },


            getEditSalesAssistantInfo: function (salesId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getEditSalesAssistantInfo, salesId), {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateSalesAssistantInfo: function (params, salesId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.updateSalesAssistantInfo, salesId), {
                    param: JSON.stringify(params)
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            deleteSalesAssistantInfo: function (salesId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.company.deleteSalesAssistantInfo, salesId), {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },


            getCompaniesTotalsData: function () {
                var defer = $q.defer();
                HttpService.get(Api.salesRep.getCompaniesTotalsData, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getAsstsCompaniesTotalsData: function () {
                var defer = $q.defer();
                HttpService.get(Api.salesAssistant.getCompaniesTotalsData, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            setCompanyCcy: function (ccy) {
                var defer = $q.defer();
                HttpService.patch(Api.company.setCcy + ccy, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CustomerBS', function ($q, $rootScope, HttpService, strformat, AddressTool) {
        return {
            searchCurrentCustomers: function (key) {
                var defer = $q.defer();
                HttpService.get(Api.customer.searchCurrentCustomers, {
                    search: key
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            checkPaymentExistCustomer:function (cId) {
                var defer = $q.defer();
                HttpService.get(Api.customer.checkPaymentExistCustomer+cId, {
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            customerRegister: function (username, password, firstName, lastName, mobile, email) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.customer.customerRegister, $rootScope.loginUser.company_id), {
                    username: username,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                    mobile: mobile,
                    email: email
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            /**
             * 获取当前登录用户的客户
             * @param page
             * @param count
             * @param keyword
             * @returns {Promise}
             */
            getFromCurrentUser: function (page, count, keyword) {
                var defer = $q.defer();

                var params = {
                    page: page,
                    per_page: count
                };

                if (keyword) {
                    params.search = keyword;
                }

                HttpService.get(Api.customer.getFromCurrentUser, params, function (response) {
                    angular.forEach(response.data.result.customers, function (customer) {
                        if (customer.address) {
                            if (customer.address.indexOf('formatted_address') > 0) {
                                customer.address = JSON.parse(customer.address);
                            }else {
                                if(customer.address == "{}"){
                                    customer.address = '';
                                }
                            }
                            customer.final_address = AddressTool.finalAddress(customer.address);
                        }
                    });
                    defer.resolve({
                        data: response.data.result.customers,
                        total: response.data.result.total
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            /**
             *
             * @param param
             * @returns {Promise}
             */
            addToCurrentUser: function (param) {
                var defer = $q.defer();

                var sendParams = {
                    param: JSON.stringify(param)
                };

                HttpService.post(Api.customer.getFromCurrentUser, sendParams, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            /**
             * 从当前登录用户删除customer
             * @param customerId
             */
            deleteFromCurrentUser: function (customerId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.customer.getDetailFromCurrentUser, customerId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            /**
             * 获取当前登录用户的客户详情
             * @param customerId
             * @returns {Promise}
             */
            getDetailFromCurrentUser: function (customerId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.customer.getDetailFromCurrentUser, customerId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateToCurrentUser: function (param) {
                var defer = $q.defer();
                var sendParams = {
                    param: JSON.stringify(param)
                };

                HttpService.patch(strformat(Api.customer.updateToCurrentUser, param.customerId), sendParams, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            getCustomerMCList:function(email){
                var defer = $q.defer();
                HttpService.get(Api.customer.getOutGroupListMember, {
                    email:email
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            changeCustomerMCList : function(param){
                var defer = $q.defer();
                HttpService.patch(Api.customer.changeOutGroupList, param, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            }
        }



    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('DriverBS', function ($q, HttpService, strformat, AddressTool) {
        return {
            getCurrentUserAll: function () {
                var defer = $q.defer();
                HttpService.get(Api.driver.getCurrentUserAll, {}, function (response) {
                    angular.forEach(response.data.result, function (driver) {
                        if (driver.address) {
                            if (driver.address.indexOf('formatted_address') > 0) {
                                driver.address = JSON.parse(driver.address);
                            }else {
                                if(driver.address == "{}"){
                                    driver.address = '';
                                }
                            }
                            driver.final_address = AddressTool.finalAddress(driver.address);
                        }
                    });
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addToCurrentUser: function (param) {
                var defer = $q.defer();
                HttpService.post(Api.driver.addToCurrentUser, {
                    param: JSON.stringify(param)
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            routineConversionsFromLocToISO: function (routine) {
                var defaultDayRoutine = "111111111111111111111111111111111111111111111111";
                var finalWeekRoutine = '';
                angular.forEach(routine, function (item) {
                    if (!item.work) {
                        finalWeekRoutine += defaultDayRoutine;
                    } else {
                        var start_index = item.start * 2;
                        var end_index = item.end * 2;
                        var startString = defaultDayRoutine.substring(0, start_index);
                        var endString = defaultDayRoutine.substring(end_index);
                        var middleString = defaultDayRoutine.substring(start_index, end_index);
                        middleString = middleString.replace(/1/g, '0');

                        finalWeekRoutine += startString + middleString + endString;
                    }
                });
                //获取时区
                var timeZone = (new Date().getTimezoneOffset() / 60) * (-1) * 2;
                var locRoutineDataString = "";
                if (timeZone > 0) {
                    var tempStart = finalWeekRoutine.substring(timeZone);
                    var tempSpell = finalWeekRoutine.substring(0, timeZone);
                    locRoutineDataString = tempStart + tempSpell;
                } else if (timeZone < 0) {
                    var tempStart = finalWeekRoutine.substr(timeZone);
                    locRoutineDataString = tempStart + finalWeekRoutine;
                } else {
                    locRoutineDataString = finalWeekRoutine;
                }
                //locRoutineDataString 转locRoutineData 数组
                var locRoutineData = undefined;
                for (var i = 0; i < 7; i++) {
                    if (locRoutineData == undefined) {
                        locRoutineData = new Array(locRoutineDataString.substring(i * 48, (i + 1) * 48) + "");
                    } else {
                        locRoutineData.push(locRoutineDataString.substring(i * 48, (i + 1) * 48) + "");

                    }
                }
                return locRoutineData;
            },

            deleteFromCurrentUser: function (driverId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.driver.deleteFromCurrentUser, driverId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getDetailFromCurrentUser: function (driverId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.driver.getDetailFromCurrentUser, driverId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateToCurrentUser: function (driverId, param) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.driver.updateToCurrentUser, driverId), {
                    param: JSON.stringify(param)
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            changeDriverImage: function (driverId, file) {
                var defer = $q.defer();
                HttpService.upload(strformat(Api.driver.changeDriverImage, driverId), {
                    avatar: file
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addAdminAsDriver: function (param) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.driver.addAdminToDriverUser, param), {
                    param: param
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }
        }
    });

/**
 * 
 * Created by Pham on 3/17/18.
 */
angular.module('KARL.Services')
    .factory('CouponBS', function ($q, HttpService, strformat, AddressTool, $rootScope) {
        return {
            getCouponsAll: function () {
                var defer = $q.defer();
                HttpService.get(Api.coupon.getCouponsAll, {company_id : $rootScope.loginUser.company_id}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                },function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getDetail: function (id) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.coupon.getDetail, id), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                },function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            change_state: function (id, changedState) {
                var defer = $q.defer();
                HttpService.put(strformat(Api.coupon.update, id), {turn_state : changedState, is_stateChange : 1}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                },function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            deleteCoupon: function (id) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.coupon.delete, id), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                },function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            createOrUpdate: function (param) {
                var defer = $q.defer();
                
                if(param.id == 0) {
                    HttpService.post(Api.coupon.create, param, function (response) {
                        defer.resolve({
                            data: response.data.result
                        });
                    },function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    });

                    return defer.promise;
                }
                else {
                    HttpService.put(strformat(Api.coupon.update, param.id), param, function (response) {
                        defer.resolve({
                            data: response.data.result
                        });
                    },function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    });

                    return defer.promise;
                }
                
            }


        }
    });


/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('EventBS', function ($q, HttpService,strformat) {
        return {
            addToCalendar: function (start_time, end_time, content, type, owner_id, repeat_type, repeat_days) {
                var defer = $q.defer();
                HttpService.post(Api.event.addToCalendar, {
                    start_time: start_time,
                    end_time: end_time,
                    content: content,
                    type: type,
                    owner_id: owner_id,
                    repeat_type: repeat_type,
                    repeat_days: repeat_days,
                    time_zone:jstz.determine().name()
                }, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            deleteCalendarEvent: function (eventId,repeat) {
                var defer = $q.defer();

                HttpService.delete(strformat(Api.event.deleteCalendarEvent, eventId), {
                    repeat:repeat
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            eventsFromCurrentCompany:function (type,id) {
                var defer = $q.defer();
                var requestParame = {"type":type,"id":id};
                HttpService.get(Api.event.eventsFromCurrentCompany, requestParame, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('MapBS', function ($q, $http) {

            return {

                getTimezone: function (lat, lng) {
                    // var defer = $q.defer();
                    // var url = 'https://maps.googleapis.com/maps/api/timezone/json';
                    // var params = {
                    //     location: lat + ',' + lng,
                    //     timestamp: (new Date().valueOf() + "").substr(0, 10),
                    //     key: 'AIzaSyA_l3gw9utuFnIMofTHjzIAMYWQUac8iqc'
                    // };
                    // HttpService.get(url, params, function (response) {
                    //     defer.resolve({data: response.data.result});
                    // }, function (treated, response) {
                    //     defer.reject({treated: treated, response: response});
                    // });
                    // return defer.promise;

                    // HttpUtils.get($http, url, params, function (response) {
                    //     {
                    // if (response.data == null || response.data.code == null || response.data.result == null) {
                    //     MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                    //     if (faultHandler) {
                    //         faultHandler(true, response);
                    //     }
                    // }
                    // if (response.data.code >= 2000 && response.data.code < 3000) {
                    //     if (successHandler) {
                    //         successHandler(response);
                    //     }
                    // }
                    // var treated = treatCommonFault(response);
                    // if (faultHandler) {
                    //     faultHandler(treated, response);
                    // }
                    // if (response.data.code == 3007) {
                    //     $state.go("login");
                    // }
                    // }, function (error) {
                    // MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                    // if (faultHandler) {
                    //     faultHandler(true, error);
                    // }
                    // }

                    // },

                }
            }
        }
    );


// get: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
//     if (!arguments[4]) bNoUseToken = false;
//     UserCacheBS.loadCache().then(function (result) {
//         if (!bNoUseToken && result.data) {
//             if (!params) {
//                 params = {};
//             }
//             params.token = result.data.token;
//         }
//         if (bNoUseToken && customizeToken) {
//             if (!params) {
//                 params = {};
//             }
//             params.token = customizeToken;
//         }
//         angular.forEach(params, function (key, value) {
//             if (angular.isObject(value)) {
//                 params.key = JSON.stringify(value);
//             }
//         });
//         HttpUtils.get($http, url, params, function (response) {
//             if (response.data == null || response.data.code == null || response.data.result == null) {
//                 MessageBox.toast(T.T("ErrorCode.GET"), 'error');
//                 if (faultHandler) {
//                     faultHandler(true, response);
//                 }
//             }
//             if (response.data.code >= 2000 && response.data.code < 3000) {
//                 if (successHandler) {
//                     successHandler(response);
//                 }
//             }
//             var treated = treatCommonFault(response);
//             if (faultHandler) {
//                 faultHandler(treated, response);
//             }
//             if(response.data.code == 3007){
//                 $state.go("login");
//             }
//         }, function (error) {
//             MessageBox.toast(T.T("ErrorCode.GET"), 'error');
//             if (faultHandler) {
//                 faultHandler(true, error);
//             }
//         });
//     }, function (error) {
//         $log.error(error);
//         MessageBox.toast(T.T("ErrorCode.GET"), 'error');
//         if (faultHandler) {
//             faultHandler(true, error);
//         }
//     });
// },

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('OfferBS', function ($log, $q, HttpService, strformat) {
        return {

            getCurrentOfferAll: function () {
                var defer = $q.defer();
                HttpService.get(Api.offer.getCurrentOfferAll, {}, function (response) {
                    if(response.data.code == 2100){
                        response.data.result = [];
                    }
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getAll: function (page, count) {
                var defer = $q.defer();
                HttpService.get(Api.offer.getAll, {
                    page: page,
                    per_page: count
                }, function (response) {
                    defer.resolve({
                        data: response.data.result.cars,
                        total: response.data.result.total
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            /**
             *
             * @param param:object
             * "name": "NBA SHOW IN MIAMI",
             * "description": "",
             * "type": "1",
             * "dAddress": "Str kdjaji . sidj o US",
             * "dLat": "39.098763",
             * "dLng": "-109.0001001",
             * "dRadius": "12",
             * "aAddress": "Str kdid,No . oisid n,US",
             * "aLat": "39.09876",
             * "aLng": "-108.987765",
             * "aRadius": "12",
             * "distanceMin": "120",
             * "distanceMax": "12",
             * "costMin": "120",
             * "price": "12",
             * "tva": "2",
             * "RateCalcMethod": "1",
             * "durationMin": "1",
             * "durationMax": "120",
             * "drivers":"1,2,3",
             * "cars":"1,2,3",
             * "options":"1,2,3,4"，
             *
             * @returns {*}
             */
            addToCurrentUser: function (param) {
                var defer = $q.defer();
                var sendData = {
                    name: param.name,
                    description: param.description,
                    type: param.type,
                    d_address: param.dAddress,
                    d_is_port:param.dIsPort,
                    d_port_price:param.dPortPrice,
                    d_lat: param.dLat,
                    d_lng: param.dLng,
                    d_radius: param.dRadius,
                    a_address: param.aAddress,
                    a_is_port:param.aIsPort,
                    a_port_price:param.aPortPrice,
                    a_lat: param.aLat,
                    a_lng: param.aLng,
                    a_radius: param.aRadius,
                    cost_min: param.costMin,
                    prices: JSON.stringify(param.prices),
                    tva: param.tva,
                    drivers: param.drivers,
                    cars: param.cars,
                    options: param.options,
                    calendar: param.calendar
                };
                $log.debug(JSON.stringify(sendData));
                HttpService.post(Api.offer.addToCurrentOffer, {
                    param: JSON.stringify(sendData)
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            routineConversionsFromLocToISO: function (routine) {
                var defaultDayRoutine = "111111111111111111111111111111111111111111111111";
                var finalWeekRoutine = '';
                angular.forEach(routine, function (item) {
                    if (!item.work) {
                        finalWeekRoutine += defaultDayRoutine;
                    } else {
                        var start_index = item.start * 2;
                        var end_index = item.end * 2;
                        var startString = defaultDayRoutine.substring(0, start_index);
                        var endString = defaultDayRoutine.substring(end_index);
                        var middleString = defaultDayRoutine.substring(start_index, end_index);
                        middleString = middleString.replace(/1/g, '0');

                        finalWeekRoutine += startString + middleString + endString;
                    }
                });
                //获取时区
                var timeZone = (new Date().getTimezoneOffset() / 60) * (-1) * 2;
                var locRoutineDataString = "";
                if (timeZone > 0) {
                    var tempStart = finalWeekRoutine.substring(timeZone);
                    var tempSpell = finalWeekRoutine.substring(0, timeZone);
                    locRoutineDataString = tempStart + tempSpell;
                } else if (timeZone < 0) {
                    var tempStart = finalWeekRoutine.substr(timeZone);
                    locRoutineDataString = tempStart + finalWeekRoutine;
                } else {
                    locRoutineDataString = finalWeekRoutine;
                }
                //locRoutineDataString 转locRoutineData 数组
                var locRoutineData = undefined;
                for (var i = 0; i < 7; i++) {
                    if (locRoutineData == undefined) {
                        locRoutineData = new Array(locRoutineDataString.substring(i * 48, (i + 1) * 48) + "");
                    } else {
                        locRoutineData.push(locRoutineDataString.substring(i * 48, (i + 1) * 48) + "");

                    }
                }
                return locRoutineData;
            },

            /**
             *
             * @param param:object
             * "id": 23
             * "name": "NBA SHOW IN MIAMI",
             * "description": "",
             * "type": "1",
             * "dAddress": "Str kdjaji . sidj o US",
             * "dLat": "39.098763",
             * "dLng": "-109.0001001",
             * "dRadius": "12",
             * "aAddress": "Str kdid,No . oisid n,US",
             * "aLat": "39.09876",
             * "aLng": "-108.987765",
             * "aRadius": "12",
             * "distanceMin": "120",
             * "distanceMax": "12",
             * "costMin": "120",
             * "price": "12",
             * "tva": "2",
             * "RateCalcMethod": "1",
             * "durationMin": "1",
             * "durationMax": "120",
             * "drivers":"1,2,3",
             * "cars":"1,2,3",
             * "options":"1,2,3,4"，
             *
             * @returns {*}
             */
            updateToCurrentUser: function (param) {
                var defer = $q.defer();
                var sendData = {
                    id: param.id,
                    name: param.name,
                    description: param.description,
                    type: param.type,
                    d_address: param.dAddress,
                    d_is_port: param.dIsPort,
                    d_port_price: param.dPortPrice,
                    d_lat: param.dLat,
                    d_lng: param.dLng,
                    d_radius: param.dRadius,
                    a_address: param.aAddress,
                    a_is_port: param.aIsPort,
                    a_port_price: param.aPortPrice,
                    a_lat: param.aLat,
                    a_lng: param.aLng,
                    a_radius: param.aRadius,
                    cost_min: param.costMin,
                    prices: JSON.stringify(param.prices),
                    tva: param.tva,
                    drivers: param.drivers,
                    cars: param.cars,
                    options: param.options,
                    calendar: param.calendar
                };
                HttpService.patch(strformat(Api.offer.updateToCurrentOffer, param.id), {
                    param: JSON.stringify(sendData)
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            deleteFromCurrentUser: function (offerId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.offer.deleteFromCurrentOffer, offerId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getDetailFromCurrentUser: function (offerId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.offer.getDetailFromCurrentUser, offerId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('OptionBS', function ($q, HttpService,strformat) {
        return {
            getCurrentOptionAll: function () {
                var defer = $q.defer();

                HttpService.get(Api.option.currentOptionAll, {}, function (response) {
                    if(response.data.code == 2100){
                        response.data.result = [];
                    }
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            addCurrentOption: function (param) {
                var defer = $q.defer();

                HttpService.post(Api.option.currentOptionAll, {param:param}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            deleteFromCurrentOption: function (optionId) {
                var defer = $q.defer();

                HttpService.delete(strformat(Api.option.deleteFromCurrentUserOption,optionId ), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },updateFromCurrentOption: function (id,param) {
                var defer = $q.defer();

                HttpService.patch(strformat(Api.option.updateFromCurrentOption,id), {param:param}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            },
            getAll: function (page, count) {
                var defer = $q.defer();

                HttpService.get(Api.option.getAll, {
                    page: page,
                    per_page: count
                }, function (response) {
                    defer.resolve({
                        data: response.data.result.cars,
                        total:response.data.result.total,
                    });
                }, function (treated, response) {
                    defer.reject({treated : treated, response : response});
                });

                return defer.promise;
            }
        }
    });


/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('OrderBS', function ($q, HttpService,$filter, AddressTool) {
        return {
            getActiveOrder: function (dateType, searchDate) {
                var defer = $q.defer();
                HttpService.get(Api.order.getActiveOrder, {}, function (response)
                {
                    defer.resolve({data: response.data.result});
                }, function (treated, response)
                {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            },

            getHomeOrders: function () {
                var defer = $q.defer();
                var day = new Date($filter('date')(new Date(), "longDate"));
                var requestParams = {
                    "start_time": parseInt(day.getTime() / 1000),
                    "end_time": parseInt(day.getTime() / 1000 + 24 * 60 * 60)
                };
                HttpService.get(Api.order.getActiveOrder, requestParams, function (response)
                {
                    angular.forEach(response.data.result, function (order) {
                        if (order.d_address) {
                            if(order.d_address.indexOf('formatted_address') > 0){
                                order.d_address = JSON.parse(order.d_address);
                            }
                            order.d_final_address = AddressTool.finalAddress(order.d_address);
                        }
                        if (order.a_address) {
                            if(order.a_address.indexOf('formatted_address') > 0){
                                order.a_address = JSON.parse(order.a_address);
                            }
                            order.a_final_address = AddressTool.finalAddress(order.a_address);
                        }
                    });
                    defer.resolve(response.data);
                }, function (treated, response)
                {
                    defer.reject({treated : treated, response : response});
                });
                return defer.promise;
            }
        }
    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('PaymentBS', function ($q, HttpService, strformat) {
        return {

            getCompanyPaymentList: function () {
                var defer = $q.defer();
                HttpService.get(Api.payment.getFromCurrentCompany, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            deleteFromCurrentCompany: function (id) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.payment.deleteFromCurrentCompany, id), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            activeFromCurrentCompany: function (id) {
                var defer = $q.defer();
                HttpService.put(strformat(Api.payment.activeFromCurrentCompany, id), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getCardByClient: function (id) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.payment.getCardByClient, id), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addCardByClient: function (id, params) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.payment.addCardByClient, id), params, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            deleteCardByClient: function (id, number) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.payment.deleteCardByClient, id, number), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }
        }

    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('StatisticsBS', function ($q, HttpService) {
        return {

            statistics: function (selectDate, type) {
                //如果是日,则取当日的23:59:59
                //如果是周,则取周末的23:59:59
                //如果是月,则取月末的23:59:59
                var date = angular.copy(selectDate);
                var timeStamp = '';
                if (type == 0) {
                    date.setDate(date.getDate() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else if (type == 1) {
                    if (date.getDay() == 0) {
                        date.setDate(date.getDate() + 1);
                    } else {
                        date.setDate(date.getDate() + 7 - date.getDay() + 1);
                    }
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else {
                    date.setDate(1);
                    date.setMonth(date.getMonth() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                }
                var defer = $q.defer();
                HttpService.get(Api.order.statistics, {
                    timestamp: timeStamp,
                    type: type,
                    count: 3
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            saleStatistics: function (selectDate, type) {
                //如果是日,则取当日的23:59:59
                //如果是周,则取周末的23:59:59
                //如果是月,则取月末的23:59:59
                var date = angular.copy(selectDate);
                var timeStamp = '';
                if (type == 0) {
                    date.setDate(date.getDate() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else if (type == 1) {
                    if (date.getDay() == 0) {
                        date.setDate(date.getDate() + 1);
                    } else {
                        date.setDate(date.getDate() + 7 - date.getDay() + 1);
                    }
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else {
                    date.setDate(1);
                    date.setMonth(date.getMonth() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                }
                var defer = $q.defer();
                HttpService.get(Api.salesRep.getCompaniesState, {
                    timestamp: timeStamp,
                    type: type,
                    count: 3
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            }
        }

    });
'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Services')
    .factory('SuperCarBS', function ($log, $q, HttpService, strformat) {
        return {

            loadCarModelsOnPlatform: function () {
                var defer = $q.defer();
                HttpService.get(Api.super.carModelsOnPlatform, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            loadCarCategoriesOnPlatform: function () {
                var defer = $q.defer();
                HttpService.get(Api.super.carCategoriesOnPlatform, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addCarCategoriesOnPlatform: function (CategoryName, CategoryDescribe) {
                var defer = $q.defer();
                HttpService.post(Api.super.carCategoriesOnPlatform, {
                    name: CategoryName,
                    desc: CategoryDescribe
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            modifyCategories: function (CategoryName, CategoryDescribe, CategoryId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.super.modifyCategories, CategoryId), {
                    name: CategoryName,
                    desc: CategoryDescribe
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            loadCarBrandsOnPlatform: function () {
                var defer = $q.defer();
                HttpService.get(Api.super.carBrandsOnPlatform, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addCarBrandsOnPlatform: function (name) {
                var defer = $q.defer();
                HttpService.post(Api.super.carBrandsOnPlatform, {
                    name: name
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            editCarBrandsOnPlatform: function (id, name) {
                var defer = $q.defer();
                HttpService.patch(Api.super.carBrandsOnPlatform + "/" + id, {
                    name: name
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            addCarModelOnPlatform: function (brandId, categoryId, maxBags, maxSeats, modelName) {
                var defer = $q.defer();
                HttpService.post(Api.super.carModelsOnPlatform, {
                    brand_id: brandId,
                    category_id: categoryId,
                    max_bags: maxBags,
                    max_seats: maxSeats,
                    model_name: modelName
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            saveCarModelOnPlatform: function (modelId, brandId, categoryId, maxBags, maxSeats, modelName) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.super.carModelIdOnPlatform, modelId), {
                    brand_id: brandId,
                    category_id: categoryId,
                    max_bags: maxBags,
                    max_seats: maxSeats,
                    model_name: modelName
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            addCarModelImage: function (carModelId, file) {
                var defer = $q.defer();
                HttpService.uploadParamsAndData(strformat(Api.super.carModelsImageOnPlatform, carModelId), {},
                    {car_model_img: file}, function (response) {
                        defer.resolve({
                            data: response.data.result
                        });
                    }, function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    });

                return defer.promise;
            },

            replaceCarModelImage: function (imageId, file) {
                var defer = $q.defer();
                HttpService.uploadParamsAndData(strformat(Api.super.carModelsImageIdOnPlatform, imageId), {},
                    {car_model_img: file}, function (response) {
                        defer.resolve({
                            data: response.data.result
                        });
                    }, function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    });

                return defer.promise;
            }
        }

    });

'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('KARL.Services')
    .factory('SuperRateBS', function ($log, $q, HttpService, strformat) {
        return {

            getRateRules: function () {
                var defer = $q.defer();
                HttpService.get(Api.super.rateRules, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            updateRateRules: function (rate) {
                var defer = $q.defer();
                HttpService.patch(Api.super.rateRules, {rules: rate}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            }
        }

    });

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('TransactionBS', function ($q, HttpService, strformat) {
        return {

            getTransactions: function (startTime, endTime, page, perPage, keyword, filter, archive) {
                var defer = $q.defer();
                var params = {
                    start_time: (new Date(startTime).valueOf() + "").substr(0, 10),
                    end_time: (new Date(endTime).valueOf() + "").substr(0, 10),
                    page: page,
                    per_page: perPage,
                    filter: filter,
                    archive: archive
                };
                if (keyword) {
                    params.search = keyword;
                }
                HttpService.get(Api.transaction.getTransaction, params, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getInvoiceInfo: function (bookingId) {
                var defer = $q.defer();
                var params = {};
                HttpService.get(strformat(Api.transaction.getInvoiceDetail, bookingId), params, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getTransactionsBills: function (startTime, endTime, page, perPage) {
                var defer = $q.defer();
                var params = {
                    start_time: (new Date(startTime).valueOf() + "").substr(0, 10),
                    end_time: (new Date(endTime).valueOf() + "").substr(0, 10),
                    page: page,
                    per_page: perPage
                };
                HttpService.get(Api.transaction.getTransactionBill, params, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            sendInvoiceEmail: function (bookingId, email) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.transaction.sendInvoiceEmail, bookingId), {
                    email: email
                }, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            editArchive: function (bookingId, archiveId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.transaction.editArchive, bookingId), {
                    archive: archiveId
                }, function (response) {
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }
        }

    });
/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('UserBS', function ($log, $q, HttpService, UserCacheBS, strformat) {
        return {

            login: function (username, password) {
                var defer = $q.defer();
                HttpService.post(Api.user.login, {username: username, password: password}, function (response) {
                    // 登录成功保存用户数据
                    if (response.data.result.admin && response.data.result.admin.expire_time) {
                        response.data.result.admin.location = response.data.result.location
                    }
                    UserCacheBS.cache(response.data.result);
                    defer.resolve({data: response.data.result});
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateCurrentUser: function (param) {
                var defer = $q.defer();
                HttpService.patch(Api.admin.updateAdmin, {
                    param: param
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            changeAvatarToCurrentUser: function (file) {
                var defer = $q.defer();

                HttpService.upload(Api.admin.changeAvatar, {
                    avatar: file
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            logout: function () {
                var defer = $q.defer();

                HttpService.post(Api.user.logout, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            changePassword: function (oldPwd, newPwd) {
                var defer = $q.defer();
                HttpService.post(Api.admin.changePassword, {
                    old_pwd: oldPwd,
                    new_pwd: newPwd
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            forgotPassword: function (email) {
                var defer = $q.defer();
                HttpService.post(Api.admin.forgotPassword, {
                    email: email
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            updateAdminWebToken: function (token) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.admin.pushWebToken, token), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateSalesRep: function (param) {
                var defer = $q.defer();
                HttpService.patch(Api.salesRep.updateSalesRep, {
                    param: param
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateSalesAssistant: function (param) {
                var defer = $q.defer();
                HttpService.patch(Api.salesAssistant.updateSalesAssistant, {
                    param: param
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }

        }
    });