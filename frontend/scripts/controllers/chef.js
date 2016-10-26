/**
 * Created by sparshithp on 7/2/16.
 */

app.controller('chefCtrl', function($scope, $auth, $alert, $http, $rootScope) {
    $rootScope.title = "Chef Detail";
    var id = "57ddea992eca0223696c81a5";
    $http({
        method: 'GET',
        url: 'http://localhost:3000/chef/'+id,
        skipAuthorization: true // `Authorization: Bearer <token>` will not be sent on this request.
    }).then(function(res){
        console.log(res);
        $scope.chefName=res.data.chef.name;
        $scope.chefImageUrl=res.data.chef.imageUrl;
        $scope.description =res.data.chef.description;
    });

});