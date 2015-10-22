angular.module('App', ['ngRoute', 'Auth', 'Office', 'Tools', 'Buildings', 'ngCookies'])
.run(($location, $rootScope ) ->
  $rootScope.$on('$routeChangeStart', (next, current) ->
    if ($location.path() != '') && ($location.path() != '/') && !$rootScope.user.id
      $location.path('auth')
  )
  return
)
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
      reloadOnSearch: false
    )
])