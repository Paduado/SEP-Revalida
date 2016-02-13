'use strict';

angular.module('myApp.review', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/applications/review', {
            templateUrl: 'sections/applications/review/review.html',
            controller: 'ReviewCtrl'
        });
    }])
    .controller('ReviewCtrl', ['$scope','$rootScope',function ($scope,$rootScope)
    {
        $scope.application = $rootScope.application;

        $scope.openFile = function(file)
        {
            window.open(file);
        };
    }]);







