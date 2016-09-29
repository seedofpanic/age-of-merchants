import * as _ from 'lodash';

angular.module('DB', [])
  .factory('Regions', Regions)
  .factory('ProfileBuildings', ProfileBuildings)
  .factory('Profile', Profile);

Regions.$inject = ['$http'];

function Regions($http) {
  var regions = {}
  $http.get('/api/regions').then(function (res) {
    _.each(res.data, function (region) {
      regions[region.id] = region;
    });
  });
  return regions;
}

ProfileBuildings.$inject = ['$http', '$route'];

function ProfileBuildings($http, $route) {
  var buildings = {arr: {}};
  buildings.get = function () {
    var profile_id = $route.current.params.profile_id;
    buildings.arr = {};
    $http.get('/api/buildings?profile_id=' + profile_id).then(function (res) {
      _.each(res.data, function (building) {
        buildings.arr[building.id] = building;
      });
      buildings.length = res.data.length;
    });
    buildings.push = function (building) {
      buildings.arr[building.id] = building;
      buildings.length++;
    };
  };
  return buildings;
}

Profile.$inject = ['$http', '$route', '$rootScope'];

function Profile($http, $route, $rootScope) {
  var profile = {}
  var get = function (profile_id) {
    if (profile_id) {
      $http.get('/api/profile?id=' + profile_id)
          .then(function (res) {
                angular.copy(res.data, profile);
                profile.update = function () {
                  get($route.current.params.profile_id);
                };
              }
          )
    }
  }
  get($route.current.params.profile_id);

  $rootScope.$on('$routeChangeSuccess', function (scope, next, current) {
    get(next.params.profile_id);
  })
  return profile;
}
