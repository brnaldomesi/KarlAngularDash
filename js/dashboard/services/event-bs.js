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