/**
 * Created by sparshithp on 10/24/16.
 */
app.controller('chatCtrl', function($scope, $auth, $alert, $http, $rootScope, $location, $anchorScroll, $stateParams, URL) {
    $location.hash('scrollArea');
    var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
    //Chat block bottom padding hack fix
    $scope.chatPadding = '0%';
    if(!iOS) {
        $scope.chatPadding = '15%';
    }
    // call $anchorScroll()
    $anchorScroll();
    $rootScope.title = "Chat";
    $scope.chats = [];
    console.log($stateParams);
    if($stateParams.lastChat) {
        $scope.chats.push({
            response: true,
            text: $stateParams.lastChat
        });
    }
    $scope.sendMessage = function(){
        if(!$scope.msg || $scope.msg.trim()==""){
            $scope.msg = "";
            return;
        }
        $scope.chats.push({
            response: false,
            text: $scope.msg
        });
        $location.hash('scrollArea');

        // call $anchorScroll()
        $anchorScroll();
        $http.post(URL+'/parse', {userId: 'sffsf', text: $scope.msg})
            .then(
                function(response){
                    $scope.msg = "";
                    $scope.chats.push({
                        response : true,
                        text: response.data
                    });
                    $location.hash('scrollArea');

                    // call $anchorScroll()
                    $anchorScroll();
                },
                function(response){
                    // failure callback
                    console.log(response);
                }
            );
    }
});