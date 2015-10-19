// Generated by CoffeeScript 1.10.0
(function() {
  angular.module('Buildings', []).controller('NewBuildingCtrl', function($element, $http, $route) {
    var that;
    that = this;
    that.types = {};
    that.regions = {};
    that.profile_name = $route.current.params.profile_name;
    $http.get('/api/buildings/types').then(function(res) {
      return that.types = res.data;
    });
    $http.get('/api/regions').then(function(res) {
      return that.regions = res.data;
    });
    that.create = function() {
      if (that.name.length > 0 && that.type > -1 && that.region > -1 && that.x > -1 && that.y > -1) {
        $http.post('/api/buildings/new', {
          name: that.name,
          type: that.type,
          region: that.region,
          x: that.x,
          y: that.y,
          profile_name: that.profile_name
        }).then(function(res) {
          return $element.modal('hide');
        });
      }
    };
  }).controller('BuildingsCtrl', function($scope, $http, $compile) {
    var $nbm, that;
    that = this;
    $nbm = null;
    $http.get('/api/buildings', function(buildings) {
      return that.buildings = buildings;
    });
    that.openNewBuilding = function() {
      if (!$nbm) {
        $http.get('/partials/modals/new_building.html').then(function(res) {
          $nbm = $(res.data).appendTo('body');
          $nbm.modal({
            selector: {
              close: '.close',
              approve: '.approve'
            }
          }).modal('show');
          return $compile($nbm)($scope);
        });
      } else {
        $nbm.modal('show');
      }
    };
  });

}).call(this);

//# sourceMappingURL=buildings.js.map
