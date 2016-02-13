'use strict';

angular.module('myApp.search', ['ngRoute', 'smart-table'])

    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/applications/search', {
            templateUrl: 'sections/applications/search/search.html',
            controller: 'SearchCtrl'
        });
    }])

    .controller('SearchCtrl', ['$scope', '$rootScope', function ($scope, $rootScope)
    {


        var params = {
            TableName: "applications"
        };

        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.scan(params, onScan);

        function onScan(err, data)
        {
            if (err)
            {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else
            {
                console.log("Scan succeeded.");
                console.log(data.Items);
                $scope.applications = data.Items;
                $scope.$digest();
                if (typeof data.LastEvaluatedKey != "undefined")
                {
                    console.log("Scanning for more...");
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    docClient.scan(params, onScan);
                }
            }
        }

        $scope.formatDate = function (timestamp)
        {
            var date = new Date();
            date.setTime(timestamp);

            var month = date.getMonth() + 1;
            var day = date.getDate();


            month = (month < 10 ? "0" : "") + month;
            day = (day < 10 ? "0" : "") + day;
            return  date.getFullYear() + "-" + month + "-" + day;

        };

        $scope.getStatus = function (status)
        {
            switch (status)
            {
                case 1:
                    return "Pendiente";
                case 2:
                    return "Aceptado";
                case 3:
                    return "Rechazado";
            }
        };


        $scope.openDetails = function (app)
        {
            $rootScope.application = app;
            $scope.go('/applications/review')
        };


    }]);