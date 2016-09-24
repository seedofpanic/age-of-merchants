angular.module('Buildings', ['Tools', 'DB', 'Building'])
  .factory('BuildingTypes', BuildingTypes)
  .controller('NewBuildingCtrl', NewBuildingCtrl)
  .factory('SelectedBuilding', SelectedBuilding)
  .controller('BuildingsCtrl', BuildingsCtrl)
  .controller('BuildingCtrl', BuildingCtrl)
  .factory('ExportData', ExportData)
  .controller('ImportCtrl', ImportCtrl)
  .controller('ExportCtrl', ExportCtrl)
  .factory('OrderData', OrderData)
  .controller('ProductOrderCtrl', ProductOrderCtrl);

BuildingTypes.$inject = ['$http'];

function BuildingTypes($http) {
  var types = {};
  $http.get('api/buildings/types').then(function (res) {
    $.each(res.data, function (key) {
      types[key] = this;
    });
  });
  return types;
}

NewBuildingCtrl.$inject = ['$element', '$http', '$route', 'Regions', 'ProfileBuildings', 'Profile', 'BuildingTypes'];

function NewBuildingCtrl($element, $http, $route, Regions, ProfileBuildings, Profile, BuildingTypes) {
  var that = this;
  that.x = 0;
  that.y = 0;
  that.types = [];
  that.regions = Regions;
  that.profile_id = $route.current.params.profile_id;
  that.profile = Profile;
  that.types = BuildingTypes;
  that.setName = function (name) {
    that.name = name + ' ' + Math.ceil(Math.random() * 10000);
  };
  that.changeType = function (type) {
    that.setName(type.name);
    if (that.types[type.value] && that.types[type.value].resources_out) {
      keys = Object.keys(that.types[type.value].resources_out);
      that.out_id = (keys.length > 0) ? keys[0] : '';
    }
  };
  that.create = function () {
    if (
        that.name.length > 0 &&
        that.type > -1 &&
        that.region > -1 &&
        that.x > -1 &&
        that.y > -1
    ) {
      $http.post('/api/buildings/new', {
        name: that.name,
        type: that.type,
        out_type: that.out_id,
        region: that.region,
        x: that.x,
        y: that.y,
        profile_id: that.profile_id
      }).then(function (res) {
        ProfileBuildings.push(res.data);
        Profile.update();
        $element.modal('hide');
      });
    }
  };
}

function SelectedBuilding() {
  return {b: undefined};
}

BuildingsCtrl.$inject = ['$scope', '$http', '$compile', '$route',
    'Modals', 'Regions', 'ProfileBuildings', 'SelectedBuilding'];

function BuildingsCtrl($scope, $http, $compile, $route, Modals, Regions, ProfileBuildings, SelectedBuilding) {
  that = this;
  that.regions = Regions;
  that.selected = SelectedBuilding;
  ProfileBuildings.get();
  that.select = function (building) {
    if (!building) {
      return;
    }
    that.loading = true;
    that.selected.b = building;
    $route.updateParams({'building_id': building.id});
  };
  that.buildings = ProfileBuildings;
  var building_id = $route.current.params.building_id;
  $scope.$watch(function () {
    return ProfileBuildings.arr[building_id]
  }, function () {
    that.select(ProfileBuildings.arr[building_id])
  });
  that.deselect = function () {
    that.selected.b = undefined;
    $route.updateParams({'building_id': undefined, building_tab: undefined})
  };
  that.openNewBuilding = function () {
    Modals.show('new_building', $scope);
  };
}

BuildingCtrl.$inject = ['$http', 'SelectedBuilding', '$scope', 'BuildingTypes'];

function BuildingCtrl($http, SelectedBuilding, $scope, BuildingTypes) {
  var that = this;
  that.selected = SelectedBuilding;
  that.types = BuildingTypes;
  that.hire = 0;
  that.getMax = function () {
    if (!that.selected.b || !that.humans)
      return 0
    if ((that.selected.b.workers_c + that.humans.count) < that.types[that.selected.b.type].max_workers)
      return that.selected.b.workers_c + that.humans.count;
    else
      return that.types[that.selected.b.type].max_workers;
  };
  that.employ = function () {
    building = that.selected.b
    $http.post('/api/buildings/employ', {
      id: that.humans.id,
      count: that.hire,
      building_id: building.id,
      salary: that.salary
    }).then(function (res) {
      building.worker_s = res.data.worker_s;
      $scope.WorkersEditForm.$dirty = false;
    });
  };
  $scope.$watch(function () {
    return SelectedBuilding.b;
  }, function (newVal) {
    if (!newVal) {
      return;
    }
    that.salary = newVal.worker_s;
    $http.get('/api/products/humans?building_id=' + newVal.id)
        .then(function (res) {
          that.humans = res.data
        })
        .finally(function () {
          that.loading = false;
        });
  })
}

function ExportData() {
  return {product: {}};
}

ImportCtrl.$inject = ['$http', 'Modals', '$scope', 'OrderData', '$route'];

function ImportCtrl($http, Modals, $scope, OrderData, $route) {
  var that = this;
  that.products = [];
  that.get = function (prop) {
    prop = prop || '';
    $http.get('/api/products/import/' + prop)
        .then(function (res) {
          that.products = res.data;
        });
  };
  that.get('');
  that.order = function (product) {
    angular.copy(product, OrderData.product);
    Modals.show('order_product', $scope, function () {
      OrderData.building_id = $route.current.params.building_id;
      $http.post('api/contracts/new', OrderData);
    });
  };
}

ExportCtrl.$inject = ['ExportData', '$scope'];

function ExportCtrl(ExportData, $scope) {
  var that = this;
  that.ed = ExportData;
}

function OrderData() {
  return {product: {}};
}

ProductOrderCtrl.$inject = ['OrderData'];

function ProductOrderCtrl(OrderData) {
  var that = this;
  that.od = OrderData;
}