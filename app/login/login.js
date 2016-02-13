'use strict';

angular.module('myApp.login', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
        });
    }])
    .controller('loginController', function ($scope)
    {
    	$scope.email = "";
    	$scope.password = "";
    	$scope.invalidLogin = false;

    	$scope.doLogin = function()
    	{
    		console.log($scope.email);
    		console.log($scope.password);
    		$scope.invalidLogin = false;
  			var lambda = new AWS.Lambda();
  			var input ={
				email: $scope.email,
				password: $scope.password
			};
  			lambda.invoke({
				FunctionName: 'SEPLogin',
				Payload: JSON.stringify(input)
			}, function(err, data)
			{
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
						// You will never know what happens before :)
						//creds.expire = true;
						// You will never know what happens next :)
						localStorage.setItem("userIsLoggedIn", true);
						localStorage.setItem("userType", output.userType);
      					window.location.reload();
					}
				}
			});
    	}

    });