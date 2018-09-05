'use strict';

/* App Module */
angular.module('Flow', [
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
    'Flow.Controllers',
    'Flow.Services',
    'Flow.Directives'
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
        var lang=GetQueryString(location.href,'lang');
        if(!lang){
            lang = 'en';
        }
        if(lang!='en'&&lang!='fr'){
            lang ='en'
        }
        console.log(lang);
        window.localStorage.setItem('lang',lang);
        document.cookie='widgetLang='+lang;
        // console.log('lang is ', lang);
        // console.log(window.localStorage.lang);
        // if (window.localStorage.lang) {
        //     lang = window.localStorage.lang;
        // } else {
        //     lang = navigator.language.toLocaleLowerCase();
        // }
        // console.log('lang is ', lang);
        //todo
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
        $stateProvider
            .state('flow', {
                url: '/flow',
                templateUrl: 'templates/iframe/flow/flow.html',
                controller: 'FlowCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('flownew', {
                url: '/flownew',
                templateUrl: 'templates/iframe/flow/flow-step-1.html',
                controller: 'FlowStep1Ctrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('customer-register', {
                url: '/customer-register',
                templateUrl: 'templates/iframe/flow/customer-register.html',
                controller: 'CustomerRegisterCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('select-payment', {
                url: '/select-payment',
                templateUrl: 'templates/iframe/flow/select-payment.html',
                controller: 'selectPaymentCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('booked', {
                url: '/booked',
                templateUrl: 'templates/iframe/flow/booked.html',
                controller: 'bookedCtrl',
                params: {
                    data: {}
                }
            })
        ;
        $urlRouterProvider.otherwise("/flow");
    })
    .run(function ($rootScope) {
        // console.log(location.href);
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