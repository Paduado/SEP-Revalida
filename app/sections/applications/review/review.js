'use strict';

angular.module('myApp.review', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/applications/review', {
            templateUrl: 'sections/applications/review/review.html',
            controller: 'ReviewCtrl'
        });
    }])
    .controller('ReviewCtrl', ['$scope','$rootScope','$mdDialog',function ($scope,$rootScope,$mdDialog)
    {
        $scope.application = $rootScope.application;

        $scope.openFile = function(file)
        {
            window.open(file);
        };


        $scope.accept =  function()
        {
            var docClient = new AWS.DynamoDB.DocumentClient();
            var table = "applications";

            var date = new Date().getTime();

            // Update the item, unconditionally,

            var params = {
                TableName:table,
                Key:{
                    "userID": $scope.application.userID,
                },
                UpdateExpression: "set applicationStatus = :s, uploadTimestamp = :u",
                ExpressionAttributeValues:{
                    ":s": 2,
                    ":u": date
                },
                ReturnValues:"UPDATED_NEW"
            };

            console.log("Updating the item...");
            docClient.update(params, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('body')))
                            .clickOutsideToClose(true)
                            .title('Solicitud Aceptada')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Aceptar')
                    );
                    $scope.go('applications/search');
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });



        };

        $scope.reject = function ()
        {
            var docClient = new AWS.DynamoDB.DocumentClient();
            var table = "applications";

            var date = new Date().getTime();

            // Update the item, unconditionally,

            var params = {
                TableName:table,
                Key:{
                    "userID": $scope.application.userID,
                },
                UpdateExpression: "set applicationStatus = :s, uploadTimestamp = :u",
                ExpressionAttributeValues:{
                    ":s": 3,
                    ":u": date
                },
                ReturnValues:"UPDATED_NEW"
            };

            console.log("Updating the item...");
            docClient.update(params, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('body')))
                            .clickOutsideToClose(true)
                            .title('Solicitud Cancelada')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Aceptar')
                    );
                    $scope.go('applications/search');
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });
        }
    }]);







