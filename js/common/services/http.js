/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('Common.Services')
    .factory('HttpService', function ($state, $log, $http, Upload, MessageBox, UserCacheBS,T) {

        function treatCommonFault(response) {
            var treated = false;
            var errMsg = T.T("ErrorCode." + response.data.code);
            if (errMsg.indexOf('ErrorCode.')===-1) {
                MessageBox.toast(errMsg, 'error');
                treated = true;
            }
            return treated;
            // if (errMsg != null) {
            //     MessageBox.toast(errMsg, 'error');
            //     treated = true;
            // }
            // return treated;
        };

        return {
            post: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });

                    HttpUtils.post($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.POST"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.POST"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.POST"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            get: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        if (!params) {
                            params = {};
                        }
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    HttpUtils.get($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.GET"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            delete: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        if (!params) {
                            params = {};
                        }
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    HttpUtils.delete($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.DELETE"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.DELETE"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.DELETE"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            patch: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        if (!params) {
                            params = {};
                        }
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    HttpUtils.patch($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.PATCH"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.PATCH"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.PATCH"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            put: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        if (!params) {
                            params = {};
                        }
                        params.token = result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        if (!params) {
                            params = {};
                        }
                        params.token = customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    HttpUtils.put($http, url, params, function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.PUT"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.PUT"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.PUT"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            upload: function (url, params, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[4]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    if (!bNoUseToken && result.data) {
                        url = url + '?token=' + result.data.token;
                    }
                    if (bNoUseToken && customizeToken) {
                        url = url + '?token=' + customizeToken;
                    }
                    angular.forEach(params, function (key, value) {
                        if (angular.isObject(value)) {
                            params.key = JSON.stringify(value);
                        }
                    });
                    Upload.upload({
                        url: url,
                        data: params
                    }).then(function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.UPLOAD"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }
                    }, function (error) {
                        MessageBox.toast(T.T("ErrorCode.UPLOAD"), 'error');
                        if (faultHandler) {
                            faultHandler(true, error);
                        }
                    }, function (evt) {
                        //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
                }, function (error) {
                    $log.error(error);
                    MessageBox.toast(T.T("ErrorCode.UPLOAD"), 'error');
                    if (faultHandler) {
                        faultHandler(true, error);
                    }
                });
            },

            uploadParamsAndData: function (url, params, data, successHandler, faultHandler, bNoUseToken, customizeToken) {
                if (!arguments[5]) bNoUseToken = false;
                UserCacheBS.loadCache().then(function (result) {
                    var p = [];
                    for (var key in params) {
                        p.push(key + '=' + encodeURIComponent(params[key]));
                    }
                    p = p.join('&');
                    if (!bNoUseToken && result.data) {
                        url = url + '?token=' + result.data.token + '&' + p;
                    }
                    if (bNoUseToken && customizeToken) {
                        url = url + '?token=' + customizeToken + '&' + p;
                    }
                    angular.forEach(data, function (key, value) {
                        if (angular.isObject(value)) {
                            data.key = JSON.stringify(value);
                        }
                    });
                    Upload.upload({
                        url: url,
                        data: data
                    }).then(function (response) {
                        if (response.data == null || response.data.code == null || response.data.result == null) {
                            MessageBox.toast(T.T("ErrorCode.UPLOAD"), 'error');
                            if (faultHandler) {
                                faultHandler(true, response);
                            }
                        }
                        if (response.data.code >= 2000 && response.data.code < 3000) {
                            if (successHandler) {
                                successHandler(response);
                            }
                        }
                        var treated = treatCommonFault(response);
                        if (faultHandler) {
                            faultHandler(treated, response);
                        }
                        if(response.data.code == 3007){
                            $state.go("login");
                        }

                    }, function (error) {
                        if (faultHandler) {
                            faultHandler(error);
                        }
                        MessageBox.toast('Upload', 'error');
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    });
                }, function (error) {
                    $log.info(error);
                    if (faultHandler) {
                        faultHandler(error);
                    }
                });
            }
        }
    });

