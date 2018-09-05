/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CompanyBS', function ($q, HttpService, strformat) {
        return {
            createCompany: function (company_param, admin_param, payment_param, charge_param) {
                var defer = $q.defer();
                var params = {
                    company_param: company_param,
                    admin_param: admin_param,
                    payment_param: payment_param,
                    charge_param: charge_param
                };
                HttpService.post(Api.company.createAllNewCompany, params, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCompanyDetail: function (companyId) {
                var defer = $q.defer();
                var params = {};
                HttpService.get(strformat(Api.company.getACompanyDetail, companyId), params, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getAllCompanies: function (page, count) {
                var defer = $q.defer();
                var params = {
                    page: page,
                    per_page: count
                };
                HttpService.get(Api.company.getAllCompanies, params, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCurrentCompanies: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getCurrentCompanies, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            updateCurrentCompanies: function (name, address, lat, lng, tcp, phone, email, emailHost, emailPort, emailPassword, country, language) {
                var defer = $q.defer();
                HttpService.patch(Api.company.getCurrentCompanies, {
                    name: name,
                    address: address,
                    lat: lat,
                    lng: lng,
                    tcp: tcp,
                    phone1: phone,
                    email: email,
                    email_host: emailHost,
                    email_port: emailPort,
                    email_password: emailPassword,
                    country: country,
                    lang: language
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            changeLogoToCurrentCompany: function (file) {
                var defer = $q.defer();

                HttpService.upload(Api.company.changeLogo, {
                    company_logo: file
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCompanyDetails: function (companyId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getCompanyDetail, companyId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            companyDetailRate: function (rate, companyId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.companyDetailRate, companyId), {
                    company_rate: rate
                }, function (response) {
                    defer.resolve({
                        data: response
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            modifyCompanyPush: function (pushProfile, pushApiToken, configId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.modifyCompanyPush, configId), {
                    push_profile: pushProfile,
                    push_api_token: pushApiToken
                }, function (response) {
                    defer.resolve({
                        data: response
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            addCompanyPush: function (pushProfile, pushApiToken, companyId) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.company.addCompanyPush, companyId), {
                    push_profile: pushProfile,
                    push_api_token: pushApiToken
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCompanyPush: function (companyId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getCompanyPush, companyId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            getCompanyApp: function (companyId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getCompanyApp, companyId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            modifyCompanyApp: function (androidUrl, androidPkgName, iosUrl, iosId, companyId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.modifyCompanyApp, companyId), {
                    android_url: androidUrl,
                    pkg_name: androidPkgName,
                    ios_id: iosId,
                    ios_url: iosUrl
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            getCompaniesList: function (name) {
                var defer = $q.defer();
                HttpService.get(Api.super.getCompaniesList, {
                    search: name
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            companyStatistics: function (selectDate, type, companyId) {
                //如果是日,则取当日的23:59:59
                //如果是周,则取周末的23:59:59
                //如果是月,则取月末的23:59:59
                var date = angular.copy(selectDate);
                var timeStamp = '';
                if (type == 0) {
                    date.setDate(date.getDate() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else if (type == 1) {
                    if (date.getDay() == 0) {
                        date.setDate(date.getDate() + 1);
                    } else {
                        date.setDate(date.getDate() + 7 - date.getDay() + 1);
                    }
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                } else {
                    date.setDate(1);
                    date.setMonth(date.getMonth() + 1);
                    timeStamp = parseInt((date.valueOf() + "").substr(0, 10)) - 1;
                }
                var defer = $q.defer();
                HttpService.get(Api.super.companyStatistics, {
                    timestamp: timeStamp,
                    type: type,
                    count: 3,
                    company_id: companyId
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            getCompanySetting: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getCompanySetting, {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            editCompanySetting: function (hideDriverFee, payAuth, settleType, distanceUnit) {
                var defer = $q.defer();
                HttpService.patch(Api.company.editCompanySetting, {
                    hide_driver_fee: hideDriverFee,
                    pay_auth: payAuth,
                    settle_type: settleType,
                    distance_unit: distanceUnit
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            getProxyAdmin: function () {
                var defer = $q.defer();
                HttpService.get(Api.admin.getProxyAdmin, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            createProxyAdmin: function () {
                var defer = $q.defer();
                HttpService.put(Api.admin.createProxyAdmin, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            deleteProxyAdmin: function () {
                var defer = $q.defer();
                HttpService.delete(Api.admin.deleteProxyAdmin, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            getCompanyDisclaimer: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getCompanyDisclaimer, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            editCompanyDisclaimer: function (disclaimer) {
                var defer = $q.defer();
                HttpService.patch(Api.company.editCompanyDisclaimer, {disclaimer: disclaimer}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            changeCompanyAnSettingLock: function (companyId, locked) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.changeCompanyAnLocked, companyId),
                    {locked: locked},
                    function (response) {
                        defer.resolve({
                            data: response.data
                        });
                    }, function (treated, response) {
                        defer.reject({treated: treated, response: response});
                    });
                return defer.promise;
            },

            getMailChimpSetting: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getGroupSetting, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            updateMailChimpSetting: function (key, list) {
                var defer = $q.defer();
                HttpService.put(Api.company.getCompanyMailChimp, {
                    key: key,
                    list_id: list
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            getMailChimpList: function (key) {
                var defer = $q.defer();
                HttpService.get(Api.company.getMailChimpList + key, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            checkOutGroupList: function (key) {
                var defer = $q.defer();
                HttpService.get(Api.company.checkOutGroupKey, {key: key}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            getGroupSetting: function () {
                var defer = $q.defer();
                HttpService.get(Api.company.getGroupSetting, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            setGroupSetting: function (type, sort, key, group) {
                var defer = $q.defer();
                HttpService.post(Api.company.getGroupSetting, {
                    type: type,
                    sort: sort,
                    key: key,
                    groups: group
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            deleteGroupSetting: function (type, sort, key, group) {
                var defer = $q.defer();
                HttpService.delete(Api.company.getGroupSetting, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            modifyGroupSetting: function (type, sort, key, group) {
                var defer = $q.defer();
                HttpService.patch(Api.company.getGroupSetting, {
                    type: type,
                    sort: sort,
                    key: key,
                    groups: group
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            bindStripeAccount: function (code) {
                var defer = $q.defer();
                HttpService.post(Api.company.bindStripe, {
                    code: code
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getSalesRep: function (page, perPage, searchKeyWord) {
                var defer = $q.defer();
                var params = {
                    page: page,
                    per_page: perPage
                };

                if (searchKeyWord) {
                    params.search = searchKeyWord;
                }
                HttpService.get(Api.company.getSalesRep, params, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            createSalesRep: function (SalesRepInfo) {
                var defer = $q.defer();
                HttpService.post(Api.company.createSalesRep, {
                    first_name: SalesRepInfo.firstName,
                    last_name: SalesRepInfo.lastName,
                    password: SalesRepInfo.password,
                    email: SalesRepInfo.email,
                    mobile: SalesRepInfo.mobile,
                    country: SalesRepInfo.selectedCountry,
                    lang: SalesRepInfo.selectedLanguage
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getEditSalesRepInfo: function (salesId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getEditSalesRepInfo, salesId), {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateSalesRepInfo: function (params, salesId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.updateSalesRepInfo, salesId), {
                    param: JSON.stringify(params)
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            deleteSalesRepInfo: function (salesId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.company.deleteSalesRepInfo, salesId), {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },


            getSalesAssistant: function (page, perPage, searchKeyWord) {
                var defer = $q.defer();
                var params = {
                    page: page,
                    per_page: perPage
                };

                if (searchKeyWord) {
                    params.search = searchKeyWord;
                }
                HttpService.get(Api.company.getSalesAssistant, params, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            createSalesAssistant: function (SalesAssInfo) {
                var defer = $q.defer();
                HttpService.post(Api.company.createSalesAssistant, {
                    first_name: SalesAssInfo.firstName,
                    last_name: SalesAssInfo.lastName,
                    password: SalesAssInfo.password,
                    email: SalesAssInfo.email,
                    mobile: SalesAssInfo.mobile,
                    country: SalesAssInfo.selectedCountry,
                    lang: SalesAssInfo.selectedLanguage
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },


            getEditSalesAssistantInfo: function (salesId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.company.getEditSalesAssistantInfo, salesId), {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateSalesAssistantInfo: function (params, salesId) {
                var defer = $q.defer();
                HttpService.patch(strformat(Api.company.updateSalesAssistantInfo, salesId), {
                    param: JSON.stringify(params)
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            deleteSalesAssistantInfo: function (salesId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.company.deleteSalesAssistantInfo, salesId), {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },


            getCompaniesTotalsData: function () {
                var defer = $q.defer();
                HttpService.get(Api.salesRep.getCompaniesTotalsData, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            getAsstsCompaniesTotalsData: function () {
                var defer = $q.defer();
                HttpService.get(Api.salesAssistant.getCompaniesTotalsData, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            setCompanyCcy: function (ccy) {
                var defer = $q.defer();
                HttpService.patch(Api.company.setCcy + ccy, {}, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            }
        }
    });