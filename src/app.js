const indexTemplate = require('./../jade/index.jade');
const authTemplate = require('./../jade/auth.jade');
const officeTemplate = require('./../jade/office.jade');
const mapTemplate = require('./../jade/map.jade');
const usersTemplate = require('./../jade/users.jade');
const userTemplate = require('./../jade/user.jade');

// styles
require('./../css/semantic.min.css');
require('./../css/style.css');

window.$ = window.jQuery = require('./../bower_components/jquery/dist/jquery');
require('./../bower_components/angular/angular.min');
require('./../bower_components/angular-route/angular-route.min');
require('./../bower_components/angular-cookies/angular-cookies.min');
require('./semantic.min');

require('./modules/auth');
require('./modules/building');
require('./modules/buildings');
require('./modules/db');
require('./modules/dropdown');
require('./modules/map');
require('./modules/office');
require('./modules/tools');
require('./modules/user');
require('./modules/users');

angular.module('App', ['ngRoute', 'Auth', 'Office', 'Tools', 'Buildings', 'ngCookies', 'Map', 'Users', 'User'])
  .run(run)
  .config(config);

run.$inject = ['$location', '$rootScope'];

function run($location, $rootScope) {
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
    template: indexTemplate
  });
  $routeProvider.when('/auth', {
    template: authTemplate,
    controller: 'AuthCtrl'
  });
  $routeProvider.when('/office/:profile_id?/:tab?', {
    template: officeTemplate,
    controller: 'OfficeCtrl as office',
    reloadOnSearch: false
  });
  $routeProvider.when('/map', {
    template: mapTemplate,
    controller: 'MapCtrl as mc'
  });
  $routeProvider.when('/users', {
    template: usersTemplate,
    controller: 'UsersCtrl as uc'
  });
  $routeProvider.when('/profile/:tab?', {
    template: userTemplate,
    controller: 'UserCtrl as uc',
    reloadOnSearch: false
  });
}