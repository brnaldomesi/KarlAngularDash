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