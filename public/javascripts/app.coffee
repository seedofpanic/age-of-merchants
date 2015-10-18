angular.module('App', ['ngRoute', 'Auth'])
.config(['$routeProvider', ($routeProvider) ->
    $routeProvider.when('/',
      templateUrl: 'partials/index.html'
    )
    $routeProvider.when('/auth',
      templateUrl: 'partials/auth.html',
      controller: 'AuthCtrl'
    )
])