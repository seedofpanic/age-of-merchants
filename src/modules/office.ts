const officeTabsTemplates = {
  building: require('./../../jade/office/building.jade')(),
  buildings: require('./../../jade/office/buildings.jade')(),
  troops: require('./../../jade/office/troops.jade')(),
  stats: require('./../../jade/office/stats.jade')()
};

angular.module('Office', ['ngRoute'])
    .controller('OfficeCtrl', OfficeCtrl)
    .factory('OrderTroop', OrderTroop)
    .factory('NeighborTroop', NeighborTroop)
    .controller('TroopsCtrl', TroopsCtrl)
    .controller('MoveTroopCtrl', MoveTroopCtrl)
    .controller('NeighTroopsCtrl', NeighTroopsCtrl)
    .directive('officeTabContents', officeTabContents);

OfficeCtrl.$inject = ['$http', '$route', '$location', 'Profile'];

function OfficeCtrl($http, $route, $location, Profile) {
  var that = this;
  that.loaded = true;
  that.new_profile_name = '';
  that.profile_id = $route.current.params.profile_id;
  that.profiles = [];
  if (!that.profile_id) {
    $http.get('/api/profiles').then(function (res) {
      that.profiles = res.data;
    })
  }
  that.profile = Profile;
  that.deselect = function () {
    $location.path('office');
  };
  that.newProfile = function () {
    that.err = null;
    if (that.new_profile_name.length > 0) {
      $http.post('/api/profile/new', {name: that.new_profile_name})
          .then(function (res) {
            that.profiles.push(res.data)
          }, function (res) {
            that.err = res.data;
          });
    }
  };

  that.selectProfile = function (profile) {
    $route.updateParams({profile_id: profile.id});
  };
}

function OrderTroop() {
  return {troop: {}};
}

function NeighborTroop() {
  return {troop: {}};
}

TroopsCtrl.$inject = ['$http', '$route', 'Regions', '$scope', 'OrderTroop', 'Modals', 'NeighborTroop'];

function TroopsCtrl($http, $route, Regions, $scope, OrderTroop, Modals, NeighborTroop) {
  var that = this;
  that.regions = Regions;
  that.profile_id = $route.current.params.profile_id;
  $http.get('/api/troops?profile_id=' + that.profile_id)
      .then(function (res) {
        that.troops = res.data;
      });
  that.stopTroop = function (troop) {
    $http.post('/api/troop/stop', {troop_id: troop.id})
        .then(function () {
          troop.move = undefined;
        });
  };
  that.openMover = function (troop) {
    angular.copy(troop, OrderTroop.troop);
    OrderTroop.troop.move = {};
    OrderTroop.troop.move.field = {};
    angular.copy(troop.field, OrderTroop.troop.move.field);
    Modals.show('move_troop', $scope, function () {
      $http.post('api/troop/move', OrderTroop.troop)
          .then(function (res) {
            troop.move = res.data
          });
    });
  };
  that.showNeighbors = function (troop) {
    NeighborTroop.troop = troop;
    Modals.show('troops_neighbors', $scope, function () {
    });
  };
}

MoveTroopCtrl.$inject = ['OrderTroop', 'Regions'];

function MoveTroopCtrl(OrderTroop, Regions) {
  const that = this;
  that.regions = Regions;
  that.troop = OrderTroop.troop;
}

NeighTroopsCtrl.$inject = ['NeighborTroop', '$http'];

function NeighTroopsCtrl(NeighborTroop, $http) {
  const that = this;
  that.id = NeighborTroop.troop.id;
  that.troops = [];
  $http.get('api/troops/field', {
    params: {
      field_id: NeighborTroop.troop.field.id,
      troop_id: NeighborTroop.troop.id
    }
  }).then(function (res) {
    res.data.forEach(function (troop) {
      troop.attack = troop.assaults.length > 0;
      that.troops.push(troop);
    });
  });
  that.attack = function (troop) {
    if (troop.attack) {
      $http.post('api/troops/attack', {target_id: troop.id, troop_id: that.id}).catch(function () {
        troop.attack = false;
      });
    } else {
      $http.post('api/troops/stop_attack', {target_id: troop.id, troop_id: that.id}).catch(function () {
        troop.attack = true;
      });
    }
  }
}

officeTabContents.$inject = ['$route'];

function officeTabContents($route){
  return {
    restrict: 'A',
    template: function () {
      return officeTabsTemplates[$route.current.params.tab] || officeTabsTemplates.stats;
    }
  }
}