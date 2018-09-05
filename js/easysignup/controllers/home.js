/**
 * Created by Alur on 2017-12-10.
 */
angular.module('EasySignUp.Controllers')
    .controller('HomeCtrl', function ($log, $scope, $rootScope, $state, $http, $uibModal, $timeout, MessageBox, EasySignUpBS, T, $filter, $translate) {

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

        angular.element('#companyAndAdmin').validator();
        var pageLanguage = GetQueryString(location.href, "lang");
        var saleId = ApiServer.repSalesId;

        var initData = function () {
            if (pageLanguage != 'en'
                && pageLanguage != 'fr') {
                pageLanguage = 'en';
            }
            $translate.use(pageLanguage);
            $scope.fullName = null;
            $scope.email = null;
            $scope.mobile = null;
            $scope.password = null;
            $scope.pwdConfirmation = null;
        };
        initData();

        $scope.submitCompanyAndAdmin = function ($event) {
            if ($scope.fullName == null || $scope.fullName == undefined || $scope.fullName.trim(' ') == '') {
                MessageBox.toast(T.T('easySignUp_home.jsFullNameNull'), 'error');
                return;
            }
            if ($scope.email == null || $scope.email == undefined || $scope.email.trim(' ') == '') {
                MessageBox.toast(T.T('easySignUp_home.jsEmailNull'), 'error');
                return;
            }
            if ($scope.mobile == null || $scope.mobile == undefined || $scope.mobile.trim(' ') == '') {
                MessageBox.toast(T.T('easySignUp_home.jsMobileNull'), 'error');
                return;
            }
            if ($scope.password == null || $scope.password == undefined || $scope.password.trim(' ') == '') {
                MessageBox.toast(T.T('easySignUp_home.jsPasswordNull'), 'error');
                return;
            }
            if ($scope.password != $scope.pwdConfirmation) {
                MessageBox.toast(T.T('easySignUp_home.jsPasswordNotSame'), 'error');
                return;
            }
            var firstName = $scope.fullName.split(' ').slice(0, -1).join(' ');
            var lastName = $scope.fullName.split(' ').slice(-1).join(' ');
            if (firstName == null || firstName == undefined || firstName.trim(' ') == '') {
                firstName = lastName;
            }
            var companyName = lastName + " Limo";
            var address = '{"address_components":[{"long_name":"1","short_name":"1","types":["street_number"]},{"long_name":"Liberty Island - Ellis Island","short_name":"Liberty Island - Ellis Island","types":["route"]},{"long_name":"Liberty Island","short_name":"Liberty Island","types":["neighborhood","political"]},{"long_name":"Manhattan","short_name":"Manhattan","types":["political","sublocality","sublocality_level_1"]},{"long_name":"New York","short_name":"New York","types":["locality","political"]},{"long_name":"New York County","short_name":"New York County","types":["administrative_area_level_2","political"]},{"long_name":"New York","short_name":"NY","types":["administrative_area_level_1","political"]},{"long_name":"U.S.A","short_name":"US","types":["country","political"]},{"long_name":"10004","short_name":"10004","types":["postal_code"]},{"long_name":"1418","short_name":"1418","types":["postal_code_suffix"]}],"formatted_address":"1 Liberty Island - Ellis Island, New York, NY 10004 U.S.A","geometry":{"location":{"lat":40.6898059,"lng":-74.0450227},"location_type":"ROOFTOP","viewport":{"south":40.6884569197085,"west":-74.04637168029149,"north":40.6911548802915,"east":-74.04367371970852}},"place_id":"ChIJb3tL045QwokRYfNmCnemBzY","types":["street_address"],"isAirport":false,"latlng":{"lng":-74.0450227,"lat":40.6898059}}';
            var lat = '40.6898059';
            var lng = '-74.0450227';
            var company = {
                name: companyName,
                address: address,
                lat: lat,
                lng: lng,
                tcp: "",
                ccy: "",
                lang: "en",
                country: "US",
                sale_id: saleId,
                email: $scope.email,
                phone1: $scope.mobile
            };
            var admin = {
                first_name: firstName,
                last_name: lastName,
                mobile: $scope.mobile,
                email: $scope.email,
                password: $scope.password,
                lang: "en"
            };
            var ladda = Ladda.create($event.target);
            ladda.start();
            EasySignUpBS.easySignUp(JSON.stringify(company),
                JSON.stringify(admin)).then(function (result) {
                // MessageBox.toast(T.T('board_home.jsEnter_com_detail'));
                ladda.stop();
                initData();
                $state.go("finish");
            }, function (error) {
                ladda.stop();
                console.log('add company error ', error);
                if (error.treated) {
                } else {
                    if (error.response.data.code == "3301") {
                        MessageBox.toast(T.T('board_home.jsPromo_code_error'), 'error');
                    } else if (error.response.data.code == "3303") {
                        MessageBox.toast(T.T('board_home.jsSaleIdNotExist'), 'error');
                    } else if (error.response.data.code == "3300") {
                        MessageBox.toast(T.T('board_home.jsCompany_already_exit'), 'error');
                    } else if (error.response.data.code == "3100") {
                        MessageBox.toast(T.T('board_home.jsAdmin_username_used'), 'error');
                    } else if (error.response.data.code == "3101") {
                        MessageBox.toast(T.T('board_home.jsAdmin_mobile_used'), 'error');
                    } else if (error.response.data.code == "3102") {
                        MessageBox.toast(T.T('board_home.jsAdmin_email_used'), 'error');
                    }
                }
            });
            ladda.stop();
        };

    });
