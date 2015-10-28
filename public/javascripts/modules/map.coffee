angular.module('Map', [])
.controller('MapCtrl', ($http, $scope) ->
  that = @
  that.regions = []
  $http.get('/api/regions').then((res) ->
    that.regions = res.data
  )
  that.getR = (int) ->
    range = that.max_c - that.min_c
    int -= that.min_c
    return if (int < (range >> 1)) then 255 else parseInt(255*((range - int)/(range >> 1)))
  that.getG = (int) ->
    range = that.max_c - that.min_c
    int -= that.min_c
    return if (int > (range >> 1)) then 255 else parseInt(255*(int/(range >> 1)));

  that.getRQ = (int) ->
    range = (that.max_q - that.min_q) * 100
    int = (int - that.min_q) * 100
    return if (int < (range >> 1)) then 255 else parseInt(255*((range - int)/(range >> 1)))
  that.getGQ = (int) ->
    range = (that.max_q - that.min_q) * 100
    int = (int - that.min_q) * 100
    return if (int > (range >> 1)) then 255 else parseInt(255*(int/(range >> 1)));

  that.load_map = (type) ->
    unless type > 0
      return
    if that.loading
      return
    that.selected_type = type
    that.loading = true;
    $http.get('/api/map?region_id=' + that.selected.id + '&type=' + type).then((res) ->
      that.map = res.data

      that.max_c = that.map[0][0].res.c;
      that.min_c = that.map[0][0].res.c;
      that.max_q = that.map[0][0].res.q;
      that.min_q = that.map[0][0].res.q;
      for x in [0..that.map.length - 1]
        for y in [0..that.map[x].length - 1]
          tile = that.map[x][y].res
          if that.max_c < tile.c
            that.max_c = tile.c
          if that.min_c > tile.c
            that.min_c = tile.c
          if that.max_q < tile.q
            that.max_q = tile.q
          if that.min_q > tile.q
            that.min_q = tile.q

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