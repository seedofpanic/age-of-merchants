angular.module('Map', [])
.controller('MapCtrl', ($http) ->
  that = @
  that.regions = []
  $http.get('/api/regions').then((res) ->
    that.regions = res.data
  )
  that.getR = (int) ->
    return if (int < 500000) then 255 else parseInt(255*((1000000 - int)/500000))
  that.getB = (int) ->
    return if (int > 500000) then 255 else parseInt(255*(int/500000));
  that.open = (region) ->
    $http.get('/api/map?id=' + region.id).then((res) ->
      that.map = res.data
    )
  return
)