/**
 * Created by sparshithp on 2/7/16.
 */
app.controller('mealDetailCtrl', function($scope, $auth, $alert, $http, $rootScope, $stateParams) {
    $rootScope.title = "Order Meal"
    var mealId = $stateParams.mealId;
    console.log(mealId);
});