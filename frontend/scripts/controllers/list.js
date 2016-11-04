/**
 * Created by sparshithp on 10/30/16.
 */
app.controller('ListCtrl', function ($scope, $rootScope, $auth, $state, $filter, $http, URL) {
    $rootScope.title = "Groceries";
    $scope.isAuthenticated = function () {

        return $auth.isAuthenticated();
    };

    $scope.addItem = function () {
        var itemToAdd = $scope.itemToAdd;

        if (!itemToAdd || /^\s*$/.test(itemToAdd)) {
            return;
        }
        console.log(itemToAdd);
        $http.post(URL+'/list/addItem', {item: itemToAdd})
            .then(
                function(response){
                    console.log(response);
                    $scope.items = response.data.list.items;
                    console.log($scope.items);
                    $scope.itemToAdd = null;
                },
                function(response){
                    // failure callback
                    console.log(response);
                }
            );
        //$scope.items.unshift(itemToAdd.trim());
    };

    $scope.print = function (itemId) {
        console.log(itemId);
        $http.post(URL+'/list/deleteItem', {itemId: itemId})
            .then(
                function(response){
                    console.log(response);
                    $scope.items = response.data.list.items;
                    console.log($scope.items);
                },
                function(response){
                    // failure callback
                    console.log(response);
                }
            );
    };
    /*
     $http.post(URL+'/list/add', {items: $scope.items})
     .then(
     function(response){
     console.log(response);
     },
     function(response){
     // failure callback
     console.log(response);
     }
     );
     */

    $http.get(URL + '/list/get')
        .then(function (response) {
            console.log("to");
            console.log(response);
                $scope.items = response.data.list.items;
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );

    $scope.editItem = function(itemId, itemName){
        if (!itemName || /^\s*$/.test(itemName)) {
            return;
        }
        console.log(itemId);
        console.log(itemName);
        $http.post(URL+'/list/editItem', {itemId: itemId, itemName: itemName})
            .then(
                function(response){
                    console.log(response);
                    $scope.items = response.data.list.items;
                    console.log($scope.items);
                },
                function(response){
                    // failure callback
                    console.log(response);
                }
            );
    }
});