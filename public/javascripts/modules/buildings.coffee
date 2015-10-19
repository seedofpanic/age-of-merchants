angular.module('Buildings', [])
.controller('NewBuildingCtrl', ($element, $http, $route) ->
  that = @
  that.types = {}
  that.regions = {}
  that.profile_name = $route.current.params.profile_name
  $http.get('/api/buildings/types').then((res) ->
    that.types = res.data
  )
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
.controller('BuildingsCtrl', ($scope, $http, $compile, $route) ->
  that = @
  $nbm = null
  $http.get('/api/buildings?profile_name=' + $route.current.params.profile_name).then( (res) ->
    that.buildings = res.data
  )
  that.openNewBuilding = () ->
    unless $nbm
      $http.get('/partials/modals/new_building.html').then((res) ->
        $nbm = $(res.data).appendTo('body')
        $nbm.modal(
          selector:
            close: '.close'
            approve: '.approve'
        ).modal('show')
        $compile($nbm)($scope)
      )
    else
      $nbm.modal('show')
    return
  return
)