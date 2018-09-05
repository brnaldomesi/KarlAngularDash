/**
 * Created by jian on 17-9-11.
 */

angular.module('KARL.Controllers')
    .controller('salesAssistantCompaniesCtrl', function (CompanyBS, $scope, $timeout, MessageBox) {
        var firstLoad = true;
        loadData();
        function loadData() {
            MessageBox.showLoading();
            CompanyBS.getAsstsCompaniesTotalsData().then(function (result) {
                MessageBox.hideLoading();
                $scope.companieList = result.data.result;
                $scope.salesList=integrationCompanyInSales(result.data.result);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("stats.jsGet_statistics_fail"), "error");
                }
            })
        }


        function integrationCompanyInSales(companies) {
            console.log(companies);
            var salesForCompanyArray = [];
            for (var i = 0; i < companies.length; i++) {
                var haveCompany=true;
                for (var k = 0; k < salesForCompanyArray.length; k++) {
                    if (salesForCompanyArray[k].salesId===companies[i].sale_id) {
                        haveCompany=false;
                        salesForCompanyArray[k].companiesCount++;
                        salesForCompanyArray[k].companies.push(companies[i])
                    }
                }
                if(haveCompany){
                    var item={
                        'salesId':companies[i].sale_id,
                        'salesName':companies[i].first_name+companies[i].last_name,
                        'companies':[companies[i]],
                        'companiesCount':1
                    };
                    salesForCompanyArray.push(item)
                }

            }

            $timeout(function () {
                $(function () {
                    $("#rates-vehicle-accordion").accordion({
                        header: 'h3.myselect',
                        active: true,
                        alwaysOpen: false,
                        animated: false,
                        collapsible: true,
                        heightStyle: "content",
                        beforeActivate: function (event, ui) {
                            $(".rates-sub-accordion").accordion({
                                header: 'div.rates-sub',
                                active: true,
                                alwaysOpen: false,
                                animated: false,
                                collapsible: true,
                                heightStyle: "content"
                            });
                        }
                    });
                });
            }, 0);
           return salesForCompanyArray
        }

        $scope.$watch('input.searchText', function (word) {
            if (word) {
                $scope.searchResult = search(word);
                $scope.showSearchResult = true;
            } else {
                $scope.showSearchResult = false;
            }
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        function search(searchKeyWord) {
            var searchList = [];
            angular.forEach($scope.companieList, function (item) {
                if (
                    item.name.toString().toLowerCase().indexOf(searchKeyWord.toString().toLowerCase()) >= 0
                ) {
                    searchList.push(item)
                }
            });
            $timeout( function() {
                if(firstLoad){
                    $(".rates-subs-accordion").accordion({
                        header: 'div.rates-sub',
                        active: true,
                        alwaysOpen: false,
                        animated: false,
                        collapsible: true,
                        heightStyle: "content"
                    });
                }else {
                    $(".rates-subs-accordion").accordion("refresh");
                    $(".rates-subs-accordion").accordion( "option", "active",false);
                }
                firstLoad = false;
            },0);
            return searchList
        }
    });