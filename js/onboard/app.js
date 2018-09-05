'use strict';

/* App Module */
angular.module('OnBoard', [
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
    'OnBoard.Controllers',
    'OnBoard.Services',
    'angular-stripe'
])
    .config(function ($translateProvider) {
        // window.localStorage.lang = 'en';
        var lang;
        // console.log('lang is ',lang);
        // console.log(window.localStorage.lang);
        if(window.localStorage.lang){
            lang = window.localStorage.lang;
        }else {
            lang = navigator.language.toLocaleLowerCase();
        }
        console.log('lang is ',lang);
        //todo
        lang ='en';
        if(lang!='en'&&lang!='fr'){
            lang ='en'
        };
        $translateProvider.useStaticFilesLoader({
            prefix:'languages/',
            suffix:'.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['en','fr'], {
            'en_*': 'en',
            "fr_*": 'fr',
            '*': 'en'
        });
        $translateProvider.preferredLanguage(lang);
        $translateProvider.fallbackLanguage('en')
    })
    .config(function ($stateProvider, $urlRouterProvider,stripeProvider ,$locationProvider) {
        stripeProvider.setPublishableKey(StripeInfo.publish_key);
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'templates/onboard/home.html',
                controller: 'HomeCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('vehicle', {
                url: '/vehicle',
                templateUrl: 'templates/onboard/vehicle.html',
                controller: 'VehicleCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('vehicle-add', {
                url: '/vehicle-add',
                templateUrl: 'templates/onboard/vehicle-add.html',
                controller: 'VehicleAddCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('vehicle-edit', {
                url: '/vehicle-edit',
                templateUrl: 'templates/onboard/vehicle-edit.html',
                controller: 'VehicleEditCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('driver', {
                url: '/driver',
                templateUrl: 'templates/onboard/driver.html',
                controller: 'DriverCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('driver-add', {
                url: '/driver-add',
                templateUrl: 'templates/onboard/driver-add.html',
                controller: 'DriverAddCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('driver-edit', {
                url: '/driver-edit',
                templateUrl: 'templates/onboard/driver-edit.html',
                controller: 'DriverEditCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('finish', {
                url: '/finish',
                templateUrl: 'templates/onboard/finish.html',
                controller: 'FinishCtrl',
                params: {
                    data: {},
                    event: {}
                }
            });
        $urlRouterProvider.otherwise("/home");
        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });
    })
    .run(function ($rootScope) {
        $rootScope.$on('$stateChangeStart', function () {
            $(document.body).animate({'scrollTop':0},300);
        })
    });
