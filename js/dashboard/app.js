'use strict';

/* App Module */
angular.module('KARL', [
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
    'KARL.Controllers',
    'KARL.Filters',
    'KARL.Services',
    'KARL.Directives',
    'Encryption',
    '720kb.datepicker'
])
    .config(function ($translateProvider) {
        // window.localStorage.lang = 'en';
        var lang;
        if (window.localStorage.lang) {
            lang = window.localStorage.lang;
        } else {
            lang = navigator.language.toLocaleLowerCase();
        }

        //todo
        if (lang != 'en' && lang != 'fr') {
            lang = 'en'
        }
        window.localStorage.lang = lang;
        // lang='en';
        $translateProvider.useStaticFilesLoader({
            prefix: 'languages/',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['en', 'fr'], {
            'en_*': 'en',
            "fr_*": 'fr',
            '*': 'en'
        });
        $translateProvider.preferredLanguage(lang);
        $translateProvider.fallbackLanguage('en');
        if (lang == 'zh') {
            lang = 'zh-cn';
        }
        moment.locale(lang);
    })
    .config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|sms):/);
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/dashboard/login.html',
                controller: 'LoginCtrl'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'templates/dashboard/home.html',
                controller: 'HomeCtrl'
            })
            .state('calendar', {
                url: '/calendar',
                templateUrl: 'templates/dashboard/calendar.html',
                controller: 'CalendarCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('book', {
                url: '/book',
                templateUrl: 'templates/dashboard/book.html',
                controller: 'BookCtrl'
            })
            .state('stats', {
                url: '/stats',
                templateUrl: 'templates/dashboard/stats.html',
                controller: 'StatsCtrl'
            })
            .state('vehicles', {
                url: '/vehicles',
                templateUrl: 'templates/dashboard/vehicles.html',
                controller: 'VehiclesCtrl'
            })
            .state('vehicle-add', {
                url: '/vehicle-add',
                templateUrl: 'templates/dashboard/vehicle-add.html',
                controller: 'VehicleAddCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('vehicle-edit', {
                url: '/vehicle-edit',
                templateUrl: 'templates/dashboard/vehicle-edit.html',
                controller: 'VehicleEditCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/dashboard/profile.html',
                controller: 'ProfileCtrl',
                cache: false
            })
            .state('setting', {
                url: '/setting',
                templateUrl: 'templates/dashboard/setting.html',
                controller: 'SettingCtrl',
                cache: false
            })
            .state('clients', {
                url: '/clients',
                templateUrl: 'templates/dashboard/clients.html',
                controller: 'ClientsCtrl'
            })
            .state('option', {
                url: '/option',
                templateUrl: 'templates/dashboard/option.html',
                controller: 'OptionCtrl'
            })
            .state('client-add', {
                url: '/client-add',
                templateUrl: 'templates/dashboard/client-add.html',
                controller: 'ClientAddCtrl'
            })
            .state('rates', {
                url: '/rates',
                templateUrl: 'templates/dashboard/rates.html',
                controller: 'RatesCtrl'
            })
            .state('drivers', {
                url: '/drivers',
                templateUrl: 'templates/dashboard/drivers.html',
                controller: 'DriversCtrl'
            })
            .state('finance', {
                url: '/finance',
                templateUrl: 'templates/dashboard/finance.html',
                controller: 'FinanceCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('coupon', {
                url: '/coupon',
                templateUrl: 'templates/dashboard/coupons.html',
                controller: 'CouponsCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('companies', {
                url: '/companies',
                templateUrl: 'templates/dashboard/companies.html',
                controller: 'CompaniesCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('affiliate-network', {
                url: '/affiliate-network',
                templateUrl: 'templates/dashboard/affiliate-network.html',
                controller: 'AffiliateNetworkCtrl'
            })
            .state('vehicle-category', {
                url: '/vehicle-category',
                templateUrl: 'templates/dashboard/super-vehicle-category.html',
                controller: 'SuperVehicleCategoryCtrl'
            })
            .state('super-vehicle-maker', {
                url: '/super-vehicle-maker',
                templateUrl: 'templates/dashboard/super-vehicle-maker.html',
                controller: 'SuperVehicleMakerCtrl'
            })
            .state('super-rate-rule', {
                url: '/super-rate-rule',
                templateUrl: 'templates/dashboard/super-rate-rule.html',
                controller: 'SuperRateRuleCtrl'
            })
            .state('super-vehicle-model', {
                url: '/super-vehicle-model',
                templateUrl: 'templates/dashboard/super-vehicle-models.html',
                controller: 'SuperVehicleModelsCtrl'
            })
            .state('super-stats', {
                url: '/super-stats',
                templateUrl: 'templates/dashboard/super-stats.html',
                controller: 'superStatsCtrl'
            })
            .state('sales-rep', {
                url: '/sales-rep',
                templateUrl: 'templates/dashboard/sales-rep.html',
                controller: 'salesRepCtrl'
            })
            .state('sales-assistant', {
                url: '/sales-assistant',
                templateUrl: 'templates/dashboard/sales-assistant.html',
                controller: 'salesAssistantCtrl'
            })
            .state('sales-rep-home', {
                url: '/sales-rep-home',
                templateUrl: 'templates/dashboard/sales-rep-home.html',
                controller: 'salesRapHomeCtrl'
            })
            .state('sales-rep-totals', {
                url: '/sales-rep-totals',
                templateUrl: 'templates/dashboard/sales-rep-totals.html',
                controller: 'SalesRapTotalsCtrl'
            })
            .state('sales-rep-companies', {
                url: '/sales-rep-companies',
                templateUrl: 'templates/dashboard/sales-rep-companies.html',
                controller: 'salesRapCompaniesCtrl'
            })

            .state('sales-assistant-home', {
                url: '/sales-assistant-home',
                templateUrl: 'templates/dashboard/sales-assistant-home.html',
                controller: 'salesAssistantHomeCtrl'
            })

            .state('sales-assistant-companies', {
                url: '/sales-assistant-companies',
                templateUrl: 'templates/dashboard/sales-assistant-companies.html',
                controller: 'salesAssistantCompaniesCtrl'
            })

            .state('super-god-view', {
                url: '/super-god-view',
                templateUrl: 'templates/dashboard/super-god-view.html',
                controller: 'superGodViewCtrl'
            })

        ;
        $urlRouterProvider.otherwise("/login");
    })
    .run(function (UserCacheBS, LocationService) {
        UserCacheBS.loadCache();
        LocationService.getCurrentPosition();
    });
