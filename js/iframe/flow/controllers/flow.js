/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('Flow.Controllers')
    .controller('FlowCtrl', function ($scope, $rootScope, $state, $stateParams, $http, $uibModal, $log, MessageBox, $timeout, FlowBS, MapTool, AddressTool,$filter) {
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

        //限制notes字数为999
        $("#easybook-notes-textarea").on("input propertychange", function () {
            var $this = $(this),
                _val = $this.val();
            if (_val.length > 999) {
                $this.val(_val.substring(0, 999));
            }
        });

        $scope.bookType = undefined;
        $scope.pickupTime = undefined;
        $scope.optionsPrice = 0;
        $scope.rsOptionsPrice = 0;
        $scope.amountOff = 0;
        $scope.percentOff = 0;
        $scope.showCoupon = false;

        $scope.langStyle=localStorage.getItem('lang');
        if($scope.langStyle==='fr'){
            $scope.iosAppImgLink='img/dashboard/iox-FR.png';
            $scope.androidAppImgLink='img/dashboard/google-FR.png'
        }else {
            $scope.iosAppImgLink='img/dashboard/download-on-the-app-store.png';
            $scope.androidAppImgLink='img/dashboard/google-play.png'
        }
        console.log($scope.langStyle);
        var cards;
        var loginUser;
        var company_id;
        var d_lat;
        var d_lng;
        var d_id;
        var a_lat;
        var a_lng;
        var a_id;
        var estimate_distance;
        var estimate_duration;
        var dair;
        var dflight;
        var dAirFs;
        var aair;
        var aflight;
        var aAirFs;
        var d_is_airport;
        var a_is_airport;
        if ($stateParams.data.params && !$stateParams.data.company_infor) {
            company_id = GetQueryString(location.href, "company_id");
            if (!company_id) {
                angular.element($("#stepTwo")).addClass("hidden");
                angular.element($("#stepThree")).addClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleTwo")).removeClass("active");
                angular.element($("#titleThree")).removeClass("active");
                return;
            }
            console.log($stateParams)
            $scope.bookType = $stateParams.data.params.type;
            $scope.pickupTime = new Date(parseInt($stateParams.data.params.appointed_time));
            $scope.pickupLocation = $stateParams.data.params.pickup;
            $scope.dropoffLocation = $stateParams.data.params.dropoff;
            $scope.estimate_time_show = $stateParams.data.params.estimate_duration;
            $scope.estimate_data = $stateParams.data.params.estimate_data;
            $scope.offers = $stateParams.data.offerData;
            $scope.dair = $stateParams.data.params.d_air;
            $scope.dflight = $stateParams.data.params.d_flight;
            dAirFs = $stateParams.data.params.d_airFs;
            d_is_airport = $stateParams.data.params.d_is_airport;
            $scope.aair = $stateParams.data.params.a_air;
            $scope.aflight = $stateParams.data.params.a_flight;
            aAirFs = $stateParams.data.params.a_flight;
            a_is_airport = $stateParams.data.params.a_is_airport;
            estimate_duration = $stateParams.data.params.estimate_duration;
            //存储widget父窗口的链接
            // localStorage.setItem('a4c_iframe_widget_parent_link', GetQueryString(location.href, "parentLink"));
            // $scope.companyInfor = {id: company_id, name: '', phone1: '', phone2: '', email: ''};
            //
            //公司信息
            // FlowBS.getCompanyInfor(company_id).then(function (result) {
            //     $scope.companyInfor = result.data;
            // }, function (error) {
            // });

        } else if ($stateParams.data && $stateParams.data.company_infor) {
            company_id = $stateParams.data.company_infor.id;
            if (!company_id) {
                angular.element($("#stepTwo")).addClass("hidden");
                angular.element($("#stepThree")).addClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleTwo")).removeClass("active");
                angular.element($("#titleThree")).removeClass("active");
                return;
            }
            $scope.bookType = $stateParams.data.params.bookType;
            $scope.pickupTime = new Date(parseInt($stateParams.data.params.appointed_time));
            cards = $stateParams.data.cards;
            loginUser = $stateParams.data.login_user;
            d_lat = $stateParams.data.params.pickupLocation.geometry.location.lat();
            d_lng = $stateParams.data.params.pickupLocation.geometry.location.lng();
            d_id = $stateParams.data.params.pickupLocation.place_id;
            $scope.dair = $stateParams.data.params.dair;
            $scope.dflight = $stateParams.data.params.dflight;
            d_is_airport = $stateParams.data.params.d_is_airport;
            if ($scope.bookType == 1) {
                //p2p
                a_lat = $stateParams.data.params.dropoffLocation.geometry.location.lat();
                a_lng = $stateParams.data.params.dropoffLocation.geometry.location.lng();
                a_id = $stateParams.data.params.dropoffLocation.place_id;
                $scope.aair = $stateParams.data.params.aair;
                $scope.aflight = $stateParams.data.params.aflight;
                estimate_distance = $stateParams.data.params.estimate_data.distance.value * 0.62 / 1000;
                estimate_duration = $stateParams.data.params.estimate_data.duration.value / 60;
                a_is_airport = $stateParams.data.params.a_is_airport;
            } else {
                //hourly
                estimate_duration = $stateParams.data.params.hours * 60;
                a_is_airport = 0;
            }

            //公司信息
            $scope.companyInfor = $stateParams.data.company_infor;
        } else {

            company_id = GetQueryString(location.href, "company_id");
            if (!company_id) {
                angular.element($("#stepTwo")).addClass("hidden");
                angular.element($("#stepThree")).addClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleTwo")).removeClass("active");
                angular.element($("#titleThree")).removeClass("active");
                return;
            }
            $scope.bookType = GetQueryString(location.href, "type");
            $scope.pickupTime = new Date(parseInt(GetQueryString(location.href, "appointed_time")));
            d_lat = GetQueryString(location.href, "d_lat");
            d_lng = GetQueryString(location.href, "d_lng");
            d_id = GetQueryString(location.href, "d_id");

            a_lat = GetQueryString(location.href, "a_lat");
            a_lng = GetQueryString(location.href, "a_lng");
            a_id = GetQueryString(location.href, "a_id");

            estimate_distance = GetQueryString(location.href, "estimate_distance");
            estimate_duration = GetQueryString(location.href, "estimate_duration");
            $scope.dair = GetQueryString(location.href, "d_air");
            $scope.dflight = GetQueryString(location.href, "d_flight");
            dAirFs = GetQueryString(location.href, "d_airFs");
            $scope.aair = GetQueryString(location.href, "a_air");
            $scope.aflight = GetQueryString(location.href, "a_flight");
            aAirFs = GetQueryString(location.href, "a_airFs");
            d_is_airport = GetQueryString(location.href, "d_is_airport");
            a_is_airport = GetQueryString(location.href, "a_is_airport");
            //存储widget父窗口的链接
            localStorage.setItem('a4c_iframe_widget_parent_link', GetQueryString(location.href, "parentLink"));

            $scope.companyInfor = {id: company_id, name: '', phone1: '', phone2: '', email: ''};

            //公司信息
            // FlowBS.getCompanyInfor(company_id).then(function (result) {
            //     $scope.companyInfor = result.data;
            // }, function (error) {
            // });
        }

        $rootScope.company_id = company_id;
        //公司LOGO
        $scope.companyImg = ApiServer.serverUrl + ApiServer.version + '/companies/logo/' + company_id;
        //公司APP
        $scope.getCompanyIosApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/ios';
        $scope.getCompanyGoogleApp = ApiServer.serverUrl + '/app/company/' + $rootScope.company_id + '/android';

        $scope.step = 2;

        $scope.maxBags = $scope.rsMaxBags = ['N/A'];
        $scope.selectedMaxBags = $scope.rsSelectedMaxBags = 'N/A';
        $scope.maxPassengers = $scope.rsMaxPassengers = ['N/A'];
        $scope.selectedMaxPassengers = $scope.rsSelectedMaxPassengers = 'N/A';
        $scope.passengers = $scope.rsPassengers = [];

        $scope.mouseoverover = function (cate) {
            if (!cate.isSelect) {
                cate.showSelect = true
            }
        };
        $scope.mouseleaveleave = function (cate) {
            if (cate.showSelect) {
                cate.showSelect = false
            }
        };

        $scope.onChangePassengerCount = function (isReturn) {
            if (isReturn) {
                $scope.rsPassengers = [];
                var count = 0;
                if ($scope.rsSelectedMaxPassengers == $scope.rsMaxPassengers[0]) {
                    count = 0;
                } else {
                    if ($scope.rsMaxPassengers.length > 6) {
                        if ($scope.rsSelectedMaxPassengers < $scope.rsMaxPassengers[6]) {
                            count = $scope.rsSelectedMaxPassengers;
                        } else {
                            count = 6;
                        }
                    } else {
                        count = $scope.rsSelectedMaxPassengers;
                    }
                }
                for (var i = 0; i < count; i++) {
                    $scope.rsPassengers.push({name: ''});
                }
            } else {
                $scope.passengers = [];
                var count = 0;
                if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                    count = 0;
                } else {
                    if ($scope.maxPassengers.length > 6) {
                        if ($scope.selectedMaxPassengers < $scope.maxPassengers[6]) {
                            count = $scope.selectedMaxPassengers;
                        } else {
                            count = 6;
                        }
                    } else {
                        count = $scope.selectedMaxPassengers;
                    }
                }
                for (var i = 0; i < count; i++) {
                    $scope.passengers.push({name: ''});
                }
            }
        };

        $scope.initBagCountAndPassengerCount = function (selectCar, isReturn) {
            if (isReturn) {
                $scope.rsMaxBags = ['N/A'];
                for (var i = 1; i < selectCar.bags_max + 1; i++) {
                    $scope.rsMaxBags.push(i);
                }
                $scope.rsSelectedMaxBags = 'N/A';

                $scope.rsMaxPassengers = ['N/A'];
                for (var i = 1; i < selectCar.seats_max + 1; i++) {
                    $scope.rsMaxPassengers.push(i);
                }
                $scope.rsSelectedMaxPassengers = 'N/A';

                $scope.rsPassengers = [];
            } else {
                $scope.maxBags = ['N/A'];
                for (var i = 1; i < selectCar.bags_max + 1; i++) {
                    $scope.maxBags.push(i);
                }
                $scope.selectedMaxBags = 'N/A';

                $scope.maxPassengers = ['N/A'];
                for (var i = 1; i < selectCar.seats_max + 1; i++) {
                    $scope.maxPassengers.push(i);
                }
                $scope.selectedMaxPassengers = 'N/A';

                $scope.passengers = [];
            }
        };

        var getMapMatrixDistance = function (originLat, originlng, destinationLat, destinationLng, sucessHandle, faultHandle) {
           console.log($scope.companyInfor);
            var origins = [{lat: originLat, lng: originlng}];
            var destinations = [{lat: destinationLat, lng: destinationLng}];
            var travelMode = "DRIVING";
            var distanceMatrixService = new google.maps.DistanceMatrixService;
            distanceMatrixService.getDistanceMatrix({
                origins: origins,
                destinations: destinations,
                travelMode: google.maps.TravelMode[travelMode],
                unitSystem: $scope.companyInfor.distance_unit==1?google.maps.UnitSystem.IMPERIAL:google.maps.UnitSystem.METRIC
            }, function (response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK) {
                    if (sucessHandle) {
                        sucessHandle(response);
                    }
                } else {
                    if (faultHandle) {
                        faultHandle(status);
                    }
                }
            });
        };

        var initOptions = function (options) {
            var formatOptions = {number: [], checkBox: [], radioGroup: [], checkBoxGroup: [], numberGroup: []};
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option.type == "NUMBER") {
                    option.count = 0;
                    if (option.add_max > 1) {
                        formatOptions.number.push(option);
                    } else {
                        formatOptions.checkBox.push(option);
                    }
                } else if (option.type == "CHECKBOX") {
                    option.count = 0;
                    formatOptions.checkBox.push(option);
                } else if (option.type == "GROUP") {
                    if (option.group == undefined || option.group.length == 0) {
                        continue;
                    }
                    for (var j = 0; j < option.group.length; j++) {
                        option.group[j].count = 0;
                    }
                    if (option.group[0].type == "NUMBER") {
                        formatOptions.numberGroup.push(option);
                    } else if (option.group[0].type == "RADIO") {
                        option.group.selectId = -1;
                        option.group.price = 0;
                        option.group.msg = "-";
                        formatOptions.radioGroup.push(option);
                    } else if (option.group[0].type == "CHECKBOX") {
                        formatOptions.checkBoxGroup.push(option);
                    }
                }
            }
            return formatOptions;
        };

        var initCarList = function (data) {
            var cars = [];
            //循环遍历offer
            for (var i = 0; i < data.length; i++) {
                //循环遍历offer 中的car_categories
                for (var k = 0; k < data[i].car_categories.length; k++) {
                    for (var j = 0; j < data[i].car_categories[k].cars.length; j++) {
                        data[i].car_categories[k].cars[j].isSelect = false;
                        var option = initOptions(data[i].options);
                        data[i].car_categories[k].cars[j].options = jQuery.extend(true, {}, option);
                        data[i].car_categories[k].cars[j].offer = data[i];

                        cars.push(data[i].car_categories[k].cars[j]);
                    }
                }
            }
            return cars;
        };

        var initVehicles = function (data) {
            $scope.cars = initCarList(data);
            // console.log($scope.cars);
            // for(var i=0;i<$scope.cars.length;i++){
            //     $scope.cars[i].showSelect=false
            // }
            $scope.selectedCar = 0;
            $scope.initBagCountAndPassengerCount($scope.cars[$scope.selectedCar], false);
            $scope.cars[0].isSelect = true;
            $scope.initRideOptions();
        };

        var initRsVehicles = function (data) {
            $scope.rscategories = initCarList(data);
            //优先匹配去程车辆
            //再匹配去程车系
            //再匹配去程车make
            //以上3者匹配不上,则匹配第1辆车
            var carIndex = 0;
            var findCar = false;
            var findModel = false;
            var findBrand = false;
            for (var i = 0; i < $scope.rscategories.length; i++) {
                var car = $scope.rscategories[i];
                if (car.car_id == $scope.cars[$scope.selectedCar].car_id) {
                    findCar = true;
                    carIndex = i;
                    break;
                }
                if (car.model == $scope.cars[$scope.selectedCar].model) {
                    if (findModel) {
                        continue;
                    } else {
                        findModel = true;
                        carIndex = i;
                    }
                }
                if (car.brand == $scope.cars[$scope.selectedCar].brand) {
                    if (findBrand) {
                        continue;
                    } else {
                        findBrand = true;
                        carIndex = i;
                    }
                }
                if (findCar) {
                    break;
                }
            }

            $scope.rscars = $scope.rscategories;
            $scope.rsselectedCar = carIndex;
            if (findCar) {
                $scope.rsMaxBags = $scope.maxBags;
                $scope.rsSelectedMaxBags = $scope.selectedMaxBags;
                $scope.rsMaxPassengers = $scope.maxPassengers;
                $scope.rsSelectedMaxPassengers = $scope.selectedMaxPassengers;
                $scope.rsPassengers = $scope.passengers;
            } else {
                $scope.initBagCountAndPassengerCount($scope.rscars[$scope.rsselectedCar], true);
            }
            $scope.rscars[$scope.rsselectedCar].isSelect = true;
            $scope.initRsRideOptions();

            if (document.body.clientWidth <= 768 && document.body.clientWidth > 414) {

                if ($scope.rscars.length > 2) {
                    $scope.reCarsPoint = true
                } else {
                    $scope.reCarsPoint = false
                }
            } else if (document.body.clientWidth > 768) {

                if ($scope.rscars.length > 3) {
                    $scope.reCarsPoint = true
                } else {
                    $scope.reCarsPoint = false
                }
            }

        };

        var rsDair;
        var rsDflight;
        var rsDairFs;
        var rsAair;
        var rsAflight;
        var rsAairFs;
        var rs_d_is_airport;
        var rs_a_is_airport;
        var initReturnService = function () {
            rsDair = $scope.aair;
            rsDflight = $scope.aflight;
            rsDairFs = aAirFs;
            rsAair = $scope.dair;
            rsAflight = $scope.dflight;
            rsAairFs = dAirFs;
            rs_d_is_airport = a_is_airport;
            rs_a_is_airport = d_is_airport;
            var time = new Date(Date.parse($scope.pickupTime) + 3 * 60 * 60 * 1000);
            $scope.rspickupTime = new Date(time);
        };

        $scope.goGetCar = function (index, cate) {
            cate.showSelect = false;
            if ($scope.selectedCar == index) {
                return;
            }
            for (var i = 0; i < $scope.cars.length; i++) {
                if (index === i) {
                    $scope.cars[i].isSelect = true;
                    $scope.selectedCar = index;
                    $scope.showCoupon = $scope.cars[i].company_id == company_id;
                } else {
                    $scope.cars[i].isSelect = false
                }
            }
            $scope.initBagCountAndPassengerCount($scope.cars[$scope.selectedCar], false);
            $scope.initRideOptions();
        };

        $scope.goGetReCar = function (index, cate) {
            cate.showSelect = false;
            if ($scope.rsselectedCar == index) {
                return;
            }
            for (var i = 0; i < $scope.rscars.length; i++) {
                if (index === i) {
                    $scope.rscars[i].isSelect = true;
                    $scope.rsselectedCar = index;
                } else {
                    $scope.rscars[i].isSelect = false
                }
            }
            $scope.initBagCountAndPassengerCount($scope.rscars[$scope.rsselectedCar], true);
            $scope.initRsRideOptions()
        };

        $scope.initRideOptions = function () {
            var car = $scope.cars[$scope.selectedCar];
            $scope.options = car.options;
            $scope.offer = car.offer;
            $scope.calcPrice();
            if ($scope.offer.company_id == $rootScope.company_id) {
                $scope.showCoupon = true;
            }
            console.log($scope.showCoupon);
        };

        $scope.initRsRideOptions = function () {
            var car = $scope.rscars[$scope.rsselectedCar];
            $scope.rsoptions = car.options;
            $scope.rsoffer = car.offer;
            console.log($scope.rsoffer);
            $scope.rscalcPrice();
        };

        // var onPickUpSearchSelect = function (lat, lng) {
        //     MapTool.geocoderAddress(lat, lng, function (result) {
        //         $timeout(function () {
        //             $scope.pickupLocation = result;
        //             $scope.pickupLocation.d_final_address = AddressTool.finalAddress($scope.pickupLocation);
        //         }, 0);
        //     }, function (error) {
        //     });
        // };
        //
        // var onDropOffSearchSelect = function (lat, lng) {
        //     MapTool.geocoderAddress(lat, lng, function (result) {
        //         $timeout(function () {
        //             $scope.dropoffLocation = result;
        //             $scope.dropoffLocation.a_final_address = AddressTool.finalAddress($scope.dropoffLocation);
        //         }, 0);
        //     }, function (error) {
        //     });
        // };


        var onPickUpSearchSelect = function (placeId) {
            var placeService = new google.maps.places.PlacesService(document.createElement('div'));
            placeService.getDetails({
                placeId: placeId
            }, function (result, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(result);
                    $timeout(function () {
                        $scope.pickupLocation = result;
                        $scope.pickupLocation.d_final_address = AddressTool.finalAddress($scope.pickupLocation);
                    }, 0);
                }
            });
        };

        var onDropOffSearchSelect = function (placeId) {
            var placeService = new google.maps.places.PlacesService(document.createElement('div'));
            placeService.getDetails({
                placeId: placeId
            }, function (result, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(result);
                    $timeout(function () {
                        $scope.dropoffLocation = result;
                        $scope.dropoffLocation.a_final_address = AddressTool.finalAddress($scope.dropoffLocation);
                    }, 0);
                }
            });
        };

        $scope.init = function () {
            localStorage.setItem('distanceunit',$scope.companyInfor.distance_unit);
            if ($stateParams.data.params && !$stateParams.data.company_infor) {
                initVehicles($scope.offers);
                onPickUpSearchSelect($scope.pickupLocation.place_id);
                if ($scope.bookType == 1) {
                    initReturnService();
                    onDropOffSearchSelect($scope.dropoffLocation.place_id);
                }
            } else {
                if ($scope.bookType == 1) {
                    onPickUpSearchSelect(d_id);
                    onDropOffSearchSelect(a_id);

                    var directionsService = new google.maps.DirectionsService;
                    MapTool.calculateAndDisplayRoute(
                        directionsService,
                        {placeId: d_id},
                        {placeId: a_id},
                        (new Date($scope.pickupTime).valueOf() + "").substr(0, 10),
                        function (response, status) {
                            console.log("response is ", response);
                            if (status === google.maps.DirectionsStatus.OK) {
                                    $scope.estimate_data = response.routes[0].legs[0];
                                    $scope.estimate_time_show = estimate_duration;

                                MessageBox.showLoading();
                                FlowBS.getOffer(company_id,
                                    $scope.bookType,
                                    d_lat,
                                    d_lng,
                                    a_lat,
                                    a_lng,
                                    estimate_distance,
                                    estimate_duration,
                                    $scope.pickupTime,
                                    d_is_airport,
                                    a_is_airport,
                                    2
                                ).then(function (result) {
                                    $scope.offers = result.data;
                                    initVehicles($scope.offers);
                                    initReturnService();
                                    MessageBox.hideLoading();
                                }, function (error) {
                                    MessageBox.hideLoading();
                                    if (error.treated) {
                                    } else {
                                        if (error.response.data.code == "3808") {
                                            MessageBox.toast($filter('translate')('flow.jsNo_offers'), 'error');
                                        } else if (error.response.data.code == "3809") {
                                            MessageBox.toast($filter('translate')('flow.jsNo_vehicles'), 'error');
                                        } else if (error.response.data.code == "3810") {
                                            MessageBox.toast($filter('translate')('flow.jsNo_drivers'), 'error');
                                        } else {
                                            MessageBox.toast($filter('translate')('flow.jsNo_offers'), 'error');
                                        }
                                    }
                                });

                            }
                        }
                    );
                } else if ($scope.bookType == 2) {
                    onPickUpSearchSelect(d_id);
                    $scope.estimate_time_show = estimate_duration;
                    MessageBox.showLoading();
                    FlowBS.getOffer(
                        company_id,
                        $scope.bookType,
                        d_lat,
                        d_lng,
                        a_lat,
                        a_lng,
                        estimate_distance,
                        estimate_duration,
                        $scope.pickupTime,
                        d_is_airport,
                        0,
                        2
                    ).then(function (result) {
                        $scope.offers = result.data;
                        initVehicles($scope.offers);
                        MessageBox.hideLoading();
                    }, function (error) {
                        MessageBox.hideLoading();
                        if (error.treated) {
                        } else {
                            if (error.response.data.code == "3808") {
                                MessageBox.toast($filter('translate')('flow.jsNo_offers'), 'error');
                            } else if (error.response.data.code == "3809") {
                                MessageBox.toast($filter('translate')('flow.jsNo_vehicles'), 'error');
                            } else if (error.response.data.code == "3810") {
                                MessageBox.toast($filter('translate')('flow.jsNo_drivers'), 'error');
                            } else {
                                MessageBox.toast($filter('translate')('flow.jsNo_offers'), 'error');
                            }
                        }
                    });
                }
            }

            //初始化开关控件
            $scope.showReturnService = false;
            $timeout(function () {
                $("[name='rsSwitch']").bootstrapSwitch();
                $("[name='rsSwitch']").on('switchChange.bootstrapSwitch', function (event, state) {
                    $timeout(function () {
                        if (state) {
                            $scope.editDatetime(2);
                        } else {
                            $scope.showReturnService = false;
                        }
                    }, 0);
                });
            }, 20);
        };

        $scope.setViewState = function () {
            if ($scope.step == 2) {
                angular.element($("#stepTwo")).removeClass("hidden");
                angular.element($("#stepThree")).addClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleOne a")).addClass("iframe-nav1");
                angular.element($("#titleTwo")).addClass("active");
                angular.element($("#titleTwo a")).addClass("iframe-nav2");
                angular.element($("#titleThree")).removeClass("active");
                angular.element($("#titleThree a")).addClass("iframe-nav1");
            } else if ($scope.step == 3) {
                angular.element($("#stepTwo")).addClass("hidden");
                angular.element($("#stepThree")).removeClass("hidden");
                angular.element($("#titleOne")).removeClass("active");
                angular.element($("#titleOne a")).addClass("iframe-nav1");
                angular.element($("#titleTwo")).removeClass("active");
                angular.element($("#titleTwo a")).removeClass("iframe-nav2");
                angular.element($("#titleTwo a")).addClass("iframe-nav1");
                angular.element($("#titleThree")).addClass("active");
                angular.element($("#titleThree a")).removeClass("iframe-nav1");
                angular.element($("#titleThree a")).addClass("iframe-nav2");
            } else {
            }
        };

        $scope.calcPrice = function () {
            if ($scope.options.length == 0) {
                $scope.totalPrice = $scope.offer.basic_cost * (1 + $scope.offer.tva / 100);
                if ($scope.totalPrice > 0 && $scope.totalPrice < 1) {
                    $scope.totalPrice = 1.00;
                }
                return;
            }
            $scope.options.selectOption = [];
            // 解析checkBox价格
            var checkBoxPrice = 0;
            for (var i = 0; i < $scope.options.checkBox.length; i++) {
                var optionItem = $scope.options.checkBox[i];
                if (optionItem.count == 1) {
                    checkBoxPrice = checkBoxPrice + optionItem.price;
                    $scope.options.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            // 解析number价格
            var numberPrice = 0;
            for (var i = 0; i < $scope.options.number.length; i++) {
                var optionItem = $scope.options.number[i];
                numberPrice = numberPrice + (optionItem.price * optionItem.count);
                if (optionItem.count > 0) {
                    $scope.options.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            //解析raidoGroup价格
            var raidoGroupPrice = 0;
            for (var i = 0; i < $scope.options.radioGroup.length; i++) {
                var optionItem = $scope.options.radioGroup[i];
                raidoGroupPrice = raidoGroupPrice + parseFloat(optionItem.price);
                if (optionItem.selectId != undefined) {
                    $scope.options.selectOption.push({
                        option_id: optionItem.selectId,
                        count: 1
                    });
                }
            }

            //解析checkBoxGroup价格
            var checkBoxGroupPrice = 0;
            for (var i = 0; i < $scope.options.checkBoxGroup.length; i++) {
                for (var j = 0; j < $scope.options.checkBoxGroup[i].group.length; j++) {
                    var optionItem = $scope.options.checkBoxGroup[i].group[j];
                    if (optionItem.count == 1) {
                        checkBoxGroupPrice = checkBoxGroupPrice + optionItem.price;
                        $scope.options.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            //解析numberGrou价格
            var numberGroupPrice = 0;
            for (var i = 0; i < $scope.options.numberGroup.length; i++) {
                for (var j = 0; j < $scope.options.numberGroup[i].group.length; j++) {
                    var optionItem = $scope.options.numberGroup[i].group[j];
                    numberGroupPrice = numberGroupPrice + (optionItem.price * optionItem.count);
                    if (optionItem.count > 0) {
                        $scope.options.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            if (d_is_airport == 1) {
                if (a_is_airport == 1) {
                    $scope.totalPrice = ($scope.offer.basic_cost + $scope.offer.d_port_price + $scope.offer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                } else {
                    $scope.totalPrice = ($scope.offer.basic_cost + $scope.offer.d_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                }
            } else {
                if (a_is_airport == 1) {
                    $scope.totalPrice = ($scope.offer.basic_cost + $scope.offer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                } else {
                    $scope.totalPrice = ($scope.offer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.offer.tva / 100);
                }
            }
            $scope.optionsPrice = checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
            if ($scope.totalPrice > 0 && $scope.totalPrice < 1) {
                $scope.totalPrice = 1.00;
            }
            // console.log($scope.totalPrice)
            if($scope.showCoupon){
                $scope.showTotalPrice = $scope.totalPrice - $scope.amountOff - $scope.percentOff / 100 * ($scope.totalPrice - $scope.amountOff);
            }else{
                $scope.showTotalPrice = $scope.totalPrice;
            }
            if ($scope.showTotalPrice > 0 && $scope.showTotalPrice < 1) {
                $scope.showTotalPrice = 1.00;
            }
            if ($scope.showTotalPrice < 0) {
                $scope.showTotalPrice = 0;
            }
            // console.log($scope.showTotalPrice)
        };


        $scope.rscalcPrice = function () {
            if ($scope.rsoptions.length == 0) {
                $scope.rstotalPrice = $scope.rsoffer.basic_cost * (1 + $scope.rsoffer.tva / 100);
                if ($scope.rstotalPrice > 0 && $scope.rstotalPrice < 1) {
                    $scope.rstotalPrice = 1.00;
                }
                return;
            }
            $scope.rsoptions.selectOption = [];
            // 解析checkBox价格
            var checkBoxPrice = 0;
            for (var i = 0; i < $scope.rsoptions.checkBox.length; i++) {
                var optionItem = $scope.rsoptions.checkBox[i];
                if (optionItem.count == 1) {
                    checkBoxPrice = checkBoxPrice + optionItem.price;
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            // 解析number价格
            var numberPrice = 0;
            for (var i = 0; i < $scope.rsoptions.number.length; i++) {
                var optionItem = $scope.rsoptions.number[i];
                numberPrice = numberPrice + (optionItem.price * optionItem.count);
                if (optionItem.count > 0) {
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.option_id,
                        count: optionItem.count
                    });
                }
            }

            //解析raidoGroup价格
            var raidoGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.radioGroup.length; i++) {
                var optionItem = $scope.rsoptions.radioGroup[i];
                raidoGroupPrice = raidoGroupPrice + parseFloat(optionItem.price);
                if (optionItem.selectId != undefined) {
                    $scope.rsoptions.selectOption.push({
                        option_id: optionItem.selectId,
                        count: 1
                    });
                }
            }

            //解析checkBoxGroup价格
            var checkBoxGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.checkBoxGroup.length; i++) {
                for (var j = 0; j < $scope.rsoptions.checkBoxGroup[i].group.length; j++) {
                    var optionItem = $scope.rsoptions.checkBoxGroup[i].group[j];
                    if (optionItem.count == 1) {
                        checkBoxGroupPrice = checkBoxGroupPrice + optionItem.price;
                        $scope.rsoptions.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            //解析numberGrou价格
            var numberGroupPrice = 0;
            for (var i = 0; i < $scope.rsoptions.numberGroup.length; i++) {
                for (var j = 0; j < $scope.rsoptions.numberGroup[i].group.length; j++) {
                    var optionItem = $scope.rsoptions.numberGroup[i].group[j];
                    numberGroupPrice = numberGroupPrice + (optionItem.price * optionItem.count);
                    if (optionItem.count > 0) {
                        $scope.rsoptions.selectOption.push({
                            option_id: optionItem.option_id,
                            count: optionItem.count
                        });
                    }
                }
            }

            if (rs_d_is_airport == 1) {
                if (rs_a_is_airport == 1) {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + $scope.rsoffer.d_port_price + $scope.rsoffer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                } else {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + $scope.rsoffer.d_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                }
            } else {
                if (rs_a_is_airport == 1) {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + $scope.rsoffer.a_port_price + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                } else {
                    $scope.rstotalPrice = ($scope.rsoffer.basic_cost + checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice) * (1 + $scope.rsoffer.tva / 100);
                }
            }
            // console.log($scope.rstotalPrice)
            $scope.rsOptionsPrice = checkBoxPrice + numberPrice + raidoGroupPrice + checkBoxGroupPrice + numberGroupPrice;
            if ($scope.rstotalPrice > 0 && $scope.rstotalPrice < 1) {
                $scope.rstotalPrice = 1.00;
            }
            $scope.showRsTotalPrice = $scope.rstotalPrice - $scope.amountRsOff - $scope.percentRsOff / 100 * ($scope.rstotalPrice - $scope.amountRsOff);
            if ($scope.showRsTotalPrice > 0 && $scope.showRsTotalPrice < 1) {
                $scope.showRsTotalPrice = 1.00;
            }
            if ($scope.showRsTotalPrice < 0) {
                $scope.showRsTotalPrice = 0;
            }
            console.log($scope.showRsTotalPrice)
        };

        $scope.onEnableOption = function (option) {
            if (option.enable) {
                option.count = 1;
            } else {
                option.count = 0;
            }
            $scope.calcPrice();
        };

        $scope.onChangeOptionCount = function (option, isAdd) {
            if (isAdd) {
                if (option.count >= option.add_max) {
                    return;
                }
                option.count++;
            } else {
                if (option.count <= 1) {
                    return;
                }
                option.count--;
            }
            $scope.calcPrice();
        };

        $scope.onReEnableOption = function (option) {
            if (option.enable) {
                option.count = 1;
            } else {
                option.count = 0;
            }
            $scope.rscalcPrice();
        };

        $scope.onReChangeOptionCount = function (option, isAdd) {
            if (isAdd) {
                if (option.count >= option.add_max) {
                    return;
                }
                option.count++;
            } else {
                if (option.count <= 1) {
                    return;
                }
                option.count--;
            }
            $scope.rscalcPrice();
        };


        //下一步
        $scope.clickNextAction = function ($event) {
            if ($scope.step == 2) {
                if ($stateParams.data && $stateParams.data.company_infor) {
                    //由第2步直接进入支付页面
                    enterSelectPaymentStep(false);
                } else {
                    //由第2步进入第3步
                    $scope.step = 3;
                    $scope.setViewState();
                }
            } else if ($scope.step == 3) {
                //由第3步进入支付页面
                enterSelectPaymentStep(true, $event);
            }
        };

        var enterSelectPaymentStep = function (withLogin, $event) {
            var passengerNames = [];
            angular.forEach($scope.passengers, function (passenger) {
                passengerNames.push(passenger.name);
            });
            var passengerCount = 0;
            if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                passengerCount = 0;
            } else {
                passengerCount = $scope.selectedMaxPassengers;
            }

            var bagCount = 0;
            if ($scope.selectedMaxBags == $scope.maxBags[0]) {
                bagCount = 0;
            } else {
                bagCount = $scope.selectedMaxBags;
            }

            var params = {
                type: $scope.bookType,
                appointed_time: (new Date($scope.pickupTime).valueOf() + "").substr(0, 10),
                d_lat: $scope.pickupLocation.geometry.location.lat(),
                d_lng: $scope.pickupLocation.geometry.location.lng(),
                d_address: $scope.pickupLocation,
                estimate_duration: estimate_duration,
                car_id: $scope.cars[$scope.selectedCar].car_id,
                offer_id: $scope.cars[$scope.selectedCar].offer.offer_id,
                options: $scope.options.selectOption,
                cost: $scope.totalPrice,
                amountOff: $scope.amountOff,
                percentOff: $scope.percentOff,
                couponCode: $scope.couponCode,
                showCoupon: $scope.showCoupon,
                promo_code_shown: $scope.promo_code_shown,
                checkingCode: $scope.checkingCode,
                haveVerifyCode: $scope.haveVerifyCode,
                showTotalPrice: $scope.showTotalPrice,
                note: $scope.bookNote,
                passenger_names: passengerNames.join(','),
                passenger_count: passengerCount,
                bag_count: bagCount,
                d_airline: $scope.dair,
                d_flight: $scope.dflight,
                d_is_airport: d_is_airport,
                d_air_fs: dAirFs,
                car: $scope.cars[$scope.selectedCar],
                edit_vehicle_params: {
                    cars: $scope.cars,
                    selectedCar: $scope.selectedCar,
                    options: $scope.options,
                    offer: $scope.offer,
                    maxBags: $scope.maxBags,
                    selectedMaxBags: $scope.selectedMaxBags,
                    maxPassengers: $scope.maxPassengers,
                    selectedMaxPassengers: $scope.selectedMaxPassengers,
                    passengers: $scope.passengers
                }
            };

            var reParams = undefined;

            if ($scope.bookType == 1) {
                params.a_lat = $scope.dropoffLocation.geometry.location.lat();
                params.a_lng = $scope.dropoffLocation.geometry.location.lng();
                params.a_address = $scope.dropoffLocation;
                params.estimate_distance = $scope.estimate_data.distance.value / 1000;
                params.a_airline = $scope.aair;
                params.a_flight = $scope.aflight;
                params.a_is_airport = a_is_airport;
                params.a_air_fs = aAirFs;
                if ($scope.showReturnService) {
                    var rsPassengerNames = [];
                    angular.forEach($scope.rsPassengers, function (passenger) {
                        rsPassengerNames.push(passenger.name);
                    });
                    var rsPassengerCount = 0;
                    if ($scope.rsSelectedMaxPassengers == $scope.rsMaxPassengers[0]) {
                        rsPassengerCount = 0;
                    } else {
                        rsPassengerCount = $scope.rsSelectedMaxPassengers;
                    }

                    var rsBagCount = 0;
                    if ($scope.rsSelectedMaxBags == $scope.rsMaxBags[0]) {
                        rsBagCount = 0;
                    } else {
                        rsBagCount = $scope.rsSelectedMaxBags;
                    }

                    reParams = {
                        type: $scope.bookType,
                        appointed_time: (new Date($scope.rspickupTime).valueOf() + "").substr(0, 10),
                        d_lat: $scope.dropoffLocation.geometry.location.lat(),
                        d_lng: $scope.dropoffLocation.geometry.location.lng(),
                        d_address: $scope.dropoffLocation,
                        a_lat: $scope.pickupLocation.geometry.location.lat(),
                        a_lng: $scope.pickupLocation.geometry.location.lng(),
                        a_address: $scope.pickupLocation,
                        estimate_duration: $scope.rsestimate_data.duration.value / 60,
                        estimate_distance:$scope.rsestimate_data.distance.value / 1000,
                        car_id: $scope.rscars[$scope.rsselectedCar].car_id,
                        offer_id: $scope.rscars[$scope.rsselectedCar].offer.offer_id,
                        options: $scope.rsoptions.selectOption,
                        cost: $scope.rstotalPrice,
                        amountOff: $scope.amountRsOff,
                        percentOff: $scope.percentRsOff,
                        coupon: $scope.couponRsCode,
                        promo_code_shown: $scope.rs_promo_code_shown,
                        checkingCode: $scope.rs_checkingCode,
                        haveVerifyCode: $scope.rs_haveVerifyCode,
                        showTotalPrice: $scope.showRsTotalPrice,
                        note: $scope.bookNote,
                        passenger_names: rsPassengerNames.join(','),
                        passenger_count: rsPassengerCount,
                        bag_count: rsBagCount,
                        d_airline: rsDair,
                        d_flight: rsDflight,
                        d_air_fs: rsDairFs,
                        a_airline: rsAair,
                        a_flight: rsAflight,
                        a_air_fs: rsAairFs,
                        d_is_airport: rs_d_is_airport,
                        a_is_airport: rs_a_is_airport,
                        car: $scope.rscars[$scope.rsselectedCar],
                        edit_vehicle_params: {
                            cars: $scope.rscars,
                            selectedCar: $scope.rsselectedCar,
                            options: $scope.rsoptions,
                            offer: $scope.rsoffer,
                            maxBags: $scope.rsMaxBags,
                            selectedMaxBags: $scope.rsSelectedMaxBags,
                            maxPassengers: $scope.rsMaxPassengers,
                            selectedMaxPassengers: $scope.rsSelectedMaxPassengers,
                            passengers: $scope.rsPassengers
                        }
                    };
                }
            } else {
                params.a_is_airport = 0;
            }

            if (withLogin) {
                if (!$scope.userName) {
                    MessageBox.toast($filter('translate')('flow.jsInput_email'), "error");
                    return;
                }
                if (!$scope.password) {
                    MessageBox.toast($filter('translate')('flow.jsInput_password'), "error");
                    return;
                }
                var nextLadda = Ladda.create($event.target);
                nextLadda.start();
                FlowBS.login(company_id, $scope.userName, $scope.password).then(function (result) {
                    if (!result.data.customer) {
                        nextLadda.stop();
                        MessageBox.toast($filter('translate')('flow.jsLogin_failed'), "error");
                        return;
                    }
                    loginUser = result.data;

                    $rootScope.login_id = loginUser.id;

                    FlowBS.getCards(loginUser.token).then(function (result) {
                        nextLadda.stop();
                        MessageBox.toast($filter('translate')('flow.jsLogin_success'), "Success");
                        cards = result.data;
                        $state.go('select-payment',
                            {
                                data: {
                                    cards: cards,
                                    bookType: $scope.bookType,
                                    params: params,
                                    reParams: reParams,
                                    loginUser: loginUser,
                                    company_infor: $scope.companyInfor
                                }
                            }
                        );
                    }, function (error) {
                        nextLadda.stop();
                        MessageBox.toast($filter('translate')('flow.jsLogin_get_card_failed'), "error");

                        $state.go('select-payment',
                            {
                                data: {
                                    bookType: $scope.bookType,
                                    params: params,
                                    reParams: reParams,
                                    loginUser: loginUser,
                                    company_infor: $scope.companyInfor
                                }
                            }
                        );
                    });
                }, function (error) {
                    nextLadda.stop();
                    if (error.treated) {
                    }
                    else {
                        MessageBox.toast($filter('translate')('flow.jsLogin_failed'), "error");
                    }
                });
            } else {
                $state.go('select-payment',
                    {
                        data: {
                            cards: cards,
                            bookType: $scope.bookType,
                            params: params,
                            reParams: reParams,
                            loginUser: loginUser,
                            company_infor: $scope.companyInfor
                        }
                    }
                );
            }
        };

        //注册
        $scope.onRegisterButtonClick = function () {
            var passengerNames = [];
            angular.forEach($scope.passengers, function (passenger) {
                passengerNames.push(passenger.name);
            });
            var passengerCount = 0;
            if ($scope.selectedMaxPassengers == $scope.maxPassengers[0]) {
                passengerCount = 0;
            } else {
                passengerCount = $scope.selectedMaxPassengers;
            }

            var bagCount = 0;
            if ($scope.selectedMaxBags == $scope.maxBags[0]) {
                bagCount = 0;
            } else {
                bagCount = $scope.selectedMaxBags;
            }

            var params = {
                type: $scope.bookType,
                appointed_time: (new Date($scope.pickupTime).valueOf() + "").substr(0, 10),
                d_lat: $scope.pickupLocation.geometry.location.lat(),
                d_lng: $scope.pickupLocation.geometry.location.lng(),
                d_address: $scope.pickupLocation,
                estimate_duration: estimate_duration,
                car_id: $scope.cars[$scope.selectedCar].car_id,
                offer_id: $scope.cars[$scope.selectedCar].offer.offer_id,
                options: $scope.options.selectOption,
                cost: $scope.totalPrice,
                amountOff: $scope.amountOff,
                percentOff: $scope.percentOff,
                couponCode: $scope.couponCode,
                showCoupon: $scope.showCoupon,
                promo_code_shown: $scope.promo_code_shown,
                checkingCode: $scope.checkingCode,
                haveVerifyCode: $scope.haveVerifyCode,
                showTotalPrice: $scope.showTotalPrice,
                note: $scope.bookNote,
                passenger_names: passengerNames.join(','),
                passenger_count: passengerCount,
                bag_count: bagCount,
                d_airline: $scope.dair,
                d_flight: $scope.dflight,
                d_is_airport: d_is_airport,
                d_air_fs: dAirFs,
                car: $scope.cars[$scope.selectedCar],
                edit_vehicle_params: {
                    cars: $scope.cars,
                    selectedCar: $scope.selectedCar,
                    options: $scope.options,
                    offer: $scope.offer,
                    maxBags: $scope.maxBags,
                    selectedMaxBags: $scope.selectedMaxBags,
                    maxPassengers: $scope.maxPassengers,
                    selectedMaxPassengers: $scope.selectedMaxPassengers,
                    passengers: $scope.passengers
                }
            };

            var reParams = undefined;

            if ($scope.bookType == 1) {
                params.a_lat = $scope.dropoffLocation.geometry.location.lat();
                params.a_lng = $scope.dropoffLocation.geometry.location.lng();
                params.a_address = $scope.dropoffLocation;
                params.estimate_distance = $scope.estimate_data.distance.value / 1000;
                params.a_airline = $scope.aair;
                params.a_flight = $scope.aflight;
                params.a_air_fs = aAirFs;
                params.a_is_airport = a_is_airport;
                if ($scope.showReturnService) {
                    var rsPassengerNames = [];
                    angular.forEach($scope.rsPassengers, function (passenger) {
                        rsPassengerNames.push(passenger.name);
                    });
                    var rsPassengerCount = 0;
                    if ($scope.rsSelectedMaxPassengers == $scope.rsMaxPassengers[0]) {
                        rsPassengerCount = 0;
                    } else {
                        rsPassengerCount = $scope.rsSelectedMaxPassengers;
                    }

                    var rsBagCount = 0;
                    if ($scope.rsSelectedMaxBags == $scope.rsMaxBags[0]) {
                        rsBagCount = 0;
                    } else {
                        rsBagCount = $scope.rsSelectedMaxBags;
                    }

                    reParams = {
                        type: $scope.bookType,
                        appointed_time: (new Date($scope.rspickupTime).valueOf() + "").substr(0, 10),
                        d_lat: $scope.dropoffLocation.geometry.location.lat(),
                        d_lng: $scope.dropoffLocation.geometry.location.lng(),
                        d_address: $scope.dropoffLocation,
                        a_lat: $scope.pickupLocation.geometry.location.lat(),
                        a_lng: $scope.pickupLocation.geometry.location.lng(),
                        a_address: $scope.pickupLocation,
                        estimate_duration: $scope.rsestimate_data.duration.value / 60,
                        estimate_distance: $scope.rsestimate_data.distance.value / 1000,
                        car_id: $scope.rscars[$scope.rsselectedCar].car_id,
                        offer_id: $scope.rscars[$scope.rsselectedCar].offer.offer_id,
                        options: $scope.rsoptions.selectOption,
                        cost: $scope.rstotalPrice,
                        amountOff: $scope.amountRsOff,
                        percentOff: $scope.percentRsOff,
                        coupon: $scope.couponRsCode,
                        promo_code_shown: $scope.rs_promo_code_shown,
                        checkingCode: $scope.rs_checkingCode,
                        haveVerifyCode: $scope.rs_haveVerifyCode,
                        showTotalPrice: $scope.showRsTotalPrice,
                        note: $scope.bookNote,
                        passenger_names: rsPassengerNames.join(','),
                        passenger_count: rsPassengerCount,
                        bag_count: rsBagCount,
                        d_airline: rsDair,
                        d_flight: rsDflight,
                        d_air_fs: rsDairFs,
                        a_airline: rsAair,
                        a_flight: rsAflight,
                        a_air_fs: rsAairFs,
                        d_is_airport: rs_d_is_airport,
                        a_is_airport: rs_a_is_airport,
                        car: $scope.rscars[$scope.rsselectedCar],
                        edit_vehicle_params: {
                            cars: $scope.rscars,
                            selectedCar: $scope.rsselectedCar,
                            options: $scope.rsoptions,
                            offer: $scope.rsoffer,
                            maxBags: $scope.rsMaxBags,
                            selectedMaxBags: $scope.rsSelectedMaxBags,
                            maxPassengers: $scope.rsMaxPassengers,
                            selectedMaxPassengers: $scope.rsSelectedMaxPassengers,
                            passengers: $scope.rsPassengers
                        }
                    };
                }
            } else {
                params.a_is_airport = 0;
            }
            $state.go('customer-register',
                {
                    data: {
                        bookType: $scope.bookType,
                        params: params,
                        reParams: reParams,
                        company_infor: $scope.companyInfor
                    }
                }
            );
        };

        //eventType
        //1:编辑去程booking
        //2:添加返程booking
        //3:编辑返程booking
        $scope.editDatetime = function (eventType) {
            var isReturnSerivce;
            if (eventType == 1) {
                isReturnSerivce = false;
            } else {
                isReturnSerivce = true;
            }
            var params = {
                company_id: company_id,
                bookType: $scope.bookType,
                isReturnSerivce: isReturnSerivce,
                appointed_time: $scope.pickupTime.getTime(),
                pickupLocation: $scope.pickupLocation,
                dair: $scope.dair,
                dflight: $scope.dflight,
                dAirFs: dAirFs,
                d_is_airport: d_is_airport,
                companyInfo:$scope.companyInfor
            };
            if ($scope.bookType == 1) {
                //p2p
                if (eventType == 1) {
                    params.dropoffLocation = $scope.dropoffLocation;
                    params.aair = $scope.aair;
                    params.aflight = $scope.aflight;
                    params.aAirFs = aAirFs;
                    params.a_is_airport = a_is_airport;
                } else {
                    params.pickupLocation = $scope.dropoffLocation;
                    params.dropoffLocation = $scope.pickupLocation;
                    params.dair = rsDair;
                    params.dflight = rsDflight;
                    params.dAirFs = rsDairFs;
                    params.aair = rsAair;
                    params.aflight = rsAflight;
                    params.aAirFs = rsAairFs;
                    params.appointed_time = $scope.rspickupTime.getTime();
                    params.d_is_airport = rs_d_is_airport;
                    params.a_is_airport = rs_a_is_airport;
                }
            } else {
                //hourly
                params.hours = estimate_duration / 60;
                params.a_is_airport = 0;
            }

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/flow/book-datetime-edit.html',
                controller: 'BookDatetimeEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: params,
                        event: {
                            bookSuccess: function (params) {
                                modalInstance.dismiss();

                                if ($scope.step > 2) {
                                    $scope.step = 2;
                                    $scope.setViewState();
                                }

                                $scope.bookType = params.bookType;
                                if ($scope.bookType == 1) {
                                    if (eventType == 1) {
                                        $scope.maxBags = $scope.rsMaxBags = ['N/A'];
                                        $scope.selectedMaxBags = $scope.rsSelectedMaxBags = 'N/A';
                                        $scope.maxPassengers = $scope.rsMaxPassengers = ['N/A'];
                                        $scope.selectedMaxPassengers = $scope.rsSelectedMaxPassengers = 'N/A';
                                        $scope.passengers = $scope.rsPassengers = [];

                                        d_lat = params.pickupLocation.geometry.location.lat();
                                        d_lng = params.pickupLocation.geometry.location.lng();
                                        a_lat = params.dropoffLocation.geometry.location.lat();
                                        a_lng = params.dropoffLocation.geometry.location.lng();
                                        estimate_duration = params.estimate_data.duration.value / 60;
                                        $scope.dair = params.dair;
                                        $scope.dflight = params.dflight;
                                        dAirFs = params.dAirFs;
                                        $scope.aair = params.aair;
                                        $scope.aflight = params.aflight;
                                        aAirFs = params.aAirFs;
                                        d_is_airport = params.d_is_airport;
                                        a_is_airport = params.a_is_airport;
                                        $scope.pickupTime = new Date(params.appointed_time);
                                        $scope.pickupLocation = params.pickupLocation;
                                        $scope.pickupLocation.d_final_address = AddressTool.finalAddress($scope.pickupLocation);
                                        $scope.dropoffLocation = params.dropoffLocation;
                                        $scope.dropoffLocation.a_final_address = AddressTool.finalAddress($scope.dropoffLocation);
                                        $scope.estimate_data = params.estimate_data;
                                        $scope.estimate_time_show = estimate_duration;

                                        initVehicles(params.offers);
                                        initReturnService();
                                        if ($scope.showReturnService) {
                                            $("[name='rsSwitch']").bootstrapSwitch('toggleState');
                                        }
                                    } else {
                                        $scope.rsMaxBags = ['N/A'];
                                        $scope.rsSelectedMaxBags = 'N/A';
                                        $scope.rsMaxPassengers = ['N/A'];
                                        $scope.rsSelectedMaxPassengers = 'N/A';
                                        $scope.rsPassengers = [];

                                        rsDair = params.dair;
                                        rsDflight = params.dflight;
                                        rsDairFs = params.dAirFs;
                                        rsAair = params.aair;
                                        rsAflight = params.aflight;
                                        rsAairFs = params.aAirFs;
                                        rs_d_is_airport = params.d_is_airport;
                                        rs_a_is_airport = params.a_is_airport;
                                        $scope.rspickupTime = new Date(params.appointed_time);
                                        $scope.rsestimate_data = params.estimate_data;

                                        initRsVehicles(params.offers);
                                        $scope.showReturnService = true;
                                    }
                                } else {
                                    $scope.maxBags = $scope.rsMaxBags = ['N/A'];
                                    $scope.selectedMaxBags = $scope.rsSelectedMaxBags = 'N/A';
                                    $scope.maxPassengers = $scope.rsMaxPassengers = ['N/A'];
                                    $scope.selectedMaxPassengers = $scope.rsSelectedMaxPassengers = 'N/A';
                                    $scope.passengers = $scope.rsPassengers = [];

                                    d_lat = params.pickupLocation.geometry.location.lat;
                                    d_lng = params.pickupLocation.geometry.location.lng;
                                    estimate_duration = params.hours * 60;
                                    $scope.dair = params.dair;
                                    $scope.dflight = params.dflight;
                                    dAirFs = params.dAirFs;
                                    d_is_airport = params.d_is_airport;
                                    a_is_airport = 0;
                                    $scope.pickupTime = new Date(params.appointed_time);
                                    $scope.pickupLocation = params.pickupLocation;
                                    $scope.pickupLocation.d_final_address = AddressTool.finalAddress($scope.pickupLocation);
                                    $scope.estimate_time_show = estimate_duration;
                                    initVehicles(params.offers);

                                    if ($scope.showReturnService) {
                                        $("[name='rsSwitch']").bootstrapSwitch('toggleState');
                                    }
                                }
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                                if (eventType == 2) {
                                    $("[name='rsSwitch']").bootstrapSwitch('toggleState');
                                }
                            },
                            resetCouponCode: function () {
                                resetCouponCode();
                                resetRsCouponCode();
                            }
                        }
                    }
                }
            });
        };

        $scope.editVehicle = function () {
            var params = {};
            params.bookType = $scope.bookType;

            params.cars = $scope.cars;
            params.selectedCar = $scope.selectedCar;
            params.options = $scope.options;
            params.offer = $scope.offer;

            params.maxBags = $scope.maxBags;
            params.selectedMaxBags = $scope.selectedMaxBags;
            params.maxPassengers = $scope.maxPassengers;
            params.selectedMaxPassengers = $scope.selectedMaxPassengers;
            params.passengers = $scope.passengers;
            params.showCoupon = $scope.showCoupon;
            params.promo_code_shown = $scope.promo_code_shown;
            params.couponCode = $scope.couponCode;
            params.checkingCode = $scope.checkingCode;
            params.amountOff = $scope.amountOff;
            params.percentOff = $scope.percentOff;
            params.haveVerifyCode = $scope.haveVerifyCode;
            params.showTotalPrice = $scope.showTotalPrice;
            params.companyInfo=$scope.companyInfor;

            if (params.bookType == 1) {
                params.company_id = company_id;
                params.pickupLocation = $scope.pickupLocation;
                params.dropoffLocation = $scope.dropoffLocation;
                params.rsAppointed_time = $scope.rspickupTime.getTime();

                params.showReturnService = $scope.showReturnService;
                if (params.showReturnService) {
                    params.rscars = $scope.rscars;
                    params.rsselectedCar = $scope.rsselectedCar;
                    params.rsoptions = $scope.rsoptions;
                    params.rsoffer = $scope.rsoffer;

                    params.rsMaxBags = $scope.rsMaxBags;
                    params.rsSelectedMaxBags = $scope.rsSelectedMaxBags;
                    params.rsMaxPassengers = $scope.rsMaxPassengers;
                    params.rsSelectedMaxPassengers = $scope.rsSelectedMaxPassengers;
                    params.rsPassengers = $scope.rsPassengers;

                    params.rs_promo_code_shown = $scope.rs_promo_code_shown;
                    params.rs_checkingCode = $scope.rs_checkingCode;
                    params.couponRsCode = $scope.couponRsCode;
                    params.amountRsOff = $scope.amountRsOff;
                    params.percentRsOff = $scope.percentRsOff;
                    params.rs_haveVerifyCode = $scope.rs_haveVerifyCode;
                    params.showRsTotalPrice = $scope.showRsTotalPrice;

                    params.rsDair = rsDair;
                    params.rsDflight = rsDflight;
                    params.rsDairFs = rsDairFs;
                    params.rsAair = rsAair;
                    params.rsAflight = rsAflight;
                    params.rsAairFs = rsAairFs;
                    params.rs_d_is_airport = rs_d_is_airport;
                    params.rs_a_is_airport = rs_a_is_airport;
                    params.d_is_airport = d_is_airport;
                    params.a_is_airport = a_is_airport;

                    params.rsEstimate_data = $scope.rsestimate_data;
                } else {
                    params.rsDair = $scope.aair;
                    params.rsDflight = $scope.aflight;
                    params.rsDairFs = aAirFs;
                    params.rsAair = $scope.dair;
                    params.rsAflight = $scope.dflight;
                    params.rsAairFs = dAirFs;
                    params.rs_d_is_airport = rs_d_is_airport;
                    params.rs_a_is_airport = rs_a_is_airport;
                    params.d_is_airport = d_is_airport;
                    params.a_is_airport = a_is_airport;
                }
            } else {
                params.d_is_airport = d_is_airport;
                params.showReturnService = false;
            }

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/iframe/flow/book-vehicle-edit.html',
                controller: 'BookVehicleEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: params,
                        event: {
                            editSuccess: function (params) {
                                modalInstance.dismiss();
                                $timeout(function () {
                                    $scope.cars = params.cars;
                                    $scope.selectedCar = params.selectedCar;
                                    $scope.options = params.options;
                                    $scope.offer = params.offer;
                                    $scope.maxBags = params.maxBags;
                                    $scope.selectedMaxBags = params.selectedMaxBags;
                                    $scope.maxPassengers = params.maxPassengers;
                                    $scope.selectedMaxPassengers = params.selectedMaxPassengers;
                                    $scope.passengers = params.passengers;
                                    $scope.showCoupon = params.promo_code_shown;
                                    $scope.promo_code_shown = params.promo_code_shown;
                                    $scope.checkingCode = params.checkingCode;
                                    $scope.couponCode = params.couponCode;
                                    $scope.amountOff = params.amountOff;
                                    $scope.percentOff = params.percentOff;
                                    $scope.haveVerifyCode = params.haveVerifyCode;
                                    $scope.showTotalPrice = params.showTotalPrice;
                                    $scope.calcPrice();

                                    $scope.showReturnService = params.showReturnService;
                                    if ($scope.showReturnService) {
                                        $scope.rscars = params.rscars;
                                        $scope.rsselectedCar = params.rsselectedCar;
                                        $scope.rsoptions = params.rsoptions;
                                        $scope.rsoffer = params.rsoffer;
                                        $scope.rsMaxBags = params.rsMaxBags;
                                        $scope.rsSelectedMaxBags = params.rsSelectedMaxBags;
                                        $scope.rsMaxPassengers = params.rsMaxPassengers;
                                        $scope.rsSelectedMaxPassengers = params.rsSelectedMaxPassengers;
                                        $scope.rsPassengers = params.rsPassengers;
                                        $scope.rs_promo_code_shown = params.rs_promo_code_shown;
                                        $scope.rs_checkingCode = params.rs_checkingCode;
                                        $scope.couponRsCode = params.couponRsCode;
                                        $scope.amountRsOff = params.amountRsOff;
                                        $scope.percentRsOff = params.percentRsOff;
                                        $scope.rs_haveVerifyCode = params.rs_haveVerifyCode;
                                        $scope.showRsTotalPrice = params.showRsTotalPrice;
                                        rs_d_is_airport = params.rs_d_is_airport;
                                        rs_a_is_airport = params.rs_a_is_airport;
                                        $scope.rscalcPrice();

                                        rsDair = params.rsDair;
                                        rsDflight = params.rsDflight;
                                        rsDairFs = params.rsDairFs;
                                        rsAair = params.rsAair;
                                        rsAflight = params.rsAflight;
                                        rsAairFs = params.rsAairFs;
                                        // rs_d_is_airport = params.rs_d_is_airport;
                                        // rs_a_is_airport = params.rs_a_is_airport;
                                        $scope.rspickupTime = new Date(params.rsAppointed_time);
                                        $scope.rsestimate_data = params.rsEstimate_data;
                                    }

                                    $scope.$apply();
                                }, 0);
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        FlowBS.getCompanyInfor(company_id).then(function (result) {
            $scope.companyInfor = result.data;
            $scope.init();
        }, function (error) {
            $scope.companyInfor ={
                distance_unit: 2,
                email: "",
                id: company_id,
                name: "",
                phone1: '',
                phone2: ''
            };
            $scope.init();
        });

        $scope.setViewState();

        function resetCouponCode() {
            $scope.promo_code_shown = false;
            $scope.checkingCode = true;
            $scope.couponCode = '';
            $scope.amountOff = 0;
            $scope.percentOff = 0;
            $scope.haveVerifyCode = false;
        }

        resetCouponCode();
        $scope.showPromoCodeLine = function () {
            $scope.promo_code_shown = true;
            $scope.checkingCode = false;
        };

        $scope.dismissPromoCodeLine = function () {
            if ($scope.checkingCode) {
                return;
            }
            $scope.promo_code_shown = false;
            $scope.checkingCode = true;
        };

        $scope.getCouponCode = function ($event) {
            if ($scope.checkingCode) {
                return;
            }
            $scope.checkingCode = true;

            if ($scope.couponCode == null || $scope.couponCode == undefined || $scope.couponCode.trim(' ') == '') {
                $scope.checkingCode = false;
                MessageBox.toast($filter('translate')('flow.jsCode_not_null'), 'error');
                return;
            }

            var ladda = Ladda.create($event.target);
            ladda.start();
            FlowBS.verifyCoupon($rootScope.company_id, $scope.couponCode).then(
                function (result) {
                    console.log(result);
                    if (!result.data.valid) {
                        MessageBox.toast($filter('translate')('flow.jsCode_used'), 'error');
                    } else {
                        if (result.data.percent_off == null) {
                            $scope.percentOff = 0;
                        } else {
                            $scope.percentOff = result.data.percent_off;
                        }
                        $scope.amountOff = result.data.amount_off;
                        $scope.haveVerifyCode = true;
                    }
                    $scope.checkingCode = false;
                    $scope.calcPrice();
                    ladda.stop();
                }, function (error) {
                    $scope.checkingCode = false;
                    ladda.stop();
                    MessageBox.toast($filter('translate')('flow.jsCode_not_valid'), 'error');
                }
            );
        };

        // rs
        function resetRsCouponCode() {
            $scope.rs_promo_code_shown = false;
            $scope.rs_checkingCode = true;
            $scope.couponRsCode = '';
            $scope.amountRsOff = 0;
            $scope.percentRsOff = 0;
            $scope.rs_haveVerifyCode = false;
        }

        resetRsCouponCode();
        $scope.showRsPromoCodeLine = function () {
            $scope.rs_promo_code_shown = true;
            $scope.rs_checkingCode = false;
        };

        $scope.dismissRsPromoCodeLine = function () {
            if ($scope.rs_checkingCode) {
                return;
            }
            $scope.rs_promo_code_shown = false;
            $scope.rs_checkingCode = true;
        };

        $scope.getRsCouponCode = function ($event) {
            if ($scope.rs_checkingCode) {
                return;
            }
            $scope.rs_checkingCode = true;

            if ($scope.couponRsCode == null || $scope.couponRsCode == undefined || $scope.couponRsCode.trim(' ') == '') {
                $scope.rs_checkingCode = false;
                MessageBox.toast($filter('translate')('flow.jsCode_not_null'), 'error');
                return;
            }

            var ladda = Ladda.create($event.target);
            ladda.start();
            FlowBS.verifyCoupon($rootScope.company_id, $scope.couponRsCode).then(
                function (result) {
                    console.log(result);
                    if (!result.data.valid) {
                        MessageBox.toast($filter('translate')('flow.jsCode_used'), 'error');
                    } else {
                        if (result.data.percent_off == null) {
                            $scope.percentRsOff = 0;
                        } else {
                            $scope.percentRsOff = result.data.percent_off;
                        }
                        $scope.amountRsOff = result.data.amount_off;
                        $scope.rs_haveVerifyCode = true;
                    }
                    $scope.rs_checkingCode = false;
                    $scope.rscalcPrice();
                    ladda.stop();
                }, function (error) {
                    $scope.rs_checkingCode = false;
                    ladda.stop();
                    MessageBox.toast($filter('translate')('flow.jsCode_not_valid'), 'error');
                }
            );
        };

    })
;