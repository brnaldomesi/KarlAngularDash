/**
 * Created by wangyaunzhi on 16/12/17.
 */
angular.module('KARL.Directives')
    .directive('googleAnalytics', function ($rootScope) {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                mixpanel.track('DashBoard Entry Page', {'pageName': attrs.analyticsPage});
                if($rootScope.loginUser != null){
                    scope.userId = $rootScope.loginUser.id;
                    mixpanel.identify($rootScope.loginUser.id);
                    mixpanel.people.set({
                        "first_name": $rootScope.loginUser.first_name,
                        "last_name": $rootScope.loginUser.last_name,
                        "email": $rootScope.loginUser.email,
                        "gender":($rootScope.loginUser.gender == 2) ? 'female' : 'male'
                    });
                }else {
                    scope.userId = "";
                }

                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                ga('create', 'UA-89070126-1', 'auto');
                ga('set', 'page', attrs.analyticsPage);
                ga('send', 'pageview');
                ga('set', 'userId', scope.userId);
            }
        };
    });