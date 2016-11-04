var app = angular.module('hubChat', [
    'ui.router',
    'satellizer',
    'mgcrea.ngStrap',
    'pubnub.angular.service',
    'ngMessages',
    'ngAnimate'
]).constant('URL', 'http://sparshith.online:8080');

app.config(function ($stateProvider, $urlRouterProvider, $authProvider, URL) {
    console.log(URL);
    $urlRouterProvider.otherwise('/');
    $authProvider.storageType = 'localStorage';
    $authProvider.loginUrl = URL+"/auth/login";
    $authProvider.signupUrl = URL+"/auth/signup";

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/chat.html',
            controller: 'chatCtrl',
            params: {
                lastChat: null
            },
            resolve: { authenticate: authenticate }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl'
        })
        .state('logout', {
            url: '/logout',
            template: null,
            controller: 'LogoutCtrl'
        })
        .state('mealDetail', {
            url: '/mealDetail',
            templateUrl: 'views/mealDetail.html',
            controller: 'mealDetailCtrl',
            params: {
                mealId: null
            }
        })
        .state('cart', {
            url: '/cart',
            templateUrl: 'views/cart.html',
            controller: 'cartCtrl'
        })
        .state('chef', {
            url: '/chef',
            templateUrl: 'views/chef.html',
            controller: 'chefCtrl'
        })
        .state('list', {
            url: '/list',
            templateUrl: 'views/list.html',
            controller: 'ListCtrl',
            resolve: { authenticate: authenticate }
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            resolve: {
                authenticated: ['$location', '$auth', function ($location, $auth) {
                    if (!$auth.isAuthenticated()) {
                        return $location.path('/login');
                    }
                }]
            }
        });

    function authenticate($q, $auth, $state, $timeout) {
        if ($auth.isAuthenticated()) {
            // Resolve the promise successfully
            return $q.when()
        } else {
            // The next bit of code is asynchronously tricky.

            $timeout(function() {
                // This code runs after the authentication promise has been rejected.
                // Go to the log-in page
                $state.go('login')
            });

            // Reject the authentication promise to prevent the state from loading
            return $q.reject()
        }
    }




});