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
        'myApp.review',
        'ngMaterial',
        'ngMessages',
        'ngDroplet',
        'md.data.table'
    ])
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.otherwise({redirectTo: '/applications/search'});
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
    .directive('dropfile', function ()
{
    return {
        scope: {
            ngModel: '=',
            onDestroy:'&',
            deletable:'='
        },
        transclude: true,
        template:
        '<h5 layout="row" layout-align="center">{{name}}</h5>'
        + '<div layout="row" layout-align="center center" ng-show="ngModel == \'\' " class="dropzone">'
        + '<p>Arrastre archivo o haga click</p>'
        + '</div>'
        + '<div  layout="row"  layout-align="center" class="file-icon-container" ng-show="ngModel != \'\'">'
        +'<md-fab-speed-dial  ng-init="open = false" md-open="open"  md-direction="right" class="md-scale md-hover-full"  ng-mouseenter="open=true" ng-mouseleave="open=false">'
        +'<md-fab-trigger style="width: 120px;">'
        + '<md-icon  class="file-icon"md-svg-src="resources/icons/ic_insert_drive_file.svg"></md-icon>'
        +'</md-fab-trigger>'
        +'<md-fab-actions>'
        +'<md-button ng-click="viewFile()" class="md-fab md-raised md-mini">'
        + '<md-tooltip md-direction="down">Ver</md-tooltip>'
        +'<md-icon md-svg-src="resources/icons/ic_search.svg" ></md-icon>'
        +'</md-button>'
        +'<md-button  ng-show="deletable" ng-click="deleteFile()" class="md-fab md-raised md-mini">'
        + '<md-tooltip md-direction="down">Eliminar</md-tooltip>'
        +'<md-icon md-svg-src="resources/icons/ic_delete_forever.svg"></md-icon>'
        +'</md-button>'
        +'</md-fab-actions>'
        +'</md-fab-speed-dial>'
        + '</div>'
        + '<md-progress-linear ng-show="indicator != undefined" md-mode="determinate" ng-value="indicator"></md-progress-linear>'
        + '<div class="name">{{filename}}</div>'
        +'<input type="file"class="input-file" style="display: none">',
        //+'<md-checkbox ng-model="open"></md-checkbox>',
        link: function (scope, element, attrs)
        {
            //scope.ngModel = "";
            scope.name = attrs.fileName;
            scope.filename = "";

            scope.$on('$destroy', function ()
            {
                scope.onDestroy();
            });

            var drop = element[0].getElementsByClassName('dropzone')[0];
            var inputFile = element[0].getElementsByClassName('input-file')[0];

            addEventHandler(drop, 'dragover', cancel);
            addEventHandler(drop, 'dragenter', cancel);
            addEventHandler(drop, 'drop', cancel);
            addEventHandler(drop, 'click', cancel);

            addEventHandler(drop, 'drop', function (e)
            {
                e = e || window.event;
                if (e.preventDefault)
                {
                    e.preventDefault();
                }
                scope.filename = e.dataTransfer.files[0].name;
                scope.onFileAdded(e.dataTransfer.files[0]);

                return false;
            });

            addEventHandler(drop, 'click', function (e)
            {
                inputFile.click();
                return false;
            });

            addEventHandler(inputFile, 'change', function(e)
            {
                e.preventDefault();
                scope.filename= e.srcElement.files[0].name;
                scope.onFileAdded(e.srcElement.files[0]);
                this.value = null;
                return false;
            });


            function addEventHandler(obj, evt, handler)
            {
                if (obj.addEventListener)
                {
                    obj.addEventListener(evt, handler, false);
                } else if (obj.attachEvent)
                {
                    obj.attachEvent('on' + evt, handler);
                } else
                {
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

            scope.onFileAdded = function (file)
            {
                scope.indicator = 1;
                scope.$digest();
                scope.upload(file, function (err, data)
                {
                    if (err)
                    {
                        console.log(err);
                        scope.indicator = undefined;
                        scope.$apply();
                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('body')))
                            .clickOutsideToClose(true)
                            .title('No se pudo subir el archivo')
                            .textContent('Verifique su conexión.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Aceptar')
                        );
                    }
                    else
                    {
                        console.log(data.Location);
                        scope.ngModel =
                        {
                            path:data.Location,
                            name:scope.name
                        };
                        scope.open = false;
                        scope.$apply();

                    }
                }, function (progress)
                {
                    scope.indicator = progress;
                    scope.$apply();
                });
            };

            scope.upload = function (file, onUpload, onUploading)
            {
                var params = {Bucket: 'sepfiles', Key: file.name, Body: file, ACL: 'public-read'};

                var s3 = new AWS.S3();

                s3.upload(params, onUpload).on('httpUploadProgress', function (event)
                {
                    onUploading(Math.floor(event.loaded / event.total * 100));
                });

            };
            scope.viewFile = function ()
            {
                window.open(scope.ngModel.path);
            };

            scope.deleteFile = function ()
            {
                scope.ngModel = "";
                scope.filename = "";
                scope.indicator = undefined;
            }
        }

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
                if(next.templateUrl != "login/login.html")
                {
                    $location.path("/login");
                }
            }
            else
            {

                $rootScope.userType = localStorage.getItem("userType");
                console.log(next.redirectTo);
                console.log(event.redirectTo);
                if(next.templateUrl == "login/login.html")
                {
                    $location.path("/applications/search");
                }

            }
        });
    });

AWS.config.region = 'us-east-1'; // Region
if(localStorage.getItem("userIsLoggedIn") === null)
{
    var creds = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:6e0e3192-e60d-4a54-9462-0c129e539d2c'
    });
    AWS.config.credentials = creds;
}
else
{
    var creds = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:6e0e3192-e60d-4a54-9462-0c129e539d2c'
    });
    AWS.config.credentials = creds;

    creds.params.IdentityPoolId = localStorage.getItem("identityPoolID");
    creds.params.IdentityId = localStorage.getItem("identityID");
    creds.params.Logins = {
        'cognito-identity.amazonaws.com': localStorage.getItem("token")
    };
    creds.expired = true;
    AWS.config.credentials.get(function(err)
    {
        if(err)
        {
            console.log(err, err.stack);
            localStorage.clear();
            location.reload();
        }
    });
}

var options = {
    appId : '8285fde146ca42b39a2e18da77549746', //Amazon Mobile Analytics App ID
    appTitle : "SEPRevalida",
    appVersionName : "0.1",
    appVersionCode : "1",
    appPackageName : "sep.smartplace.mx"
};

var mobileAnalyticsClient = new AMA.Manager(options);

mobileAnalyticsClient.submitEvents();