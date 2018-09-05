/**
 * Created by wangyaunzhi on 16/12/1.
 */
angular.module('Common.Filters')
    .filter('TimeFormatFilter', function (T) {
        //入参time单位为分钟
        return function (time, isIframe) {
            if (!time) {
                return ""
            } else {
                time = Math.round(time);
                if (time <= 1) {
                    if (isIframe) {
                        return 1 + "Min";
                    } else {
                        return 1 + T.T('comment.jsMin');
                    }
                } else if (time > 1 && time <= 60) {
                    if (isIframe) {
                        return time + "Mins";
                    } else {
                        return time + T.T('comment.jsMins');
                    }

                } else {
                    if (time % 60 == 0) {
                        if (isIframe) {
                            return parseInt(time / 60) + ":00" + " Hrs";
                        } else {
                            return parseInt(time / 60) + ":00" + T.T('comment.jsHrs');
                        }
                    } else if (time % 60 > 0 && time % 60 < 10) {
                        if (isIframe) {
                            return parseInt(time / 60) + ":0" + time % 60 + " Hrs";
                        } else {
                            return parseInt(time / 60) + ":0" + time % 60 + T.T('comment.jsHrs');
                        }
                    } else {
                        if (isIframe) {
                            return parseInt(time / 60) + ":" + time % 60 + " Hrs";
                        } else {
                            return parseInt(time / 60) + ":" + time % 60 + T.T('comment.jsHrs');
                        }
                    }
                }
            }
        }
    });
