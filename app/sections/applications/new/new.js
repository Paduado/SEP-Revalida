'use strict';

angular.module('myApp.new', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/applications/new', {
            templateUrl: 'sections/applications/new/new.html',
            controller: 'NewCtrl'
        });
    }])
    .controller('NewCtrl', function ($scope,$mdDialog)
    {
        $scope.application =
        {
            type: "1",
            gender: "",
            subgender: "",
            lastname1: "",
            lastname2: "",
            firstname: "",
            email: "",
            phone: "",
            sex: "",
            birthdate: "",
            country: "",
            state: "",
            city: "",
            street: "",
            colony: "",
            cp: "",
            number: "",
            acta: "",
            curp: "",
            cert: ""
        };

        $scope.isTypeSelected = function (type)
        {
            return (type == $scope.application.type);
        };
        $scope.setType = function (type)
        {
            $scope.application.type = type;
        };

        $scope.isGenderSelected = function (gender)
        {
            return (gender == $scope.application.gender);
        };
        $scope.setGender = function (gender)
        {
            $scope.application.gender = gender;
        };
        $scope.isSubgenderSelected = function (subgender)
        {
            return (subgender == $scope.application.subgender);
        };
        $scope.setSubgender = function (subgender)
        {
            $scope.application.subgender = subgender;
        };

        $scope.genderChanged = function ()
        {
            console.log($scope);
            $scope.application.subgender = undefined;
        };

        $('#birthdate').datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function (date)
            {
                var scope = angular.element($('#birthdate')).scope();
                scope.$apply(function ()
                {
                    scope.application.birthdate = date;
                });
            }
        });

        $scope.applicationIncomplete = function()
        {
            return $scope.form.$invalid || $scope.application.file1 == "" || $scope.application.file2 == "" || $scope.application.file3 == "";
        };

        $scope.submit = function ()
        {

            $scope.application.uploadTimestamp = Math.floor(Date.now());
            $scope.application.userID =  Math.floor(Date.now()).toString();
            $scope.application.applicationStatus = 1;
            var params = {
                TableName: 'applications',
                Item: $scope.application
            };

            var docClient = new AWS.DynamoDB.DocumentClient();

            docClient.put(params, function (err, data)
            {
                if (err)
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('body')))
                            .clickOutsideToClose(true)
                            .title('Error al subir la solicitud')
                            .textContent('Alguno de los campos esta vacio o con un formato erroneo.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Aceptar')
                    );
                    console.log(err);
                }
                else
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('body')))
                            .clickOutsideToClose(true)
                            .title('Solicitud dada de alta')
                            .textContent('Aparecerá en el area de pendientes para su revisión.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Aceptar')
                    );
                    $scope.application =
                    {
                        type: "1",
                        gender: "",
                        subgender: "",
                        lastname1: "",
                        lastname2: "",
                        firstname: "",
                        email: "",
                        phone: "",
                        sex: "",
                        birthdate: "",
                        country: "",
                        state: "",
                        city: "",
                        street: "",
                        colony: "",
                        cp: "",
                        number: "",
                        acta: "",
                        curp: "",
                        cert: ""
                    };
                    console.log(data);
                }
            });
        };

        $scope.deleteDoc = function(doc)
        {
            $scope.application[doc] = "";
        };
    });







