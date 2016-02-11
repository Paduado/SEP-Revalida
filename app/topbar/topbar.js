/**
 * Created by robertoreym on 27/01/16.
 */
'use strict';

(function(){

    var app = angular.module('topBar',[]);

    app.directive('topBar',function(){
        return{
            restrict: 'E',
            templateUrl:'topbar/topbar.html',
            controller: ['$scope',function ($scope) {

            }]
        };

    });
    app.config(function($logProvider){
        $logProvider.debugEnabled(true);
    });
})();
