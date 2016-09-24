angular.module('App', ['ngRoute', 'Auth', 'Office', 'Tools', 'Buildings', 'ngCookies', 'Map', 'Users', 'User'])
  .run(run)
  .config(config);

run.$inject = ['$location', '$rootScope'];

function run($location, $rootScope ) {
  $rootScope.$on('$routeChangeStart', function (next, current) {
    if (($location.path() != '') && ($location.path() != '/') && !$rootScope.user.id) {
      $location.path('auth');
    }
    if ($location.path() == '') {
      $location.path('/');
    }
  });
}

config.$inject = ['$routeProvider'];

function config($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/index.html'
  });
  $routeProvider.when('/auth', {
    templateUrl: 'partials/auth.html',
    controller: 'AuthCtrl'
  });
  $routeProvider.when('/office/:profile_id?/:tab?', {
    templateUrl: 'partials/office.html',
    controller: 'OfficeCtrl as office',
    reloadOnSearch: false
  });
  $routeProvider.when('/map', {
    templateUrl: 'partials/map.html',
    controller: 'MapCtrl as mc'
  });
  $routeProvider.when('/users', {
    templateUrl: 'partials/users.html',
    controller: 'UsersCtrl as uc'
  });
  $routeProvider.when('/profile/:tab?', {
    templateUrl: 'partials/user.html',
    controller: 'UserCtrl as uc',
    reloadOnSearch: false
  });
}