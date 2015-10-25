angular.module('Map', [])
.controller('MapCtrl', ($http, $scope) ->
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
  that.load_map = (type) ->
    unless type > 0
      return
    if that.loading
      return
    that.selected_type = type
    that.loading = true;
    $http.get('/api/map?region_id=' + that.selected.id + '&type=' + type).then((res) ->
      that.map = res.data
      that.loading = false;
      setTimeout(() ->
        $('.popup').popup()
      , 1
      )
    )
  that.open = (region) ->
    that.selected = region
    that.load_map(that.selected_type)
  $scope.$watch(() ->
    that.res_type
  ,
    that.load_map
  )
  return
)