angular.module('App', ['ngRoute', 'Auth', 'Office', 'Tools', 'Buildings'])
.config(['$routeProvider', ($routeProvider) ->
    $routeProvider.when('/',
      templateUrl: 'partials/index.html'
    )
    $routeProvider.when('/auth',
      templateUrl: 'partials/auth.html'
      controller: 'AuthCtrl'
    )
    $routeProvider.when('/office/:profile_name?/:tab?',
      templateUrl: 'partials/office.html'
      controller: 'OfficeCtrl as office'
    )
])