const indexTemplate = require('./../jade/index.jade');
const authTemplate = require('./../jade/auth.jade');
const officeTemplate = require('./../jade/office.jade');
const mapTemplate = require('./../jade/map.jade');
const usersTemplate = require('./../jade/users.jade');
const userTemplate = require('./../jade/user.jade');

// styles
require('./../css/semantic.min.css');
require('./../css/style.css');

require('angular');
require('angular-route');
require('angular-cookies');

import './modules/auth.ts';
import './modules/building.ts';
import './modules/buildings.ts';
import './modules/db.ts';
import './modules/dropdown.ts';
import './modules/map.ts';
import './modules/office.ts';
import './modules/tools.ts';
import './modules/user.ts';
import './modules/users.ts';

class _run {
  public $inject = ['$location', '$rootScope', '$http'];
  constructor($location, $rootScope, $http) {
    $http.get('/api/user').then((res) => $rootScope.user = res.data);
    $rootScope.$on('$routeChangeStart', function (next, current) {
      if ($location.path() == '') {
        $location.path('/');
      }
    });
  }
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

angular.module('App', ['ngRoute', 'Auth', 'Office', 'Tools', 'Buildings', 'ngCookies', 'Map', 'Users', 'User'])
    .run(_run)
    .config(config);