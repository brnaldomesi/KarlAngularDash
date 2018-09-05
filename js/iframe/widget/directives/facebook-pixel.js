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