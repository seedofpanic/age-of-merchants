angular.module('Map', [])
.controller('MapCtrl', ($http) ->
  that = @
  that.regions = []
  $http.get('/api/regions').then((res) ->
    that.regions = res.data
  )
  that.getR = (int) ->
    if int <= 1000000
      return if (int < 500000) then 255 else parseInt(255*((1000000 - int)/500000))
    else
      return 0
  that.getG = (int) ->
    if int <= 1000000
      return if (int > 500000) then 255 else parseInt(255*(int/500000));
    else
      return 255
  that.open = (region) ->
    that.selected = region
    $http.get('/api/map?id=' + region.id).then((res) ->
      that.map = res.data
      setTimeout(() ->
        $('.popup').popup()
      , 1
      )
    )
  return
)