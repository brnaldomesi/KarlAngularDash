'use strict';

/**
 * Created by Alur on 2017-12-10.
 */

/* App Module */
angular.module('EasySignUp', [
    'ui.router',                // angular-ui-router
    'ui.bootstrap',             // angular-bootstrap
    'oitozero.ngSweetAlert',    // ngSweetAlert
    'cfp.loadingBar',           // angular-loading-bar
    'ngFileUpload',             // ng-file-upload
    'strformat',                // strformat
    'ui.calendar',              // angular-ui-calendar
    'rzModule',                 // angularjs-slider
    'pascalprecht.translate',   // angularjs-translater
    'Common.Controllers',
    'Common.Services',
    'Common.Filters',
    'EasySignUp.Controllers',
    'EasySignUp.Services'
])
    .config(function ($translateProvider) {
        var lang = 'en';
        if (window.localStorage.lang) {
            lang = window.localStorage.lang;
        } else {
            lang = navigator.language.toLocaleLowerCase();
        }
        lang = 'en';
        if (lang != 'en' && lang != 'fr') {
            lang = 'en'
        }
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
        $translateProvider.fallbackLanguage('en')
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'templates/easysignup/home.html',
                controller: 'HomeCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
            .state('finish', {
                url: '/finish',
                templateUrl: 'templates/easysignup/finish.html',
                controller: 'FinishCtrl',
                params: {
                    data: {},
                    event: {}
                }
            })
        $urlRouterProvider.otherwise("/home");
    })
    .run(function ($rootScope) {
        $rootScope.$on('$stateChangeStart', function () {
            $(document.body).animate({'scrollTop': 0}, 300);
        })
    });
