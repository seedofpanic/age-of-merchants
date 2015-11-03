angular.module('Building', [])
.controller('SoldiersCtrl', ($http, $route) ->
  that = @
  building_id = $route.current.params.building_id
  profile_name = $route.current.params.profile_name
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
        profile_name: profile_name
      .then (res) ->
        update()
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