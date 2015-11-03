angular.module('Building', [])
.controller('SoldiersCtrl', ($http, $route) ->
  that = @
  building_id = $route.current.params.building_id
  $http.get('/api/army?building_id=' + building_id).then(
    (res) ->
      that.soldiers = res.data
      that.loading = false
    () ->
      that.loading = false
  )
  return
)
.controller('ProductsCtrl', ($http, $route) ->
  that = @
  building_id = $route.current.params.building_id
  $http.get('/api/products?building_id=' + building_id).then(
    (res) ->
      that.products = res.data
      that.loading = false
    () ->
      that.loading = false
  )
  return
)