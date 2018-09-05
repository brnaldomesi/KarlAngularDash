/**
 * Created by wangyaunzhi on 16/9/19.
 */
angular.module('KARL.Directives')
    .directive('karlHeaderMenu', function ($rootScope, $state, $log, $uibModal, MessageBox, UserCacheBS, UserBS, T, $translate) {
        var MenuPermission = {
            superAdmin: {
                home: false,
                book: false,
                calendar: false,
                vehicles: false,
                drivers: false,
                option: false,
                stats: false,
                clients: false,
                affiliate: false,
                rates: false,
                finance: false,
                coupon: false,
                companies: true,
                carModel: true,
                profile: false,
                vehicleCategory: true,
                vehicleMaker: true,
                vehicleModel: true,
                superStats: true,
                superRate: true,
                setting: false,
                SalesRep: true,
                superSalesAssistant:true,
                salesRepHome: false,
                salesRepTotals: false,
                salesRepCompanies: false,
                salesAssistantHome:false,
                salesAssistantCompanies:false,
                superGodView:true
            },
            admin: {
                home: true,
                book: true,
                calendar: true,
                vehicles: true,
                drivers: true,
                option: true,
                stats: true,
                clients: true,
                affiliate: true,
                rates: true,
                finance: true,
                coupon: true,
                companies: false,
                carModel: false,
                profile: true,
                vehicleCategory: false,
                vehicleMaker: false,
                vehicleModel: false,
                superStats: false,
                setting: true,
                SalesRep: false,
                salesRepHome: false,
                salesRepTotals: false,
                salesRepCompanies: false,
                salesAssistantHome:false,
                salesAssistantCompanies:false,
                superGodView:false
            },

            salesRep: {
                home: false,
                book: false,
                calendar: false,
                vehicles: false,
                drivers: false,
                option: false,
                stats: false,
                clients: false,
                affiliate: false,
                rates: false,
                finance: false,
                coupon: true,
                companies: false,
                carModel: false,
                profile: false,
                vehicleCategory: false,
                vehicleMaker: false,
                vehicleModel: false,
                superStats: false,
                setting: false,
                SalesRep: false,
                salesRepHome: true,
                salesRepTotals: true,
                salesRepCompanies: true,
                salesAssistantHome:false,
                salesAssistantCompanies:false,
                superGodView:false
            },


            salesAssistant: {
                home: false,
                book: false,
                calendar: false,
                vehicles: false,
                drivers: false,
                option: false,
                stats: false,
                clients: false,
                affiliate: false,
                rates: false,
                finance: false,
                coupon: true,
                companies: false,
                carModel: false,
                profile: false,
                vehicleCategory: false,
                vehicleMaker: false,
                vehicleModel: false,
                superStats: false,
                setting: false,
                SalesRep: false,
                salesRepHome: false,
                salesRepTotals: false,
                salesRepCompanies: false,
                salesAssistantHome:true,
                salesAssistantCompanies:true,
                superGodView:false
            }
        };

        // var viewTitle = {0:T.T('header_menu.h5home'),
        //                  1:T.T('header_menu.h5easy_book'),
        //                  2:T.T('header_menu.h5calendar'),
        //                  3:T.T('comment.h5vehicles'),
        //                  4:T.T('comment.h5drivers'),
        //                  5:T.T('comment.h5add-Ons'),
        //                  6:T.T('header_menu.h5stats'),
        //                  7:T.T('comment.h5client'),
        //                  8:T.T('header_menu.h5affiliate_network'),
        //                  9:T.T('header_menu.h5rates'),
        //                  10:T.T('header_menu.h5finance'),
        //                  11:T.T('header_menu.h5companies'),
        //                  12:T.T('header_menu.h5car_model'),
        //                  13:T.T('header_menu.h5profile'),
        //                  14:T.T('header_menu.h5vehicle_category'),
        //                  15:T.T('header_menu.h5vehicle_maker'),
        //                  16:T.T('header_menu.h5vehicle_model'),
        //                  17:T.T('header_menu.h5super_stats' ),
        //                  18:T.T('header_menu.h5Setting')
        // };
        return {
            restrict: 'E',
            templateUrl: 'templates/dashboard/header-menu.html',
            link: function (scope, element, attrs) {
                if (!$rootScope.loginUser) {
                    $state.go('login');
                    return;
                }

                if (!$rootScope.menuState || $rootScope.menuState == 0) {
                    //关闭(默认)
                    $(element).parent().addClass('app-aside-folded');
                } else {
                    //打开
                    $(element).parent().removeClass('app-aside-folded');
                }

                scope.setMenuState = function () {
                    if (!$rootScope.menuState || $rootScope.menuState == 0) {
                        //设置为打开状态
                        $rootScope.menuState = 1;
                    } else {
                        ////设置为关闭状态
                        $rootScope.menuState = 0;
                    }
                };
                scope.viewTitles = viewTitles;
                scope.activeIndex = attrs.activeIndex;
                // scope.title = viewTitle[scope.activeIndex];
                if ($rootScope.loginUser.superadmin) {
                    scope.menuPermission = MenuPermission.superAdmin;
                } else if ($rootScope.loginUser.admin) {
                    scope.menuPermission = MenuPermission.admin;
                } else if($rootScope.loginUser.sale){
                    scope.salesRepInfo = $rootScope.loginUser;
                    scope.menuPermission = MenuPermission.salesRep;
                }else {
                    scope.salesAssisInfo = $rootScope.loginUser;
                    scope.menuPermission = MenuPermission.salesAssistant;
                }

                scope.videoUrl = YoutobeUrls[scope.activeIndex] + "?autoplay=1";
                scope.openYoutubeVideo = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'templates/dashboard/youtube-video-model.html',
                        controller: 'YoutubeModelCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            $stateParams: {
                                data: {
                                    videoUrl: scope.videoUrl
                                },
                                event: {
                                    cancel: function () {
                                        modalInstance.dismiss();
                                    }
                                }
                            }
                        }
                    });
                };

                scope.logout = function () {
                    MessageBox.confirm(T.T('alertTitle.warning'), T.T('header_menu.jsLogout_info'), function (isConfirm) {
                        if (isConfirm) {
                            localStorage.removeItem('loginusername');
                            localStorage.removeItem('loginpassword');
                            sessionStorage.removeItem('password');
                            localStorage.setItem('rememberme', '0');
                            $rootScope.menuState = undefined;
                            MessageBox.showLoading();
                            UserBS.logout().then(function (result) {
                                UserCacheBS.cleanCache();
                                MessageBox.hideLoading();
                                MessageBox.toast(T.T('header_menu.jsLogout_success'), 'success');
                                $state.go("login");
                            }, function (error) {
                                MessageBox.hideLoading();
                                UserCacheBS.cleanCache();
                                MessageBox.toast(T.T('header_menu.jsLogout_success'), 'success');
                                // 哪怕登出调用失败, 也要跳到登录界面
                                $state.go("login");
                            });
                        }
                    })
                };

                var initLanguage = function () {
                    if (window.localStorage.lang) {
                        scope.cur_lang = window.localStorage.lang;
                    } else {
                        scope.cur_lang = navigator.language.toLocaleLowerCase();
                    }
                    if (scope.cur_lang == 'en' || scope.cur_lang == 'fr') {
                        $translate.use(scope.cur_lang);
                        // $translate.use('en');
                    } else {
                        scope.cur_lang = 'en';
                        $translate.use('en');
                    }
                };

                 function languageReload(atrs) {
                     window.localStorage.lang = atrs;
                     $translate.use(atrs);
                     window.location.reload();
                 }

                initLanguage();

                scope.switching = function (atr) {
                    atr = atr === 'en' ? 'fr' : "en";
                    $rootScope.loginUser.lang = atr;
                    // console.log($rootScope.loginUser);
                    var loginUser = {
                        lang: atr,
                        token: $rootScope.loginUser.token
                    };
                    if($rootScope.loginUser.admin.expire_time){
                        languageReload(atr);
                    } else if ($rootScope.loginUser.admin) {
                        MessageBox.showLoading();
                        UserBS.updateCurrentUser(JSON.stringify(loginUser)).then(function (result) {
                            MessageBox.hideLoading();
                            languageReload(atr)
                        }, function (error) {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        });
                    } else if ($rootScope.loginUser.sale) {
                        MessageBox.showLoading();
                        UserBS.updateSalesRep(JSON.stringify(loginUser)).then(function (result) {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        }, function (error) {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        });
                    } else if($rootScope.loginUser.asst){
                        MessageBox.showLoading();
                        UserBS.updateSalesAssistant(JSON.stringify(loginUser)).then(function (result) {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        },function () {
                            MessageBox.hideLoading();
                            languageReload(atr);
                        })
                    }else {
                        languageReload(atr);
                    }

                }
            }
        };
    });
