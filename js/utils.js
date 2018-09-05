// 这里放常用的方法

var HttpUtils = {

    post: function ($http, url, params, successHandler, errorHandler) {
        $http.post(url, HttpUtils.obj2params(params),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                responseType: 'json',
                timeout: ApiServer.timeout
            }).then(successHandler, errorHandler);
    },

    get: function ($http, url, params, successHandler, errorHandler) {
        var handleUrl=HttpUtils.obj2params(params)?url + "?" + HttpUtils.obj2params(params):url;
        $http.get(handleUrl,
            {
                responseType: 'json',
                timeout: ApiServer.timeout
            }).then(successHandler, errorHandler);
    },

    delete: function ($http, url, params, successHandler, errorHandler) {
        $http.delete(url + "?" + HttpUtils.obj2params(params),
            { headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                responseType: 'json',
                timeout: ApiServer.timeout
            }).then(successHandler, errorHandler);
    },

    patch: function ($http, url, params, successHandler, errorHandler) {
        $http.patch(url, HttpUtils.obj2params(params),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                responseType: 'json',
                timeout: ApiServer.timeout
            }).then(successHandler, errorHandler);
    },

    put: function ($http, url, params, successHandler, errorHandler) {
        $http.put(url, HttpUtils.obj2params(params),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                responseType: 'json',
                timeout: ApiServer.timeout
            }).then(successHandler, errorHandler);
    },

    obj2params: function (obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    }
};
