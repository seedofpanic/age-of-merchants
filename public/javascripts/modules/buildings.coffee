angular.module('Buildings', ['Tools'])
.controller('NewBuildingCtrl', ($element, $http, $route) ->
  that = @
  that.types = {}
  that.regions = {}
  that.profile_name = $route.current.params.profile_name
  $http.get('/api/regions').then((res) ->
    that.regions = res.data
  )
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
        $element.modal('hide')
      )
    return
  return
)
.controller('BuildingsCtrl', ($scope, $http, $compile, $route, Modals, ExportData, $location) ->
  that = @
  that.selected = undefined
  that.select = (building) ->
    that.loading = true
    that.selected = building
    $route.updateParams('building_id': building.id)
    $http.get('/api/goods?building_id=' + building.id).then(
      (res) ->
        building.goods = res.data
        that.loading = false
      () ->
        that.loading = false
    )
  $http.get('/api/buildings?profile_name=' + $route.current.params.profile_name).then( (res) ->
    that.buildings = res.data
    building_id = parseInt($route.current.params.building_id)
    if building_id > 0
      that.buildings.forEach((a) ->
        if a.id == building_id
          that.select(a)
      )
  )
  that.deselect = () ->
    that.selected = undefined
  that.openNewBuilding = () ->
    Modals.show('new_building', $scope)
    return
  that.openImport = () ->
    Modals.show('import', $scope)
    return
  that.export = (goods) ->
    if goods.export
      Modals.show('stop_export', $scope, () ->
        $http.post('api/goods/stop_export', goods).then((res) ->
          angular.copy(res.data, goods)
        )
      )
    else
      angular.copy(goods, ExportData.goods)
      ExportData.goods.export = 1;
      ExportData.goods.export_count = 100;
      Modals.show('start_export', $scope,  () ->
        $http.post('api/goods/start_export', ExportData.goods).then((res) ->
          angular.copy(res.data, goods)
        )
      )
  return
)
.factory('ExportData', () ->
  goods: {}
)
.controller('ImportCtrl', ($http, Modals, $scope, OrderData, $route) ->
  that = @
  that.goods = []
  $http.get('/api/goods').then((res) ->
    that.goods = res.data
  )
  that.order = (goods) ->
    angular.copy(goods, OrderData.goods)
    Modals.show('order_goods', $scope, () ->
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
  goods: {}
)
.controller('GoodsOrderCtrl', (OrderData) ->
  that = @
  that.od = OrderData
  return
)