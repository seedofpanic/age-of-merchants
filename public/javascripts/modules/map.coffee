angular.module('Map', [])
.factory 'SelectedField', () ->
  f: null
.controller 'MapCtrl', ($http, $scope, Regions, Modals, SelectedField) ->
  that = @
  that.regions = Regions
  that.sub_type = -1
  that.getR = (int) ->
    range = that.max_c - that.min_c
    hrange = (range >> 1)
    int -= that.min_c
    if hrange == 0
      return if (int < 1) then 255 else 0
    else
      return if (int < (range >> 1)) then 255 else parseInt(255*((range - int)/hrange))
  that.getG = (int) ->
    range = that.max_c - that.min_c
    int -= that.min_c
    hrange = (range >> 1)
    if hrange == 0
      return if (int > hrange) then 255 else parseInt(255*(int));
    else
      return if (int > hrange) then 255 else parseInt(255*(int/hrange));

  that.getRQ = (int) ->
    range = (that.max_q - that.min_q) * 100
    int = (int - that.min_q) * 100
    return if (int < (range >> 1)) then 255 else parseInt(255*((range - int)/(range >> 1)))
  that.getGQ = (int) ->
    range = (that.max_q - that.min_q) * 100
    int = (int - that.min_q) * 100
    return if (int > (range >> 1)) then 255 else parseInt(255*(int/(range >> 1)));

  that.load_map = () ->
    type = that.sub_type
    if !type || parseInt(type) == -1
      return
    if that.loading
      return
    that.selected_type = type
    that.loading = true;
    $http.get('/api/map?region_id=' + that.selected.id + '&type=' + that.map_type + '&sub_type=' + that.sub_type).then((res) ->
      that.map = res.data

      if parseInt(that.map_type) == 1
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
      else if parseInt(that.map_type) == 2
        that.max_c = that.map[0][0].c;
        that.min_c = that.map[0][0].c;
        for x in [0..that.map.length - 1]
          for y in [0..that.map[x].length - 1]
            tile = that.map[x][y]
            if that.max_c < tile.c
              that.max_c = tile.c
            if that.min_c > tile.c
              that.min_c = tile.c
      that.loading = false;
      setTimeout(() ->
        $('.popup').popup()
      , 1
      )
    )
  that.open = (region) ->
    that.selected = region
    that.load_map(that.selected_type)
  $scope.$watch () ->
    that.res_type
  , (newVal) ->
    that.sub_type = newVal
    that.load_map()
  $scope.$watch () ->
    that.build_type
  , (newVal) ->
    that.sub_type = newVal
    that.load_map()
  $scope.$watch () ->
    that.map_type
  , (newVal) ->
    if newVal == 1
      that.sub_type = that.res_type
    else
      that.sub_type = that.build_type
    that.load_map()
  that.openFieldBuildings = (field) ->
    SelectedField.f = field
    SelectedField.f.filter_mode = that.build_type
    Modals.show('field_buildings', $scope, null, () ->
      console.log('ok');
      $('body').addClass('scrolling')
    )
  return
.controller 'FieldBuildingsCtrl', ($scope, $http, SelectedField, $element) ->
  that = @
  that.field = SelectedField.f
  that.buildings = []
  get = (page) ->
    $http.get '/api/field/buildings',
      params:
        field_id: that.field.id
        page: page
        mode: that.field.filter_mode
    .then (res) ->
      that.buildings = res.data.buildings
      $scope.pages = res.data.pages
      $scope.current_page = res.data.page
  $scope.$watch () ->
    $scope.current_page
  , get
  get(0)
  $scope.$watch () ->
    that.buildings.length
  , (newVal) ->
    $scope.$evalAsync () ->
      $element.modal('refresh')
  return