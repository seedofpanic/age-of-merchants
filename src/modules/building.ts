import * as _ from 'lodash';

const buildingTabsTemplates = {
  army: require('./../../jade/office/building/army.jade')(),
  products: require('./../../jade/office/building/products.jade')(),
  shop: require('./../../jade/office/building/shop.jade')()
};

angular.module('Building', [])
    .controller('SoldiersCtrl', SoldiersCtrl)
    .controller('ProductsCtrl', ProductCtrl)
    .controller('ShopCtrl', ShopCtrl)
    .directive('buildingTabContents', buildingTabContents);

function SoldiersCtrl($http, $route) {
  var that = this;
  var building_id = $route.current.params.building_id;
  var profile_id = $route.current.params.profile_id;
  const update = function () {
    $http.get('/api/army?building_id=' + building_id)
      .then(function (res) {
        that.soldiers = res.data;
      })
      .finally(function () {
        that.loading = false;
      });
  };
  update();
  that.formTroop = function () {
    var troop = [];
    _.each(that.soldiers, function (soldier) {
      if (soldier.recruit > 0) {
        troop.push(soldier);
      }
    });
    if (troop.length > 0) {
      $http.post('/api/troops/new', {
        soldiers: troop,
        building_id: building_id,
        profile_id: profile_id
      })
        .then(function (res) {
          update();
        });
    }
  };
}

ProductCtrl.$inject = ['$http', '$route', 'Modals', '$scope', 'ExportData'];

function ProductCtrl($http, $route, Modals, $scope, ExportData) {
  var that = this;
  $scope.exportData = ExportData;
  var building_id = $route.current.params.building_id;
  that.loading = true;
  $http.get('/api/products?building_id=' + building_id)
    .then(function (res) {
      that.products = res.data;
      that.loading = false;
    })
    .catch(function () {
      that.loading = false;
    });
  that.openImport = function () {
    Modals.show('import', $scope);
  };
  that.export = function (product) {
    if (product.export) {
      Modals.show('stop_export', $scope, function () {
        $http.post('api/product/stop_export', product).then(function (res) {
          angular.copy(res.data, product);
        });
      });
    } else {
      angular.copy(product, ExportData.product);
      ExportData.product.export = 1;
      ExportData.product.export_count = 100;
      Modals.show('start_export', $scope, function () {
        $http.post('api/product/start_export', ExportData.product).then(function (res) {
          angular.copy(res.data, product);
        });
      });
    }
  }
}

ShopCtrl.$inject = ['$http'];

function ShopCtrl($http) {
  var that = this;
}

buildingTabContents.$inject = ['$route'];

function buildingTabContents($route){
  return {
    restrict: 'A',
    template: function () {
      return buildingTabsTemplates[$route.current.params.tab] || buildingTabsTemplates.products;
    }
  }
}