'use strict';

angular.module('myApp.login', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
        });
    }])
    .controller('loginController',["$scope","$location","$rootScope", function ($scope,$location)
    {
    	var that = this;
    	$scope.email = "";
    	$scope.password = "";
    	$scope.loggingIn = false;
    	$scope.invalidLogin = false;
    	that.handleUpdateCredentialsResponse = function(err)
    	{
    		$scope.$apply(function()
    		{
				if (err) console.log(err, err.stack);
				else {
					$location.path("/applications/search");
				}
			});
    	};
    	that.handleLoginResponse = function(err, data)
    	{
    		$scope.$apply(function()
    		{
				$scope.loggingIn = false
				if(err)
				{
					$scope.invalidLogin = true;
					console.log(err, err.stack);
				}
				else
				{
					var output = JSON.parse(data.Payload);
					if (!output.login) {
						$scope.invalidLogin = true;
					}
					else
					{
						localStorage.setItem("userIsLoggedIn", true);
						localStorage.setItem("userType", output.userType);
						localStorage.setItem("identityID", output.identityId);
						localStorage.setItem("identityPoolID", output.identityPoolID);
						localStorage.setItem("token", output.token);

						var creds = AWS.config.credentials;
						creds.params.IdentityPoolId = output.identityPoolID;
						creds.params.IdentityId = output.identityId;
						creds.params.Logins = {
							'cognito-identity.amazonaws.com': output.token
						};
						creds.expired = true;
						AWS.config.credentials.get(that.handleUpdateCredentialsResponse);
					}
				}
			});
		};
    	$scope.doLogin = function()
    	{
    		$scope.invalidLogin = false;
  			var lambda = new AWS.Lambda();
  			var input ={
				email: $scope.email,
				password: $scope.password
			};
			$scope.loggingIn = true;
  			lambda.invoke({
				FunctionName: 'SEPLogin',
				Payload: JSON.stringify(input)
			}, that.handleLoginResponse);
    	};

    }]);