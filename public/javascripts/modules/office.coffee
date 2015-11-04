angular.module('Office', ['ngRoute'])
.controller('OfficeCtrl', ($http, $route, $location, Profile) ->
  that = @
  that.loaded = true
  that.new_profile_name = ''
  that.profile_name = $route.current.params.profile_name
  that.profiles = []
  unless that.profile_name
    $http.get('/api/profiles').then((res) ->
      that.profiles = res.data
    )
  that.profile = Profile
  that.deselect = () ->
    $location.path('office')
  that.newProfile = () ->
    if that.new_profile_name.length > 0
      $http.post('/api/profile/new', name: that.new_profile_name)
      .then( (res) ->
        that.profiles.push(res.data)
      , () ->

      )
  that.selectProfile = (profile) ->
    $route.updateParams(profile_name: profile.name);
  return
)
.factory 'OrderTroop', () ->
  troop: {}
.controller 'TroopsCtrl', ($http, $route, Regions, $scope, OrderTroop, Modals) ->
  that = @
  that.regions = Regions
  that.profile_name = $route.current.params.profile_name
  $http.get '/api/troops?profile_name=' + that.profile_name
  .then (res) ->
    that.troops = res.data
  that.stopTroop = (troop) ->
    $http.post '/api/troop/stop', {troop_id: troop.id}
    .then () ->
      troop.move = undefined
  that.openMover = (troop) ->
    angular.copy(troop, OrderTroop.troop)
    OrderTroop.troop.move = {}
    OrderTroop.troop.move.field = {}
    angular.copy(troop.field, OrderTroop.troop.move.field)
    Modals.show 'move_troop', $scope, () ->
      $http.post 'api/troop/move', OrderTroop.troop
      .then (res) ->
        troop.move = res.data
  return
.controller 'MoveTroopCtrl', (OrderTroop, Regions) ->
  that = @
  that.regions = Regions
  that.troop = OrderTroop.troop
  return