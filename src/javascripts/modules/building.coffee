angular.module('Building', [])
.controller('SoldiersCtrl', ($http, $route) ->
  that = @
  building_id = $route.current.params.building_id
  profile_id = $route.current.params.profile_id
  update = () ->
    $http.get('/api/army?building_id=' + building_id).then(
      (res) ->
        that.soldiers = res.data
        that.loading = false
      () ->
        that.loading = false
    )
  update()
  that.formTroop = () ->
    troop = []
    $.each(that.soldiers, () ->
      soldier = @
      if soldier.recruit > 0
        troop.push soldier
    )
    if troop.length > 0
      $http.post '/api/troops/new',
        soldiers: troop
        building_id: building_id
        profile_id: profile_id
      .then (res) ->
        update()
  return
)
.controller('ProductsCtrl', ($http, $route, Modals, $scope, ExportData) ->
  that = @
  $scope.exportData = ExportData
  building_id = $route.current.params.building_id
  that.loading = true
  $http.get('/api/products?building_id=' + building_id).then(
    (res) ->
      that.products = res.data
      that.loading = false
    () ->
      that.loading = false
  )
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
.controller 'ShopCtrl', ($http) ->
  that = @