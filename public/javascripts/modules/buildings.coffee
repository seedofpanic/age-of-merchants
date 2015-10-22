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
.controller('BuildingsCtrl', ($scope, $http, $compile, $route, Modals) ->
  that = @
  $http.get('/api/buildings?profile_name=' + $route.current.params.profile_name).then( (res) ->
    that.buildings = res.data
  )
  that.selected = undefined
  that.select = (building) ->
    that.loading = true
    that.selected = building
    $http.get('/api/goods?building_id=' + building.id).then(
      (res) ->
        building.goods = res.data
        that.loading = false
      () ->
        that.loading = false
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
        goods.export = false
        $http.post('api/goods/update', goods).then((res) ->
          goods = res.data
        )
      )
    else
      Modals.show('start_export', $scope,  () ->
        goods.export = false
        $http.post('api/goods/update', goods).then((res) ->
          goods = res.data
        )
      )
  return
)
.controller('ImportCtrl', ($http) ->
  that = @
  that.goods = {}
  $http.get('/api/goods').then((res) ->
    that.goods = res.data
  )
  return
)