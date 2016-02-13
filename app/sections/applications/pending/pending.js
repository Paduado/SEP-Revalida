'use strict';

angular.module('myApp.new', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/applications/new', {
            templateUrl: 'sections/applications/new/pending.html',
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
            file1: "",
            file2: "",
            file3: ""
        };

        $scope.progress1 = 0;
        $scope.progress2 = 0;
        $scope.progress3 = 0;

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
            //    if (err)
            //    {
            //        $mdDialog.show(
            //            $mdDialog.alert()
            //                .parent(angular.element(document.querySelector('body')))
            //                .clickOutsideToClose(true)
            //                .title('Error al subir la solicitud')
            //                .textContent('Alguno de los campos esta vacio o con un formato erroneo.')
            //                .ariaLabel('Alert Dialog Demo')
            //                .ok('Aceptar')
            //        );
            //        console.log(err);
            //    }
            //    else
            //    {
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
                        file1: "",
                        file2: "",
                        file3: ""
                    };
                    console.log(data);
                //}
            //});
        };


        $scope.onFileAdded = function (file, prop, indicator)
        {
            $scope[indicator] = 1;
            $scope.$digest();
            $scope.upload(file, function (err, data)
                {
                    if (err)
                        console.log(err);
                    else
                    {
                        console.log(data.Location);
                        //onUpload(data);
                        $scope.application[prop] = data.Location;
                        $scope.$digest();
                    }
                },
                function (progress)
                {
                    $scope[indicator] = progress;
                    $scope.$digest();
                });
        };

        $scope.upload = function (file, onUpload, onUploading)
        {
            var params = {Bucket: 'sepfiles', Key: file.name, Body: file,ACL: 'public-read'};

            var s3 = new AWS.S3();

            s3.upload(params, onUpload).on('httpUploadProgress', function (event)
            {
                console.log(Math.floor(event.loaded / event.total * 100));
                onUploading(Math.floor(event.loaded / event.total * 100));
            });

        };
        $scope.deleteFile = function (prop, indicator)
        {
            $scope.application[prop] = "";
            $scope[indicator] = 0;
            $scope.$digest()
        }

    }).directive('dropfile', function ($compile)
{
    return function ($scope, element, attrs)
    {
        var drop = element[0].getElementsByClassName('dropzone')[0];
        var iconContainer = element[0].getElementsByClassName('file-icon-container')[0];
        var fileIcon = iconContainer.getElementsByClassName('file-icon')[0];
        var deleteIcon = iconContainer.getElementsByClassName('delete-icon')[0];
        var name = element[0].getElementsByClassName('name')[0];
        var inputFile = document.getElementById('input-file');

        addEventHandler(drop, 'dragover', cancel);
        addEventHandler(drop, 'dragenter', cancel);
        addEventHandler(drop, 'drop', function (e)
        {
            e = e || window.event; // get window.event if e argument missing (in IE)
            if (e.preventDefault)
            {
                e.preventDefault();
            } // stops the browser from redirecting off to the image.
            name.innerHTML = e.dataTransfer.files[0].name;
            $scope.onFileAdded(e.dataTransfer.files[0], attrs.prop, attrs.indicator);

            return false;
        });

        addEventHandler(drop, 'click', function (e)
        {
            inputFile.dataset.prop = attrs.prop;
            inputFile.click();
            return false;
        });

        addEventHandler(iconContainer, 'click', function (e)
        {
            name.innerHTML = "";
            $scope.deleteFile(attrs.prop, attrs.indicator);
            return false;
        });
        addEventHandler(iconContainer, 'mouseover', function (e)
        {
            fileIcon.style.opacity = 0;
            deleteIcon.style.opacity = 1;
            return false;
        });
        addEventHandler(iconContainer, 'mouseleave', function (e)
        {
            fileIcon.style.opacity = 1;
            deleteIcon.style.opacity = 0;
            return false;
        });

        addEventHandler(inputFile, 'change', function (e)
        {
            if (this.dataset.prop == attrs.prop)
            {
                name.innerHTML = e.srcElement.files[0].name;
                $scope.onFileAdded(e.srcElement.files[0], attrs.prop, attrs.indicator);
            }
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
    };
});

function dropArea(drop, onFileAdded)
{
    //var drop = document.getElementById(id);


}






