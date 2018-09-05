'use strict';

/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 11/26/15.
 */
angular.module('Widget.Directives', []);

/**
 * Created by jian on 17-6-7.
 */
angular.module('Widget.Directives')
.directive('faceBookPixel',function ($rootScope, $timeout) {
    return {
        restrict:'E',
        link:function (scope, element, attrs) {
            $timeout(function () {
                if(typeof fbq === 'undefined'){
                    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                        document,'script','https://connect.facebook.net/en_US/fbevents.js');
                    var fpkey=$rootScope.fasebookPixelId;
                    fbq('init', fpkey); // Insert your pixel ID here.
                    fbq('track', attrs.pixelPage);
                }else {
                    fbq('track', attrs.pixelPage);
                }

            }, 10)
        }
    }
})
/**
 * Created by wangyaunzhi on 16/12/17.
 */
angular.module('Widget.Directives')
    .directive('googleAnalytics', function ($rootScope, $timeout) {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    mixpanel.track('Iframe Widget Entry page', {'pageName': attrs.analyticsPage});
                    if ($rootScope.loginUser != null) {
                        mixpanel.identify($rootScope.loginUser.id);
                        mixpanel.people.set({
                            "first_name": $rootScope.loginUser.first_name,
                            "last_name": $rootScope.loginUser.last_name,
                            "email": $rootScope.loginUser.email,
                            "gender": ($rootScope.loginUser.gender == 2) ? 'female' : 'male'
                        });
                    }
                    (function (i, s, o, g, r, a, m) {
                        i['GoogleAnalyticsObject'] = r;
                        i[r] = i[r] || function () {
                                (i[r].q = i[r].q || []).push(arguments)
                            }, i[r].l = 1 * new Date();
                        a = s.createElement(o),
                            m = s.getElementsByTagName(o)[0];
                        a.async = 1;
                        a.src = g;
                        m.parentNode.insertBefore(a, m)
                    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
                    console.log($rootScope.trackingId);
                    var gaKey=$rootScope.trackingId;
                    ga('create', gaKey, 'auto');
                    ga('set', 'page', attrs.analyticsPage);
                    ga('send', 'pageview');
                }, 10);
            }
        };
    });