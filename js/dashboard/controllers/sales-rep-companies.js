/**
 * Created by jian on 17-8-9.
 */
angular.module('KARL.Controllers')
    .controller('salesRapCompaniesCtrl',function (CompanyBS,$scope,$timeout) {
        var firstLoad = true;
        $scope.showSearchResult = false;
        loadData();
        function loadData() {
            CompanyBS.getCompaniesTotalsData().then(function (result) {
                $timeout( function() {
                    console.log(result);
                    $scope.companieList=result.data.result;
                    $scope.$apply();
                    if(firstLoad){
                        $("#vehicle-accordion").accordion({
                            header: 'h3.myselect',
                            active: false,
                            collapsible:true,
                            heightStyle: "content"
                        });
                    }else {
                        $("#vehicle-accordion").accordion("refresh");
                        $("#vehicle-accordion").accordion( "option", "active",false);
                    }
                    firstLoad = false;
                });
            },function (error) {
                console.log(error)
            })
        }

        $scope.$watch('input.searchText', function (word) {
            console.log(word);
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
                    $("#vehicle-accordion").accordion({
                        header: 'h3.myselect',
                        active: false,
                        collapsible:true,
                        heightStyle: "content"
                    });
                }else {
                    $("#vehicle-accordion").accordion("refresh");
                    $("#vehicle-accordion").accordion( "option", "active",false);
                }
                firstLoad = false;
            },0);
            return searchList
        }
    });