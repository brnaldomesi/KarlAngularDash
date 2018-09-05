angular.module('Common.Filters')
    .filter('dateFormatter', function () {
        return function (date, format) {
            if (date === 'Select Date' || date === 'Date') {
                return
            }
            var lang = localStorage.getItem('lang');
            var formatStr;
            var formatDate = {
                "shortDate": {
                    "en": "MMM DD",
                    "fr": "DD MMM"
                },
                "weekMonthDay": {
                    "en": 'dddd,MMMM D',
                    "fr": 'dddd,D MMMM'
                },
                "eventDate": {
                    "en": "MMMM.D h:mm a",
                    "fr": "D.MMMM H:mm"
                },
                "langDate": {
                    "en": "LL",
                    "fr": "LL"
                },
                "langsDate": {
                    "en": "lll",
                    "fr": "lll"
                },
                "shortTime": {
                    "en": "LT",
                    "fr": "LT"
                },
                "shortHour": {
                    "en": "h A",
                    "fr": "H :00"
                },
                "shortMonth": {
                    "en": "MMM",
                    "fr": "MMM"
                },
                "statsDate": {
                    "en": "MMMM.DD,YYYY",
                    "fr": "DD.MMMM,YYYY"
                },
                "statsShortFirstDate": {
                    "en": "MMM DD",
                    "fr": "DD"
                },
                "statsShortLastDate": {
                    "en": "DD ,YYYY",
                    "fr": "DD MMM ,YYYY"
                },
                "statsLongLastDate": {
                    "en": "MMM DD ,YYYY",
                    "fr": "DD MMM,YYYY"
                },
                "longDates": {
                    "en": "l LT",
                    "fr": "l LT"
                }
            };
            if (format in formatDate) {
                formatStr = formatDate[format][lang];
            } else {
                formatStr = format
            }

            var d = moment(date);
            if (d.isValid()) {
                return moment(date).format(formatStr); //in absence of format parameter, return the relative time from the given date
            } else {
                return date;
            }
        }
    });
