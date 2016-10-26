app.controller('SignupCtrl', function ($scope, $auth, $rootScope, $state) {
    $scope.message = "";
    $rootScope.title = "Signup";
    $scope.signup = function () {
        var fullName = $scope.fullName;
        var email = $scope.email.toLowerCase();
        var password = $scope.password;
        var phone = $scope.phone;
        var address = $scope.address;
        var zipCode = $scope.zipCode;
        var city = $scope.city;
        var confPwd = $scope.confPwd;

        if(!validateEmail(email)){
            $scope.message = "Please enter the correct email.";
            return;
        }
        if(password.length <8){
            $scope.message = "Password length should be minimum eight characters";
            return;
        }
        if(password != confPwd){
            $scope.message = "Password and confirm passwords don't match";
            return;
        }
        if(!fullName || !email || !password || !phone || !address || !zipCode || !city){
            $scope.message = "Please fill all fields";
            return;
        }
        $auth.signup({
            fullName: $scope.fullName,
            email: $scope.email,
            password: $scope.password,
            phone: $scope.phone,
            address: $scope.address,
            zipCode: $scope.zipCode,
            city: $scope.city
        }).then(function(res) {
                if(res.data && res.data.message){
                    $scope.message = res.data.message;
                    $auth.setToken(res.data.token);
                }
                $auth.setToken(res.data.token);
                $state.go("home");
            })
            .catch(function(res) {
                if(res.data && res.data.message){
                    $scope.message = res.data.message;
                }else{
                    console.log(res);
                    $scope.message = "Network error. Please try again";
                }
            });
    };
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
});