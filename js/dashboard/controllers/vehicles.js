/**
 * http://www.myideaway.com
 * Created by Tommy Chen on 12/7/15.
 */
angular.module('KARL.Controllers')
    .controller('VehiclesCtrl', function ($log, $scope, $rootScope, $state, $uibModal, $timeout, $filter,MessageBox, CarBS,T) {
        if(!$rootScope.loginUser){
            return;
        }

        $scope.showSearchResult = false;

        //添加车辆
        $scope.onAddButtonClick = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/vehicle-add.html',
                controller: 'VehicleAddCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        event: {
                            addSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onEditButtonClick = function (carId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/dashboard/vehicle-edit.html',
                controller: 'VehicleEditCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    $stateParams: {
                        data: {
                            carId: carId
                        },
                        event: {
                            editSuccess: function () {
                                modalInstance.dismiss();
                                loadData();
                            },
                            cancel: function () {
                                modalInstance.dismiss();
                            }
                        }
                    }
                }
            });
        };

        $scope.onDeleteButtonClick = function (id) {
            MessageBox.showLoading();
            CarBS.deleteFromCurrentUser(id).then(function (result) {
                MessageBox.hideLoading();
                MessageBox.toast(T.T("vehicles.jsDelete_success"), "Success");
                loadData();
            }, function (error) {
                console.log(error);
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    if (error.response.data.code == "3605")
                    {
                        $timeout(function ()
                        {
                            MessageBox.confirm(T.T('alertTitle.warning'), $filter('translate')('vehicles.jsDelete_vehicle_warning', {length: error.response.data.result.length}), function (isConfirm)
                            {
                                if (isConfirm)
                                {
                                    //$state.go("calendar");
                                    $state.go("calendar",{data:{bookId: error.response.data.result[0].id}});
                                }
                            });
                        }, 500);
                    }
                    else {
                        MessageBox.toast(T.T("vehicles.jsDelete_fail"), "error");
                    }
                }
            });
        };

        // Function
        var originalCars = [];
        var firstLoad = true;
        var loadData = function () {
            MessageBox.showLoading();
            CarBS.getCurrentUserAll().then(function (result) {
                MessageBox.hideLoading();
                $timeout(function () {
                    originalCars = result.data.cars;
                    $scope.brands = integrationCarInBrand(originalCars);

                    if(searchText && $scope.showSearchResult){
                        $scope.searchResult = getSearchCarsResult(originalCars,searchText);
                    }else {
                        $scope.searchResult = originalCars;
                    }
                    $scope.$apply();

                    $( function() {
                        $(".card-more").click(function(){
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".searchcard-more").click(function(){
                            $(this).next().fadeToggle();
                            $(this).fadeToggle(
                                $(this).children("i").toggleClass("fa-ellipsis-v")
                            );
                        });
                        $(".gen").click(function(){
                            $(this).parent().find(".gen-panel").fadeIn(200);
                        });
                        $(".gen-cancel").click(function(){
                            $(this).parents(".gen-panel").fadeOut(200);
                        });
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
                },0);
            }, function (error) {
                MessageBox.hideLoading();
                if (error.treated) {
                }
                else {
                    MessageBox.toast(T.T("vehicles.jsGet_car_failed"), "error");
                }
            });
        };

        //以category整合车辆数据
        var integrationCarInCategory = function (cars) {
            var tempCategorys = [];
            angular.forEach(cars,function (car) {
                var findCategory = false;
                for (var i=0;i<tempCategorys.length;i++){
                    if(tempCategorys[i].categoryId == car.category_id){
                        findCategory = true;
                        var findCar = false;
                        for (var j=0;j<tempCategorys[i].cars.length;j++){
                            if(tempCategorys[i].cars[j].id == car.id){
                                findCar = true;
                                break;
                            }
                        }
                        if(!findCar){
                            tempCategorys[i].cars.push(car);
                        }
                        break;
                    }
                }
                if(!findCategory){
                    var category = {"categoryId":car.category_id,
                                    "categoryName":car.category,
                                    "cars":[car]};
                    tempCategorys.push(category);
                }
            });
            return tempCategorys;
        };

        //以brand整合车辆数据
        var integrationCarInBrand = function (cars) {
            var tempBrands = [];
            angular.forEach(cars,function (car) {
                var findBrand = false;
                for (var i=0;i<tempBrands.length;i++){
                    if(tempBrands[i].brandName == car.brand){
                        findBrand = true;
                        var findCar = false;
                        for (var j=0;j<tempBrands[i].cars.length;j++){
                            if(tempBrands[i].cars[j].id == car.id){
                                findCar = true;
                                break;
                            }
                        }
                        if(!findCar){
                            tempBrands[i].cars.push(car);
                        }
                        break;
                    }
                }
                if(!findBrand){
                    var brand = {"brandName":car.brand,
                                 "cars":[car]};
                    tempBrands.push(brand);
                }
            });
            return tempBrands;
        };

        var searchText = undefined;
        $scope.$watch('input.searchText', function (word) {
            $timeout(function () {
                if (!word) {
                    $scope.showSearchResult = false;
                    searchText = undefined;
                }else {
                    $scope.showSearchResult = true;
                    searchText = word;
                    $scope.searchResult = [];
                    $scope.$apply();

                    $scope.searchResult = getSearchCarsResult(originalCars,word);
                    $scope.$apply();
                    $(".searchcard-more").click(function(){
                        $(this).next().fadeToggle();
                        $(this).fadeToggle(
                            $(this).children("i").toggleClass("fa-ellipsis-v")
                        );
                    });
                    $(".gen").click(function(){
                        $(this).parent().find(".gen-panel").fadeIn(200);
                    });
                    $(".gen-cancel").click(function(){
                        $(this).parents(".gen-panel").fadeOut(200);
                    });
                }
            }, 100);
        });

        $scope.onCancelSearchButtonClick = function () {
            $scope.input.searchText = undefined;
        };

        var getSearchCarsResult = function (originalCars,searchText) {
            var tempSearch = [];
            angular.forEach(originalCars,function (car) {
                if(car.model.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                    || car.brand.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                    || car.license_plate.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1){
                    tempSearch.push(car);
                }
            });
            return tempSearch;
        };

        // Init
        loadData();
    });
