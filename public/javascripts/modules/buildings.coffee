angular.module('Buildings', ['Tools', 'DB', 'Building'])
.controller('NewBuildingCtrl', ($element, $http, $route, Regions, ProfileBuildings, Profile) ->
  that = @
  that.types = {}
  that.regions = Regions
  that.profile_name = $route.current.params.profile_name
  that.create = () ->
    if (
      that.name.length > 0 &&
      that.type > -1 &&
      that.region > -1 &&
      that.x > -1 &&
      that.y > -1
    )
      $http.post('/api/buildings/new',
        name: that.name
        type: that.type
        region: that.region
        x: that.x
        y: that.y
        profile_name: that.profile_name
      ).then((res) ->
        ProfileBuildings.push(res.data)
        Profile.update()
        $element.modal('hide')
      )
    return
  return
)
.controller('BuildingsCtrl', ($scope, $http, $compile, $route, Modals, ExportData, Regions, ProfileBuildings) ->
  that = @
  that.regions = Regions
  that.selected = undefined
  that.select = (building) ->
    unless (building)
      return
    that.loading = true
    that.selected = building
    $route.updateParams('building_id': building.id)
  that.buildings = ProfileBuildings
  building_id = $route.current.params.building_id
  $scope.$watch(() ->
    ProfileBuildings.arr[building_id]
  , () ->
    that.select(ProfileBuildings.arr[building_id])
  )
  that.deselect = () ->
    that.selected = undefined
    $route.updateParams('building_id': undefined, building_tab: undefined )
  that.openNewBuilding = () ->
    Modals.show('new_building', $scope)
    return
  that.openImport = () ->
    Modals.show('import', $scope)
    return
  that.export = (product) ->
    if product.export
      Modals.show('stop_export', $scope, () ->
        $http.post('api/product/stop_export', product).then((res) ->
          angular.copy(res.data, product)
        )
      )
    else
      angular.copy(product, ExportData.product)
      ExportData.product.export = 1;
      ExportData.product.export_count = 100;
      Modals.show('start_export', $scope,  () ->
        $http.post('api/product/start_export', ExportData.product).then((res) ->
          angular.copy(res.data, product)
        )
      )
  return
)
.factory('ExportData', () ->
  product: {}
)
.controller('ImportCtrl', ($http, Modals, $scope, OrderData, $route) ->
  that = @
  that.products = []
  $http.get('/api/products').then((res) ->
    that.products = res.data
  )
  that.order = (product) ->
    angular.copy(product, OrderData.product)
    Modals.show('order_product', $scope, () ->
      OrderData.building_id = $route.current.params.building_id
      $http.post('api/contracts/new', OrderData).then((res) ->
      )
    )
  return
)
.controller('ExportCtrl', (ExportData) ->
  that = @
  that.ed = ExportData
  return
)
.factory('OrderData', () ->
  product: {}
)
.controller('ProductsOrderCtrl', (OrderData) ->
  that = @
  that.od = OrderData
  return
)