'use strict';
var creds = {};

// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'myApp.version',
        'sidebarMenu',
        'topBar',
        'myApp.login',
        'myApp.search',
        'myApp.new',
        'ngMaterial',
        'ngMessages',
        'ngDroplet'
    ])
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.otherwise({redirectTo: '/applications/install'});
    }])
    .config(function ($mdThemingProvider)
    {
        $mdThemingProvider.theme('default')
            .primaryPalette('red')
            .accentPalette('brown');
    })
    .factory('focus', function ($timeout, $window)
    {
        return function (id)
        {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function ()
            {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    })
    .directive('eventFocus', function (focus)
    {
        return function (scope, elem, attr)
        {
            elem.on(attr.eventFocus, function ()
            {
                focus(attr.eventFocusId);
            });

            // Removes bound events in the element itself
            // when the scope is destroyed
            scope.$on('$destroy', function ()
            {
                elem.off(attr.eventFocus);
            });
        };
    })
    .run(function($rootScope, $location)
    {
        // register listener to watch route changes
        $rootScope.$on( "$routeChangeStart", function(event, next, current)
        {
            if(localStorage.getItem("userIsLoggedIn") === null)
            {
                $rootScope.userType = 0;
                console.log(next.redirectTo);
                // no logged user, we should be going to #login
                if(!next.redirectTo == "/login" )
                {
                    $location.path("/login");
                }
            }
            else
            {
                $rootScope.userType = localStorage.getItem("userType");
                console.log(next.redirectTo);
            }
        });
    });

AWS.config.region = 'us-east-1'; // Region
creds = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:6e0e3192-e60d-4a54-9462-0c129e539d2c',
});
AWS.config.credentials = creds;