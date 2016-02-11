'use strict';

angular.module('myApp.search', ['ngRoute','smart-table'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/applications/search', {
    templateUrl: 'sections/applications/search/search.html',
    controller: 'SearchCtrl'
  });
}])

.controller('SearchCtrl', ['$scope',function($scope) {

  $scope.applications = [
    {
      'id':98756,
      'date':2342362333,
      'status':'Aprobada',
      'name':'Roberto Rey',
      'type':'Solicitud'
    },
    {
      'id':23546,
      'date':234236233,
      'status':'Cancelada',
      'name':'Soberto Rey',
      'type':'Application'
    },
    {
      'id':5634,
      'date':23423623,
      'status':'Aprobada',
      'name':'Aoberto Rey',
      'type':'Solicitud'
    },
    {
      'id':98756,
      'date':2342362333,
      'status':'Aprobada',
      'name':'Roberto Rey',
      'type':'Solicitud'
    },
    {
      'id':23546,
      'date':234236233,
      'status':'Cancelada',
      'name':'Soberto Rey',
      'type':'Application'
    },
    {
      'id':5634,
      'date':23423623,
      'status':'Aprobada',
      'name':'Aoberto Rey',
      'type':'Solicitud'
    },
    {
      'id':98756,
      'date':2342362333,
      'status':'Aprobada',
      'name':'Roberto Rey',
      'type':'Solicitud'
    },
    {
      'id':23546,
      'date':234236233,
      'status':'Cancelada',
      'name':'Soberto Rey',
      'type':'Application'
    },
    {
      'id':5634,
      'date':23423623,
      'status':'Aprobada',
      'name':'Aoberto Rey',
      'type':'Solicitud'
    },
    {
      'id':98756,
      'date':2342362333,
      'status':'Aprobada',
      'name':'Roberto Rey',
      'type':'Solicitud'
    },
    {
      'id':23546,
      'date':234236233,
      'status':'Cancelada',
      'name':'Soberto Rey',
      'type':'Application'
    },
    {
      'id':5634,
      'date':23423623,
      'status':'Aprobada',
      'name':'Aoberto Rey',
      'type':'Solicitud'
    }

  ];

}]);