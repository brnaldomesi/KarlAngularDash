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