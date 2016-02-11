'use strict';

angular.module('myApp.new', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/applications/new', {
            templateUrl: 'sections/applications/new/new.html',
            controller: 'NewCtrl'
        });
    }])

    .controller('NewCtrl', function ($scope)
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
            number: ""
        };

        $scope.progress = 0;


        $scope.file1 = "";
        $scope.file2 = "";

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

        $scope.submit = function ()
        {
            //console.log($scope.application);
            //$scope.application.uploadTimestamp = "sdadsada";
            //$scope.application.userID = "ddsda";
            //var params = {
            //    TableName: 'applications',
            //    Item: $scope.application
            //};
            //
            //var docClient = new AWS.DynamoDB.DocumentClient();
            //
            //docClient.put(params, function (err, data)
            //{
            //    if (err) console.log(err);
            //    else console.log(data);
            //});
            alert($scope.file1);
            alert($scope.file2);
        };


    })
    .controller('fileUpload', function ($scope)
    {
        $scope.prop = "file";
        $scope.drop;
        $scope.test = function ()
        {
            alert("dos");
            $scope.$parent.file2 = "dos";
        };


        $scope.upload = function (file)
        {
            var params = {Bucket: 'sepfiles', Key: file.name, Body: file};

            var s3 = new AWS.S3();

            s3.upload(params, function (err, data)
            {
                if (err)
                    console.log(err);
                else
                {
                    console.log(data.Location);
                    $scope.$parent[$scope.prop] = data.Location;
                }

            }).on('httpUploadProgress', function (event)
            {
                console.log(Math.floor(event.loaded / event.total * 100));
                $scope.progress = Math.floor(event.loaded / event.total * 100);
                $scope.$digest();
            });

        };


        dropArea("drop1", function onFileAdded(file)
        {
            $scope.upload(file);
        });


        $scope.test = function ()
        {
            alert('sadsad');
        };
    });

function dropArea(id, onFileAdded)
{
    var drop = document.getElementById(id);


    addEventHandler(drop, 'dragover', cancel);
    addEventHandler(drop, 'dragenter', cancel);
    addEventHandler(drop, 'drop', function (e)
    {
        e = e || window.event; // get window.event if e argument missing (in IE)
        if (e.preventDefault)
        {
            e.preventDefault();
        } // stops the browser from redirecting off to the image.

        onFileAdded(e.dataTransfer.files[0]);

        return false;
    });


    function addEventHandler(obj, evt, handler)
    {
        if (obj.addEventListener)
        {
            // W3C method
            obj.addEventListener(evt, handler, false);
        } else if (obj.attachEvent)
        {
            // IE method.
            obj.attachEvent('on' + evt, handler);
        } else
        {
            // Old school method.
            obj['on' + evt] = handler;
        }
    }

    function cancel(e)
    {
        if (e.preventDefault)
        {
            e.preventDefault();
        }
        return false;
    }
}






