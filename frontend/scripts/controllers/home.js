/**
 * Created by sparshithp on 6/10/16.
 */
app.controller('HomeCtrl', function($scope, $alert, $auth, $rootScope, $http) {
    $rootScope.title = "Meals";
    console.log($auth.isAuthenticated());
    $http({
        method: 'GET',
        url: 'http://localhost:3000/area/list',
        skipAuthorization: true // `Authorization: Bearer <token>` will not be sent on this request.
    }).then(function(res){
        $scope.areas = res.data.areas;
    });
    $scope.changedArea = function(areaSelected){
        var areadId = areaSelected._id;
        console.log("****Area: "+JSON.stringify(areaSelected));
        $http({
            method: 'GET',
            url: 'http://localhost:3000/meal/list/'+areadId,
            skipAuthorization: true // `Authorization: Bearer <token>` will not be sent on this request.
        }).then(function(res){
            var meals = res.data.meals;
            $scope.meals = meals;
            console.log(res.data);
        });
    };

    $scope.getTime = function (dateTimeString){
        var date = new Date(dateTimeString);

        // convert to msec
        // add local time zone offset
        // get UTC time in msec
        var local = date.getTime() + (date.getTimezoneOffset() * 60000);

        // create new Date object for different city
        // using supplied offset
        var localDate = new Date(local);
        var hrs = padZeros(localDate.getHours(), 2);
        var min = padZeros(localDate.getMinutes(), 2);
        var amPm = "AM"
        if(hrs/12==1){
            amPm = "PM";
        }
        return hrs+":"+min+" "+amPm;
    };

    function padZeros(num, size){ return ('000000000' + num).substr(-size); }

    /*
    $http({
        method: 'GET',
        url: 'http://localhost:3000/api/me',
        skipAuthorization: true // `Authorization: Bearer <token>` will not be sent on this request.
    }).then(function(res){
        console.log(res);
    });
    */
});