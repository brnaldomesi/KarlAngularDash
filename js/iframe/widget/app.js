'use strict';

/* App Module */
angular.module('Widget', [
    'ui.router',                // angular-ui-router
    'ui.bootstrap',             // angular-bootstrap
    'oitozero.ngSweetAlert',    // ngSweetAlert
    'cfp.loadingBar',           // angular-loading-bar
    'ngFileUpload',             // ng-file-upload
    'strformat',                // strformat
    'ui.calendar',              // angular-ui-calendar
    'rzModule',                 // angularjs-slider
    'pascalprecht.translate',                 // angularjs-translater
    'Common.Controllers',
    'Common.Services',
    'Common.Filters',
    'Widget.Controllers',
    'Widget.Services',
    'Widget.Directives'
])
    .config(function ($translateProvider) {
        var GetQueryString = function (url, name) {
            var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
            var matcher = pattern.exec(url);
            var items = null;
            if (null != matcher) {
                try {
                    items = decodeURIComponent(decodeURIComponent(matcher[1]));
                } catch (e) {
                    try {
                        items = decodeURIComponent(matcher[1]);
                    } catch (e) {
                        items = matcher[1];
                    }
                }
            }
            return items;
        };
        var lang = GetQueryString(location.href,'lang');
        console.log(lang);
        if(!lang){
            lang = 'en';
        }
        if(lang!='en'&&lang!='fr'){
            lang ='en'
        }
        console.log(lang);
        window.localStorage.setItem('lang',lang);
        // if (window.localStorage.lang) {
        //     lang = window.localStorage.lang;
        // } else {
        //     lang = navigator.language.toLocaleLowerCase();
        // }
        // console.log('lang is ', lang);
        $translateProvider.preferredLanguage(lang);
        $translateProvider.useStaticFilesLoader({
            prefix: 'js/iframe/languages/',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['en', 'fr'], {
            'en_*': 'en',
            "fr_*": 'fr',
            '*': 'en'
        });
        $translateProvider.fallbackLanguage('en')
        moment.locale(lang);
    })
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        var GetQueryString = function (url, name) {
            var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
            var matcher = pattern.exec(url);
            var items = null;
            if (null != matcher) {
                try {
                    items = decodeURIComponent(decodeURIComponent(matcher[1]));
                } catch (e) {
                    try {
                        items = decodeURIComponent(matcher[1]);
                    } catch (e) {
                        items = matcher[1];
                    }
                }
            }
            return items;
        };
        var widget_id = GetQueryString(location.href, "widget_id");
        if (!widget_id) {
            widget_id = 1;
        }
        $stateProvider
            .state('widget', {
                url: '/widget',
                templateUrl: 'templates/iframe/widget/widget_' + widget_id + '.html',
                controller: 'WidgetCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
        ;
        $urlRouterProvider.otherwise("/widget");
    })
    .run(function ($rootScope) {
        console.log(location.href);
        var GetQueryString = function (url, name) {
            var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
            var matcher = pattern.exec(url);
            var items = null;
            if (null != matcher) {
                try {
                    items = decodeURIComponent(decodeURIComponent(matcher[1]));
                } catch (e) {
                    try {
                        items = decodeURIComponent(matcher[1]);
                    } catch (e) {
                        items = matcher[1];
                    }
                }
            }
            return items;
        };
        var lang=GetQueryString(location.href,'lang');
        if(lang!='en'&&lang!='fr'){
            lang ='en'
        }
        $rootScope.lang=lang;
        if (ApiServer.env === "pub") {
            $rootScope.trackingId=GetQueryString(location.href,'gaKey');
            $rootScope.fasebookPixelId=GetQueryString(location.href,'fpkey');
            if(!$rootScope.trackingId){
                $rootScope.trackingId='UA-89070126-1';
            }
            if(!$rootScope.fasebookPixelId){
                $rootScope.fasebookPixelId='1426263484071503';
            }
        }
    });
