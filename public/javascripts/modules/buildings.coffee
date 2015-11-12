angular.module('Buildings', ['Tools', 'DB', 'Building'])
.controller('NewBuildingCtrl', ($element, $http, $route, Regions, ProfileBuildings, Profile) ->
  that = @
  that.x = 0
  that.y = 0
  that.types = []
  that.regions = Regions
  that.profile_name = $route.current.params.profile_name
  that.profile = Profile
  $http.get('api/buildings/types').then (res) ->
    that.types = res.data
  that.setName = (name) ->
    that.name = name + ' ' + Math.ceil(Math.random() * 10000)
  that.changeType = (type) ->
    that.setName(type.name)
    if that.types[type.value] && that.types[type.value].resources_out
      keys = Object.keys(that.types[type.value].resources_out)
      that.out_id = if keys.length > 0 then keys[0] else ''
    return
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
        out_type: that.out_id
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
.factory 'SelectedBuilding', () ->
  b: undefined
.controller('BuildingsCtrl', ($scope, $http, $compile, $route, Modals, Regions, ProfileBuildings, SelectedBuilding) ->
  that = @
  that.regions = Regions
  that.selected = SelectedBuilding
  that.select = (building) ->
    unless (building)
      return
    that.loading = true
    that.selected.b = building
    $route.updateParams('building_id': building.id)
  that.buildings = ProfileBuildings
  building_id = $route.current.params.building_id
  $scope.$watch(() ->
    ProfileBuildings.arr[building_id]
  , () ->
    that.select(ProfileBuildings.arr[building_id])
  )
  that.deselect = () ->
    that.selected.b = undefined
    $route.updateParams('building_id': undefined, building_tab: undefined )
  that.openNewBuilding = () ->
    Modals.show('new_building', $scope)
    return
  return
)
.controller 'BuildingCtrl', ($http, SelectedBuilding, $scope) ->
  that = @
  that.selected = SelectedBuilding
  $scope.$watch () ->
    SelectedBuilding.b
  , (newVal) ->
    unless newVal
      return
    $http.get('/api/products/humans?building_id=' + newVal.id).then(
      (res) ->
        that.humans = res.data
        that.loading = false
      () ->
        that.loading = false
    )
  return
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
.controller('ExportCtrl', (ExportData, $scope) ->
  that = @
  that.ed = ExportData
  $scope.$watch () ->
    ExportData.product
  , (newVal, oldVal) ->
    console.log(oldVal)
    console.log(newVal)
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