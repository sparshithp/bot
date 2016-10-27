app.controller('LoginCtrl', function ($scope, $alert, $auth, $state, $rootScope) {
    $rootScope.title = "Login";
    $scope.message="";


    $scope.login = function () {
        $scope.message="";
        var email = $scope.email;
        var password = $scope.password;


        if(!email || !password){
            $scope.message = "Please fill all fields";
            return;
        }
        email = email.toLowerCase();


        $auth.login({email: email, password: password})
            .then(function (res) {
                if (res.data && res.data.message) {
                    $scope.message = res.data.message;
                    $auth.setToken(res.data.token);
                }
                $auth.setToken(res.data.token);
                $state.go("home");

            })
            .catch(function (res) {
                if (res.data && res.data.message) {
                    $scope.message = res.data.message;
                } else {
                    $scope.message = "Network error. Please try again";
                }
            });
    };

    $scope.authenticate = function (provider) {
        $auth.authenticate(provider)
            .then(function () {
            })
            .catch(function (response) {
            });
    };
});