app.controller('NavbarCtrl', function($scope, $auth, $state) {

	$scope.isAuthenticated = function() {

		return $auth.isAuthenticated();
	};
});