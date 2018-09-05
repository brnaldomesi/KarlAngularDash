/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 2/24/16.
 */
angular.module('KARL.Services')
    .factory('CustomerBS', function ($q, $rootScope, HttpService, strformat, AddressTool) {
        return {
            searchCurrentCustomers: function (key) {
                var defer = $q.defer();
                HttpService.get(Api.customer.searchCurrentCustomers, {
                    search: key
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            checkPaymentExistCustomer:function (cId) {
                var defer = $q.defer();
                HttpService.get(Api.customer.checkPaymentExistCustomer+cId, {
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            customerRegister: function (username, password, firstName, lastName, mobile, email) {
                var defer = $q.defer();
                HttpService.post(strformat(Api.customer.customerRegister, $rootScope.loginUser.company_id), {
                    username: username,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                    mobile: mobile,
                    email: email
                }, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            /**
             * 获取当前登录用户的客户
             * @param page
             * @param count
             * @param keyword
             * @returns {Promise}
             */
            getFromCurrentUser: function (page, count, keyword) {
                var defer = $q.defer();

                var params = {
                    page: page,
                    per_page: count
                };

                if (keyword) {
                    params.search = keyword;
                }

                HttpService.get(Api.customer.getFromCurrentUser, params, function (response) {
                    angular.forEach(response.data.result.customers, function (customer) {
                        if (customer.address) {
                            if (customer.address.indexOf('formatted_address') > 0) {
                                customer.address = JSON.parse(customer.address);
                            }else {
                                if(customer.address == "{}"){
                                    customer.address = '';
                                }
                            }
                            customer.final_address = AddressTool.finalAddress(customer.address);
                        }
                    });
                    defer.resolve({
                        data: response.data.result.customers,
                        total: response.data.result.total
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            /**
             *
             * @param param
             * @returns {Promise}
             */
            addToCurrentUser: function (param) {
                var defer = $q.defer();

                var sendParams = {
                    param: JSON.stringify(param)
                };

                HttpService.post(Api.customer.getFromCurrentUser, sendParams, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },

            /**
             * 从当前登录用户删除customer
             * @param customerId
             */
            deleteFromCurrentUser: function (customerId) {
                var defer = $q.defer();
                HttpService.delete(strformat(Api.customer.getDetailFromCurrentUser, customerId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            /**
             * 获取当前登录用户的客户详情
             * @param customerId
             * @returns {Promise}
             */
            getDetailFromCurrentUser: function (customerId) {
                var defer = $q.defer();
                HttpService.get(strformat(Api.customer.getDetailFromCurrentUser, customerId), {}, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },

            updateToCurrentUser: function (param) {
                var defer = $q.defer();
                var sendParams = {
                    param: JSON.stringify(param)
                };

                HttpService.patch(strformat(Api.customer.updateToCurrentUser, param.customerId), sendParams, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            },
            getCustomerMCList:function(email){
                var defer = $q.defer();
                HttpService.get(Api.customer.getOutGroupListMember, {
                    email:email
                }, function (response) {
                    defer.resolve({
                        data: response.data
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });
                return defer.promise;
            },
            changeCustomerMCList : function(param){
                var defer = $q.defer();
                HttpService.patch(Api.customer.changeOutGroupList, param, function (response) {
                    defer.resolve({
                        data: response.data.result
                    });
                }, function (treated, response) {
                    defer.reject({treated: treated, response: response});
                });

                return defer.promise;
            }
        }



    });