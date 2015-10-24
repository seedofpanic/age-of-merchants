angular.module('Map', [])
.controller('MapCtrl', ($http) ->
  that = @
  that.regions = []
  $http.get('/api/regions').then((res) ->
    that.regions = res.data
  )
  that.parseInt = (int) ->
    return parseInt(int);
  that.open = (region) ->
    $http.get('/api/map?id=' + region.id).then((res) ->
      that.map = res.data
    )
  return
)