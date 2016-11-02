/**
 * Created by sparshithp on 10/30/16.
 */
app.controller('ListCtrl', function($scope, $auth, $state, $filter, $http, URL) {

    $scope.isAuthenticated = function() {

        return $auth.isAuthenticated();
    };
    $scope.items = ["1 Kg Toor Dal", "100g Onions", "2 Rin Soap"];

    $scope.addItem = function(){
        var itemToAdd = $scope.itemToAdd;
        if(!itemToAdd || /^\s*$/.test(itemToAdd)){
            return;
        }
        $scope.items.unshift(itemToAdd.trim());
        $scope.itemToAdd = null;
    };

    $scope.print = function(index){
        console.log(index);
        $scope.items.splice(index, 1);
    };

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
});